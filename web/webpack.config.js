// const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const path = require('path');
const webpack = require('webpack');

const REPO_ROOT = __dirname;

module.exports = {

    mode: process.env.NODE_ENV || 'development',
    entry: {
        'app': [
            './src/frontend/main.tsx'
        ],
        'replay': [
            './src/frontend/replay/main.tsx'
        ]
    },

    output: {
        filename: '[name].js',
        path: path.resolve(REPO_ROOT, 'public/dist/'),
        publicPath: '/dist'
    },

    // devServer: {
    //     compress: true,
    //     port: 9000,
    //     hot: true,
    //     contentBase: 'public',
    //     allowedHosts: ['localhost']
    // },

    // Currently we need to add '.ts' to the resolve.extensions array.
    resolve: {
        extensions: ['.ts', '.tsx', '.js', '.less'],
        modules: ['node_modules', 'src', '..']
    },

    // Source maps support ('inline-source-map' also works)
    devtool: 'source-map',

    externals: {
        'd3': 'd3',
        'underscore': '_',
        'react': 'React',
        'redux': 'Redux',
        'react-redux': 'ReactRedux',
        'react-dom': 'ReactDOM',
        'codemirror': 'CodeMirror',
        'axios': 'axios'
    },

    // Add the loader for .ts files.
    module: {
        rules: [{
            include: path.join(process.cwd(), '.'),
            test: /\.tsx?$/,
            use: [
                {
                    loader: 'ts-loader',
                    options: {
                        transpileOnly: true
                    },
                },
            ]
        }]
    },

    plugins: [
        new webpack.HotModuleReplacementPlugin({
            // Compute HMR chunks first
            multiStep: true
        }),
        new webpack.NamedModulesPlugin(),
        // new ForkTsCheckerWebpackPlugin(),
        new webpack.DefinePlugin({
            'process.env': {
                'NODE_ENV': JSON.stringify('development')
            }
        })
    ],
};
