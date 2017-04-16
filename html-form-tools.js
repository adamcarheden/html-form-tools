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

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports) {

	const defaultCallbacks={unformat:!1,validate:!1,format:!1,sync:!1,invalid:!1,intermediate:!1,valid:!1},events={HTMLInputElement:{keypress:function(a){return this.debug(`keypress: value='${this.input.value}'`),!!this.ignoreKey(a)||void this.validateAndFormat(a)},input:function(a){this.debug(`input: value='${this.input.value}'`),this.validateAndFormat(a)},blur:function(){this.debug(`blur: value='${this.input.value}'`),this.sync()}}};var defaultOpts={defaultValue:null,ignoreCtrl:!0,ignoreAlt:!0,debug:!1},predictInput=function(a){if(!('key'in a))throw new Error(`predictInput called on event of type '${a.type}', which has no value 'key'. You probably only want to call this on KeyEvents`);var b=a.target.value.slice(0,a.target.selectionStart),c=a.target.value.slice(a.target.selectionEnd),d=`${b}${a.key}${c}`;return d};class ManagedInput{constructor(a,b,c){if('string'!=typeof a)this.input=a;else if(this.input=document.getElementById(a),!this.input&&(this.input=document.querySelector(a),!this.input))throw new Error(`Failed to find element by id or query selector '${a}'`);if('object'!=typeof this.input)throw Error(`Expected an object or the name of an element to manage, but got a '${typeof this.input}'`);if(!(this.input instanceof HTMLInputElement))throw Error(`Expected an HTMLInputElement, got a '${this.input.constructor.name}'`);if('format'in b&&!('unformat'in b)&&console.warn(`You defined the format callback but not the unformat callback. That probably won't work well.`),'unformat'in b&&!('format'in b)&&console.warn(`You defined the unformat callback but not the format callback. That probably won't work well.`),'format'in b||'unformat'in b||'validate'in b||console.warn(`You didn't define the format/unformat callbacks nor the validate callback. This module doesn't really do anything if you haven't defined at least one of those.`),this.callbacks={},'undefined'==typeof b&&(b={}),'object'!=typeof b)throw new Error(`callbacks should be an object, not a ${typeof b}`);if(Object.keys(defaultCallbacks).forEach(d=>{this.callbacks[d]=d in b?b[d]:defaultCallbacks[d]}),Object.keys(b).forEach(function(d){d in defaultCallbacks||console.warn(`Unknown callback: '${d}'`)}),this.opts={},'undefined'==typeof c&&(c={}),'object'!=typeof c)throw new Error(`opts should be an object, not a ${typeof c}`);Object.keys(defaultOpts).forEach(d=>{this.opts[d]=d in c?c[d]:defaultOpts[d]}),null!==this.opts.defaultValue&&(this.input.value=this.opts.defaultValue),this.validateAndFormat(),this.inputType=this.input.constructor.name,Object.keys(events[this.inputType]).forEach(d=>{this.input.addEventListener(d,f=>{events[this.inputType][d].bind(this)(f)})})}set(a){this.input.value=a,this.validateAndFormat()}unformat(a,b){return'undefined'==typeof a&&(a=this.input.value),this.callbacks.unformat?this.callbacks.unformat(a,b):a}unformatted(a){'undefined'==typeof a&&(a=this.input.value);var b=this.callbacks.unformat?this.callbacks.unformat(a):a;return'object'==typeof b?b.value:b}format(a,b){return this.callbacks.format?this.callbacks.format(a,b):a}validate(a){return'undefined'==typeof a&&(a=this.unformatted(this.input.value)),!this.callbacks.validate||this.callbacks.validate(a)}sync(a){'undefined'==typeof a&&(a=this.unformatted(this.input.value));try{if(this.callbacks.sync&&this.validate(a))return this.callbacks.sync(a)}catch(b){this.debug(`Refusing to sync invalid value ${a}`)}}invalid(a,b,c){this.callbacks.invalid&&this.callbacks.invalid(a,b,c,this.input)}intermediate(a,b,c){this.callbacks.intermediate&&this.callbacks.intermediate(a,b,c,this.input)}valid(a,b,c){this.callbacks.valid&&this.callbacks.valid(a,b,c,this.input)}ignoreKey(a){if(!('key'in a))throw new Error(`ignoreKey should only be called for KeyEvents. Called on event of type ${a.type}`);return(1<a.key.length||this.opts.ignoreCtrl&&a.ctrlKey||this.opts.ignoreAlt&&a.altKey)&&(this.debug({ignoring:a}),!0)}validateAndFormat(a){var b,c,d=this.input.selectionStart;a&&a.key?(b=this.input.value,c=predictInput(a),d++):c=this.input.value;var f=this.unformat(c,d);'object'!=typeof f&&(f={value:f,cursorPos:!1});try{if(!this.validate(f.value))this.debug(`'${f.value}': acceptable intermediate value, formatting delayed`),this.intermediate(f.value,b,c);else{var g=this.format(f.value,f.cursorPos);'object'!=typeof g&&(g={value:g,cursorPos:!1}),this.debug(`'${f.value}' (cursorPos=${f.cursorPos}) is valid, formatted as '${g.value}' (cursorPos=${g.cursorPos})`),a&&a.preventDefault(),this.input.value=g.value,g.cursorPos&&this.input.setSelectionRange(g.cursorPos,g.cursorPos),this.valid(f.value,b,c)}}catch(h){return this.debug(`Invalid value '${f.value}': "${h.message}". We'll prevent input if possible.`),a&&a.preventDefault(),a&&'keypress'===a.type||this.invalid(f.value,b,c),!1}return!0}debug(a){this.opts.debug&&console.log(a)}}const commafy=function(a,b){let c;switch(2>arguments.length&&(b=0),typeof a){case'number':c=a.toString();break;case'symbol':case'string':if(c=a.toString(),!c.match(/^\s*\d+(\.\d*)?\s*$/))return 2>arguments.length?a:{value:a,cursorPos:b};let j=c.substring(0,b),l=c.substring(b).trim();0===j.trim().length&&(b-=j.length,j=''),c=j+l;break;default:return 2>arguments.length?a:{value:a,cursorPos:b};}var d=c.match(/\./)?c.split(/\./,2):[c];for(var f=[],g=0,h=0;h<d[0].length;h++){let j=d[0].length-h-1;0!==h&&0==h%3&&(f.unshift(','),j<b&&g++),f.unshift(d[0].charAt(j))}return b+=g,d[0]=f.join(''),c=d.join('.'),2>arguments.length?c:{value:c,cursorPos:b}},uncommafy=function(a,b){var c=a.replace(/,/g,'');return 2<=arguments.length?(b-=a.substring(0,b).replace(/[^,]/g,'').length,{value:c,cursorPos:b}):c},mergeCallbacks=function(a,b,c,d=[]){return Object.keys(a).forEach(function(f){if(-1!==d.indexOf(f))f in b||(b[f]=a[f]);else{if(f in b)throw new Error(`You defined the callback '${f}', but '${c}' also defines that callback`);b[f]=a[f]}}),b},IntegerInput=function(a,b={},c={}){let d=JSON.parse(JSON.stringify(c));'commafy'in d||(d.commafy=!0);var f=!1;'MaxDigits'in d&&(f=d.MaxDigits,delete d.MaxDigits);var g=!1,h=!1;return d.commafy?(g=stackFormats(b,'format',function(j,l){return commafy(j,l)}),h=stackFormats(b,'unformat',function(j,l){return uncommafy(j,l)})):('format'in b&&(g=b.format),'unformat'in b&&(h=b.unformat)),delete d.commafy,new ManagedInput(a,mergeCallbacks(b,{validate:function(j){if(!j.match(/^[0-9]*$/))throw new Error('must be a integer');if(f&&j.length>f)throw new Error(`Must be at most ${f} digits`);return!0},format:g,unformat:h},'IntegerInput'),d)},FloatInput=function(a,b={},c={}){let d=JSON.parse(JSON.stringify(c));'commafy'in d||(d.commafy=!0);var f=!1;'MaxMantissaDigits'in d&&(f=d.MaxMantissaDigits,delete d.MaxMantissaDigits);var g=!1;'MaxDecimalDigits'in d&&(g=d.MaxDecimalDigits,delete d.MaxDecimalDigits);var h=!1,j=!1;return d.commafy?(h=stackFormats(b,'format',function(l,m){return commafy(l,m)}),j=stackFormats(b,'unformat',function(l,m){return uncommafy(l,m)})):('format'in b&&(h=b.format),'unformat'in b&&(j=b.unformat)),delete d.commafy,new ManagedInput(a,mergeCallbacks(b,{validate:function(l){if(l=l.toString(),0===l.length)return!1;var m=l.match(/^(\d*)((\.)(\d*))?$/);if(!m)throw new Error('Must be numeric (with out without a decimal)');if(f&&m[1]&&m[1].length>f)throw new Error(`Mantissa part must be no more than '${f}' digits`);if(g&&m[4]&&m[4].length>g)throw new Error(`Decimal part must be no more than '${g}' digits`);return m[3]&&!m[4]?!1:!0},format:h,unformat:j},'FloatInput',['format','unformat']),d)},stackFormats=function(a,b,c){let d;return d=b in a&&'function'==typeof a[b]?function(f,g){var h=c(f,g);return a[b](h.value,h.cursorPos)}:c,d},DollarInput=function(a,b={},c={}){let d=JSON.parse(JSON.stringify(c));return'MaxDecimalDigits'in d||(d.MaxDecimalDigits=2),FloatInput(a,mergeCallbacks(b,{unformat:function(f,g){f=f.toString();var h=f.replace(/^\$+/,''),j=g,l=f.length-h.length;return j-=Math.min(g,l),{value:h,cursorPos:j}},format:function(f,g){return{value:'$'+f,cursorPos:!1!==g&&g+1}}},'DollarInput'),d)};module.exports={ManagedInput:function(a,b,c){return new ManagedInput(a,b,c)},IntegerInput:IntegerInput,FloatInput:FloatInput,DollarInput:DollarInput,util:{commafy:commafy,uncommafy:uncommafy}};

/***/ }
/******/ ])
});
;