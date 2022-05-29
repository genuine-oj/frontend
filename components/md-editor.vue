<template>
  <base-md-editor
    v-model="content"
    :mode="mode"
    left-toolbar="undo redo | h bold italic strikethrough quote | ul ol table hr | link image code"
  />
</template>

<script>
export default {
  name: 'OJMdEditor',
  model: {
    prop: 'value',
    event: 'valueChange'
  },
  props: {
    value: {
      type: String,
      default: ''
    },
    mode: {
      type: String,
      default: 'editable'
    }
  },
  computed: {
    content: {
      get() {
        return this.value
      },
      set(value) {
        this.$emit('valueChange', value)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep .vuepress-markdown-body {
  padding: 0 !important;
}
</style>
