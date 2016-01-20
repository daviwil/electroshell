var webpack = require('webpack');
var path = require('path');

module.exports = {
    entry: {
        app: ['./src/app.tsx'],
        main: "./src/main.ts"
    },

    output: {
        path: path.join(__dirname, 'out'),
        filename: '[name].js'
    },

    resolve: {
        extensions: ['', '.webpack.js', '.web.js', '.ts', '.tsx', '.js', '.css']
    },

    module: {
        loaders: [
            { test: /\.tsx?$/, loader: 'babel-loader!ts-loader' },
            { test: /\.css$/, loader: 'style-loader!css-loader' }
        ]
    },

    target: "electron",

    externals: {
        'electron': 'require("electron")',
        'fs': 'require("fs")',
        'ipc': 'require("ipc")',
        'child_process': 'require("child_process")'
    },

    plugins: [
    ]
}