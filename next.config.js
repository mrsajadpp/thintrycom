/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: ['thintry.com', 'api.thintry.com', 'files.thintry.com', 'i.postimg.cc', 'iili.io', 'encrypted-tbn0.gstatic.com'], // Add the domains you want to allow images from
    }
};

module.exports = nextConfig;
