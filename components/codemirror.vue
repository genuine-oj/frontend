<template>
  <vue-codemirror v-model="code" :options="codemirrorOptions" />
</template>

<script>
import VueCodemirror from '~/components/vue-codemirror'

const languages = {
  c: 'text/x-csrc',
  cpp: 'text/x-c++src'
}
export default {
  name: 'OJCodemirror',
  components: {
    VueCodemirror
  },
  model: {
    prop: 'codeValue',
    event: 'codeValueChange'
  },
  props: {
    codeValue: {
      type: String,
      default: ''
    },
    language: {
      type: String,
      default: 'c'
    },
    readonly: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    codemirrorOptions() {
      let additionalOptions = {}
      if (this.readonly)
        additionalOptions = {
          readOnly: true,
          cursorBlinkRate: -1,
          styleActiveLine: false,
          lineNumbers: false
        }
      return {
        mode: languages[this.language],
        ...additionalOptions
      }
    },
    code: {
      get() {
        return this.codeValue
      },
      set(value) {
        this.$emit('codeValueChange', value)
      }
    }
  }
}
</script>

<style scoped></style>
