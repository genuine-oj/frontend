<template>
  <div>
    <v-breadcrumbs :items="breadCrumbs" />
    <v-tabs v-model="tab" centered>
      <v-tab>
        <v-icon left> mdi-pencil</v-icon>
        {{ $t('problem.problemEdit') }}
      </v-tab>
      <v-tab>
        <v-icon left> mdi-database-cog</v-icon>
        {{ $t('problem.problemJudgeSettings') }}
      </v-tab>
    </v-tabs>
    <v-tabs-items v-model="tab" class="mt-3">
      <v-tab-item>
        <detail-edit />
      </v-tab-item>
      <v-tab-item>
        <data-edit />
      </v-tab-item>
    </v-tabs-items>
  </div>
</template>

<script>
import DetailEdit from './detail-edit'
import DataEdit from './data-edit'

export default {
  name: 'ProblemEditPage',
  components: {
    DetailEdit,
    DataEdit
  },
  validate({ params }) {
    return /^\d+$/.test(params.id)
  },
  data() {
    return {
      tab: 0,
      problem_id: undefined
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
          text: this.$t('problem.problemDetail'),
          disabled: false,
          to: `/problem/${this.problem_id}`,
          nuxt: true,
          exact: true
        },
        {
          text: this.$t('problem.problemEdit'),
          disabled: true
        }
      ]
    }
  },
  created() {
    this.problem_id = this.$route.params.id
  },
  methods: {}
}
</script>

<style lang="scss" scoped></style>
