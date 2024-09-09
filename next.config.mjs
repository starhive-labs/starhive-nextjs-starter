/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        // TODO: !!
        remotePatterns: [{
            protocol: 'https',
            hostname: 'media.dev.starhive.io',
            port: '',
            pathname: '/**'
        }, {
            protocol: 'https',
            hostname: 'api.dev.starhive.io',
            port: '',
            pathname: '/**'
        }]
    },
};

export default nextConfig;
