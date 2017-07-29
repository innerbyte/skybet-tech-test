
const ngtools = require('@ngtools/webpack');
const wp_merge = require('webpack-merge');
const webpack = require('webpack');
let common_part = require('./config/webpack.common');
const client_part = require('./config/webpack.client');
let server_part = require('./config/webpack.server');
const server_spec_part = require('./config/webpack.server.test');
const prod_part = require('./config/webpack.prod');
const {getAotPlugin} = require('./config/webpack.aot');
const {root} = require('./config/helpers');

module.exports = function (options, wp_options) {
    options = options || {};

    if (!!options.aot) {
        console.log(`Running build for ${options.client ? 'client' : 'server'} with AoT Compilation`)
    }

    if (!!options.test) {
        console.log(`Running tests for ${options.client ? 'client' : 'server'}`);
    }

    console.log("Building sources...");

    const env = {
        is_prod: !!options.prod,
        is_aot: !!options.aot,
        is_test: !!options.test
    };

    common_part = wp_merge({}, common_part, {
        plugins: [
            new webpack.DefinePlugin({
                webpack: {
                    is_prod: JSON.stringify(!!options.prod),
                    is_aot: JSON.stringify(!!options.aot),
                    is_test: JSON.stringify(!!options.test)
                    // environment: JSON.stringify(is_prod ? 'prod' : 'dev')
                },
                'process.env': {
                    'NODE_ENV': JSON.stringify((!!options.prod) ? 'production' : 'development')
                }
            })
        ]
    });

    if (!env.is_prod)
        common_part.devtool = 'eval';

    if (env.is_test)
        server_part = server_spec_part;

    const server_cfg = wp_merge({}, common_part, server_part, {
        entry: (!!options.aot) ? {server: root('./src/main.server.aot.ts')} : server_part.entry, // Temporary
        plugins: [
            getAotPlugin('server', !!options.aot, root('./src/app/main-server-app.module') + '#MainServerAppModule')
        ]
    });

    const sky_entry = `./src/app/main.browser.${!!options.aot ? 'aot.ts' : 'ts'}`;

    const client_entries = {
        skybetapp: sky_entry,
    };

    let client_cfg = wp_merge({}, common_part, client_part(client_entries, env), {
        plugins: [
            getAotPlugin('client', !!options.aot, root('./src/app/main-browser-app.module') + '#MainBrowserAppModule')
        ]
    });

    if (!!options.prod) {
        client_cfg = wp_merge({}, client_cfg, prod_part);
    }

    const configs = [];

    if (!options.aot) {
        configs.push(client_cfg, server_cfg);
    } else if (options.client) {
        configs.push(client_cfg);
    } else if (options.server) {
        configs.push(server_cfg);
    }

    return configs;
};
