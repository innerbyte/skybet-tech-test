const {root} = require('./helpers');

const {AotPlugin} = require('@ngtools/webpack');

/**
 * This is a server config which should be merged on top of common config
 */
module.exports = {
    entry: {
        server: root('./src/main.server.ts')
    },
    output: {
        filename: '[name].js',
        chunkFilename: '[id].[chunkhash].js'
    },
    target: 'node',
    node: {
        __dirname: true
    }
};
