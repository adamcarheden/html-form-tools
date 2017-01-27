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
1. input - The input to manage. This can be the actual [HTMLInputElement](https://developer.mozilla.org/en-US/docs/Web/API/HTMLInputElement), or a string representing either the id of the element or a query selector that will return it as the first item.

2. Callbacks - An object with functions as values and any combination of the following keys:
	* **unformat** Should strip formatting applied by the format() callback and return the stripped value.

	Params:
		* value - the formatted value
		* value - the position of the cursor prior to unformatting

	Should return one of the following:
		* The value with formatting removed
		* An object with the keys:
			* value: same as above
			* cursorPos: The offset in the unformatted string of the cursor. This is optional, but without it the cursor will be moved to the end of the input with each keystroke.


```
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
	// be a poorly placed and coupling of concerns.
	// Params:
	// * value - The validated, unformatted value of the input field
	sync: false,

	// Called when the input changes and the value is invalid
	// We prevent this when possible, but we can't stop the user from pasting it in
	invalid: false,

	// Called when the input changes and the value is invalid but allowed (intermediate)
	intermediate: false,

	// Called when the input changes and the value is valid
	valid: false,
```


3. Options - An object with any combination of the following keys:
	* debug      (boolean) - Print debugging to the JavaScript console. Useful for debugging your callback functions. Default: false
	* ignoreCtrl (boolean) - Ignore keystrokes if ctrl is pressed. This is usually what you want to do. Default: true
	* ignoreAlt  (boolean) - Ignore keystrokes if alt is pressed. This is usually what you want to do. Default: true

### IntegerInput()
### FloatInput()
### DollarInput()

## DataTrue Integration
HTML Form Tools was written at the same time as [DataTrue](https://github.com/adamcarheden/data-true). They're independent, but work well together. Use HTML Form Tools to validate single fields and control input. Use DataTrue to validate data across multiple fields.

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
