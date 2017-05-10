(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define("html-form-tools", [], factory);
	else if(typeof exports === 'object')
		exports["html-form-tools"] = factory();
	else
		root["html-form-tools"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 5);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return commafy; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return uncommafy; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "c", function() { return mergeCallbacks; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "d", function() { return stackFormats; });
var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var commafy = function commafy(num, cursorPos) {
	var value = void 0;
	if (arguments.length < 2) cursorPos = 0;
	switch (typeof num === 'undefined' ? 'undefined' : _typeof(num)) {
		case 'number':
			value = num.toString();
			break;
		case 'symbol':
		case 'string':
			value = num.toString();

			if (!value.match(/^\s*\d+(\.\d*)?\s*$/)) {
				if (arguments.length < 2) return num;
				return { value: num, cursorPos: cursorPos };
			}

			var before = value.substring(0, cursorPos);
			var after = value.substring(cursorPos).trim();
			if (before.trim().length === 0) {
				cursorPos -= before.length;
				before = '';
			}
			value = before + after;
			break;
		default:
			if (arguments.length < 2) return num;
			return { value: num, cursorPos: cursorPos };
	}
	var parts;
	if (value.match(/\./)) {
		parts = value.split(/\./, 2);
	} else {
		parts = [value];
	}
	var res = [];
	var moveCursor = 0;
	for (var i = 0; i < parts[0].length; i++) {
		var pos = parts[0].length - i - 1;
		if (i !== 0 && i % 3 === 0) {
			res.unshift(',');
			if (pos < cursorPos) moveCursor++;
		}
		res.unshift(parts[0].charAt(pos));
	}
	cursorPos += moveCursor;
	parts[0] = res.join('');
	value = parts.join('.');
	if (arguments.length < 2) {
		return value;
	} else {
		return { value: value, cursorPos: cursorPos };
	}
};
var uncommafy = function uncommafy(value, cursorPos) {
	switch (typeof value === 'undefined' ? 'undefined' : _typeof(value)) {
		case 'number':
			return value.toString();
		case 'symbol':
		case 'string':
			var val = value.replace(/,/g, '');
			if (arguments.length >= 2) {
				cursorPos -= value.substring(0, cursorPos).replace(/[^,]/g, '').length;
				return { value: val, cursorPos: cursorPos };
			}
			return val;
		case 'undefined':
			return '';
		default:
			return value.toString();
	}
};

var mergeCallbacks = function mergeCallbacks(src, tgt, name) {
	var skip = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : [];

	Object.keys(src).forEach(function (k) {
		if (skip.indexOf(k) !== -1) {
			if (!(k in tgt)) tgt[k] = src[k];
		} else {
			if (k in tgt) throw new Error('You defined the callback \'' + k + '\', but \'' + name + '\' also defines that callback');
			tgt[k] = src[k];
		}
	});
	return tgt;
};

var stackFormats = function stackFormats(callbacks, name, formatter) {
	var fun = void 0;
	if (name in callbacks && typeof callbacks[name] === 'function') {
		fun = function fun(value, cursorPos) {
			var fmtd = formatter(value, cursorPos);
			return callbacks[name](fmtd.value, fmtd.cursorPos);
		};
	} else {
		fun = formatter;
	}
	return fun;
};

/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var defaultCallbacks = {
	unformat: false,

	validate: false,

	format: false,

	sync: false,

	invalid: false,

	intermediate: false,

	valid: false
};

var events = {
	HTMLInputElement: {
		keypress: function keypress(e) {
			this.debug('keypress: value=\'' + this.input.value + '\'');
			if (this.ignoreKey(e)) return true;
			this.validateAndFormat(e);
		},

		input: function input(e) {
			this.debug('input: value=\'' + this.input.value + '\'');
			this.validateAndFormat(e);
		},

		blur: function blur(e) {
			this.debug('blur: value=\'' + this.input.value + '\'');
			this.sync();
		}
	}
};

var defaultOpts = {
	defaultValue: null,
	ignoreCtrl: true,
	ignoreAlt: true,
	debug: false
};

var predictInput = function predictInput(e) {
	if (!('key' in e)) throw new Error('predictInput called on event of type \'' + e.type + '\', which has no value \'key\'. You probably only want to call this on KeyEvents');
	var beforeSelection = e.target.value.slice(0, e.target.selectionStart);
	var afterSelection = e.target.value.slice(e.target.selectionEnd);
	var res = '' + beforeSelection + e.key + afterSelection;
	return res;
};

var ManagedInput = function () {
	function ManagedInput(input, callbacks, opts) {
		var _this = this;

		_classCallCheck(this, ManagedInput);

		if (typeof input === 'string') {
			this.input = document.getElementById(input);
			if (!this.input) {
				this.input = document.querySelector(input);
				if (!this.input) throw new Error('Failed to find element by id or query selector \'' + input + '\'');
			}
		} else {
			this.input = input;
		}
		if (!(_typeof(this.input) === 'object')) {
			throw Error('Expected an object or the name of an element to manage, but got a \'' + _typeof(this.input) + '\'');
		}
		if (!(this.input instanceof HTMLInputElement)) {
			throw Error('Expected an HTMLInputElement, got a \'' + this.input.constructor.name + '\'');
		}

		if ('format' in callbacks && !('unformat' in callbacks)) {
			console.warn('You defined the format callback but not the unformat callback. That probably won\'t work well.');
		}
		if ('unformat' in callbacks && !('format' in callbacks)) {
			console.warn('You defined the unformat callback but not the format callback. That probably won\'t work well.');
		}
		if (!('format' in callbacks || 'unformat' in callbacks || 'validate' in callbacks)) {
			console.warn('You didn\'t define the format/unformat callbacks nor the validate callback. This module doesn\'t really do anything if you haven\'t defined at least one of those.');
		}

		this.callbacks = {};
		if (typeof callbacks === 'undefined') callbacks = {};
		if ((typeof callbacks === 'undefined' ? 'undefined' : _typeof(callbacks)) !== 'object') throw new Error('callbacks should be an object, not a ' + (typeof callbacks === 'undefined' ? 'undefined' : _typeof(callbacks)));
		Object.keys(defaultCallbacks).forEach(function (cb) {
			_this.callbacks[cb] = cb in callbacks ? callbacks[cb] : defaultCallbacks[cb];
		});
		Object.keys(callbacks).forEach(function (cb) {
			if (!(cb in defaultCallbacks)) {
				console.warn('Unknown callback: \'' + cb + '\'');
			}
		});

		this.opts = {};
		if (typeof opts === 'undefined') opts = {};
		if ((typeof opts === 'undefined' ? 'undefined' : _typeof(opts)) !== 'object') throw new Error('opts should be an object, not a ' + (typeof opts === 'undefined' ? 'undefined' : _typeof(opts)));
		Object.keys(defaultOpts).forEach(function (opt) {
			_this.opts[opt] = opt in opts ? opts[opt] : defaultOpts[opt];
		});
		if (this.opts.defaultValue !== null) {
			this.input.value = this.opts.defaultValue;
		}
		this.validateAndFormat();

		this.inputType = 'HTMLInputElement';
		Object.keys(events[this.inputType]).forEach(function (evnt) {
			_this.input.addEventListener(evnt, function (e) {
				events[_this.inputType][evnt].bind(_this)(e);
			});
		});
	}

	_createClass(ManagedInput, [{
		key: 'unformat',
		value: function unformat(value, cursorPos) {
			if (typeof value === 'undefined') value = this.input.value;
			if (typeof value === 'undefined') {
				value = '';
			} else {
				value = value.toString();
			}
			if (this.callbacks.unformat) return this.callbacks.unformat(value, cursorPos);
			return value;
		}
	}, {
		key: 'unformatted',
		value: function unformatted(value) {
			if (typeof value === 'undefined') value = this.input.value;
			if (typeof value === 'undefined') {
				value = '';
			} else {
				value = value.toString();
			}
			var unf = this.callbacks.unformat ? this.callbacks.unformat(value) : value;
			if ((typeof unf === 'undefined' ? 'undefined' : _typeof(unf)) === 'object') return unf.value;
			return unf;
		}
	}, {
		key: 'format',
		value: function format(value, cursorPos) {
			if (this.callbacks.format) return this.callbacks.format(value, cursorPos);
			return value;
		}
	}, {
		key: 'validate',
		value: function validate(value) {
			if (typeof value === 'undefined') value = this.unformatted(this.input.value);
			if (this.callbacks.validate) return this.callbacks.validate(value);
			return true;
		}
	}, {
		key: 'sync',
		value: function sync(value) {
			if (typeof value === 'undefined') value = this.unformatted(this.input.value);
			try {
				if (this.callbacks.sync && this.validate(value)) {
					return this.callbacks.sync(value);
				}
			} catch (e) {
				this.debug('Refusing to sync invalid value ' + value);
			}
		}
	}, {
		key: 'invalid',
		value: function invalid(unformattedValue, oldValue, newValue) {
			if (this.callbacks.invalid) this.callbacks.invalid(unformattedValue, oldValue, newValue, this.input);
		}
	}, {
		key: 'intermediate',
		value: function intermediate(unformattedValue, oldValue, newValue) {
			if (this.callbacks.intermediate) this.callbacks.intermediate(unformattedValue, oldValue, newValue, this.input);
		}
	}, {
		key: 'valid',
		value: function valid(unformattedValue, oldValue, newValue) {
			if (this.callbacks.valid) this.callbacks.valid(unformattedValue, oldValue, newValue, this.input);
		}
	}, {
		key: 'ignoreKey',
		value: function ignoreKey(evnt) {
			if (!('key' in evnt)) throw new Error('ignoreKey should only be called for KeyEvents. Called on event of type ' + evnt.type);
			if (evnt.key.length > 1 || this.opts.ignoreCtrl && evnt.ctrlKey || this.opts.ignoreAlt && evnt.altKey) {
				this.debug({ ignoring: evnt });
				return true;
			}
			return false;
		}
	}, {
		key: 'validateAndFormat',
		value: function validateAndFormat(e) {

			var oldValue = '';
			var newValue;
			var cursorPos = this.input.selectionStart;
			if (e && e.key) {
				oldValue = this.input.value;
				newValue = predictInput(e);
				cursorPos++;
			} else {
				newValue = this.input.value;
			}
			var unformatted = this.unformat(newValue, cursorPos);
			if ((typeof unformatted === 'undefined' ? 'undefined' : _typeof(unformatted)) !== 'object') unformatted = { value: unformatted, cursorPos: false };
			try {
				if (!this.validate(unformatted.value)) {
					this.debug('\'' + unformatted.value + '\': acceptable intermediate value, formatting delayed');
					this.intermediate(unformatted.value, oldValue, newValue);
				} else {
					var formatted = this.format(unformatted.value, unformatted.cursorPos);
					if ((typeof formatted === 'undefined' ? 'undefined' : _typeof(formatted)) !== 'object') formatted = { value: formatted, cursorPos: false };
					this.debug('\'' + unformatted.value + '\' (cursorPos=' + unformatted.cursorPos + ') is valid, formatted as \'' + formatted.value + '\' (cursorPos=' + formatted.cursorPos + ')');
					if (e) e.preventDefault();
					this.input.value = formatted.value;
					if (formatted.cursorPos) {
						this.input.setSelectionRange(formatted.cursorPos, formatted.cursorPos);
					}
					this.valid(unformatted.value, oldValue, newValue);
				}
			} catch (ex) {
				this.debug('Invalid value \'' + unformatted.value + '\': "' + ex.message + '". We\'ll prevent input if possible.');
				if (e) e.preventDefault();
				if (!e || e.type !== 'keypress') this.invalid(unformatted.value, oldValue, newValue);
				return false;
			}
			return true;
		}
	}, {
		key: 'set',
		value: function set(newValue, force) {
			var oldValue = this.input.value;
			var unformatted = this.unformat(newValue);
			if ((typeof unformatted === 'undefined' ? 'undefined' : _typeof(unformatted)) !== 'object') unformatted = { value: unformatted, cursorPos: false };
			var formatted = newValue;
			var valid = false;
			try {
				if (!this.validate(unformatted.value)) {
					this.debug('set() called with \'' + unformatted.value + '\': acceptable intermediate value set programatically, formatting delayed');
					this.intermediate(unformatted.value, oldValue, newValue);
				} else {
					valid = true;
					formatted = this.format(unformatted.value, unformatted.cursorPos);
					this.debug('set() called with \'' + unformatted.value + '\': valid, formatted as \'' + formatted.value + '\' (cursorPos=' + formatted.cursorPos + ')');
				}
			} catch (ex) {
				if (force) {
					this.debug('set() called with force. Setting invalid value \'' + unformatted.value + '\': "' + ex.message + '". ');
				} else {
					this.debug('set() called without force, ignoring invalid value \'' + unformatted.value + '\': "' + ex.message + '". ');
					return valid;
				}
			}
			if ((typeof formatted === 'undefined' ? 'undefined' : _typeof(formatted)) !== 'object') formatted = { value: formatted, cursorPos: false };
			this.input.value = formatted.value;
			if (formatted.cursorPos) this.input.setSelectionRange(formatted.cursorPos, formatted.cursorPos);
			if (valid) this.valid(unformatted.value, oldValue, newValue);
			return valid;
		}
	}, {
		key: 'debug',
		value: function debug(msg) {
			if (this.opts.debug) console.log(msg);
		}
	}]);

	return ManagedInput;
}();

/* harmony default export */ __webpack_exports__["a"] = (ManagedInput);

/***/ }),
/* 2 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__util__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__ManagedInput__ = __webpack_require__(1);



/* harmony default export */ __webpack_exports__["a"] = (function (input) {
	var callbacks = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
	var opts = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

	var newOpts = JSON.parse(JSON.stringify(opts));
	if (!('commafy' in newOpts)) newOpts.commafy = true;

	var maxMantissa = false;
	if ('MaxMantissaDigits' in newOpts) {
		maxMantissa = newOpts.MaxMantissaDigits;
		delete newOpts.MaxMantissaDigits;
	}
	var maxDecimal = false;
	if ('MaxDecimalDigits' in newOpts) {
		maxDecimal = newOpts.MaxDecimalDigits;
		delete newOpts.MaxDecimalDigits;
	}
	var fmt = false;
	var ufmt = false;
	if (newOpts.commafy) {
		fmt = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__util__["d" /* stackFormats */])(callbacks, 'format', function (value, cursorPos) {
			return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__util__["a" /* commafy */])(value, cursorPos);
		});
		ufmt = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__util__["d" /* stackFormats */])(callbacks, 'unformat', function (value, cursorPos) {
			return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__util__["b" /* uncommafy */])(value, cursorPos);
		});
	} else {
		if ('format' in callbacks) fmt = callbacks.format;
		if ('unformat' in callbacks) ufmt = callbacks.unformat;
	}
	delete newOpts.commafy;

	return new __WEBPACK_IMPORTED_MODULE_1__ManagedInput__["a" /* default */](input, __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__util__["c" /* mergeCallbacks */])(callbacks, {
		validate: function validate(value) {
			if (typeof value === 'undefined') {
				value = '';
			} else {
				value = value.toString();
			}
			if (value.length === 0) return false;

			var parts = value.match(/^(\d*)((\.)(\d*))?$/);
			if (!parts) throw new Error('Must be numeric (with out without a decimal)');
			if (maxMantissa && parts[1] && parts[1].length > maxMantissa) throw new Error('Mantissa part must be no more than \'' + maxMantissa + '\' digits');
			if (maxDecimal && parts[4] && parts[4].length > maxDecimal) throw new Error('Decimal part must be no more than \'' + maxDecimal + '\' digits');
			if (parts[3] && !parts[4]) return false;
			return true;
		},
		format: fmt,
		unformat: ufmt
	}, 'FloatInput', ['format', 'unformat']), newOpts);
});

/***/ }),
/* 3 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__util__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__FloatInput__ = __webpack_require__(2);



/* harmony default export */ __webpack_exports__["a"] = (function (input) {
	var callbacks = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
	var opts = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

	var newOpts = JSON.parse(JSON.stringify(opts));
	if (!('MaxDecimalDigits' in newOpts)) newOpts.MaxDecimalDigits = 2;
	return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__FloatInput__["a" /* default */])(input, __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__util__["c" /* mergeCallbacks */])(callbacks, {
		unformat: function unformat(value, cursorPos) {
			if (typeof value === 'undefined') {
				value = '';
			} else {
				value = value.toString();
			}
			var unf = value.replace(/^\$+/, '');
			var cp = cursorPos;
			var ext = value.length - unf.length;
			cp -= Math.min(cursorPos, ext);
			return { value: unf, cursorPos: cp };
		},
		format: function format(value, cursorPos) {
			var res = { value: '$' + value, cursorPos: cursorPos === false ? false : cursorPos + 1 };
			return res;
		}
	}, 'DollarInput'), newOpts);
});

/***/ }),
/* 4 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__util__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__ManagedInput__ = __webpack_require__(1);



/* harmony default export */ __webpack_exports__["a"] = (function (input) {
	var callbacks = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
	var opts = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

	var newOpts = JSON.parse(JSON.stringify(opts));
	if (!('commafy' in newOpts)) newOpts.commafy = true;
	var maxDigits = false;
	if ('MaxDigits' in newOpts) {
		maxDigits = newOpts.MaxDigits;
		delete newOpts.MaxDigits;
	}

	var fmt = false;
	var ufmt = false;
	if (newOpts.commafy) {
		fmt = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__util__["d" /* stackFormats */])(callbacks, 'format', function (value, cursorPos) {
			return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__util__["a" /* commafy */])(value, cursorPos);
		});
		ufmt = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__util__["d" /* stackFormats */])(callbacks, 'unformat', function (value, cursorPos) {
			return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__util__["b" /* uncommafy */])(value, cursorPos);
		});
	} else {
		if ('format' in callbacks) fmt = callbacks.format;
		if ('unformat' in callbacks) ufmt = callbacks.unformat;
	}
	delete newOpts.commafy;

	return new __WEBPACK_IMPORTED_MODULE_1__ManagedInput__["a" /* default */](input, __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__util__["c" /* mergeCallbacks */])(callbacks, {
		validate: function validate(val) {
			if (!val.match(/^[0-9]*$/)) throw new Error('must be a integer');
			if (maxDigits && val.length > maxDigits) throw new Error('Must be at most ' + maxDigits + ' digits');
			return true;
		},
		format: fmt,
		unformat: ufmt
	}, 'IntegerInput'), newOpts);
});

/***/ }),
/* 5 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__util__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__ManagedInput__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__IntegerInput__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__FloatInput__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__DollarInput__ = __webpack_require__(3);






/* harmony default export */ __webpack_exports__["default"] = ({
	ManagedInput: function ManagedInput(input, callbacks, opts) {
		return new __WEBPACK_IMPORTED_MODULE_1__ManagedInput__["a" /* default */](input, callbacks, opts);
	},
	IntegerInput: __WEBPACK_IMPORTED_MODULE_2__IntegerInput__["a" /* default */],
	FloatInput: __WEBPACK_IMPORTED_MODULE_3__FloatInput__["a" /* default */],
	DollarInput: __WEBPACK_IMPORTED_MODULE_4__DollarInput__["a" /* default */],
	util: {
		commafy: __WEBPACK_IMPORTED_MODULE_0__util__["a" /* commafy */],
		uncommafy: __WEBPACK_IMPORTED_MODULE_0__util__["b" /* uncommafy */]
	}
});

/***/ })
/******/ ]);
});