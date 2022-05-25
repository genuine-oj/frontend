import Vue from 'vue'
import VueCodemirror from 'vue-codemirror'

import 'codemirror/mode/clike/clike'

import 'codemirror/addon/selection/active-line'
import 'codemirror/addon/scroll/simplescrollbars'
import 'codemirror/addon/scroll/simplescrollbars.css'

import 'codemirror/addon/selection/mark-selection'

import 'codemirror/addon/scroll/annotatescrollbar'
import 'codemirror/addon/search/matchesonscrollbar'
import 'codemirror/addon/search/searchcursor'
import 'codemirror/addon/search/match-highlighter'

import 'codemirror/addon/dialog/dialog'
import 'codemirror/addon/dialog/dialog.css'
import 'codemirror/addon/search/search'
import 'codemirror/keymap/sublime'

import 'codemirror/lib/codemirror.css'
import 'codemirror/theme/material-palenight.css'

const { codemirror } = VueCodemirror


const options = {
  tabSize: 4,
  styleActiveLine: true,
  lineNumbers: true,
  line: true,
  keyMap: 'sublime',
  theme: 'material-palenight',
  lineWrapping: true,
  scrollbarStyle: 'overlay'
}

codemirror.props.globalOptions.default = () => options

Vue.component('BaseCodemirror', codemirror)
