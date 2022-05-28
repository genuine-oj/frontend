<template>
  <v-row>
    <v-col cols='12'>
      {{ submissions }}
      <v-data-table
        :headers='headers'
        :items='submissions'
        item-key='id'
        :items-per-page='10'
        :options.sync='options'
        :server-items-length='count'
        :loading='loading'
        disable-sort
      />
    </v-col>
  </v-row>
</template>

<script>
export default {
  name: 'SubmissionIndexPage',
  data() {
    return {
      submissionsData: [],
      loading: false,
      count: 0,
      options: {}
    }
  },
  computed: {
    headers() {
      return [
        { text: '#', value: 'id', width: '1%' },
        { text: this.$t('submission.problem'), value: 'problem.title', width: '23%' },
        { text: this.$t('submission.submitter'), value: 'user', width: '10%' },
        { text: this.$t('submission.status'), value: 'status', width: '10%' },
        { text: this.$t('submission.score'), value: 'score', width: '10%' },
        { text: this.$t('submission.usedTime'), value: 'used_time', width: '10%' },
        { text: this.$t('submission.memory'), value: 'memory', width: '10%' },
        { text: this.$t('submission.solution'), value: 'solution', width: '15%' },
        { text: this.$t('submission.submitTime'), value: 'submit_time', width: '21%' }
      ]
    },
    submissions() {
      return this.submissionsData.map(e => {
        return {
          id: e.id,
          problem: e.problem,
          user: e.user.username + (e.user.real_name ? `(${e.user.real_name})` : ''),
          status: this.$utils.codeJudge.judgeStatus.getDisplay(e.status),
          score: e.score,
          used_time: e.execute_time ?? '--',
          memory: this.$utils.misc.parseSize(e.execute_memory) ?? '--',
          solution: this.$utils.codeJudge.languages.getDisplay(e.language) + ' / ' + this.$utils.misc.parseSize(e.source_size),
          submit_time: this.$dayjs(e.create_time).format('YYYY/MM/DD HH:MM:ss')
        }
      })
    }
  },
  mounted() {
    this.loadData()
  },
  methods: {
    loadData() {
      const limit = this.options.itemsPerPage
      const offset = (this.options.page - 1) * this.options.itemsPerPage
      this.loading = true
      this.$axios.get('/submission/', {
        params: {
          limit,
          offset
        }
      }).then(res => {
        this.count = res.count
        this.submissionsData = res.results
      }).catch(err => {
        this.$swal('提交记录加载失败', err, 'error')
      }).finally(() => {
        this.loading = false
      })
    }
  }
}
</script>

<style scoped>

</style>
