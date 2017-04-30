import { commafy, uncommafy, mergeCallbacks, stackFormats } from './util'
import ManagedInput from './ManagedInput'

export default function(input, callbacks = {}, opts = {}) {
	let newOpts = JSON.parse(JSON.stringify(opts))
	if (!('commafy' in newOpts)) newOpts.commafy = true
	var maxDigits = false
	if ('MaxDigits' in newOpts) {
		maxDigits = newOpts.MaxDigits
		delete newOpts.MaxDigits
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
		validate: function(val) {
			if (!val.match(/^[0-9]*$/)) throw new Error('must be a integer')
			if (maxDigits && val.length > maxDigits) throw new Error(`Must be at most ${maxDigits} digits`)
			return true
		},
		format: fmt,
		unformat: ufmt,
	}, 'IntegerInput'), newOpts)
}

