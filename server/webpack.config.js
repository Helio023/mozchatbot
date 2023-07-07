module.exports = {
  mode: 'production',
  entry: './public/register.js', // Update with your entry file
  output: {
    filename: 'registerbundle.js', // Update with your desired output file name
    path: __dirname + '/public', // Update with your desired output directory
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
    ],
  },
};
