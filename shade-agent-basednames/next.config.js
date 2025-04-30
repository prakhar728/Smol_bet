/** @type {import('next').NextConfig} */
module.exports = {
    output: 'standalone',
    webpack: (config, { isServer }) => {
        if (!isServer) {
            config.resolve.fallback = {
                net: false,
                fs: false,
                tls: false,
                crypto: false,
            };
        }
        return config;
    },
};
