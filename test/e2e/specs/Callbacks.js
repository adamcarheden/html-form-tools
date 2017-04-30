// For authoring Nightwatch tests, see
// http://nightwatchjs.org/guide#usage
var fixtures = require('../fixtures')

module.exports = {
	'Callbacks': function (browser) {
		// automatically uses dev Server port from /config.index.js
		// default: http://localhost:8080
		// see nightwatch.conf.js
		const devServer = browser.globals.devServerURL


		const makeCheckRes = function(cb) {
			return function(result) {
				if (result.state !== 'success') {
					console.log(result)
					this.assert.equal(result.state,'success',"Checking '"+cb+"' failed")
					return
				}
				if (!Array.isArray(result.value)) {
					console.log(result)
					this.assert.equal(true,false,"Checking '"+cb+"' didn't return an array")
					return
				}
				for (var num=0; num < result.value.length; num++) {
					var res = result.value[num]
					if (!('value' in res)) {
						console.log(res)
						this.assert.equal(true,false,"Checking '"+cb+"' returned an object with a 'state' key")
						continue
					}
					if (!('expect' in res)) {
						console.log(res)
						this.assert.equal(true,false,"Checking '"+cb+"' returned an object with a 'expect' key")
						continue
					}
					if (!('msg' in res)) {
						console.log(res)
						this.assert.equal(true,false,"Checking '"+cb+"' returned an object with a 'msg' key")
						continue
					}
					this.assert.equal(res.value, res.expect, res.msg)
				}
			}
		}

		const input = 'abc'
		const intermediateStr = 'false'
		const invalidStr = 'throw'
		const invalidStrPre = invalidStr.substring(0,invalidStr.length-1)
		browser
			.url(devServer)
			.waitForElementVisible('#app', 5000)
			.assert.elementPresent('input#allcb')

			// Clear arg cache
			.execute(function(input) {
				window.cbParams.unformat = null
				window.cbParams.validate = null
				window.cbParams.format = null
				window.cbParams.sync = null
				window.cbParams.invalid = null
				window.cbParams.intermediate = null
				window.cbParams.valid = null
			})

			// Ensure it took
			.execute(function() {
				return [{value: window.cbParams.unformat === null, expect: true, msg: "windows.cbParams.unformat is null before input"}]
			}, [], makeCheckRes('unformat'))
			.execute(function() {
				return [{value: window.cbParams.format === null, expect: true, msg: "windows.cbParams.validate is null before input"}]
			}, [], makeCheckRes('validate'))
			.execute(function() {
				return [{value: window.cbParams.format === null, expect: true, msg: "windows.cbParams.format is null before input"}]
			}, [], makeCheckRes('format'))
			.execute(function() {
				return [{value: window.cbParams.sync === null, expect: true, msg: "windows.sync.unformat is null before input"}]
			}, [], makeCheckRes('sync'))
			.execute(function() {
				return [{value: window.cbParams.valid === null, expect: true, msg: "windows.cbParams.valid is null before input"}]
			}, [], makeCheckRes('valid'))

			// Enter input
			.clearValue('input#allcb')
			.getValue('input#allcb', fixtures.expect(''))
			.setValue('input#allcb', input)
			// unformat
			.execute(function(input) {
				return [
					{value: window.cbParams.unformat !== null, expect: true, msg: "windows.cbParams.unformat isn't null"},
					{value: window.cbParams.unformat.length, expect: 2, msg: 'unformat received 2 arguments'},
					{value: window.cbParams.unformat[0], expect: input, msg: 'unformat received input'},
					{value: window.cbParams.unformat[1], expect: input.length, msg: 'cursor at end of field'},
				]
			}, [input], makeCheckRes('unformat'))

			// validate
			.execute(function(input) {
				return [
					{value: window.cbParams.validate !== null, expect: true, msg: "windows.cbParams.validate isn't null"},
					{value: window.cbParams.validate.length, expect: 1, msg: 'validate received 1 argument'},
					{value: window.cbParams.validate[0], expect: input, msg: 'validate received input'},
				]
			}, [input], makeCheckRes('validate'))

			// format
			.execute(function(input) {
				return [
					{value: window.cbParams.format !== null, expect: true, msg: "windows.cbParams.format isn't null"},
					{value: window.cbParams.format.length, expect: 2, msg: 'format received 2 arguments'},
					{value: window.cbParams.format[0], expect: input, msg: 'format received input'},
					{value: window.cbParams.format[1], expect: input.length, msg: 'cursor at end of field'},
				]
			}, [input], makeCheckRes('format'))

			// valid
			.execute(function(input) {
				return [
					{value: window.cbParams.valid !== null, expect: true, msg: "windows.cbParams.valid isn't null"},
					{value: window.cbParams.valid.length, expect: 4, msg: 'valid received 4 arguments'},
					{value: window.cbParams.valid[0], expect: input, msg: 'valid received input'},
					{value: window.cbParams.valid[1], expect: input.substring(0,input.length-1), msg: 'old value is the string less the final character'},
					{value: window.cbParams.valid[2], expect: input, msg: 'new value is input'},
					{value: document.getElementById('allcb') === window.cbParams.valid[3], expect: true, msg: 'input passed to valid() is the correct input'},
				]
			}, [input], makeCheckRes('valid'))

			// Sync
			.execute(function() {
				return [{value: window.cbParams.sync === null, expect: true, msg: "windows.cbParams.sync is null before input loses focus"}]
			}, [], makeCheckRes('sync'))
			.sendKeys('input#allcb', browser.Keys.TAB)
			.execute(function(input) {
				return [
					{value: window.cbParams.sync !== null, expect: true, msg: "windows.cbParams.sync isn't null"},
					{value: window.cbParams.sync.length, expect: 1, msg: 'sync received 1 argument'},
					{value: window.cbParams.sync[0], expect: input, msg: 'sync received input'},
				]
			}, [input], makeCheckRes('sync'))

			// Intermediate
			.execute(function() {
				window.cbParams.intermediate = null
			})
			.execute(function() {
				return [{value: window.cbParams.intermediate === null, expect: true, msg: "windows.cbParams.intermediate is null before input"}]
			}, [], makeCheckRes('intermediate'))
			.clearValue('input#allcb')
			.getValue('input#allcb', fixtures.expect(''))
			.setValue('input#allcb', intermediateStr)
			.execute(function(intermediateStr) {
				return [
					{value: window.cbParams.intermediate !== null, expect: true, msg: "windows.cbParams.intermediate isn't null"},
					{value: window.cbParams.intermediate.length, expect: 4, msg: 'intermediate received 4 arguments'},
					{value: window.cbParams.intermediate[0], expect: intermediateStr, msg: 'intermediate received input'},
					{value: window.cbParams.intermediate[1], expect: '', msg: 'old value is empty'}, // TODO: I'm not sure why this is empty, but I suspect it may be an artifact of testing. 
					{value: window.cbParams.intermediate[2], expect: intermediateStr, msg: 'new value is input'},
					{value: document.getElementById('allcb') === window.cbParams.intermediate[3], expect: true, msg: 'input passed to intermediate() is the correct input'},
				]
			}, [intermediateStr], makeCheckRes('intermediate'))

			// Invalid
			.execute(function() {
				window.cbParams.invalid = null
			})
			.execute(function() {
				return [{value: window.cbParams.invalid === null, expect: true, msg: "windows.cbParams.invalid is null before input"}]
			}, [], makeCheckRes('invalid'))
			.clearValue('input#allcb')
			.getValue('input#allcb', fixtures.expect(''))
			.setValue('input#allcb', invalidStr)
			.getValue('input#allcb', fixtures.expect(invalidStrPre))
			.execute(function(invalidStr) {
				return [{value: window.cbParams.invalid === null, expect: true, msg: "windows.cbParams.invalid is still null"}]
			}, [invalidStr], makeCheckRes('invalid'))
/*
// TODO: test copy-n-pasteing an invalid value in. Nightwatch can apparently paste, but copying doesn't work.
// Probably some misguided Chrome security nonsense.
			.setValue('input#noz', invalidStr)
			.keys([browser.Keys.CONTROL, "a"],function() {
				this.pause(2000)
				this.keys([browser.Keys.CONTROL, "c"]) // copy text
			}) // highlight text
			.clearValue('input#allcb')
			.keys([browser.Keys.CONTROL, "v"]) // paste text
			.pause(2000)
			.execute(function(invalidStr) {
				return [
					{value: window.cbParams.invalid !== null, expect: true, msg: "windows.cbParams.invalid isn't null"},
					{value: window.cbParams.invalid.length, expect: 4, msg: 'invalid received 4 arguments'},
					{value: window.cbParams.invalid[0], expect: invalidStr, msg: 'intermediate received input'},
					{value: window.cbParams.invalid[1], expect: '', msg: 'old value is empty'}, // TODO: I'm not sure why this is empty, but I suspect it may be an artifact of testing. 
					{value: window.cbParams.invalid[2], expect: invalidStr, msg: 'new value is input'},
					{value: document.getElementById('allcb') === window.cbParams.invalid[3], expect: true, msg: 'input passed to invalid() is the correct input'},
				]
			}, [invalidStr], makeCheckRes('invalid'))
*/
			



//			.setValue('input#allcb',fixtures.arrays.ASCII_PRINTABLES)
//			.getValue('input#allcb', fixtures.expect(allcb))


		browser.end()
	}
}
