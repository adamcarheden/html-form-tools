// For authoring Nightwatch tests, see
// http://nightwatchjs.org/guide#usage



module.exports = {
	'default e2e tests': function (browser) {
		// automatically uses dev Server port from /config.index.js
		// default: http://localhost:8080
		// see nightwatch.conf.js
		const devServer = browser.globals.devServerURL

		browser
			.url(devServer)
			.waitForElementVisible('#app', 5000)
			.assert.elementPresent('input#noz')
			.setValue('input#noz',['x','y','z','1','2','3'])
			.getValue('input#noz', function(result) {
				this.assert.equal(typeof result, "object");
				this.assert.equal(result.status, 0);
				this.assert.equal(result.value, "xy123");
			})
/*
			.setValue('#testin',['a','b','c'])
			.assert.containsText('#testout', 'abc')
			.assert.elementCount('img', 1)
*/
			.end()
	}
}
