// For authoring Nightwatch tests, see
// http://nightwatchjs.org/guide#usage
var fixtures = require('../fixtures')

module.exports = {
	'DollarInput': function (browser) {
		// automatically uses dev Server port from /config.index.js
		// default: http://localhost:8080
		// see nightwatch.conf.js
		const devServer = browser.globals.devServerURL

		// Sanity check
		browser
			.url(devServer)
			.waitForElementVisible('#app', 5000)
			.assert.elementPresent('input#dollar')

		// Test valid input
		browser
			.clearValue('input#dollar')
			.getValue('input#dollar', fixtures.expect(''))
			.setValue('input#dollar',['1'])
			.getValue('input#dollar', fixtures.expect('$1'))
			.setValue('input#dollar',['2'])
			.getValue('input#dollar', fixtures.expect('$12'))
			.setValue('input#dollar',['3'])
			.getValue('input#dollar', fixtures.expect('$123'))
			.setValue('input#dollar',['4'])
			.getValue('input#dollar', fixtures.expect('$1,234'))
			.setValue('input#dollar',['5'])
			.getValue('input#dollar', fixtures.expect('$12,345'))
			.setValue('input#dollar',['6'])
			.getValue('input#dollar', fixtures.expect('$123,456'))
			.setValue('input#dollar',['7'])
			.getValue('input#dollar', fixtures.expect('$1,234,567'))
			.setValue('input#dollar',['.'])
			.getValue('input#dollar', fixtures.expect('$1,234,567.'))
			.setValue('input#dollar',['8'])
			.getValue('input#dollar', fixtures.expect('$1,234,567.8'))
			.setValue('input#dollar',['9'])
			.getValue('input#dollar', fixtures.expect('$1,234,567.89'))

		// Test invalid input
		browser
			.clearValue('input#dollar')
			.getValue('input#dollar', fixtures.expect(''))
			.setValue('input#dollar',fixtures.arrays.ALPHA)
			.getValue('input#dollar', fixtures.expect(''))
		// TODO: fix to allow commas only where appropriate
		browser
			.clearValue('input#dollar')
			.getValue('input#dollar', fixtures.expect(''))
			.setValue('input#dollar',fixtures.arrays.SYMBOLS)
			.getValue('input#dollar', fixtures.expect('$,.'))

		// Test combination of valid and invalid input
		browser
			.clearValue('input#dollar')
			.getValue('input#dollar', fixtures.expect(''))
			.setValue('input#dollar',['a','4','5','g','!','3',',','4','g','#','9','.','7','R','3'])
			.getValue('input#dollar', fixtures.expect('$45,349.73'))

		browser.end()
	}
}
