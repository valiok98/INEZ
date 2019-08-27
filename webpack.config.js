const path = require('path');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const LiveReloadPlugin = require('webpack-livereload-plugin');
const autoprefixer = require('autoprefixer');

module.exports = {
    mode: 'development',
    entry: {
        'index': ['babel-polyfill', './src/js/client/index.ts'],
        'display-suggestions': './src/js/client/display-suggestions.ts',
        'index.min.css': './src/css/index.scss'
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js']
    },
    output: {
        filename: '[name].min.js',
        path: path.resolve(__dirname, 'dist')
    },
    optimization: {
        minimizer: [new UglifyJsPlugin()]
    },
    module: {
        rules: [
            {
                test: /\.(s)?css$/,
                exclude: /\.(woof|woff2|eot|ttf)/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: 'index.min.css',
                        },
                    },
                    { loader: 'extract-loader' },
                    { loader: 'css-loader' },
                    { loader: 'resolve-url-loader' },
                    {
                        loader: 'postcss-loader',
                        options: {
                            plugins: () => [autoprefixer()],
                        },
                    },
                    {
                        loader: 'sass-loader',
                        options: {
                            includePaths: ['./node_modules'],
                        },
                    }
                ],
            },
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/
            },
            {
                test: /\.m?js$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env']
                    }
                }
            },
            {
                test: /.*\/src\/.*\.js$/,
                exclude: /display-suggestions.ts/, // excluding .spec files
                loader: "uglify"
            }
        ]
    },
    plugins: [
        new LiveReloadPlugin()
    ],
    devtool: 'eval'
};