# HTML Form Tools

HTML Form Tools is a framework for making user-input user-friendly. Specifically, it helps you:
* Limit what the user can type to minimize invalid input
* Format input as the user types
* Validate values as the user types to provide instant feedback

## Live Demo
(Coming soon)

## Usage

```html
<html>
<head>
<script type='text/javascript' src='html-form-tools.js'></script>
<script>
	window.addEventListener('load', function(event) {
		window['html-form-tools'].ManagedInput('money', {
			validate: function(val) {

				// Invalid value: Input will not be allowed
				if (!val.match(/^\d*(\.\d*)?$/)) throw new Error('invalid chars')

				// Incomplete value: Input will be allowed but valid callbacks won't fire
				if (val.length === 0 || val.match(/\.$/)) return false

				// Valid value: Valid callbacks will fire
				return true // The value is a valid number

			},
			format: function(val) { return '$'+val },
			unformat: function(val) { return val.replace(/^\$/,'') },
		})
	})
</script>
</head>
<body>
	<input id='money'/>
</body>
</html>
```
**NOTE: You can use _FloatInput_, _IntegerInput_ or _DollarInput_ instead of ManagedInput to get some pre-defined validation and formatting.**

## API
### ManagedInput()
Arguments:
1. Input - The input to manage. This can be the actual [HTMLInputElement](https://developer.mozilla.org/en-US/docs/Web/API/HTMLInputElement), or a string representing either the id of the element or a query selector that will return it as the first item.

2. Callbacks - An object with functions as values and any combination of the following keys:
	* **format** Applies formatting to the value, such as adding commas.

	Params:
		* value - The validated, unformatted value of the input field
		* cursorPos - The position of the cursor prior to formatting as returned by [selectionStart](https://developer.mozilla.org/en-US/docs/Mozilla/Tech/XUL/Property/selectionStart)

	Should return one of the following:
		* A String suitable to assign to input.value
		* An object with the keys:
			* value: same as above
			* cursorPos: The offset in the formatted string of the cursor. This is optional, but without it the cursor will be moved to the end of the input with each keystroke.

	* **unformat** Should strip formatting applied by the format() callback and return the stripped value.

	Params:
		* value - the formatted value
		* value - the position of the cursor prior to unformatting

	Should return one of the following:
		* The value with formatting removed
		* An object with the keys:
			* value: same as above
			* cursorPos: The offset in the unformatted string of the cursor. This is optional, but without it the cursor will be moved to the end of the input with each keystroke.

	* **validate**

	Params:
		* value - The value of the input field with formatting stripped by unformat()

	Should:
		* return true if the value is valid
		* return false if the value is invalid but an acceptable intermediate value (i.e. '1.' is not a valid number but you can't type '1.0' witout first typing '1.'). Formatting is not reapplied to intermediate values, but previous formatting is not stripped either (i.e. the input behaves as if html-form-tools isn't operating.)
		* throw an exception if the value is invalid and input should be prevented. Note: It's not always possible/desirable to prevent intput. For example, preventing copy-n-pasted values is confusing for the user.

	* **sync** Called when the input looses focus (onblur event) and the input is valid. Use this callback to write the value to some back-end storage or validate it with respect to other input fields.

	Params:
		* value - The validated, unformatted value of the input field

	Return: ignored

	* **invalid** Called when the input changes and the value is invalid. We prevent this when possible, but we can't stop the user from copy-n-pasting in invalid data.

	Params:
		* unformattedValue - The new value with formatting stipped.
		* oldValue - The formatted value of the field prior to the keystroke.
		* newValue - The new value after the keystroke but before formatting is applied. This is what the new value would be even when input is disallowed by 'validate'.
		* rawValue - The 'value' property of the HTMLInputElement.

	* **intermediate** Called when the input changes and the value is invalid but allowed (i.e. 'valid' returns false)

	Params:
		* unformattedValue - The new value with formatting stipped.
		* oldValue - The formatted value of the field prior to the keystroke.
		* newValue - The new value after the keystroke but before formatting is applied. This is what the new value would be even when input is disallowed by 'validate'.
		* rawValue - The 'value' property of the HTMLInputElement.

	* **valid** Called when the input changes and the value is valid.

	Params:
		* unformattedValue - The new value with formatting stipped.
		* oldValue - The formatted value of the field prior to the keystroke.
		* newValue - The new value after the keystroke but before formatting is applied. This is what the new value would be even when input is disallowed by 'validate'.
		* rawValue - The 'value' property of the HTMLInputElement.

3. Options - An object with any combination of the following keys:
	* debug      (boolean) - Print debugging to the JavaScript console. Useful for debugging your callback functions. Default: false
	* ignoreCtrl (boolean) - Ignore keystrokes if ctrl is pressed. This is usually what you want to do. Default: true
	* ignoreAlt  (boolean) - Ignore keystrokes if alt is pressed. This is usually what you want to do. Default: true

### IntegerInput()

Arguments are the same as ManagedInput, but validate is defined for you. Additionally Options may include:
* commafy - Format by adding commas. (default: true)
* MaxDigits - the maxium number of digits the user is allowed to type. (default: undefined/no limit)

### FloatInput()

Arguments are the same as ManagedInput, but validate is defined for you. Additionally Options may include:
* commafy - Format by adding commas. (default: true)
* MaxMantissaDigits - The maximum number of digits the user is allowed to type to the left of the decimal point. (default: undefined/no limit)
* MaxDecimalDigits - The maximum number of digits the user is allowed to type to the right of the decimal point. (default: undefined/no limit)

### DollarInput()
Like FloatInput but formats by adding a dollar sign to the front. Arguments are the same as ManagedInput, but validate is defined for you. Additionally Options may include:
* commafy - Format by adding commas. (default: true)
* MaxMantissaDigits - The maximum number of digits the user is allowed to type to the left of the decimal point. (defualt: undefined/no limit)
* MaxDecimalDigits - The maximum number of digits the user is allowed to type to the right of the decimal point. (default: 2)

__Note: You may define the format/unformat callbacks even if you let IntegerInput, FloatInput or DollarInput commafy for you. Your callbacks will receive the value with commas added.__

##  Integration
HTML Form Tools was written to complement [SchemaSure](https://github.com/adamcarheden/schema-sure). They're independent, but work well together. Use HTML Form Tools to validate single fields and control input. Use [SchemaSure]((https://github.com/adamcarheden/schema-sure) to validate data across multiple fields.

## Current Status
Beta. Seems to work well, but needs unit testing and a larger library of pre-defined input types, such as e-mail, phone number, zip code, ip address, etc.

## Contributing 
``` bash
git clone https://github.com/adamcarheden/html-form-tools.git
cd html-form-tools
npm run lint
npm run build
```
Everything important is in src/html-form-tools.js.

PRs welcome.
