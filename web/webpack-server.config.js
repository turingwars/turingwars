const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const webpack = require('webpack');
const path = require('path');
const nodeExternals = require('webpack-node-externals');
const StartServerPlugin = require('start-server-webpack-plugin');

module.exports = {
    entry: ['webpack/hot/signal', './src/server/boot.ts'],
    output: {
        path: path.join(__dirname, '.tmp'),
        filename: 'server.js'
    },
    watch: true,
    mode: 'development',
    devtool: 'inline-source-map',
    target: 'node',
    node: {
        __filename: true,
        __dirname: true
    },
    resolve: {
        alias: {
            'views': path.resolve(__dirname, 'src/server/.views/')
        },
        extensions: ['.html', '.ts', '.js']
    },
    externals: [
        nodeExternals({ whitelist: ['webpack/hot/signal'] })
    ],
    module: {
        rules: [
            {
                test: /\.ts$/,
                include: path.join(__dirname, 'src'),
                use: [
                    {
                        loader: 'ts-loader',
                        options: {
                            transpileOnly: true
                        }
                    }
                ],
                exclude: /node_modules/
            }
        ]
    },
    plugins: [
        new StartServerPlugin({
            name: 'server.js',
            // nodeArgs: [`--require`, 'dotenv/config', '--inspect-brk=9229']
            signal: true
        }),
        new webpack.NamedModulesPlugin(),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoEmitOnErrorsPlugin(),
        new ForkTsCheckerWebpackPlugin(),
        new webpack.BannerPlugin({
            banner: 'require("source-map-support").install();',
            raw: true,
            entryOnly: false
        })
    ]
};