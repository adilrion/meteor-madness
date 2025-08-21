import type { NextConfig } from "next";
import { webpack } from "next/dist/compiled/webpack/webpack";

const nextConfig: NextConfig = {
    /* config options here */
    webpack(config) {
        config.plugins.push(
            new webpack.DefinePlugin({
                CESIUM_BASE_URL: JSON.stringify("cesium"),
            })
        );
        return config;
    },
};

export default nextConfig;
