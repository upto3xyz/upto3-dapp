'use client'

import { useState, useEffect } from 'react'
import { useAccount } from 'wagmi'
import { onAuthStateChanged } from 'firebase/auth'
import { useAppSelector, useAppDispatch } from '@/redux/hooks'
import { auth } from '@/lib/firebase/firebase.utils'
import { Button } from '@/components/ui/button'
import { Icons } from '@/components/icons'
import { _linkWithPopup } from '@/lib/firebase/firebase.utils'
import { FIREBASE_TOKEN } from '@/contants/localstorage'
import { localStorage } from '@/lib/store'
import { getUser } from '@/lib/firebase/firestore.users'
import { setUserInfo } from '@/redux/features/userInfoSlice'
import { Switch } from "@/components/ui/switch"
import { Separator } from '@/components/ui/separator'

export default function Setting() {
  const dispatch = useAppDispatch()
  const { address } = useAccount()
  const [isAlreadyLinked, setIsAlreadyLinked] = useState(false)
  const [disabledConnectTwitter, setDisabledConnectTwitter] = useState(false)
  const [loadingTwitter, setLoadingTwitter] = useState(false)
  const authState = useAppSelector((state) => state.authReducer.authState)
  const userInfoState = useAppSelector((state) => state.userInfoReducer)
  const [userAddr, setUserAddr] = useState('')

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        user?.providerData.forEach((profile) => {
          if (profile.providerId === 'twitter.com') {
            setIsAlreadyLinked(true)
          }
        })
      }
    })
  }, [])

  useEffect(() => {
    if (address) setUserAddr(`${address?.slice(0, 4)}...${address?.slice(-4)}`)
  }, [address])

  const updateUser = () => {
    const token = localStorage.get(FIREBASE_TOKEN)
    return fetch(`${process.env.NEXT_PUBLIC_FIREBASE_URL}/users/update-user`, {
      method: 'POST',
      headers: {
        authorization: `Bearer ${token}`,
      },
    })
  }

  const handleConnectTwitter = () => {
    setDisabledConnectTwitter(true)
    setLoadingTwitter(true)
    _linkWithPopup()
      .then(async () => {
        setIsAlreadyLinked(true)
        handleUpdate()
      })
      .catch((err) => {
        setDisabledConnectTwitter(false)
        setLoadingTwitter(false)

        let errMsg = ''
        switch (err.code) {
          case 'auth/credential-already-in-use':
            errMsg =
              'The current Twitter account has been linked to another account.'
            break
          default:
            errMsg = 'Server error, please contact the administrator'
            break
        }

        console.error(errMsg)
      })
  }

  const handleUpdate = async () => {
    if (address) {
      setDisabledConnectTwitter(true)
      setLoadingTwitter(true)
      await updateUser()
      getUser(address)
        .then((res) => {
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
        })
        .finally(() => {
          setDisabledConnectTwitter(false)
          setLoadingTwitter(false)
        })
    }
  }

  return (
    <>
      <div className='flex justify-between items-center'>
        <div className='flex text-base font-normal text-zinc-800'>
          <Icons.wallet className='mr-4' size={20}/>
          Address
        </div>
        <div className='text-zinc-400 text-sm'>{userAddr}</div>
      </div>
      <div className='flex justify-between items-center mt-4'>
        <div className='flex text-base font-normal text-zinc-800'>
          <Icons.twitter className='mr-4' size={20} />
          Twitter account
        </div>
        {isAlreadyLinked ? (
          Boolean(userInfoState.twitterHandle) ? (
            <Button className='justify-center px-2 py-1 h-auto'>
              @{userInfoState.twitterName}
            </Button>
          ) : (
            <Button
              disabled={
                disabledConnectTwitter ||
                !Boolean(authState) ||
                Boolean(userInfoState.twitterHandle)
              }
              className='justify-center px-2 py-1 h-auto'
              onClick={handleUpdate}
            >
              {loadingTwitter ? (
                <Icons.spinner className='mr-2 h-4 w-4 animate-spin' />
              ) : (
                ''
              )}
              Update Twitter
            </Button>
          )
        ) : (
          <Button
            disabled={
              disabledConnectTwitter ||
              !Boolean(authState) ||
              Boolean(userInfoState.twitterHandle)
            }
            className='justify-center px-2 py-1 h-auto'
            onClick={handleConnectTwitter}
          >
            {loadingTwitter ? (
              <Icons.spinner className='mr-2 h-4 w-4 animate-spin' />
            ) : (
              ''
            )}
            Connect
          </Button>
        )}
      </div>
      <Separator className='my-4'></Separator>
      <div className='flex justify-between items-center'>
        <div className='flex'>
          <Icons.calendar_plus className='mr-4' size={20}/> Google calendar
        </div>
        <Switch disabled />
      </div>
    </>
  )
}
