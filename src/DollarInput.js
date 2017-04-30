import { mergeCallbacks } from './util'
import FloatInput from './FloatInput'

export default function(input, callbacks = {}, opts = {}) {
	let newOpts = JSON.parse(JSON.stringify(opts))
	if (!('MaxDecimalDigits' in newOpts)) newOpts.MaxDecimalDigits = 2
	return FloatInput(input, mergeCallbacks(callbacks, {
		unformat: function(value, cursorPos) {
			value = value.toString()
			var unf = value.replace(/^\$+/,'')
			var cp = cursorPos
			var ext = value.length - unf.length
			cp -= Math.min(cursorPos, ext)
			return { value: unf, cursorPos: cp }
		},
		format: function(value, cursorPos) {
			var res = {value: '$'+value, cursorPos: (cursorPos === false) ? false : cursorPos+1 }
			return res
		}
	}, 'DollarInput'), newOpts)
}
