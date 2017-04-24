const DIGITS = '0123456789'
const SYMBOLS = ' `~!@#$%^&*()-_=+[]\\{}|;\':",./<>?'
const UPPER = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
const LOWER = 'abcdefghijklmnopqrstuvwxyz'
const ASCII_PRINTABLES = DIGITS+SYMBOLS+UPPER+LOWER
const expect = function(value) {
	return function(result) {
		this.assert.equal(typeof result, "object");
		this.assert.equal(result.status, 0);
		this.assert.equal(result.value, value)
	}
}

module.exports = {
	expect,
	strings: {
		DIGITS,
		SYMBOLS,
		UPPER,
		LOWER,
		ASCII_PRINTABLES,
	},
	arrays: {
		DIGITS: DIGITS.split(''),
		SYMBOLS: SYMBOLS.split(''),
		UPPER: UPPER.split(''),
		LOWER: LOWER.split(''),
		ASCII_PRINTABLES: ASCII_PRINTABLES.split(''),
	}
}
