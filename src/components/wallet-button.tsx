import React from 'react'
import { useRouter } from 'next/navigation'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { Button, buttonVariants } from '@/components/ui/button'
import { Icons } from '@/components/icons'
import WalletAvatar from '@/components/wallet-avatar'
import { Separator } from '@/components/ui/separator'

function WalletButton({
  twitterName,
  twitterHandle,
  twitterPhoto,
}: {
  twitterName: string | undefined
  twitterHandle: string | undefined
  twitterPhoto: string | undefined
}) {
  const showChain = false
  const router = useRouter()
  const handleClickSetting = () => {
    router.push('/setting')
  }

  return (
    <ConnectButton.Custom>
      {({
        account,
        chain,
        openAccountModal,
        openChainModal,
        openConnectModal,
        authenticationStatus,
        mounted,
      }) => {
        // Note: If your app doesn't use authentication, you
        // can remove all 'authenticationStatus' checks
        const ready = mounted && authenticationStatus !== 'loading'
        const connected =
          ready &&
          account &&
          chain &&
          (!authenticationStatus || authenticationStatus === 'authenticated')

        return (
          <div
            {...(!ready && {
              'aria-hidden': true,
              style: {
                opacity: 0,
                pointerEvents: 'none',
                userSelect: 'none',
              },
            })}
          >
            {(() => {
              if (!connected) {
                return (
                  <Button onClick={openConnectModal} variant='outline'>
                    Connect Wallet
                  </Button>
                )
              }

              if (chain.unsupported) {
                return (
                  <Button onClick={openChainModal} variant='outline'>
                    Wrong network
                  </Button>
                )
              }

              return (
                <div style={{ display: 'flex', gap: 12 }}>
                  {showChain && (
                    <Button
                      onClick={openChainModal}
                      style={{ display: 'flex', alignItems: 'center' }}
                      variant='outline'
                    >
                      {chain.hasIcon && (
                        <div
                          style={{
                            background: chain.iconBackground,
                            width: 12,
                            height: 12,
                            borderRadius: 999,
                            overflow: 'hidden',
                            marginRight: 4,
                          }}
                        >
                          {chain.iconUrl && (
                            <img
                              alt={chain.name ?? 'Chain icon'}
                              src={chain.iconUrl}
                              style={{ width: 12, height: 12 }}
                            />
                          )}
                        </div>
                      )}
                      {chain.name}
                    </Button>
                  )}

                  {twitterHandle && (
                    <a
                      href={
                        twitterHandle
                          ? `https://twitter.com/i/user/${twitterHandle}`
                          : ''
                      }
                      target='_blank'
                      rel='noreferrer'
                      className={`${buttonVariants({ variant: 'outline' })} hidden lg:inline-block`}
                      onClick={(event) => event.stopPropagation()}
                    >
                      <div className='flex items-center'>
                        {twitterPhoto && (
                          <img
                            alt={'twitter avatar'}
                            src={twitterPhoto}
                            className='w-4 rounded-full max-w-full h-auto align-middle border-none'
                          />
                        )}
                        <span className='ml-1 text-sm'>{twitterName}</span>
                      </div>
                    </a>
                  )}

                  <Button onClick={openAccountModal} variant='outline'>
                    0 <span className='ml-1 font-bold'>Point</span>
                    <Separator orientation='vertical' className='mx-3' />
                    <WalletAvatar
                      address={account.address}
                      ensImage={account.ensAvatar}
                      size={10}
                    />
                    <span className='ml-2'>
                      {account.ensName ?? account.displayName}
                    </span>
                    {/*{account.displayBalance*/}
                    {/*  ? ` (${account.displayBalance})`*/}
                    {/*  : ''}*/}
                  </Button>

                  <Button variant='outline' onClick={handleClickSetting}>
                    <Icons.settings className='h-5 w-5'/>
                  </Button>
                </div>
              )
            })()}
          </div>
        )
      }}
    </ConnectButton.Custom>
  )
}

export default WalletButton
