<template>
  <div>
    <v-row>
      <v-col cols="12">
        <v-card>
          <v-toolbar flat color="primary" dark dense>
            <v-toolbar-title v-text="'判题模式'" />
          </v-toolbar>
          <v-card flat>
            <v-card-text>
              <v-row>
                <v-col class="py-0">
                  <v-radio-group v-model="data.use_subcheck" row dense>
                    <v-radio :value="false">
                      <template #label> 标准运行</template>
                    </v-radio>
                    <v-radio :value="true">
                      <template #label> 子评测</template>
                    </v-radio>
                  </v-radio-group>
                </v-col>
                <v-col cols="auto" class="py-0">
                  <v-divider class="mx-4" vertical></v-divider>
                </v-col>
                <v-col class="py-0">
                  <v-radio-group v-model="data.use_spj" row dense>
                    <v-radio :value="false">
                      <template #label> 标准比较</template>
                    </v-radio>
                    <v-radio :value="true">
                      <template #label> 特殊裁决</template>
                    </v-radio>
                  </v-radio-group>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-card>
      </v-col>
      <v-col v-if="!data.is_spj" cols="12">
        <v-card>
          <v-toolbar flat color="primary" dark dense>
            <v-toolbar-title v-text="'评测数据'" />
          </v-toolbar>
          <v-card flat>
            <v-card-text>
              <v-row>
                <v-col cols="12">
                  <v-file-input
                    show-size
                    dense
                    outlined
                    hide-details
                    accept="application/zip"
                    :placeholder="'上传文件'"
                    @change="loadZip"
                  />
                </v-col>
                <v-row dense>
                  <v-col
                    v-for="(item, index) in data.test_case_config"
                    :key="item.name"
                    cols="6"
                    sm="4"
                    md="3"
                  >
                    <v-list-item>
                      <v-list-item-content>
                        <v-list-item-title v-text="item.name" />
                      </v-list-item-content>
                      <v-list-item-action>
                        <v-list-item-action-text>
                          <v-row>
                            <span
                              v-if="
                                scoreEditing !== item.name && item.score >= 0
                              "
                              v-text="
                                $t('problemData.score', { score: item.score })
                              "
                            />
                            <v-text-field
                              v-else
                              :value="item.score"
                              single-line
                              hide-details
                              hide-spin-buttons
                              solo
                              dense
                              type="number"
                              min="0"
                              class="score-editor"
                              @input="updateScore($event, item)"
                            />
                            <v-btn
                              x-small
                              icon
                              class="ml-1"
                              plain
                              :disabled="item.score < 0"
                              @click="toggleScoreEditing(item.name)"
                            >
                              <v-icon>
                                <template v-if="scoreEditing !== item.name">
                                  mdi-pencil
                                </template>
                                <template v-else> mdi-check-bold</template>
                              </v-icon>
                            </v-btn>
                            <v-menu offset-y open-on-hover>
                              <template #activator="{ on, attrs }">
                                <v-btn
                                  x-small
                                  icon
                                  plain
                                  v-bind="attrs"
                                  v-on="on"
                                >
                                  <v-icon>mdi-eye</v-icon>
                                </v-btn>
                              </template>
                              <v-list dense>
                                <v-list-item @click="viewCase(item, 'in')">
                                  <v-list-item-content>in</v-list-item-content>
                                </v-list-item>
                                <v-list-item @click="viewCase(item, 'ans')">
                                  <v-list-item-content>ans</v-list-item-content>
                                </v-list-item>
                              </v-list>
                            </v-menu>
                            <v-menu offset-y open-on-hover>
                              <template #activator="{ on, attrs }">
                                <v-btn
                                  x-small
                                  icon
                                  plain
                                  v-bind="attrs"
                                  v-on="on"
                                >
                                  <v-icon>mdi-download</v-icon>
                                </v-btn>
                              </template>
                              <v-list dense>
                                <v-list-item @click="downloadCase(item, 'in')">
                                  <v-list-item-content>in</v-list-item-content>
                                </v-list-item>
                                <v-list-item @click="downloadCase(item, 'ans')">
                                  <v-list-item-content>ans</v-list-item-content>
                                </v-list-item>
                              </v-list>
                            </v-menu>
                            <v-btn
                              x-small
                              icon
                              plain
                              @click="deleteCase(item, index)"
                            >
                              <v-icon>mdi-delete</v-icon>
                            </v-btn>
                          </v-row>
                        </v-list-item-action-text>
                      </v-list-item-action>
                    </v-list-item>
                  </v-col>
                  <v-col
                    v-if="currentTotalScore !== 100"
                    cols="12"
                    class="px-5"
                  >
                    <v-alert dense outlined type="error">
                      请确保总分数为 <b>100</b> 分 ！当前为
                      <b>{{ currentTotalScore }}</b> 分
                    </v-alert>
                  </v-col>
                </v-row>
              </v-row>
            </v-card-text>
          </v-card>
        </v-card>
      </v-col>
    </v-row>
    <v-row class="justify-center">
      <v-col cols="4" md="2">
        <v-btn
          color="primary"
          block
          :disabled="currentTotalScore !== 100"
          @click="saveData"
        >
          <v-icon left> mdi-content-save-all</v-icon>
          {{ $t('save') }}
        </v-btn>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import JSZip from 'jszip'

export default {
  name: 'ProblemDataEditPage',
  validate({ params }) {
    return /^\d+$/.test(params.id)
  },
  data() {
    return {
      problem_id: null,
      data: {},
      newCases: {},
      deleteCases: [],
      scoreEditing: null,
      cleanedZipBlob: null
    }
  },
  computed: {
    currentTotalScore() {
      return (
        this.data.test_case_config &&
        this.data.test_case_config
          .map(v => v.score)
          .reduce((previous, current) => {
            return parseInt(previous) + parseInt(current)
          }, 0)
      )
    }
  },
  mounted() {
    this.problem_id = this.$route.params.id
    this.loadData()
  },
  methods: {
    async loadData() {
      await this.$store.dispatch('startLoading')
      const res = await this.$axios.get(`/problem/data/${this.problem_id}/`)
      this.data = res.data
      await this.$store.dispatch('stopLoading')
    },
    async loadZip(file) {
      if (!file) return
      const zip = await JSZip.loadAsync(file)
      const cmp = (a, b) => a.name - b.name
      const inputs = zip.file(/^[^/]+\.in$/i).sort(cmp)
      const outputs = zip.file(/^[^/]+\.(out|ans)$/i).sort(cmp)
      const inputNames = inputs.map(
        v => v.name.match(/^(?<n>[^/]+)\.in$/i).groups.n
      )
      const outputNames = outputs.map(
        v => v.name.match(/^(?<n>[^/]+)\.(out|ans)$/i).groups.n
      )
      const data = []
      const currentData = this.data.test_case_config.map(v => v.name)
      for (const v of inputNames) {
        const idx = inputNames.indexOf(v)
        const pos = outputNames.indexOf(v)
        if (pos >= 0) {
          if (currentData.includes(v)) {
            this.$swal(
              '加载失败',
              '上传的文件中存在与原测试数据同名文件，请修正后再次上传！',
              'error'
            )
            return
          }
          data.push(v)
          this.$set(this.newCases, v, {
            input: inputs[idx].async('arraybuffer'),
            ans: outputs[pos].async('arraybuffer')
          })
        }
      }
      data.forEach(e => {
        this.data.test_case_config.push({
          name: e,
          score: 0
        })
      })
      this.calculateScore()
      this.data.test_case_config = this.data.test_case_config.sort(cmp)
    },
    async saveData() {
      const cleanedZip = new JSZip()
      for (const i in this.newCases) {
        cleanedZip.file(`${i}.in`, this.newCases[i].input)
        cleanedZip.file(`${i}.ans`, this.newCases[i].ans)
      }
      this.cleanedZipBlob = await cleanedZip.generateAsync({ type: 'blob' })
      const formData = new FormData()
      this.data.test_case_config = this.data.test_case_config.map(
        v => (v.score = parseInt(v.score)) && v
      )
      Object.keys(this.data).forEach(key => {
        const value = this.data[key]
        if (typeof value === 'object' && value !== null)
          formData.append(key, JSON.stringify(value))
        else formData.append(key, value)
      })
      formData.append('test_cases', this.cleanedZipBlob)
      formData.append('spj_source', null)
      formData.append('delete_cases', JSON.stringify(this.deleteCases))
      this.$axios
        .put(`/problem/data/${this.problem_id}/`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        })
        .then(res => {
          this.data = res.data
          this.newCases = []
          this.deleteCases = []
          this.$swal(this.$t('saveSuccess'), '', 'success')
        })
        .catch(err => {
          if (typeof err === 'string')
            this.$swal(this.$t('saveFailed'), err, 'error')
        })
    },
    updateScore(value, item) {
      item.score = parseInt(value)
    },
    async fetchCaseFile(fileName) {
      const res = await this.$axios.get(`/problem/${this.problem_id}/data/`, {
        params: {
          mode: 'fetch',
          file: fileName
        },
        responseType: 'blob'
      })
      return res.data
    },
    async viewCase(item, type) {
      const file = await this.fetchCaseFile(`${item.name}.${type}`)
      const reader = new FileReader()
      reader.onloadend = () => {
        const display = window.open('', '')
        display.document.title = 'Data View'
        display.document.write(String(reader.result))
      }
      reader.readAsText(file.data)
    },
    downloadCase(item, type) {
      this.$axios.get(`/problem/${this.problem_id}/data/`, {
        params: {
          mode: 'fetch',
          file: `${item.name}.${type}`
        }
      })
    },
    deleteCase(item, index) {
      this.data.test_case_config.splice(index, 1)
      if (Object.keys(this.newCases).includes(item.name))
        delete this.newCases[item.name]
      else this.deleteCases.push(item.name)
    },
    toggleScoreEditing(name) {
      if (this.scoreEditing === name) this.scoreEditing = null
      else this.scoreEditing = name
    },
    calculateScore() {
      const score = parseInt(100 / this.data.test_case_config.length)
      this.data.test_case_config = this.data.test_case_config.map(
        v => (v.score = score) && v
      )
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep .score-editor {
  width: 52px;
  font-size: 0.75rem;

  > div {
    min-height: 20px !important;
    height: 20px !important;
  }
}
</style>
