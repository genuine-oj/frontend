<template>
  <Viewer :value="value" :plugins="plugins" />
</template>

<script>
import { Viewer } from '@bytemd/vue'
import 'bytemd/dist/index.css'
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
  name: 'MdViewer',
  components: {
    Viewer
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
    plugins() {
      return [
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
  }
}
</script>

<style lang="scss" scoped>
:deep(code) {
  background-color: transparent !important;
}

div.markdown-body {
  font-size: 18px;
}
</style>
