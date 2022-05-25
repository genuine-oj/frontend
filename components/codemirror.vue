<template>
  <base-codemirror v-model='code' :options='codemirrorOptions' />
</template>

<script>
export default {
  name: 'OJCodemirror',
  model: {
    prop: 'codeValue',
    event: 'codeValueChange'
  },
  props: {
    codeValue: {
      type: String,
      default: ''
    },
    mime: {
      type: String,
      default: ''
    }
  },
  computed: {
    codemirrorOptions() {
      return {
        mode: this.mime
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

<style scoped>

</style>
