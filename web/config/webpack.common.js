const extract_text_plugin = require("extract-text-webpack-plugin");
const {root} = require('./helpers');
const webpack = require('webpack');

/**
 * This is a common webpack config which is the base for all builds
 */
module.exports = {
    resolve: {
        extensions: ['.js', '.ts', '.css', '.scss']
    },
    output: {
        path: root('./dist'),
        publicPath: "/"
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                loader: '@ngtools/webpack'
            },
            {
                test: /\.ts$/,
                use: ['angular2-template-loader'],
                exclude: [/\.(spec|e2e)\.ts$/]
            },
            {
                test: /\.css$/,
                use: extract_text_plugin.extract({
                        fallback: "style-loader",
                        use: ["css-loader"]
                        // [{
                        //     loader: 'css-loader',
                        //     options: {
                        //         sourceMap: false,
                        //         minimize: true
                        //     }
                        // }]
                    }
                ),
                exclude: root('src', 'app')
            },
            {
                test: /\.scss$/,
                use: extract_text_plugin.extract({
                        fallback: 'style-loader',
                        use: ["css-loader", "sass-loader"] 
                        // [{
                        //     loader: 'css-loader',
                        //     options: {
                        //         sourceMap: false,
                        //         minimize: true
                        //     }
                        // }, 'sass-loader?sourceMap']
                    }
                ),
                exclude: root('src', 'app'),
            },
            {
                test: /\.(png|jpg|gif|svg|eot|ttf|woff|woff2)$/,
                loader: {
                    loader: 'url-loader',
                    options: {
                        limit: 10000
                    }
                }
            },
            {
                test: /\.html$/,
                loader: 'html-loader'
            },
            // {
            //     test: /\.html$/,
            //     use: 'raw-loader'
            // },
            {
                test: /.css$/,
                include: root('src', 'app'),
                loader: 'raw-loader'
            },
            {
                test: /.scss$/,
                include: root('src', 'app'),
                loader: 'raw-loader!sass-loader'
            },
            {
                test: /\.json$/,
                loader: 'json-loader'
            }
        ]
    },
    plugins: [
        new extract_text_plugin("[name].css")
    ]
};
