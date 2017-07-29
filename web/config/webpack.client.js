const {root} = require('./helpers');

const {AotPlugin} = require('@ngtools/webpack');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const ScriptExtPlugin = require('script-ext-html-webpack-plugin');
const copy_plugin = require('copy-webpack-plugin');
const webpack = require('webpack');

/**
 * This is a client config which should be merged on top of common config
 */
module.exports = (entries, env) => {
    let entry_obj = Object.assign({}, entries);

    entry_obj['polyfills'] = './src/polyfills.browser.ts';
    entry_obj['vendor'] = './src/vendor.browser.ts';

    let config = {
        entry: entry_obj,
        output: {
            filename: `[name]${env.is_prod ? '.[hash]' : ''}.client.js`,
            chunkFilename: '[id].[chunkhash].js'
        },
        target: 'web',
        plugins: [
            new ScriptExtPlugin({
                defaultAttribute: 'defer'
            })
        ]
    };

    // if (env.is_prod) {
    config.plugins.push(
        new webpack.optimize.CommonsChunkPlugin({
            name: "nms",
            minChunks: function(module) {
                return module.context && module.context.indexOf("node_modules") !== -1;
            }
        })
    );

    config.plugins.push(
        new webpack.optimize.CommonsChunkPlugin({
            name: "manifest",
            minChunks: Infinity
        })
    );

    config.plugins.push(
        new webpack.optimize.CommonsChunkPlugin(
            {
                children: true,
                async: true,
                minChunks: 2
            }
        )
    );
    // }

    Object.keys(entries).forEach((v) => {
        config.plugins.push(new HtmlWebpackPlugin({
            template: root('./src/index.html'),
            filename: root(`./dist/${v}.index.html`),
            inject: 'head',
            chunks: ["manifest", "nms", "polyfills", "vendor", v]
        }));
    });

    return config;
};
