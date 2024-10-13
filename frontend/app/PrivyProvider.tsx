'use client';

import {PrivyProvider} from '@privy-io/react-auth';

export default function PrivyProviders({children}: {children: React.ReactNode}) {
  return (
    <PrivyProvider
      appId={`${process.env.NEXT_PUBLIC_PRIVY_APP_ID}`}
      config={{
        // Customize Privy's appearance in your app
        appearance: {
          theme: 'light',
          accentColor: '#676FFF',
        },
        loginMethods: ['wallet', 'farcaster'],
        // Create embedded wallets for users who don't have a wallet
        // embeddedWallets: {
        //   createOnLogin: 'users-without-wallets',
        // },
      }}
    >
      {children}
    </PrivyProvider>
  );
}