"use strict"

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

var cursorLocation(tgt) {
	if (tgt.selectionDirection === 'backward') {
	} else { // For 'none', we assume forward
		
	}
}

// Functions the user should implement
const user = {
	// Should strip formatting applied by the format() function and return the stripped value
	unformat: function(value) {},

	// Should:
	// * return true if the value is valid
	// * return false if the value is invalid but an acceptable intermediate value
	// * throw an invalidValue exception if the value is invalid and should be prevented if possible
	// Params:
	// * value - The value of the input field with formatting stripped by unformat()
	validate: function(value) {},

	// Params:
	// * value - The validated, unformatted value of the input field
	// Should return one of the following:
	// * A String suitable to assign to input.value
	//  or
	// * An object with the keys
	//   * value: same as above
	//   * cursorPos: The offset in the formatted string of the cursor
  //     This is optional, but without it the cursor will be moved to the end of the input with each keystroke
	format: function(value) {},

	// Should assign the value to backend storage, optionally validating with respect to other related data.
	// If the new value would put the backend in an invalid state, it should /not/ be assigned and instead an
	// 'cantSync' exception should be thrown
	// Params:
	// * value - The validated, unformatted value of the input field
	synchronize: function(value) {},
}

const exceptions = {
	// Throw in sychronize() if assigning the value to the backend storage would put it into an invalid state
	cantSync: {},

	// Throw in validate() if value is invalid and input should be blocked if possible
	invalidValue: {},
}

// Events we emit
const callbacks = {
	// Called when the input changes and the value is invalid
	// We prevent this when possible, but we can't stop the user from pasting it in
	invalid: {}

	// Called when the input changes and the value is invalid but allowed (intermediate)
	intermediate: {}

	// Called when the input changes and the value is valid
	valid: {}

	// Called when the backend storage update fails
	unsynced: {}

	// Called when the backend storage update is successful
	synced: {}
}

var getCursorPos(target) {
	// TODO
	return 0;
}
var doValidate(v, cursorPos, e) {
	if (!cursorPos) cursorPos = getCursorPos(e.target);
	var result;
	try {
		result = user.validate(v, cursorPos);
		if (result) {
			callbacks.invalid(v);
		} else {
			callbacks.valid(v);
		}
		var fmtd = callback.format(v, cursorPos);
		if (typeof(fmtd) == 'string') {
			fmtd = { cursorPos: false, value: fmtd, };
		}
		e.target.value = fmtd.value;
		// TODO: set new cursorPos (if possible)
	} catch (ex) {
		callbacks.invalid(v, e.target.value);
		return undefined;
	}
	return result;
}

// Events we intercept
const events = {
	intput:
		keydown: function(e) {},
		keyup: function(e) {},
		keypress: function(e) {
			e.preventDefault();
			var v = user.unformat(e.target.value);
			var cursorPos = getCursorPos(e.target);
			// TODO get cursorPos from e.target.selection*
			// TODO - munge in key at cursor position
			doValidate(v, cursorPos, e);
		},
		input: function(e) { 
			var v = user.unformat(e.target.value);
			doValidate(v, false, e); 
		},
		change: function(e) {
			try {
				user.synchronize(this._value);
				callbacks.synced(value);
			} catch (ex) {
				callbacks.unsynched(ex);
			}
		},
	}
	// TODO: textarea
	// TODO: select, checkbox, button (maybe?)
}

module.exports = {
}e
