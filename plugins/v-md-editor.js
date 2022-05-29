// noinspection JSValidateTypes

import Vue from 'vue'
import VMdEditor from '@kangc/v-md-editor/lib/codemirror-editor'
import '@kangc/v-md-editor/lib/style/codemirror-editor.css'
import githubTheme from '@kangc/v-md-editor/lib/theme/github.js'
import '@kangc/v-md-editor/lib/theme/style/github.css'

import hljs from 'highlight.js/lib/core'

import c from 'highlight.js/lib/languages/c'
import cpp from 'highlight.js/lib/languages/cpp'

import Codemirror from 'codemirror'

import 'codemirror/mode/markdown/markdown'
import 'codemirror/mode/javascript/javascript'
import 'codemirror/mode/css/css'
import 'codemirror/mode/htmlmixed/htmlmixed'
import 'codemirror/mode/vue/vue'
import 'codemirror/addon/edit/closebrackets'
import 'codemirror/addon/edit/closetag'
import 'codemirror/addon/edit/matchbrackets'
import 'codemirror/addon/display/placeholder'
import 'codemirror/addon/selection/active-line'
import 'codemirror/addon/scroll/simplescrollbars'
import 'codemirror/addon/scroll/simplescrollbars.css'
import 'codemirror/lib/codemirror.css'

import createKatexPlugin from '@kangc/v-md-editor/lib/plugins/katex/npm'
import 'katex/dist/katex.css'

import createCopyCodePlugin from '@kangc/v-md-editor/lib/plugins/copy-code/index'
import '@kangc/v-md-editor/lib/plugins/copy-code/copy-code.css'

import createTodoListPlugin from '@kangc/v-md-editor/lib/plugins/todo-list/index'
import '@kangc/v-md-editor/lib/plugins/todo-list/todo-list.css'

import zhCN from '@kangc/v-md-editor/lib/lang/zh-CN'
import enUS from '@kangc/v-md-editor/lib/lang/en-US'

VMdEditor.Codemirror = Codemirror

hljs.registerLanguage('c', c)
hljs.registerLanguage('cpp', cpp)

VMdEditor.use(githubTheme, {
  Hljs: hljs
})
  .use(createKatexPlugin())
  .use(createCopyCodePlugin())
  .use(createTodoListPlugin())

Vue.component('BaseMdEditor', VMdEditor)

export default ({ store }) => {
  const localeMapping = {
    'zh-CN': ['zh-CN', zhCN],
    'en-US': ['en-US', enUS]
  }
  store.subscribe(mutation => {
    if (mutation.type === 'updateLocale')
      VMdEditor.lang.use(...localeMapping[mutation.payload])
  })
}
