<template>
  <v-row class='mt-3'>
    <v-col cols='12'>

    </v-col>
  </v-row>
</template>

<script>
export default {
  name: 'SubmissionPage',
  validate({ params }) {
    return /^\d+$/.test(params.id)
  },
  data() {
    return {}
  },
  computed: {}
}
</script>

<style lang='scss' scoped>

</style>
