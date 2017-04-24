// For authoring Nightwatch tests, see
// http://nightwatchjs.org/guide#usage
var fixtures = require('../fixtures')

module.exports = {
	'IntegerInput': function (browser) {
		// automatically uses dev Server port from /config.index.js
		// default: http://localhost:8080
		// see nightwatch.conf.js
		const devServer = browser.globals.devServerURL

		browser
			.url(devServer)
			.waitForElementVisible('#app', 5000)
			.assert.elementPresent('input#integer')
			.getValue('input#integer', fixtures.expect(''))
			.setValue('input#integer',fixtures.arrays.SYMBOLS)
			.getValue('input#integer', fixtures.expect(''))
			.setValue('input#integer',fixtures.arrays.UPPER)
			.getValue('input#integer', fixtures.expect(''))
			.setValue('input#integer',fixtures.arrays.LOWER)
			.getValue('input#integer', fixtures.expect(''))
			.setValue('input#integer',['1'])
			.getValue('input#integer', fixtures.expect('1'))
			.setValue('input#integer',['2'])
			.getValue('input#integer', fixtures.expect('12'))
			.setValue('input#integer',['3'])
			.getValue('input#integer', fixtures.expect('123'))
			.setValue('input#integer',['4'])
			.getValue('input#integer', fixtures.expect('1,234'))
			.setValue('input#integer',['5'])
			.getValue('input#integer', fixtures.expect('12,345'))
			.setValue('input#integer',['6'])
			.getValue('input#integer', fixtures.expect('123,456'))
			.setValue('input#integer',['7'])
			.getValue('input#integer', fixtures.expect('1,234,567'))
			.end()
	}
}
