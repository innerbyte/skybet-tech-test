const {root} = require('./helpers');
const node_externals = require(`webpack-node-externals`);
const {AotPlugin} = require('@ngtools/webpack');

/**
 * This is a server config which should be merged on top of common config
 */
module.exports = {
    entry: {
        server: root('./src/spec/server/main.spec.ts')
    },
    output: {
        filename: 'server.spec.js',
        chunkFilename: '[id].[chunkhash].js'
    },
    target: 'node',
    node: {
        __dirname: true
    },
    externals: [node_externals()]
};
