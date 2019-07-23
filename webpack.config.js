const webpack = require('webpack'),
      path = require('path');

module.exports = {
    entry: './src/entry.js',
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: ['babel-loader']
            },
            {
                test: /\.css$/i,
                use: ['style-loader', 'css-loader'],
            },
        ]
    },
    resolve: {
        extensions: ['.js', '.jsx']
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'entry.js',
        library: 'VideoEditor',
        libraryTarget: 'umd'
    }
};
