const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const WebpackObfuscator = require('webpack-obfuscator');

module.exports = {
	entry: {
		content: './src/content.ts',
		background: './src/background.ts',
		popup: './src/popup.ts',
		options: './src/options.ts',
	},
	output: {
		filename: '[name].js',
		path: path.resolve(__dirname, 'dist'),
	},
	resolve: {
		extensions: ['.ts', '.js'],
	},
	module: {
		rules: [
			{
				test: /\.ts$/,
				use: 'ts-loader',
				exclude: /node_modules/,
			},
		],
	},
	mode: 'production',
	plugins: [
		new CleanWebpackPlugin(),
		new WebpackObfuscator(
			{
				compact: true,
				controlFlowFlattening: true,
				numbersToExpressions: true,
				simplify: true,
				stringArray: true,
				stringArrayEncoding: ['rc4'],
				identifierNamesGenerator: 'hexadecimal',
			},
			['content.js']
		),
	],
};
