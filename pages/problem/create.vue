<template>
  <div>
    <v-breadcrumbs :items="breadCrumbs" />
    <detail-edit mode="create" />
  </div>
</template>

<script>
import DetailEdit from './_id/detail-edit'

export default {
  name: 'ProblemCreatePage',
  components: {
    DetailEdit
  },
  data() {
    return {
      problem: {
        title: '',
        description: '',
        input_format: '',
        output_format: '',
        hint: '',
        samples: [
          { index: 1, input: '', output: '' },
          { index: 2, input: '', output: '' },
          { index: 3, input: '', output: '' }
        ]
      },
      errors: {}
    }
  },
  computed: {
    breadCrumbs() {
      return [
        {
          text: this.$t('problem.problemList'),
          disabled: false,
          to: '/problem',
          nuxt: true,
          exact: true
        },
        {
          text: this.$t('problem.problemCreate'),
          disabled: true
        }
      ]
    }
  },
  methods: {
    saveData() {
      this.$axios
        .post(`/problem/`, this.problem)
        .then(res => {
          this.problem = res.data
          this.$swal(this.$t('saveSuccess'), '', 'success')
        })
        .catch(err => {
          if (typeof err === 'string')
            this.$swal(this.$t('saveFailed'), err, 'error')
          else this.errors = err
        })
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep .bytemd {
  height: 450px;
}

.mono-space {
  font-family: Consolas, Monaco, Lucida Console, Liberation Mono, monospace;
}
</style>
