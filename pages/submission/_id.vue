<template>
  <v-row class="mt-3">
    <v-col cols="12" md="8">
      <v-tabs v-model="tab">
        <v-tab v-if="!submission.pending && !submission.ce_se"
        >测试点信息
        </v-tab
        >
        <!-- TODO: i18n -->
        <v-tab v-if="!submission.pending && submission.log">编译信息</v-tab>
        <v-tab>源代码</v-tab>
      </v-tabs>

      <v-tabs-items v-model="tab" class="mt-3">
        <v-tab-item v-if="!submission.pending && !submission.ce_se">
          <v-card flat>
            <v-item-group v-model="testPointIndex">
              <div class="d-flex flex-wrap">
                <v-item
                  v-for="(item, index) in submission.detail"
                  :key="item.case_name"
                  v-slot="{ active, toggle }"> <!-- active slot -->
                  <v-alert
                    :color="$utils.codeJudge.judgeStatus.getColorClass(item.status)"
                    class="d-flex align-center justify-center ma-2 pa-0"
                    style="cursor: pointer"
                    :outlined="!active"
                    :dark="active"
                    width="100"
                    height="100"
                    @click="toggle"
                  >
                    <span class="id">#{{ index + 1 }}</span>
                    <div
                      class="text-h5 mt-4 text-center"
                      v-text="$utils.codeJudge.judgeStatus.getDisplay(item.status)"
                    />
                    <div class="mt-2" style="font-size: .45em">
                      {{ item.statistics.time }}ms/{{ $utils.misc.parseSize(item.statistics.memory) }}
                    </div>
                  </v-alert>
                </v-item>
              </div>
            </v-item-group>
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
    <v-col cols="12" md="3"></v-col>
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
      testPointIndex: undefined,
      ws: undefined
    }
  },
  async fetch() {
    await this.loadData()
    if (
      [
        this.$utils.codeJudge.judgeStatus.PENDING,
        this.$utils.codeJudge.judgeStatus.JUDGING
      ].includes(this.submissionData.status)
    )
      this.initWebSocket()
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
  watch: {
    testPointIndex: {
      async handler(value) {
        if (value === undefined) return
        const data = await this.loadTestPoint(this.submissionData.detail[value].case_name)
        console.log(data)
      },
      immediate: true
    }
  },
  created() {
    this.submissionData = { id: this.$route.params.id }
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
      return this.$axios
        .get(`/submission/${this.submissionData.id}/test-point/${name}/`)
        .then(res => res.data)
    }
  }
}
</script>

<style lang="scss" scoped>
.id {
  position: absolute;
  top: 0;
  left: 0;
  padding: 6px;
  font-size: .65em;
}
</style>
