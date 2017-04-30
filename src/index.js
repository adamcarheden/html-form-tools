import HTMLFormTools from './html-form-tools'
import RosettaMarkdown from 'rosetta-markdown'
import hljs from 'highlightjs'

let opts = { debug: true }
HTMLFormTools.ManagedInput('noz', {
	validate: function(val) {
		if (val.match(/z/i)) throw new Error("'z' isn't allowed")
	}
}, opts)
let cbParams = {
	unformat: null,
	validate: null,
	format: null,
	sync: null,
	invalid: null,
	intermediate: null,
	valid: null,
}
window.cbParams = cbParams
HTMLFormTools.ManagedInput('allcb', {
	unformat: function(fmtd, pos) {
		cbParams.unformat = arguments
		return {value: fmtd, cursorPos: pos }
	},
	validate: function(unfmtd) {
		cbParams.validate = arguments
		if (unfmtd === 'throw') throw new Error(`throwing as requested`)
		if (unfmtd === 'false') return false
		return true
	},
	format: function(validVal, pos) {
		cbParams.format = arguments
		return {value: validVal, cursorPos: pos }
	},
	sync: function(validVal) {
		cbParams.sync = arguments
	},
	invalid: function(invalidVal) {
		cbParams.invalid = arguments
	},
	intermediate: function(ufmtdVal) {
		cbParams.intermediate = arguments
	},
	valid: function(validVal) {
		cbParams.valid = arguments
	},
}, opts)
HTMLFormTools.IntegerInput('integer', {}, opts)
HTMLFormTools.FloatInput('float', {}, opts)
HTMLFormTools.DollarInput('dollar', {}, opts)

RosettaMarkdown.marked.setOptions({
	highlight: function(code) {
		return hljs.highlightAuto(code).value
	}
})

