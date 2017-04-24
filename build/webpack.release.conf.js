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
			}
		],
		loaders: [
			{
				test: /\.js$/,
				loader: 'babel',
				include: projectRoot,
				exclude: /node_modules/,
				query: {
					presets: ['babili']
				}
			},
		]
	},
}