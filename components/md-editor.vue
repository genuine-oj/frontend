<template>
  <Editor
    :value="value"
    :plugins="plugins"
    :locale="locale"
    @change="handleChange"
  />
</template>

<script>
import { Editor } from '@bytemd/vue'
import 'bytemd/dist/index.css'
import breaks from '@bytemd/plugin-breaks'
import gemoji from '@bytemd/plugin-gemoji'
import gfm from '@bytemd/plugin-gfm'
import highlight from '@bytemd/plugin-highlight-ssr'
import math from '@bytemd/plugin-math-ssr'

import 'highlight.js/styles/github.css'
import 'github-markdown-css/github-markdown.css'
import 'katex/dist/katex.css'

const locales = {
  'en-US': 'en',
  'zh-CN': 'zh_Hans'
}

export default {
  name: 'MdEditor',
  components: {
    Editor
  },
  model: {
    prop: 'value',
    event: 'valueChange'
  },
  props: {
    value: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      localeName: 'en'
    }
  },
  computed: {
    locale() {
      return require(`bytemd/locales/${this.localeName}.json`)
    },
    plugins() {
      return [
        breaks(),
        gemoji(),
        gfm({
          locale: require(`@bytemd/plugin-gfm/locales/${this.localeName}.json`)
        }),
        highlight(),
        math({
          locale: require(`@bytemd/plugin-math/locales/${this.localeName}.json`),
          katexOptions: { output: 'html' }
        })
      ]
    }
  },
  watch: {
    '$store.state.locale': {
      handler(value) {
        this.localeName = locales[value]
      },
      immediate: true
    }
  },
  methods: {
    handleChange(value) {
      this.$emit('valueChange', value)
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep code {
  background-color: transparent !important;
}
::v-deep .bytemd-toolbar-right [bytemd-tippy-path='5'] {
  display: none;
}
</style>
