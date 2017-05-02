// Functions the user should implement
const defaultCallbacks = {
	// Should strip formatting applied by the format() function and return the stripped value
	// Params:
	// * value - the formatted value
	// * value - the position of the cursor prior to unformatting
	// Should return one of the following:
	// * The value with formatting removed
	//  or
	// * An object with the keys
	//   * value: same as above
	//   * cursorPos: The offset in the unformatted string of the cursor
  //     This is optional, but without it the cursor will be moved to the end of the input with each keystroke
	unformat: false,

	// Should:
	// * return true if the value is valid
	// * return false if the value is invalid but an acceptable intermediate value
	//   (i.e. '1.' is not a valid decimal number but you can't type '1.0' witout first typing '1.')
	// * throw an exception if the value is invalid and input should be prevented if possible
	// Params:
	// * value - The value of the input field with formatting stripped by unformat()
	validate: false,

	// Params:
	// * value     - The validated, unformatted value of the input field
	// * cursorPos - The position of the cursor prior to formatting
	// Should return one of the following:
	// * A String suitable to assign to input.value
	//  or
	// * An object with the keys
	//   * value: same as above
	//   * cursorPos: The offset in the formatted string of the cursor
  //     This is optional, but without it the cursor will be moved to the end of the input with each keystroke
	format: false,

	// Should assign the value to some backend storage
	// I recommend validating with respect to other related data and signaling the user
	// if the new value would put your dataset in an invalid state, but that sort of logic here would
	// be poorly placed and coupling of concerns.
	// Params:
	// * value - The validated, unformatted value of the input field
	sync: false,

	// Called when the input changes and the value is invalid
	// We prevent this when possible, but we can't stop the user from pasting it in
	invalid: false,

	// Called when the input changes and the value is invalid but allowed (intermediate)
	intermediate: false,
	//
	// Called when the input changes and the value is valid
	valid: false,
}

// Events we intercept
const events = {
	HTMLInputElement: {
/*
		keydown: function(e) {
			this.debug(`keydown: value='${this.input.value}'`)
			if (this.ignoreKey(e)) return true
		},
		keyup: function(e) {
			this.debug(`keyup: value='${this.input.value}'`)
			if (this.ignoreKey(e)) return true
		},
*/
		keypress: function(e) {
			this.debug(`keypress: value='${this.input.value}'`)
			if (this.ignoreKey(e)) return true
			this.validateAndFormat(e)
		},
		// keypress handles normal typing and prevents input from firing
		// input handles things when the user copys and pasts something in or deletes 
		// with backspace or ctrl+x or something. All the possible things that could
		// happen there are too complex to handle, so we never prevent these.
		// validateAndFormat() will call the invalid() callback to let our user
		// deal with it as appropriate (such as highlighting the field to signal the
		// his/her user.)
		input: function(e) { 
			this.debug(`input: value='${this.input.value}'`)
			this.validateAndFormat(e)
		},

		blur: function(e) {
			this.debug(`blur: value='${this.input.value}'`)
			this.sync()
		},
	}
	// TODO: textarea
	// TODO: select, checkbox, button (maybe?)
}

var defaultOpts = {
	defaultValue: null,
	ignoreCtrl: true,
	ignoreAlt: true,
	debug: false,
}

var predictInput = function(e) {
	if (!('key' in e)) throw new Error(`predictInput called on event of type '${e.type}', which has no value 'key'. You probably only want to call this on KeyEvents`)
	var beforeSelection = e.target.value.slice(0, e.target.selectionStart)
	var afterSelection = e.target.value.slice(e.target.selectionEnd)
	var res = `${beforeSelection}${e.key}${afterSelection}`
	return res
}

export default class ManagedInput {
	constructor(input, callbacks, opts) {
		if (typeof input === 'string') {
			this.input = document.getElementById(input)
			if (!this.input) {
				this.input = document.querySelector(input)
				if (!this.input) throw new Error(`Failed to find element by id or query selector '${input}'`)
			}
		} else {
			this.input = input
		}
		if (!(typeof this.input === 'object')) {
			throw Error(`Expected an object or the name of an element to manage, but got a '${typeof this.input}'`)
		}
		if (!(this.input instanceof HTMLInputElement)) { // eslint-disable-line no-undef
			throw Error(`Expected an HTMLInputElement, got a '${this.input.constructor.name}'`)
		}

		if (('format' in callbacks) && !('unformat' in callbacks)) {
			console.warn(`You defined the format callback but not the unformat callback. That probably won't work well.`)
		}
		if (('unformat' in callbacks) && !('format' in callbacks)) {
			console.warn(`You defined the unformat callback but not the format callback. That probably won't work well.`)
		}
		if (!(('format' in callbacks) || ('unformat' in callbacks) || ('validate' in callbacks))) {
			console.warn(`You didn't define the format/unformat callbacks nor the validate callback. This module doesn't really do anything if you haven't defined at least one of those.`)
		}

		this.callbacks = {}
		if (typeof callbacks === 'undefined') callbacks = {}
		if (typeof callbacks !== 'object') throw new Error(`callbacks should be an object, not a ${typeof callbacks}`)
		Object.keys(defaultCallbacks).forEach((cb) => {
			this.callbacks[cb] = (cb in callbacks) ? callbacks[cb] : defaultCallbacks[cb]
		})
		Object.keys(callbacks).forEach(function(cb) {
			if (!(cb in defaultCallbacks)) {
				console.warn(`Unknown callback: '${cb}'`)
			}
		})

		this.opts = {}
		if (typeof opts === 'undefined') opts = {}
		if (typeof opts !== 'object') throw new Error(`opts should be an object, not a ${typeof opts}`)
		Object.keys(defaultOpts).forEach((opt) => {
			this.opts[opt] = (opt in opts) ? opts[opt] : defaultOpts[opt]
		})
		if (this.opts.defaultValue !== null) {
			this.input.value = this.opts.defaultValue
		}
		this.validateAndFormat()

		this.inputType = this.input.constructor.name
		Object.keys(events[this.inputType]).forEach((evnt) => {
			this.input.addEventListener(evnt, (e) => { events[this.inputType][evnt].bind(this)(e) })
		})

	}

	unformat(value, cursorPos) {
		if (typeof value === 'undefined') value = this.input.value
		if (this.callbacks.unformat) return this.callbacks.unformat(value, cursorPos)
		return value
	}
	unformatted(value) {
		if (typeof value === 'undefined') value = this.input.value
		var unf = this.callbacks.unformat ? this.callbacks.unformat(value) : value
		if (typeof unf === 'object') return unf.value
		return unf
	}
	format(value, cursorPos) {
		if (this.callbacks.format) return this.callbacks.format(value, cursorPos)
		return value
	}
	validate(value) {
		if (typeof value === 'undefined') value = this.unformatted(this.input.value)
		if (this.callbacks.validate) return this.callbacks.validate(value)
		return true
	}
	sync(value) {
		if (typeof value === 'undefined') value = this.unformatted(this.input.value)
		try {
			if (this.callbacks.sync && this.validate(value)) {
				return this.callbacks.sync(value)
			}
		} catch(e) {
			this.debug(`Refusing to sync invalid value ${value}`)
		}
	}
	invalid(unformattedValue, oldValue, newValue) {
		if (this.callbacks.invalid) this.callbacks.invalid(unformattedValue, oldValue, newValue, this.input)
		//if (this.callbacks.invalid) this.callbacks.invalid({unformatted: unformattedValue, old: oldValue, new: newValue, input: this.input})
	}
	intermediate(unformattedValue, oldValue, newValue) {
		if (this.callbacks.intermediate) this.callbacks.intermediate(unformattedValue, oldValue, newValue, this.input)
		//if (this.callbacks.intermediate) this.callbacks.intermediate({unformatted: unformattedValue, old: oldValue, new: newValue, input: this.input})
	}
	valid(unformattedValue, oldValue, newValue) {
		if (this.callbacks.valid) this.callbacks.valid(unformattedValue, oldValue, newValue, this.input)
		//if (this.callbacks.valid) this.callbacks.valid({unformatted: unformattedValue, old: oldValue, new: newValue, input: this.input})
	}

	ignoreKey(evnt) {
		if (!('key' in evnt)) throw new Error(`ignoreKey should only be called for KeyEvents. Called on event of type ${evnt.type}`)
		if (evnt.key.length > 1 ||
			(this.opts.ignoreCtrl && evnt.ctrlKey) ||
			(this.opts.ignoreAlt && evnt.altKey) 
		) {
			this.debug({ignoring: evnt})
			return true
		}
		return false
	}

	// If current state of input is a valid value,
	// apply formatting.
	// Call the valid/invalid callbacks in any case
	// Returns:
	// 	true  - calling event should prevent user input if possible ()
	// 	false - calling event should allow user input
	validateAndFormat(e) {
		// NOTE -- We can't assume 'e' is set because we call this on instantiation to format the
		// input's default value

		var oldValue = ''
		var newValue
		var cursorPos = this.input.selectionStart
		if (e && e.key) {
			oldValue = this.input.value
			newValue = predictInput(e)
			cursorPos++
		} else {
			newValue = this.input.value
		}
		let unformatted = this.unformat(newValue, cursorPos)
		if (typeof unformatted !== 'object') unformatted = { value: unformatted, cursorPos: false }
		try {
			if (!this.validate(unformatted.value)) {
				this.debug(`'${unformatted.value}': acceptable intermediate value, formatting delayed`)
				this.intermediate(unformatted.value, oldValue, newValue)
			} else {
				var formatted = this.format(unformatted.value, unformatted.cursorPos)
				if (typeof formatted !== 'object') formatted = { value: formatted, cursorPos: false }
				this.debug(`'${unformatted.value}' (cursorPos=${unformatted.cursorPos}) is valid, formatted as '${formatted.value}' (cursorPos=${formatted.cursorPos})`)
				if (e) e.preventDefault() // Since we're inserting the formatted value, we prevent keystroke
				this.input.value = formatted.value
				if (formatted.cursorPos) {
					this.input.setSelectionRange(formatted.cursorPos, formatted.cursorPos)
				}
				this.valid(unformatted.value, oldValue, newValue)
			}
		} catch (ex) {
			this.debug(`Invalid value '${unformatted.value}': "${ex.message}". We'll prevent input if possible.`)
			if (e) e.preventDefault()
			if (!e || e.type !== 'keypress') this.invalid(unformatted.value, oldValue, newValue)
			return false
		}
		return true
	}
	set(newValue, force) {
		var oldValue = this.input.value
		let unformatted = this.unformat(newValue)
		if (typeof unformatted !== 'object') unformatted = { value: unformatted, cursorPos: false }
		var formatted = newValue
		var valid = false
		try {
			if (!this.validate(unformatted.value)) {
				this.debug(`set() called with '${unformatted.value}': acceptable intermediate value set programatically, formatting delayed`)
				this.intermediate(unformatted.value, oldValue, newValue)
			} else {
				valid = true
				formatted = this.format(unformatted.value, unformatted.cursorPos)
				this.debug(`set() called with '${unformatted.value}': valid, formatted as '${formatted.value}' (cursorPos=${formatted.cursorPos})`)
			}
		} catch (ex) {
			if (force) {
				this.debug(`set() called with force. Setting invalid value '${unformatted.value}': "${ex.message}". `)
			} else {
				this.debug(`set() called without force, ignoring invalid value '${unformatted.value}': "${ex.message}". `)
				return valid
			}
		}
		if (typeof formatted !== 'object') formatted = { value: formatted, cursorPos: false }
		this.input.value = formatted.value
		if (formatted.cursorPos) this.input.setSelectionRange(formatted.cursorPos, formatted.cursorPos)
		if (valid) this.valid(unformatted.value, oldValue, newValue)
		return valid
	}


	debug(msg) {
		if (this.opts.debug) console.log(msg)
	}
}

