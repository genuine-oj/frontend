<template>
  <v-row>
    <v-col cols="12">
      {{ submissions }}
      <v-data-table
        :headers="headers"
        :items="submissions"
        item-key="id"
        :items-per-page="10"
        :options.sync="options"
        :server-items-length="count"
        :loading="loading"
        disable-sort
      >
        <template #item.id="{ item }">
          <nuxt-link
            :to="{ name: 'submission-id', params: { id: item.id } }"
            no-prefetch
            v-text="item.id"
          />
        </template>
        <template #item.problem="{ item }">
          <nuxt-link
            :to="{ name: 'problem-id', params: { id: item.problem.id } }"
            no-prefetch
            v-text="item.problem.title"
          />
        </template>
        <template #item.result="{ item }">
          <nuxt-link
            :to="{ name: 'submission-id', params: { id: item.id } }"
            no-prefetch
          >
            <v-chip
              class="px-2"
              style="cursor: pointer"
              :color="item.color"
              small
              dark
              label
              v-text="item.status"
            />
            <span
              v-if="!item.judging"
              :class="['text-h7', 'font-weight-black', `${item.color}--text`]"
              style="vertical-align: middle"
              v-text="item.score"
            />
          </nuxt-link>
        </template>
      </v-data-table>
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
        { text: '#', value: 'id' },
        {
          text: this.$t('submission.problem'),
          value: 'problem'
        },
        { text: this.$t('submission.submitter'), value: 'user' },
        { text: this.$t('submission.result'), value: 'result' },
        {
          text: this.$t('submission.usedTime'),
          value: 'used_time'
        },
        { text: this.$t('submission.memory'), value: 'memory' },
        {
          text: this.$t('submission.solution'),
          value: 'solution'
        },
        {
          text: this.$t('submission.submitTime'),
          value: 'submit_time'
        }
      ]
    },
    submissions() {
      return this.submissionsData.map(e => {
        return {
          id: e.id,
          problem: e.problem,
          user:
            e.user.username + (e.user.real_name ? `(${e.user.real_name})` : ''),
          judging: [
            this.$utils.codeJudge.judgeStatus.PENDING,
            this.$utils.codeJudge.judgeStatus.JUDGING
          ].includes(e.status),
          status: this.$utils.codeJudge.judgeStatus.getDisplay(e.status),
          color: this.$utils.codeJudge.judgeStatus.getColorClass(e.status),
          score: e.score,
          used_time: e.execute_time ? `${e.execute_time} ms` : '--',
          memory: e.execute_memory
            ? this.$utils.misc.parseSize(e.execute_memory)
            : '--',
          solution:
            this.$utils.codeJudge.languages.getDisplay(e.language) +
            ' / ' +
            this.$utils.misc.parseSize(e.source_size),
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
      this.$axios
        .get('/submission/', {
          params: {
            limit,
            offset
          }
        })
        .then(res => {
          this.count = res.data.count
          this.submissionsData = res.data.results
        })
        .catch(err => {
          this.$swal(this.$t('failed'), err, 'error')
        })
        .finally(() => {
          this.loading = false
        })
    }
  }
}
</script>

<style scoped></style>
