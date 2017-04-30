import { commafy, uncommafy, mergeCallbacks, stackFormats } from './util'
import ManagedInput from './ManagedInput'

export default function(input, callbacks = {}, opts = {}) {
	let newOpts = JSON.parse(JSON.stringify(opts))
	if (!('commafy' in newOpts)) newOpts.commafy = true

	var maxMantissa = false
	if ('MaxMantissaDigits' in newOpts) {
		maxMantissa = newOpts.MaxMantissaDigits
		delete newOpts.MaxMantissaDigits
	}
	var maxDecimal = false
	if ('MaxDecimalDigits' in newOpts) {
		maxDecimal = newOpts.MaxDecimalDigits
		delete newOpts.MaxDecimalDigits
	}
	var fmt = false
	var ufmt = false
	if (newOpts.commafy) {
		fmt = stackFormats(callbacks, 'format', function(value, cursorPos) { return commafy(value, cursorPos) })
		ufmt = stackFormats(callbacks, 'unformat', function(value, cursorPos) { return uncommafy(value, cursorPos) })
	} else {
		if ('format' in callbacks) fmt = callbacks.format
		if ('unformat' in callbacks) ufmt = callbacks.unformat
	}
	delete newOpts.commafy

	return new ManagedInput(input, mergeCallbacks(callbacks, {
		validate: function(value) {
			value = value.toString()
			if (value.length === 0) return false
			//                      0 1    23   4
			var parts = value.match(/^(\d*)((\.)(\d*))?$/)
			if (!parts) throw new Error('Must be numeric (with out without a decimal)')
			if (maxMantissa && parts[1] && parts[1].length > maxMantissa) throw new Error(`Mantissa part must be no more than '${maxMantissa}' digits`)
			if (maxDecimal && parts[4] && parts[4].length > maxDecimal) throw new Error(`Decimal part must be no more than '${maxDecimal}' digits`)
			if (parts[3] && !parts[4]) return false
			return true
		},
		format: fmt,
		unformat: ufmt,
	}, 'FloatInput', ['format','unformat']), newOpts)
}
