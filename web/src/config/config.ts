"use strict";

let config = {
    get port(): number {
        return 8585;
    },
    get_mongo_cfg(is_dev: boolean) {
        let host = is_dev ? "127.0.0.1" : "mongo";
        let port = is_dev ? "27018" : "27017";
        let db = is_dev ? "skybet-feed" : "skybet-feed";

        return `mongodb://${host}:${port}/${db}`;
    },
    assets: {
        index_file: './src/index.html',
        folders: new Map([
            [
                'dist', './dist'
            ]
        ])
    }
};

export default config;