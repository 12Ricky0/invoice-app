/** @type {import('next').NextConfig} */
const nextConfig = {
    async redirects() {
        return [
            {
                source: '/about',
                destination: '/dashboard',
                permanent: false,
            },
        ]
    },
}

module.exports = nextConfig
