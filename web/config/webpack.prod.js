
const webpack = require('webpack');
const uglify_js_plugin = require('uglifyjs-webpack-plugin');

/**
 * This is a prod config to be merged with the Client config
 */
module.exports = {
    plugins: [
        // new webpack.LoaderOptionsPlugin({
        //     minimize: true,
        //     debug: false
        // }),
        new webpack.optimize.UglifyJsPlugin({
            beautify: false,
            sourceMap: true,
            mangle: {
                screw_ie8: true,
                keep_fnames: true
            },
            compress: {
                screw_ie8: true
            },
            comments: false
        })
    ]
};
