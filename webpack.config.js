const path = require('path');

// module bundler
// https://webpack.js.org/guides/getting-started/
// https://webpack.js.org/concepts/


module.exports = {
    entry: './public/src/index.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'main.js'
    },
    mode: 'development'
};