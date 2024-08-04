/** @type {import('next').NextConfig} */
const nextConfig = {}

module.exports = nextConfig

module.exports = {
    images: {
        loader: 'custom',
        domains: [], // Keep this empty as we're handling domains in the custom loader
        path: '/',    
    },
};
