import { commafy, uncommafy } from './util'
import ManagedInput from './ManagedInput'
import IntegerInput from './IntegerInput'
import FloatInput from './FloatInput'
import DollarInput from './DollarInput'

export default {
	ManagedInput: function(input, callbacks, opts) { return new ManagedInput(input, callbacks, opts) },
	IntegerInput,
	FloatInput,
	DollarInput,
	util: {
		commafy: commafy,
		uncommafy: uncommafy,
	},
}
