// For authoring Nightwatch tests, see
// http://nightwatchjs.org/guide#usage
var fixtures = require('../fixtures')

module.exports = {
	'ManagedInput': function (browser) {
		// automatically uses dev Server port from /config.index.js
		// default: http://localhost:8080
		// see nightwatch.conf.js
		const devServer = browser.globals.devServerURL

		const noz = fixtures.strings.ASCII_PRINTABLES.replace(/z/ig,'')
		browser
			.url(devServer)
			.waitForElementVisible('#app', 5000)
			.assert.elementPresent('input#noz')
			.clearValue('input#noz')
			.getValue('input#noz', fixtures.expect(''))
			.setValue('input#noz',fixtures.arrays.ASCII_PRINTABLES)
			.getValue('input#noz', fixtures.expect(noz))
			.end()
	}
}
