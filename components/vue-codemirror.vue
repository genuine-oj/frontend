<template>
  <div class="vue-codemirror" :class="{ merge }">
    <div v-if="merge" ref="mergeview"></div>
    <textarea
      v-else
      ref="textarea"
      :name="name"
      :placeholder="placeholder"
    ></textarea>
  </div>
</template>

<script>
import factory from 'codemirror-ssr'

import useCLike from 'codemirror-ssr/mode/clike/clike'
import useActiveLine from 'codemirror-ssr/addon/selection/active-line'
import useSimpleScrollBars from 'codemirror-ssr/addon/scroll/simplescrollbars'
import 'codemirror-ssr/addon/scroll/simplescrollbars.css'

import 'codemirror-ssr/lib/codemirror.css'

if (typeof Object.assign !== 'function') {
  Object.defineProperty(Object, 'assign', {
    value(target, varArgs) {
      if (target == null) {
        throw new TypeError('Cannot convert undefined or null to object')
      }
      const to = Object(target)
      for (let index = 1; index < arguments.length; index++) {
        const nextSource = arguments[index]
        if (nextSource != null) {
          for (const nextKey in nextSource) {
            if (Object.prototype.hasOwnProperty.call(nextSource, nextKey)) {
              to[nextKey] = nextSource[nextKey]
            }
          }
        }
      }
      return to
    },
    writable: true,
    configurable: true
  })
}

export default {
  name: 'VueCodemirror',
  props: {
    code: {
      type: String,
      default: ''
    },
    value: {
      type: String,
      default: ''
    },
    marker: {
      type: Function,
      default: undefined
    },
    unseenLines: {
      type: Array,
      default: () => []
    },
    name: {
      type: String,
      default: 'codemirror'
    },
    placeholder: {
      type: String,
      default: ''
    },
    merge: {
      type: Boolean,
      default: false
    },
    options: {
      type: Object,
      default: () => ({})
    },
    events: {
      type: Array,
      default: () => []
    },
    globalOptions: {
      type: Object,
      default: () => ({
        tabSize: 4,
        styleActiveLine: true,
        lineNumbers: true,
        line: true,
        lineWrapping: true,
        scrollbarStyle: 'overlay'
      }),
      globalEvents: {
        type: Array,
        default: () => []
      }
    }
  },
  data() {
    return {
      content: '',
      codemirror: null,
      cminstance: null
    }
  },
  watch: {
    options: {
      deep: true,
      handler(options) {
        for (const key in options) {
          this.cminstance.setOption(key, options[key])
        }
      }
    },
    merge() {
      this.$nextTick(this.switchMerge)
    },
    code(newVal) {
      this.handerCodeChange(newVal)
    },
    value(newVal) {
      this.handerCodeChange(newVal)
    }
  },
  beforeDestroy() {
    this.destroy()
  },
  mounted() {
    this.initialize()
  },
  methods: {
    initialize() {
      const CMfactory = factory()
      useCLike(CMfactory)
      useActiveLine(CMfactory)
      useSimpleScrollBars(CMfactory)

      const cmOptions = Object.assign({}, this.globalOptions, this.options)
      if (this.merge) {
        // noinspection JSCheckFunctionSignatures
        this.codemirror = CMfactory.MergeView(this.$refs.mergeview, cmOptions)
        this.cminstance = this.codemirror.edit
      } else {
        // noinspection JSCheckFunctionSignatures
        this.codemirror = CMfactory.fromTextArea(this.$refs.textarea, cmOptions)
        this.cminstance = this.codemirror
        this.cminstance.setValue(this.code || this.value || this.content)
      }
      this.cminstance.on('change', cm => {
        this.content = cm.getValue()
        if (this.$emit) {
          this.$emit('input', this.content)
        }
      })

      this.$emit('ready', this.codemirror)
      this.unseenLineMarkers()

      this.refresh()
    },
    refresh() {
      this.$nextTick(() => {
        this.cminstance.refresh()
      })
    },
    destroy() {
      const element = this.cminstance.doc.cm.getWrapperElement()
      element && element.remove && element.remove()
    },
    handerCodeChange(newVal) {
      const cmValue = this.cminstance.getValue()
      if (newVal !== cmValue) {
        const scrollInfo = this.cminstance.getScrollInfo()
        this.cminstance.setValue(newVal)
        this.content = newVal
        this.cminstance.scrollTo(scrollInfo.left, scrollInfo.top)
      }
      this.unseenLineMarkers()
    },
    unseenLineMarkers() {
      if (this.unseenLines !== undefined && this.marker !== undefined) {
        this.unseenLines.forEach(line => {
          const info = this.cminstance.lineInfo(line)
          this.cminstance.setGutterMarker(
            line,
            'breakpoints',
            info.gutterMarkers ? null : this.marker()
          )
        })
      }
    },
    switchMerge() {
      const history = this.cminstance.doc.history
      const cleanGeneration = this.cminstance.doc.cleanGeneration
      // eslint-disable-next-line vue/no-mutating-props
      this.options.value = this.cminstance.getValue()

      this.destroy()
      this.initialize()

      this.cminstance.doc.history = history
      this.cminstance.doc.cleanGeneration = cleanGeneration
    }
  }
}
</script>
