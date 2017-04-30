export const commafy = function(num, cursorPos) {
	let value
	if (arguments.length < 2) cursorPos = 0
	switch (typeof num) {
	case 'number':
		value = num.toString()
		break
	case 'symbol':
	case 'string':
		value = num.toString()
		// Don't bother with things that don't look like numbers
		if (!value.match(/^\s*\d+(\.\d*)?\s*$/)) {
			if (arguments.length < 2) return num
			return {value: num, cursorPos: cursorPos}
		}
		// trim, adjusting cursorPos
		let before = value.substring(0,cursorPos)
		let after = value.substring(cursorPos).trim()
		if (before.trim().length === 0) {
			cursorPos -= before.length
			before = ''
		}
		value = before+after
		break
	default:
		if (arguments.length < 2) return num
		return {value: num, cursorPos: cursorPos}
	}
	var parts
	if (value.match(/\./)) {
		parts = value.split(/\./,2)
	} else {
		parts = [value]
	}
	var res = []
	var moveCursor = 0
	for (var i=0; i<parts[0].length; i++) {
		let pos=parts[0].length-i-1
		if (i !== 0 && i % 3 === 0) {
			res.unshift(',')
			if (pos < cursorPos) moveCursor++
		}
		res.unshift(parts[0].charAt(pos))
	}
	cursorPos += moveCursor
	parts[0] = res.join('')
	value = parts.join('.')
	if (arguments.length < 2) {
		return value
	} else {
		return {value: value, cursorPos: cursorPos }
	}
}
export const uncommafy = function(value, cursorPos) {
	var val = value.replace(/,/g,'')
	if (arguments.length >= 2) {
		cursorPos -= value.substring(0,cursorPos).replace(/[^,]/g,'').length
		return {value: val, cursorPos: cursorPos}
	}
	return val
}

export const mergeCallbacks = function(src, tgt, name, skip = []) {
	Object.keys(src).forEach(function(k) {
		if (skip.indexOf(k) !== -1) {
			if (!(k in tgt)) tgt[k] = src[k]
		} else {
			if (k in tgt) throw new Error(`You defined the callback '${k}', but '${name}' also defines that callback`)
			tgt[k] = src[k]
		}
	})
	return tgt
}

export const stackFormats = function(callbacks, name, formatter) {
	let fun
	if (name in callbacks && typeof callbacks[name] === 'function') {
		fun = function(value, cursorPos) { 
			var fmtd = formatter(value, cursorPos)
			return callbacks[name](fmtd.value, fmtd.cursorPos) 
		}
	} else {
		fun = formatter
	}
	return fun
}


