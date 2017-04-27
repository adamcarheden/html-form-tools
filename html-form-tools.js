(function(b,c){'object'==typeof exports&&'object'==typeof module?module.exports=c():'function'==typeof define&&define.amd?define('html-form-tools',[],c):'object'==typeof exports?exports['html-form-tools']=c():b['html-form-tools']=c()})(this,function(){return function(a){function b(d){if(c[d])return c[d].exports;var f=c[d]={i:d,l:!1,exports:{}};return a[d].call(f.exports,f,f.exports,b),f.l=!0,f.exports}var c={};return b.m=a,b.c=c,b.i=function(d){return d},b.d=function(d,f,g){b.o(d,f)||Object.defineProperty(d,f,{configurable:!1,enumerable:!0,get:g})},b.n=function(d){var f=d&&d.__esModule?function(){return d['default']}:function(){return d};return b.d(f,'a',f),f},b.o=function(d,f){return Object.prototype.hasOwnProperty.call(d,f)},b.p='',b(b.s=0)}([function(a,b){'use strict';Object.defineProperty(b,'__esModule',{value:!0});const d={unformat:!1,validate:!1,format:!1,sync:!1,invalid:!1,intermediate:!1,valid:!1},f={HTMLInputElement:{keypress:function(s){return this.debug(`keypress: value='${this.input.value}'`),!!this.ignoreKey(s)||void this.validateAndFormat(s)},input:function(s){this.debug(`input: value='${this.input.value}'`),this.validateAndFormat(s)},blur:function(){this.debug(`blur: value='${this.input.value}'`),this.sync()}}};var g={defaultValue:null,ignoreCtrl:!0,ignoreAlt:!0,debug:!1},h=function(s){if(!('key'in s))throw new Error(`predictInput called on event of type '${s.type}', which has no value 'key'. You probably only want to call this on KeyEvents`);var t=s.target.value.slice(0,s.target.selectionStart),u=s.target.value.slice(s.target.selectionEnd),v=`${t}${s.key}${u}`;return v};class j{constructor(s,t,u){if('string'!=typeof s)this.input=s;else if(this.input=document.getElementById(s),!this.input&&(this.input=document.querySelector(s),!this.input))throw new Error(`Failed to find element by id or query selector '${s}'`);if('object'!=typeof this.input)throw Error(`Expected an object or the name of an element to manage, but got a '${typeof this.input}'`);if(!(this.input instanceof HTMLInputElement))throw Error(`Expected an HTMLInputElement, got a '${this.input.constructor.name}'`);if('format'in t&&!('unformat'in t)&&console.warn(`You defined the format callback but not the unformat callback. That probably won't work well.`),'unformat'in t&&!('format'in t)&&console.warn(`You defined the unformat callback but not the format callback. That probably won't work well.`),'format'in t||'unformat'in t||'validate'in t||console.warn(`You didn't define the format/unformat callbacks nor the validate callback. This module doesn't really do anything if you haven't defined at least one of those.`),this.callbacks={},'undefined'==typeof t&&(t={}),'object'!=typeof t)throw new Error(`callbacks should be an object, not a ${typeof t}`);if(Object.keys(d).forEach((v)=>{this.callbacks[v]=v in t?t[v]:d[v]}),Object.keys(t).forEach(function(v){v in d||console.warn(`Unknown callback: '${v}'`)}),this.opts={},'undefined'==typeof u&&(u={}),'object'!=typeof u)throw new Error(`opts should be an object, not a ${typeof u}`);Object.keys(g).forEach((v)=>{this.opts[v]=v in u?u[v]:g[v]}),null!==this.opts.defaultValue&&(this.input.value=this.opts.defaultValue),this.validateAndFormat(),this.inputType=this.input.constructor.name,Object.keys(f[this.inputType]).forEach((v)=>{this.input.addEventListener(v,(w)=>{f[this.inputType][v].bind(this)(w)})})}set(s){this.input.value=s,this.validateAndFormat()}unformat(s,t){return'undefined'==typeof s&&(s=this.input.value),this.callbacks.unformat?this.callbacks.unformat(s,t):s}unformatted(s){'undefined'==typeof s&&(s=this.input.value);var t=this.callbacks.unformat?this.callbacks.unformat(s):s;return'object'==typeof t?t.value:t}format(s,t){return this.callbacks.format?this.callbacks.format(s,t):s}validate(s){return'undefined'==typeof s&&(s=this.unformatted(this.input.value)),!this.callbacks.validate||this.callbacks.validate(s)}sync(s){'undefined'==typeof s&&(s=this.unformatted(this.input.value));try{if(this.callbacks.sync&&this.validate(s))return this.callbacks.sync(s)}catch(t){this.debug(`Refusing to sync invalid value ${s}`)}}invalid(s,t,u){this.callbacks.invalid&&this.callbacks.invalid({unformatted:s,old:t,new:u,input:this.input})}intermediate(s,t,u){this.callbacks.intermediate&&this.callbacks.intermediate({unformatted:s,old:t,new:u,input:this.input})}valid(s,t,u){this.callbacks.valid&&this.callbacks.valid({unformatted:s,old:t,new:u,input:this.input})}ignoreKey(s){if(!('key'in s))throw new Error(`ignoreKey should only be called for KeyEvents. Called on event of type ${s.type}`);return(1<s.key.length||this.opts.ignoreCtrl&&s.ctrlKey||this.opts.ignoreAlt&&s.altKey)&&(this.debug({ignoring:s}),!0)}validateAndFormat(s){var t,u,v=this.input.selectionStart;s&&s.key?(t=this.input.value,u=h(s),v++):u=this.input.value;var w=this.unformat(u,v);'object'!=typeof w&&(w={value:w,cursorPos:!1});try{if(!this.validate(w.value))this.debug(`'${w.value}': acceptable intermediate value, formatting delayed`),this.intermediate(w.value,t,u);else{var x=this.format(w.value,w.cursorPos);'object'!=typeof x&&(x={value:x,cursorPos:!1}),this.debug(`'${w.value}' (cursorPos=${w.cursorPos}) is valid, formatted as '${x.value}' (cursorPos=${x.cursorPos})`),s&&s.preventDefault(),this.input.value=x.value,x.cursorPos&&this.input.setSelectionRange(x.cursorPos,x.cursorPos),this.valid(w.value,t,u)}}catch(y){return this.debug(`Invalid value '${w.value}': "${y.message}". We'll prevent input if possible.`),s&&s.preventDefault(),s&&'keypress'===s.type||this.invalid(w.value,t,u),!1}return!0}debug(s){this.opts.debug&&console.log(s)}}const l=function(s,t){let u;switch(2>arguments.length&&(t=0),typeof s){case'number':u=s.toString();break;case'symbol':case'string':if(u=s.toString(),!u.match(/^\s*\d+(\.\d*)?\s*$/))return 2>arguments.length?s:{value:s,cursorPos:t};let z=u.substring(0,t),A=u.substring(t).trim();0===z.trim().length&&(t-=z.length,z=''),u=z+A;break;default:return 2>arguments.length?s:{value:s,cursorPos:t};}var v=u.match(/\./)?u.split(/\./,2):[u];for(var w=[],x=0,y=0;y<v[0].length;y++){let z=v[0].length-y-1;0!==y&&0==y%3&&(w.unshift(','),z<t&&x++),w.unshift(v[0].charAt(z))}return t+=x,v[0]=w.join(''),u=v.join('.'),2>arguments.length?u:{value:u,cursorPos:t}},m=function(s,t){var u=s.replace(/,/g,'');return 2<=arguments.length?(t-=s.substring(0,t).replace(/[^,]/g,'').length,{value:u,cursorPos:t}):u},n=function(s,t,u,v=[]){return Object.keys(s).forEach(function(w){if(-1!==v.indexOf(w))w in t||(t[w]=s[w]);else{if(w in t)throw new Error(`You defined the callback '${w}', but '${u}' also defines that callback`);t[w]=s[w]}}),t},p=function(s,t={},u={}){let v=JSON.parse(JSON.stringify(u));'commafy'in v||(v.commafy=!0);var w=!1;'MaxMantissaDigits'in v&&(w=v.MaxMantissaDigits,delete v.MaxMantissaDigits);var x=!1;'MaxDecimalDigits'in v&&(x=v.MaxDecimalDigits,delete v.MaxDecimalDigits);var y=!1,z=!1;return v.commafy?(y=q(t,'format',function(A,B){return l(A,B)}),z=q(t,'unformat',function(A,B){return m(A,B)})):('format'in t&&(y=t.format),'unformat'in t&&(z=t.unformat)),delete v.commafy,new j(s,n(t,{validate:function(A){if(A=A.toString(),0===A.length)return!1;var B=A.match(/^(\d*)((\.)(\d*))?$/);if(!B)throw new Error('Must be numeric (with out without a decimal)');if(w&&B[1]&&B[1].length>w)throw new Error(`Mantissa part must be no more than '${w}' digits`);if(x&&B[4]&&B[4].length>x)throw new Error(`Decimal part must be no more than '${x}' digits`);return B[3]&&!B[4]?!1:!0},format:y,unformat:z},'FloatInput',['format','unformat']),v)},q=function(s,t,u){let v;return v=t in s&&'function'==typeof s[t]?function(w,x){var y=u(w,x);return s[t](y.value,y.cursorPos)}:u,v};b['default']={ManagedInput:function(s,t,u){return new j(s,t,u)},IntegerInput:function(s,t={},u={}){let v=JSON.parse(JSON.stringify(u));'commafy'in v||(v.commafy=!0);var w=!1;'MaxDigits'in v&&(w=v.MaxDigits,delete v.MaxDigits);var x=!1,y=!1;return v.commafy?(x=q(t,'format',function(z,A){return l(z,A)}),y=q(t,'unformat',function(z,A){return m(z,A)})):('format'in t&&(x=t.format),'unformat'in t&&(y=t.unformat)),delete v.commafy,new j(s,n(t,{validate:function(z){if(!z.match(/^[0-9]*$/))throw new Error('must be a integer');if(w&&z.length>w)throw new Error(`Must be at most ${w} digits`);return!0},format:x,unformat:y},'IntegerInput'),v)},FloatInput:p,DollarInput:function(s,t={},u={}){let v=JSON.parse(JSON.stringify(u));return'MaxDecimalDigits'in v||(v.MaxDecimalDigits=2),p(s,n(t,{unformat:function(w,x){w=w.toString();var y=w.replace(/^\$+/,''),z=x,A=w.length-y.length;return z-=Math.min(x,A),{value:y,cursorPos:z}},format:function(w,x){return{value:'$'+w,cursorPos:!1!==x&&x+1}}},'DollarInput'),v)},util:{commafy:l,uncommafy:m}}}])});