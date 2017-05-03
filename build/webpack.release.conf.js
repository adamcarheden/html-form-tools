const webpack = require( 'webpack' )
const path = require('path')
const projectRoot = path.resolve(__dirname+"/../")
const BabiliPlugin = require("babili-webpack-plugin")

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
		extensions: ['.js']
	},
	module: {
		rules: [
			{
				test: /\.(js)$/,
				loader: 'eslint-loader',
				enforce: 'pre',
				include: [projectRoot+'src'],
				options: {
					formatter: require('eslint-friendly-formatter')
				}
			},
			{
				test: /\.(js)$/,
				exclude: /node_modules/,
				loader: 'babel-loader',
			}
		],
	},
	plugins: [
		new BabiliPlugin()
	]
}
