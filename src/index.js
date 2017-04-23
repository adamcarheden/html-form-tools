import HTMLFormTools from './html-form-tools'
import RosettaMarkdown from 'rosetta-markdown'
import hljs from 'highlightjs'

let opts = { debug: true }
HTMLFormTools.ManagedInput('noz', {
	validate: function(val) {
		if (val.match(/z/i)) throw new Error("'z' isn't allowed")
	}
}, opts)
HTMLFormTools.IntegerInput('integer', {}, opts)
HTMLFormTools.FloatInput('float', {}, opts)
HTMLFormTools.DollarInput('dollar', {}, opts)

RosettaMarkdown.marked.setOptions({
	highlight: function(code) {
		return hljs.highlightAuto(code).value
	}
})

