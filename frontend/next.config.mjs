/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
      unoptimized: true,
      remotePatterns: [
        {
          protocol: 'https',
          hostname: 'waansuoormcizmvnnfgu.supabase.co',
          pathname: '/storage/v1/object/public/**',
        }
      ],
    },
    experimental: {
      serverActions: {
        bodySizeLimit: '2mb'
      },
    }
  }
  
  export default nextConfig;