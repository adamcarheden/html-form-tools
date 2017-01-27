const webpack = require( 'webpack' )
const path = require('path')
const projectRoot = path.resolve(__dirname+"/../")

module.exports = {
  entry: projectRoot+'/src/html-form-tools.js',
  output: {
    path: projectRoot,
    filename: 'html-form-tools.js',
    library: 'html-form-tools',
    libraryTarget: 'umd',
    umdNamedDefine: true
  },
  resolve: {
    extensions: [ '', '.js']
  },
  module: {
		preLoaders: [
			{
				test: /.js$/,
				loader: 'eslint',
				include: projectRoot,
				exclude: /node_modules/
			}
		],
    loaders: [
      {
        test: /\.js$/,
        loader: 'babel',
        include: projectRoot,
        exclude: /node_modules/
      },
      {
        test: /\.css$/,
        loader: 'style!css'
      }
    ]
  },
	/*
  plugins: [
    new webpack.optimize.UglifyJsPlugin( {
      minimize : true,
      sourceMap : false,
      mangle: true,
      compress: {
        warnings: false
      }
    } )
  ]
	*/
}
