<template>
  <div>
    <v-breadcrumbs :items="breadCrumbs" />
    <v-row>
      <v-col cols="12" md="8" lg="9">
        <template v-if="!showCode">
          <h2 class="text-h4" v-text="problem.title" />
          <h4
            class="text-h5 mt-1 mb-2"
            v-text="$t('problem.problemDescription')"
          />
          <md-viewer :value="problem.description" />
          <h4 class="text-h5 my-2" v-text="$t('problem.inputFormat')" />
          <md-viewer :value="problem.input_format" />
          <h4 class="text-h5 my-2" v-text="$t('problem.outputFormat')" />
          <md-viewer :value="problem.output_format" />
          <h4 class="text-h5 my-2" v-text="$t('problem.samples')" />
          <v-row v-for="sample in filteredSamples" :key="sample.index" dense>
            <v-col cols="6">
              <h5
                class="text-h6"
                v-text="$t('problem.input', { id: sample.index })"
              />
              <code v-text="sample.input" />
            </v-col>
            <v-col cols="6">
              <h5
                class="text-h6"
                v-text="$t('problem.output', { id: sample.index })"
              />
              <code v-text="sample.output" />
            </v-col>
          </v-row>
          <template v-if="problem.hint">
            <h4 class="text-h5 my-2" v-text="$t('problem.hint')" />
            <md-viewer :value="problem.hint" />
          </template>
        </template>
        <div v-else :class="$vuetify.breakpoint.mdAndUp ? 'mr-5' : ''">
          <v-row>
            <v-col cols="7" md="5">
              <v-select
                v-model="selectedLanguage"
                :items="languages"
                item-text="name"
                item-value="slug"
                :label="$t('problem.selectLanguage')"
                return-object
                dense
                outlined
                hide-details
              ></v-select>
            </v-col>
            <v-col cols="auto" md="auto" class="d-none d-md-block d-lg-block">
              <v-btn color="primary" block @click="uploadCodeFile">
                <v-icon left> mdi-file</v-icon>
                {{ $t('problem.loadCodeFile') }}
              </v-btn>
              <input
                ref="codeFileInput"
                type="file"
                class="d-none"
                :accept="`.${selectedLanguage.ext}`"
                @change="readCodeFile"
              />
            </v-col>
            <v-col cols="5" md="auto">
              <v-btn color="success" block @click="submitCode">
                <v-icon left> mdi-upload</v-icon>
                {{ $t('problem.submitCode') }}
              </v-btn>
            </v-col>
          </v-row>
          <v-row>
            <v-col class="elevation-2 rounded">
              <codemirror
                ref="codemirror"
                v-model="code"
                :language="selectedLanguage.slug"
              />
            </v-col>
          </v-row>
        </div>
      </v-col>
      <v-col cols="12" md="4" lg="3" class="text-center">
        <v-row class="mx-3 spaced" dense>
          <v-col cols="12" @click="showCode = !showCode">
            <v-btn v-if="!showCode" color="primary" block>
              <v-icon left> mdi-xml</v-icon>
              {{ $t('problem.editCode') }}
            </v-btn>
            <v-btn v-else color="primary" block outlined>
              <v-icon left> mdi-text</v-icon>
              {{ $t('problem.showProblem') }}
            </v-btn>
          </v-col>
          <template v-if="!showCode && isAdmin">
            <v-col cols="12">
              <v-btn
                color="indigo"
                :to="{ name: 'problem-id-edit', params: { id: problem.id } }"
                exact
                dark
                block
              >
                <v-icon left> mdi-pencil</v-icon>
                {{ $t('problem.problemEdit') }}
              </v-btn>
            </v-col>
          </template>
          <v-col cols="12">
            <v-row dense>
              <v-col cols="12">
                <v-chip
                  class="mr-2"
                  color="pink"
                  dark
                  :title="$t('problem.timeLimit')"
                >
                  <v-icon left> mdi-clock</v-icon>
                  {{ problem.time_limit / 1000 }}s
                </v-chip>
                <v-chip
                  color="light-blue"
                  dark
                  :title="$t('problem.memoryLimit')"
                >
                  <v-icon left> mdi-memory</v-icon>
                  {{ problem.memory_limit }}MB
                </v-chip>
              </v-col>
              <v-col cols="12">
                <v-chip
                  class="mr-2"
                  color="green"
                  dark
                  :title="$t('problem.acceptedNumber')"
                >
                  <v-icon left> mdi-flag</v-icon>
                  1222
                </v-chip>
                <v-chip
                  color="purple lighten-1"
                  dark
                  :title="$t('problem.submittedNumber')"
                >
                  <v-icon left> mdi-upload</v-icon>
                  2000
                </v-chip>
              </v-col>
            </v-row>
          </v-col>
          <v-col cols="12">
            <v-btn color="primary" text>
              <v-icon left> mdi-file-multiple-outline</v-icon>
              {{ $t('problem.mySubmissions') }}
            </v-btn>
          </v-col>
          <v-col cols="12">
            <v-card>
              <v-list subheader dense class="text-left">
                <v-subheader v-text="'最近提交'" />
                <v-list-item v-for="item in recentSubmissions" :key="item.id">
                  <v-list-item-avatar>
                    <v-img :src="$utils.misc.avatar.get(item.email)" />
                  </v-list-item-avatar>
                  <v-list-item-content>
                    <v-list-item-title v-text="item.username" />
                    <v-list-item-subtitle v-text="item.status" />
                  </v-list-item-content>
                  <v-list-item-action>
                    <v-list-item-action-text v-text="item.time" />
                  </v-list-item-action>
                </v-list-item>
              </v-list>
            </v-card>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Codemirror from '~/components/codemirror'
import MdViewer from '~/components/md-viewer'

export default {
  name: 'ProblemPage',
  components: {
    Codemirror,
    MdViewer
  },
  validate({ params }) {
    return /^\d+$/.test(params.id)
  },
  meta: {
    title: 'problem.problemDetail'
  },
  data() {
    return {
      problem: {},
      showCode: false,
      languages: [
        { name: 'C', slug: 'c', ext: 'c' },
        { name: 'C++', slug: 'cpp', ext: 'cpp' }
      ],
      selectedLanguage: undefined,
      code: '',
      recentSubmissions: [
        {
          id: 1,
          username: '用户1',
          email: 'zhongtian.yang@qq.com',
          status: 'AC',
          time: '五分钟前'
        },
        {
          id: 2,
          username: '用户2',
          email: '1417269626@qq.com',
          status: 'WA',
          time: '八分钟前'
        }
      ]
    }
  },
  async fetch() {
    await this.loadData()
  },
  head() {
    return {
      title: this.title
    }
  },
  computed: {
    ...mapGetters(['isAdmin']),
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
          disabled: true
        }
      ]
    },
    filteredSamples() {
      return (
        this.problem.samples &&
        this.problem.samples.filter(v => {
          return Boolean(v.input && v.output)
        })
      )
    }
  },
  created() {
    this.selectedLanguage = this.languages[1]
    this.problem = { id: this.$route.params.id }
  },
  methods: {
    async loadData() {
      await this.$store.dispatch('startLoading')
      const res = await this.$axios.get(`/problem/${this.problem.id}/`)
      this.problem = res.data
      await this.$store.dispatch('stopLoading')
    },
    uploadCodeFile() {
      this.$refs.codeFileInput.click()
    },
    readCodeFile() {
      const fileInput = this.$refs.codeFileInput
      const file = fileInput.files[0]
      const reader = new FileReader()
      reader.onloadend = async () => {
        if (this.code !== '') {
          const result = await this.$swal.fire({
            text: this.$t('problem.codeReplacementConfirm'),
            icon: 'question',
            showConfirmButton: true,
            showCancelButton: true,
            confirmButtonText: this.$t('confirm'),
            cancelButtonText: this.$t('cancel')
          })
          if (result.isDismissed) {
            fileInput.value = ''
            return
          }
        }
        this.code = reader.result
        fileInput.value = ''
      }
      // noinspection JSCheckFunctionSignatures
      reader.readAsText(file)
    },
    submitCode() {
      this.$axios
        .post('/submission/', {
          problem_id: this.problem.id,
          source: this.code,
          language: this.selectedLanguage.slug
        })
        .then(res => {
          this.$router.push({
            name: 'submission-id',
            params: { id: res.data.id }
          })
        })
    }
  }
}
</script>
<style lang="scss" scoped>
:deep(.CodeMirror) {
  height: 500px;
}

.spaced > * {
  margin-bottom: 6px;
}

code {
  display: inline-block;
  width: 100%;
  font-family: Consolas, Monaco, Lucida Console, Liberation Mono, monospace;
  white-space: pre-line;
}
</style>
