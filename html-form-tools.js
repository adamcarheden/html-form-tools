(function(b,c){'object'==typeof exports&&'object'==typeof module?module.exports=c():'function'==typeof define&&define.amd?define('html-form-tools',[],c):'object'==typeof exports?exports['html-form-tools']=c():b['html-form-tools']=c()})(this,function(){return function(a){function b(d){if(c[d])return c[d].exports;var f=c[d]={i:d,l:!1,exports:{}};return a[d].call(f.exports,f,f.exports,b),f.l=!0,f.exports}var c={};return b.m=a,b.c=c,b.i=function(d){return d},b.d=function(d,f,g){b.o(d,f)||Object.defineProperty(d,f,{configurable:!1,enumerable:!0,get:g})},b.n=function(d){var f=d&&d.__esModule?function(){return d['default']}:function(){return d};return b.d(f,'a',f),f},b.o=function(d,f){return Object.prototype.hasOwnProperty.call(d,f)},b.p='',b(b.s=5)}([function(a,b,c){'use strict';c.d(b,'a',function(){return f}),c.d(b,'b',function(){return g}),c.d(b,'c',function(){return h}),c.d(b,'d',function(){return j});var d='function'==typeof Symbol&&'symbol'==typeof Symbol.iterator?function(l){return typeof l}:function(l){return l&&'function'==typeof Symbol&&l.constructor===Symbol&&l!==Symbol.prototype?'symbol':typeof l},f=function(m,n){var o;switch(2>arguments.length&&(n=0),'undefined'==typeof m?'undefined':d(m)){case'number':o=m.toString();break;case'symbol':case'string':if(o=m.toString(),!o.match(/^\s*\d+(\.\d*)?\s*$/))return 2>arguments.length?m:{value:m,cursorPos:n};var p=o.substring(0,n),q=o.substring(n).trim();0===p.trim().length&&(n-=p.length,p=''),o=p+q;break;default:return 2>arguments.length?m:{value:m,cursorPos:n};}var r=o.match(/\./)?o.split(/\./,2):[o];for(var v,s=[],t=0,u=0;u<r[0].length;u++)v=r[0].length-u-1,0!==u&&0==u%3&&(s.unshift(','),v<n&&t++),s.unshift(r[0].charAt(v));return n+=t,r[0]=s.join(''),o=r.join('.'),2>arguments.length?o:{value:o,cursorPos:n}},g=function(m,n){var o=m.replace(/,/g,'');return 2<=arguments.length?(n-=m.substring(0,n).replace(/[^,]/g,'').length,{value:o,cursorPos:n}):o},h=function(m,n,o){var p=3<arguments.length&&void 0!==arguments[3]?arguments[3]:[];return Object.keys(m).forEach(function(q){if(-1!==p.indexOf(q))q in n||(n[q]=m[q]);else{if(q in n)throw new Error('You defined the callback \''+q+'\', but \''+o+'\' also defines that callback');n[q]=m[q]}}),n},j=function(m,n,o){var p;return p=n in m&&'function'==typeof m[n]?function(r,s){var t=o(r,s);return m[n](t.value,t.cursorPos)}:o,p}},function(a,b){'use strict';function d(o,p){if(!(o instanceof p))throw new TypeError('Cannot call a class as a function')}var f='function'==typeof Symbol&&'symbol'==typeof Symbol.iterator?function(o){return typeof o}:function(o){return o&&'function'==typeof Symbol&&o.constructor===Symbol&&o!==Symbol.prototype?'symbol':typeof o},g=function(){function o(p,q){for(var s,r=0;r<q.length;r++)s=q[r],s.enumerable=s.enumerable||!1,s.configurable=!0,'value'in s&&(s.writable=!0),Object.defineProperty(p,s.key,s)}return function(p,q,r){return q&&o(p.prototype,q),r&&o(p,r),p}}(),h={unformat:!1,validate:!1,format:!1,sync:!1,invalid:!1,intermediate:!1,valid:!1},j={HTMLInputElement:{keypress:function(p){return this.debug('keypress: value=\''+this.input.value+'\''),!!this.ignoreKey(p)||void this.validateAndFormat(p)},input:function(p){this.debug('input: value=\''+this.input.value+'\''),this.validateAndFormat(p)},blur:function(){this.debug('blur: value=\''+this.input.value+'\''),this.sync()}}},l={defaultValue:null,ignoreCtrl:!0,ignoreAlt:!0,debug:!1},m=function(p){if(!('key'in p))throw new Error('predictInput called on event of type \''+p.type+'\', which has no value \'key\'. You probably only want to call this on KeyEvents');var q=p.target.value.slice(0,p.target.selectionStart),r=p.target.value.slice(p.target.selectionEnd),s=''+q+p.key+r;return s},n=function(){function o(p,q,r){var s=this;if(d(this,o),'string'!=typeof p)this.input=p;else if(this.input=document.getElementById(p),!this.input&&(this.input=document.querySelector(p),!this.input))throw new Error('Failed to find element by id or query selector \''+p+'\'');if('object'!==f(this.input))throw Error('Expected an object or the name of an element to manage, but got a \''+f(this.input)+'\'');if(!(this.input instanceof HTMLInputElement))throw Error('Expected an HTMLInputElement, got a \''+this.input.constructor.name+'\'');if('format'in q&&!('unformat'in q)&&console.warn('You defined the format callback but not the unformat callback. That probably won\'t work well.'),'unformat'in q&&!('format'in q)&&console.warn('You defined the unformat callback but not the format callback. That probably won\'t work well.'),'format'in q||'unformat'in q||'validate'in q||console.warn('You didn\'t define the format/unformat callbacks nor the validate callback. This module doesn\'t really do anything if you haven\'t defined at least one of those.'),this.callbacks={},'undefined'==typeof q&&(q={}),'object'!==('undefined'==typeof q?'undefined':f(q)))throw new Error('callbacks should be an object, not a '+('undefined'==typeof q?'undefined':f(q)));if(Object.keys(h).forEach(function(t){s.callbacks[t]=t in q?q[t]:h[t]}),Object.keys(q).forEach(function(t){t in h||console.warn('Unknown callback: \''+t+'\'')}),this.opts={},'undefined'==typeof r&&(r={}),'object'!==('undefined'==typeof r?'undefined':f(r)))throw new Error('opts should be an object, not a '+('undefined'==typeof r?'undefined':f(r)));Object.keys(l).forEach(function(t){s.opts[t]=t in r?r[t]:l[t]}),null!==this.opts.defaultValue&&(this.input.value=this.opts.defaultValue),this.validateAndFormat(),this.inputType='HTMLInputElement',Object.keys(j[this.inputType]).forEach(function(t){s.input.addEventListener(t,function(u){j[s.inputType][t].bind(s)(u)})})}return g(o,[{key:'unformat',value:function(q,r){return'undefined'==typeof q&&(q=this.input.value),this.callbacks.unformat?this.callbacks.unformat(q,r):q}},{key:'unformatted',value:function(q){'undefined'==typeof q&&(q=this.input.value);var r=this.callbacks.unformat?this.callbacks.unformat(q):q;return'object'===('undefined'==typeof r?'undefined':f(r))?r.value:r}},{key:'format',value:function(q,r){return this.callbacks.format?this.callbacks.format(q,r):q}},{key:'validate',value:function(q){return'undefined'==typeof q&&(q=this.unformatted(this.input.value)),!this.callbacks.validate||this.callbacks.validate(q)}},{key:'sync',value:function(q){'undefined'==typeof q&&(q=this.unformatted(this.input.value));try{if(this.callbacks.sync&&this.validate(q))return this.callbacks.sync(q)}catch(r){this.debug('Refusing to sync invalid value '+q)}}},{key:'invalid',value:function(q,r,s){this.callbacks.invalid&&this.callbacks.invalid(q,r,s,this.input)}},{key:'intermediate',value:function(q,r,s){this.callbacks.intermediate&&this.callbacks.intermediate(q,r,s,this.input)}},{key:'valid',value:function(q,r,s){this.callbacks.valid&&this.callbacks.valid(q,r,s,this.input)}},{key:'ignoreKey',value:function(q){if(!('key'in q))throw new Error('ignoreKey should only be called for KeyEvents. Called on event of type '+q.type);return(1<q.key.length||this.opts.ignoreCtrl&&q.ctrlKey||this.opts.ignoreAlt&&q.altKey)&&(this.debug({ignoring:q}),!0)}},{key:'validateAndFormat',value:function(q){var s,r='',t=this.input.selectionStart;q&&q.key?(r=this.input.value,s=m(q),t++):s=this.input.value;var u=this.unformat(s,t);'object'!==('undefined'==typeof u?'undefined':f(u))&&(u={value:u,cursorPos:!1});try{if(!this.validate(u.value))this.debug('\''+u.value+'\': acceptable intermediate value, formatting delayed'),this.intermediate(u.value,r,s);else{var v=this.format(u.value,u.cursorPos);'object'!==('undefined'==typeof v?'undefined':f(v))&&(v={value:v,cursorPos:!1}),this.debug('\''+u.value+'\' (cursorPos='+u.cursorPos+') is valid, formatted as \''+v.value+'\' (cursorPos='+v.cursorPos+')'),q&&q.preventDefault(),this.input.value=v.value,v.cursorPos&&this.input.setSelectionRange(v.cursorPos,v.cursorPos),this.valid(u.value,r,s)}}catch(w){return this.debug('Invalid value \''+u.value+'\': "'+w.message+'". We\'ll prevent input if possible.'),q&&q.preventDefault(),q&&'keypress'===q.type||this.invalid(u.value,r,s),!1}return!0}},{key:'set',value:function(q,r){var s=this.input.value,t=this.unformat(q);'object'!==('undefined'==typeof t?'undefined':f(t))&&(t={value:t,cursorPos:!1});var u=q,v=!1;try{this.validate(t.value)?(v=!0,u=this.format(t.value,t.cursorPos),this.debug('set() called with \''+t.value+'\': valid, formatted as \''+u.value+'\' (cursorPos='+u.cursorPos+')')):(this.debug('set() called with \''+t.value+'\': acceptable intermediate value set programatically, formatting delayed'),this.intermediate(t.value,s,q))}catch(w){if(r)this.debug('set() called with force. Setting invalid value \''+t.value+'\': "'+w.message+'". ');else return this.debug('set() called without force, ignoring invalid value \''+t.value+'\': "'+w.message+'". '),v}return'object'!==('undefined'==typeof u?'undefined':f(u))&&(u={value:u,cursorPos:!1}),this.input.value=u.value,u.cursorPos&&this.input.setSelectionRange(u.cursorPos,u.cursorPos),v&&this.valid(t.value,s,q),v}},{key:'debug',value:function(q){this.opts.debug&&console.log(q)}}]),o}();b.a=n},function(a,b,c){'use strict';var d=c(0),f=c(1);b.a=function(g){var h=1<arguments.length&&void 0!==arguments[1]?arguments[1]:{},j=2<arguments.length&&void 0!==arguments[2]?arguments[2]:{},l=JSON.parse(JSON.stringify(j));'commafy'in l||(l.commafy=!0);var m=!1;'MaxMantissaDigits'in l&&(m=l.MaxMantissaDigits,delete l.MaxMantissaDigits);var n=!1;'MaxDecimalDigits'in l&&(n=l.MaxDecimalDigits,delete l.MaxDecimalDigits);var o=!1,p=!1;return l.commafy?(o=c.i(d.d)(h,'format',function(q,r){return c.i(d.a)(q,r)}),p=c.i(d.d)(h,'unformat',function(q,r){return c.i(d.b)(q,r)})):('format'in h&&(o=h.format),'unformat'in h&&(p=h.unformat)),delete l.commafy,new f.a(g,c.i(d.c)(h,{validate:function(r){if(r=r.toString(),0===r.length)return!1;var s=r.match(/^(\d*)((\.)(\d*))?$/);if(!s)throw new Error('Must be numeric (with out without a decimal)');if(m&&s[1]&&s[1].length>m)throw new Error('Mantissa part must be no more than \''+m+'\' digits');if(n&&s[4]&&s[4].length>n)throw new Error('Decimal part must be no more than \''+n+'\' digits');return s[3]&&!s[4]?!1:!0},format:o,unformat:p},'FloatInput',['format','unformat']),l)}},function(a,b,c){'use strict';var d=c(0),f=c(2);b.a=function(g){var h=1<arguments.length&&void 0!==arguments[1]?arguments[1]:{},j=2<arguments.length&&void 0!==arguments[2]?arguments[2]:{},l=JSON.parse(JSON.stringify(j));return'MaxDecimalDigits'in l||(l.MaxDecimalDigits=2),c.i(f.a)(g,c.i(d.c)(h,{unformat:function(n,o){n=n.toString();var p=n.replace(/^\$+/,''),q=o,r=n.length-p.length;return q-=Math.min(o,r),{value:p,cursorPos:q}},format:function(n,o){return{value:'$'+n,cursorPos:!1!==o&&o+1}}},'DollarInput'),l)}},function(a,b,c){'use strict';var d=c(0),f=c(1);b.a=function(g){var h=1<arguments.length&&void 0!==arguments[1]?arguments[1]:{},j=2<arguments.length&&void 0!==arguments[2]?arguments[2]:{},l=JSON.parse(JSON.stringify(j));'commafy'in l||(l.commafy=!0);var m=!1;'MaxDigits'in l&&(m=l.MaxDigits,delete l.MaxDigits);var n=!1,o=!1;return l.commafy?(n=c.i(d.d)(h,'format',function(p,q){return c.i(d.a)(p,q)}),o=c.i(d.d)(h,'unformat',function(p,q){return c.i(d.b)(p,q)})):('format'in h&&(n=h.format),'unformat'in h&&(o=h.unformat)),delete l.commafy,new f.a(g,c.i(d.c)(h,{validate:function(q){if(!q.match(/^[0-9]*$/))throw new Error('must be a integer');if(m&&q.length>m)throw new Error('Must be at most '+m+' digits');return!0},format:n,unformat:o},'IntegerInput'),l)}},function(a,b,c){'use strict';Object.defineProperty(b,'__esModule',{value:!0});var d=c(0),f=c(1),g=c(4),h=c(2),j=c(3);b['default']={ManagedInput:function(m,n,o){return new f.a(m,n,o)},IntegerInput:g.a,FloatInput:h.a,DollarInput:j.a,util:{commafy:d.a,uncommafy:d.b}}}])});