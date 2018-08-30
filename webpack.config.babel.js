import webpack from 'webpack-stream'
import UglifyJsPlugin from 'uglifyjs-webpack-plugin'
import path from 'path'

module.exports = {
    development: {
        mode: 'development',
        devtool: 'source-map-inline',
        output: {
            filename: 'bundle.js',
        }
    },
    production: {
        mode: 'production',
        output: {
            filename: 'bundle.min.js'
        },
        optimization: {
            minimizer: [
                new UglifyJsPlugin()
            ]
        }
    }
}

