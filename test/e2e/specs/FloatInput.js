// For authoring Nightwatch tests, see
// http://nightwatchjs.org/guide#usage
var fixtures = require('../fixtures')

module.exports = {
	'FloatInput': function (browser) {
		// automatically uses dev Server port from /config.index.js
		// default: http://localhost:8080
		// see nightwatch.conf.js
		const devServer = browser.globals.devServerURL

		// Sanity check
		browser
			.url(devServer)
			.waitForElementVisible('#app', 5000)
			.assert.elementPresent('input#float')

		// Test valid input
		browser
			.clearValue('input#float')
			.getValue('input#float', fixtures.expect(''))
			.setValue('input#float',['1'])
			.getValue('input#float', fixtures.expect('1'))
			.setValue('input#float',['2'])
			.getValue('input#float', fixtures.expect('12'))
			.setValue('input#float',['3'])
			.getValue('input#float', fixtures.expect('123'))
			.setValue('input#float',['4'])
			.getValue('input#float', fixtures.expect('1,234'))
			.setValue('input#float',['5'])
			.getValue('input#float', fixtures.expect('12,345'))
			.setValue('input#float',['6'])
			.getValue('input#float', fixtures.expect('123,456'))
			.setValue('input#float',['7'])
			.getValue('input#float', fixtures.expect('1,234,567'))
			.setValue('input#float',['.'])
			.getValue('input#float', fixtures.expect('1,234,567.'))
			.setValue('input#float',['8'])
			.getValue('input#float', fixtures.expect('1,234,567.8'))
			.setValue('input#float',['9'])
			.getValue('input#float', fixtures.expect('1,234,567.89'))

		// Test invalid input
		browser
			.clearValue('input#float')
			.getValue('input#float', fixtures.expect(''))
			.setValue('input#float',fixtures.arrays.ALPHA)
			.getValue('input#float', fixtures.expect(''))
		// TODO: fix to allow commas only where appropriate
		browser
			.clearValue('input#float')
			.getValue('input#float', fixtures.expect(''))
			.setValue('input#float',fixtures.arrays.SYMBOLS)
			.getValue('input#float', fixtures.expect(',.'))

		// Test combination of valid and invalid input
		browser
			.clearValue('input#float')
			.getValue('input#float', fixtures.expect(''))
			.setValue('input#float',['a','4','5','g','!','3',',','4','g','#','9','.','7','R','3'])
			.getValue('input#float', fixtures.expect('45,349.73'))

		browser.end()
	}
}
