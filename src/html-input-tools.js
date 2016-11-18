/*
## User input process:
1. User types something
1. Validate new state of the input field
	1. Potentially prevent input if new value is invalid
		* Must allow intermediary values (i.e. '1.' is not a valid floating point number, but it's  
      allowed because the input will be in that state at some point as the user types '1.0' which IS a valid value.
	1. Optionally notify user of blocked input (i.e. shake screen or temporarily color background) 
 	1. Optionally notify user of 'currently-invalid' input that was allowed (i.e. intermediary values)
1. Optionally format the input field prior to updating

 * 3) Form field looses focus
 * 4) Validate new value in context of other data.
 * 4a) If failure, flag field as out of sync with back-end data; provide user with explanation
 * 4b) If success, update back-end data. Remove out-of-sync flag if set.
 *
 */

/*

## Input Events

### Installing
*	target.on<event name> = 
	* Returning false prevents default behavior
* target.addEventListener()
	* Returning value has no effect

### Key events
1. keydown
	* After field updated
	* Repeats if key held
	* keyCode but no charCode
1. keypress
	* Before field updated
	* Repeats if key held
	* charCode but no keyCode
1. input
	* After field updated
	* Doesn't fire if preventDefault/stopPropagation called keydown/keypress
	* When paste via menus
1. keyup
	* After field updated
	* Repeats if key held
	* Fires even if preventDefault

### Focus events
1. focus
1. change
	* Before blur
1. blur

*/

// Functions the user should implement
const defaultCallbacks = {
	// Should strip formatting applied by the format() function and return the stripped value
	unformat: function(value) { return value },

	// Should:
	// * return true if the value is valid
	// * return false if the value is invalid but an acceptable intermediate value
	// * throw an InvalidValueError if the value is invalid and should be prevented if possible
	// Params:
	// * value - The value of the input field with formatting stripped by unformat()
	validate: function(value) { return true },

	// Params:
	// * value - The validated, unformatted value of the input field
	// Should return one of the following:
	// * A String suitable to assign to input.value
	//  or
	// * An object with the keys
	//   * value: same as above
	//   * cursorPos: The offset in the formatted string of the cursor
  //     This is optional, but without it the cursor will be moved to the end of the input with each keystroke
	format: function(value, cursorPos) { return {value: value, cursorPos: cursorPos } },

	// Should assign the value to backend storage, optionally validating with respect to other related data.
	// If the new value would put the backend in an invalid state, it should /not/ be assigned and instead
	// it should throw a CantSyncError
	// Params:
	// * value - The validated, unformatted value of the input field
	synchronize: function(value) { },
}

class CantSyncError extends Error {}
class InvalidValueError extends Error {}
const errors = {
	CantSyncError: CantSyncError,
	InvalidValueError: InvalidValueError
}

// Events we emit
const emit = {
	// Called when the input changes and the value is invalid
	// We prevent this when possible, but we can't stop the user from pasting it in
	invalid: function() {},

	// Called when the input changes and the value is invalid but allowed (intermediate)
	intermediate: function() {},

	// Called when the input changes and the value is valid
	valid: function() {},

	// Called when the backend storage update fails
	unsynced: function() {},

	// Called when the backend storage update is successful
	synced: function() {},
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
		// input handles things when the user copyies and pasts something in or deletes with ctrl+x or something
/*
		input: function(e) { 
			this.debug(`input: value='${this.input.value}'`)
			this.validateAndFormat(e)
		},
*/
		change: function(e) {
			this.debug(`change: value='${this.input.value}'`)
			try {
				var value = this.callbacks.unformat(this.input.value)
				this.callbacks.synchronize(value)
				emit.synced(value)
			} catch (ex) {
				emit.unsynched(ex)
			}
		},
	}
	// TODO: textarea
	// TODO: select, checkbox, button (maybe?)
}

var defaultOpts = {
	ignoreCtrl: true,
	ignoreAlt: true,
	debug: false,
}

var predictInput = function(e) {
	if (!('key' in e)) throw new Error(`predictInput called on event of type '${e.type}', which has no value 'key'. You probably only want to call this on KeyEvents`)
	var beforeSelection = e.target.value.slice(0, e.target.selectionStart)
	var afterSelection = e.target.value.slice(e.target.selectionEnd)
	var res = `${beforeSelection}${e.key}${afterSelection}`
	//console.log({before: beforeSelection, key: e.key, after: afterSelection, res: res, value: e.target.value, start: e.target.selectionStart, end: e.target.selectionEnd})
	return res
}

class ManagedInput {
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
			throw Error(`Expected an object or it of an element to manage, but got a ${typeof this.input}`)
		}
		if (!(this.input instanceof HTMLInputElement)) { // eslint-disable-line no-undef
			throw Error(`Expected an HTMLInputElement, got a ${this.input.constructor.name}`)
		}

		this.callbacks = {}
		if (typeof callbacks === 'undefined') callbacks = {}
		if (typeof callbacks !== 'object') throw new Error(`callbacks should be an object, not a ${typeof callbacks}`)
		Object.keys(defaultCallbacks).forEach((cb) => {
			this.callbacks[cb] = (cb in callbacks) ? callbacks[cb] : defaultCallbacks[cb]
		})

		this.opts = {}
		if (typeof opts === 'undefined') opts = {}
		if (typeof opts !== 'object') throw new Error(`opts should be an object, not a ${typeof opts}`)
		Object.keys(defaultOpts).forEach((opt) => {
			this.opts[opt] = (opt in opts) ? opts[opt] : defaultOpts[opt]
		})

		this.inputType = this.input.constructor.name
		Object.keys(events[this.inputType]).forEach((evnt) => {
			this.input.addEventListener(evnt, (e) => { events[this.inputType][evnt].bind(this)(e) })
		})
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

		var oldValue, newValue
		if (e.key) {
			oldValue = e.target.value
			newValue = predictInput(e)
		} else {
			newValue = e.target.value
		}
		var unformatted = this.callbacks.unformat(newValue, e.target.selectionStart)
		if (typeof unformatted !== 'object') unformatted = { value: unformatted, cursorPos: false }
		this.debug({e: e, oldValue: oldValue, newValue: newValue, unformatted: unformatted.value, cursorPos: unformatted.cursorPos})
		try {
			if (!this.callbacks.validate(unformatted.value)) {
				this.debug(`'${unformatted.value}': acceptable intermediate value, formatting delayed`)
				emit.invalid(oldValue, newValue, unformatted.value, this.input.value)
			} else {
				var formatted = this.callbacks.format(unformatted.value, unformatted.cursorPos)
				if (typeof formatted !== 'object') formatted = { value: formatted, cursorPos: false }
				this.debug(`'${unformatted.value}' (${unformatted.cursorPos}) is valid, formatted is '${formatted.value}' (${unformatted.cursorPos})`)
				e.preventDefault() // Since we're inserting the formatted value, we prevent keystroke
				e.target.value = formatted.value
				if (formatted.cursorPos) {
					this.input.setSelectionRange(formatted.cursorPos, formatted.cursorPos+1)
				}
				emit.valid(oldValue, newValue, unformatted.value, this.input.value)
			}
		} catch (ex) {
			this.debug(`Invalid value '${unformatted.value}': "${ex.message}". We'll prevent input if possible.`)
			e.preventDefault()
			emit.invalid(oldValue, newValue, unformatted.value, this.input.value)
			return false
		}
		return true
	}

	debug(msg) {
		if (this.opts.debug) console.log(msg)
	}

}

module.exports = {
	ManagedInput: ManagedInput,
	events: events,
	errors: errors,
}
