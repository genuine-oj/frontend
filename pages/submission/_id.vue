<template>
  <v-row class="mt-3">
    <v-col cols="12" md="8">
      <v-tabs v-model="tab">
        <v-tab v-if="!submission.pending && !submission.ce_se"
          >测试点信息</v-tab
        >
        <!-- TODO: i18n -->
        <v-tab v-if="!submission.pending && submission.log">编译信息</v-tab>
        <v-tab>源代码</v-tab>
      </v-tabs>

      <v-tabs-items v-model="tab" class="mt-3">
        <v-tab-item v-if="!submission.pending && !submission.ce_se">
          <v-card flat>
            <v-simple-table>
              <template #default>
                <tbody>
                  <tr v-for="item in submission.detail" :key="item.case_name">
                    <td>
                      <v-chip
                        outlined
                        label
                        @click="loadTestPoint(item.case_name)"
                      >
                        <v-icon left>mdi-pound</v-icon>
                        {{ item.case_name }}
                      </v-chip>
                    </td>
                    <td>
                      <v-chip
                        :color="
                          $utils.codeJudge.judgeStatus.getColorClass(
                            item.status
                          )
                        "
                        dark
                        v-text="
                          $utils.codeJudge.judgeStatus.getDisplay(item.status)
                        "
                      />
                    </td>
                    <td>
                      <v-chip>
                        <v-icon left>mdi-clock</v-icon>
                        {{ item.statistics.time }} ms
                      </v-chip>
                    </td>
                    <td>
                      <v-chip>
                        <v-icon left>mdi-memory</v-icon>
                        {{ $utils.misc.parseSize(item.statistics.memory) }}
                      </v-chip>
                    </td>
                  </tr>
                </tbody>
              </template>
            </v-simple-table>
          </v-card>
        </v-tab-item>

        <v-tab-item v-if="!submission.pending && submission.log">
          <v-alert
            dense
            outlined
            color="info"
            class="px-0 py-1"
            style="overflow-x: auto"
          >
            <pre class="mx-2" v-text="submission.log" />
          </v-alert>
        </v-tab-item>

        <v-tab-item>
          <v-card outlined class="px-2 py-1">
            <code-mirror
              :code-value="submission.source"
              :language="submission.language"
              :readonly="true"
            />
          </v-card>
        </v-tab-item>
      </v-tabs-items>
    </v-col>
    <v-col md="1" />
    <v-col cols="12" md="3"> </v-col>
  </v-row>
</template>

<script>
import CodeMirror from '~/components/codemirror'

export default {
  name: 'SubmissionPage',
  components: {
    CodeMirror
  },
  beforeRouteLeave(to, from, next) {
    if (this.ws) this.ws.close()
    next()
  },
  validate({ params }) {
    return /^\d+$/.test(params.id)
  },
  data() {
    return {
      submissionData: {},
      tab: 0,
      ws: undefined
    }
  },
  computed: {
    submission() {
      return {
        ...this.submissionData,
        pending:
          this.submissionData.status ===
          this.$utils.codeJudge.judgeStatus.PENDING,
        ce_se: [
          this.$utils.codeJudge.judgeStatus.COMPILE_ERROR,
          this.$utils.codeJudge.judgeStatus.SYSTEM_ERROR
        ].includes(this.submissionData.status)
      }
    }
  },
  async mounted() {
    this.submissionData = { id: this.$route.params.id }
    await this.loadData()
    if (
      [
        this.$utils.codeJudge.judgeStatus.PENDING,
        this.$utils.codeJudge.judgeStatus.JUDGING
      ].includes(this.submissionData.status)
    )
      this.initWebSocket()
  },
  methods: {
    async loadData() {
      return await this.$axios
        .get(`/submission/${this.submissionData.id}/`)
        .then(res => {
          this.submissionData = res.data
        })
        .catch(err => {
          this.$swal(this.$t('failed'), err, 'error')
        })
        .finally(() => {
          this.loading = false
        })
    },
    initWebSocket() {
      if (typeof WebSocket === 'undefined')
        return this.$swal(this.$t('failed'), 'WebSocket not supported', 'error')
      this.ws = new WebSocket(
        `ws://${location.host}/ws/submission/${this.submissionData.id}/`
      )
      this.ws.onopen = () => {
        this.ws.send(JSON.stringify({ 1: 3 }))
      }
      this.ws.onmessage = e => {
        console.log(e)
      }
    },
    loadTestPoint(name) {
      this.$axios
        .get(`/submission/${this.submissionData.id}/test-point/${name}/`)
        .then(res => {
          console.log(res.data)
        })
    }
  }
}
</script>

<style lang="scss" scoped></style>
