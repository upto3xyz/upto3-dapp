'use client'

import {
  PropsWithChildren,
  useState,
  useMemo,
  useEffect,
  useCallback,
} from 'react'
import { configureChains, mainnet, useAccount } from 'wagmi'
import { alchemyProvider } from 'wagmi/providers/alchemy'
import { publicProvider } from 'wagmi/providers/public'
import { usePathname, useRouter } from 'next/navigation'
import {
  RainbowKitAuthenticationProvider,
  RainbowKitProvider,
  createAuthenticationAdapter,
} from '@rainbow-me/rainbowkit'
import { AuthenticationStatus } from '@rainbow-me/rainbowkit/dist/components/RainbowKitProvider/AuthenticationContext'
import { SiweMessage } from 'siwe'
import jwt from 'jsonwebtoken'
import { localStorage } from '@/lib/store'
import {
  FIREBASE_TOKEN,
  REFRESH_TOKEN,
  SUPABASE_TOKEN,
} from '@/contants/localstorage'
import { setAuthState, resetAuth } from '@/redux/features/authSlice'
import { resetUserInfo } from '@/redux/features/userInfoSlice'
import { resetSignIn, setSignInState } from '@/redux/features/signInSlice'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import { handleSignOut, auth } from '@/lib/firebase/firebase.utils'
import { signInWithCustomToken } from 'firebase/auth'
import { getUser } from '@/lib/firebase/firestore.users'
import { setUserInfo } from '@/redux/features/userInfoSlice'

const maxAge = 7 * 24 * 60 * 60 // 7 days

const { chains } = configureChains(
  [mainnet],
  [
    alchemyProvider({ apiKey: process.env.NEXT_PUBLIC_ALCHEMY_ID! }),
    publicProvider(),
  ]
)

function WalletProvider({ children }: PropsWithChildren<{}>) {
  const { address, isConnected } = useAccount()
  const dispatch = useAppDispatch()
  const router = useRouter()
  const pathname = usePathname()

  const [authenticationStatus, setAuthenticationStatus] =
    useState<AuthenticationStatus>('unauthenticated')

  const authState = useAppSelector((state) => state.authReducer.authState)
  const signInState = useAppSelector((state) => state.signInReducer.signInState)

  const getUserInfo = useCallback(() => {
    if (address){
      getUser(address).then((res) => {
        dispatch(
          setUserInfo({
            bio: res?.bio,
            displayName: res?.displayName,
            following: res?.following,
            followingOrg: res?.followingOrg,
            honors: res?.honors,
            photoURL: res?.photoURL,
            twitterHandle: res?.twitterHandle,
            twitterName: res?.twitterName,
          })
        )
      })}
  }, [address, dispatch])

  const _handleSignOut = useCallback(() => {
    router.push('/')
    setAuthenticationStatus('unauthenticated')
    dispatch(resetAuth())
    dispatch(resetUserInfo())
    dispatch(resetSignIn())
    handleSignOut()
    localStorage.clearAll()
    document.cookie = `my-access-token=; path=/; max-age=0; SameSite=Lax; secure`
  }, [dispatch, router])

  const authenticationAdapter = useMemo(() => {
    return createAuthenticationAdapter({
      getNonce: async () => {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_FIREBASE_URL}/auth/generate-nonce`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              publicAddress: address,
            }),
          }
        )
        if (!res.ok) throw new Error('Failed to fetch SIWE nonce')
        const resJson = await res.json()
        return resJson.data.nonce
      },

      createMessage: ({ nonce, address, chainId }) => {
        return new SiweMessage({
          domain: window.location.host,
          address,
          statement: 'Sign in with Ethereum to the app.',
          uri: window.location.origin,
          version: '1',
          chainId,
          nonce,
        })
      },

      getMessageBody: ({ message }) => {
        return message.prepareMessage()
      },

      verify: async ({ message, signature }) => {
        try {
          const res = await fetch(
            `${process.env.NEXT_PUBLIC_FIREBASE_URL}/auth/authenticate`,
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                message,
                signature,
                publicAddress: address,
              }),
            }
          )

          const resJson = await res.json()
          const { token, supabaseToken } = resJson.data

          localStorage.set(FIREBASE_TOKEN, token)
          localStorage.set(SUPABASE_TOKEN, supabaseToken)
          // localStorage.set(REFRESH_TOKEN, refreshToken)
          document.cookie = `my-access-token=${supabaseToken}; path=/; max-age=${maxAge}; SameSite=Lax; secure`

          const authenticated = Boolean(res.ok)
          dispatch(setAuthState(authenticated))
          if (authenticated) {
            setAuthenticationStatus('authenticated')
          }
          return authenticated
        } catch (err) {
          return false
        }
      },

      signOut: async () => {
        _handleSignOut()
      },
    })
  }, [_handleSignOut, address, dispatch])

  useEffect(() => {
    function signIn() {
      const token = localStorage.get(FIREBASE_TOKEN)

      signInWithCustomToken(auth, token)
        .then(async (res) => {
          const { refreshToken } = res.user
          const firebaseToken = await res.user.getIdToken()

          localStorage.set(FIREBASE_TOKEN, firebaseToken)
          localStorage.set(REFRESH_TOKEN, refreshToken)

          dispatch(setSignInState(true))
          getUserInfo()
        })
        .catch((err) => {
          console.error(err)
        })
    }

    if (!isConnected) {
      localStorage.clearAll()
      return
    }

    const refreshToken = localStorage.get(REFRESH_TOKEN)
    const firebaseToken = localStorage.get(FIREBASE_TOKEN)
    const supabaseToken = localStorage.get(SUPABASE_TOKEN)

    if (signInState && authState && refreshToken) return

    if (isConnected && authState && !refreshToken) {
      signIn()
    }

    if (supabaseToken) {
      const decodeSbtJwt = jwt.decode(supabaseToken)

      if (Math.floor(Date.now() / 1000) > decodeSbtJwt.exp) {
        _handleSignOut()
        return
      } else {
        document.cookie = `my-access-token=${supabaseToken}; path=/; max-age=${maxAge}; SameSite=Lax; secure`
      }
    }

    if (firebaseToken && refreshToken) {
      setAuthenticationStatus('authenticated')
      dispatch(setSignInState(true))
      dispatch(setAuthState(true))
      getUserInfo()
    }
  }, [_handleSignOut, authState, dispatch, getUserInfo, isConnected, signInState])

  useEffect(() => {
    const supabaseToken = localStorage.get(SUPABASE_TOKEN)
    if (!supabaseToken && pathname !== '/') {
      router.push('/')
    }
  }, [router, pathname])

  return (
    <RainbowKitAuthenticationProvider
      adapter={authenticationAdapter}
      status={authenticationStatus}
    >
      <RainbowKitProvider chains={chains}>{children}</RainbowKitProvider>
    </RainbowKitAuthenticationProvider>
  )
}

export default WalletProvider
