
const { root } = require('./helpers');
const { AotPlugin } = require('@ngtools/webpack');

const tsconfigs = {
  client: root('./tsconfig.browser.json'),
  server: root('./tsconfig.server.json')
};

const aotTsconfigs = {
  client: root('./tsconfig.browser.json'),
  server: root('./tsconfig.server.aot.json')
};

/**
 * Generates a AotPlugin for @ngtools/webpack
 *
 * @param {string} platform Should either be client or server
 * @param {boolean} aot Enables/Disables AoT Compilation
 * @param {string} entry_module Path for the entry module
 * @returns
 */
function getAotPlugin(platform, aot, entry_module) {
    return new AotPlugin({
        entryModule: entry_module,
        tsConfigPath: aot ? aotTsconfigs[platform] : tsconfigs[platform],
        skipCodeGeneration: !aot
    });
}

module.exports = {
  getAotPlugin: getAotPlugin
};
