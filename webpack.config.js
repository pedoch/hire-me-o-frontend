// webpack.config.js
module.exports = {
  rules: [
    {
      test: /\.less$/,
      use: [
        {
          loader: 'style-loader',
        },
        {
          loader: 'css-loader', // translates CSS into CommonJS
        },
        {
          loader: 'less-loader', // compiles Less to CSS
          options: {
            lessOptions: {
              // If you are using less-loader@5 please spread the lessOptions to options directly
              modifyVars: {
                'primary-color': '#2dad67',
                'link-color': '#2dad67',
                'border-radius-base': '2px',
              },
              javascriptEnabled: true,
            },
          },
        },
      ],
      // ...other rules
    },
    {
      test: /\.m?jsx?$/,
      resolve: {
        fullySpecified: false,
      },
      // ignore transpiling JavaScript from node_modules as they should be ready to go OOTB
      // exclude: /node_modules/,
    },
  ],
  // ...other config
};
