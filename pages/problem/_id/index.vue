<template>
  <div>
    <v-breadcrumbs :items='breadCrumbs' />
    <v-row>
      <v-col cols='12' md='8' lg='9'>
        <template v-if='!showCode'>
          <h2 class='text-h4 mb-1' v-text='problem.title' />
          <h4 class='text-h5' v-text='$t("problem.problemDescription")' />
          <md-editor :value='problem.description' mode='preview' />
          <h4 class='text-h5' v-text='$t("problem.inputFormat")' />
          <md-editor :value='problem.input_format' mode='preview' />
          <h4 class='text-h5' v-text='$t("problem.outputFormat")' />
          <md-editor :value='problem.output_format' mode='preview' />
          <h4 class='text-h5' v-text='$t("problem.samples")' />
          <v-row v-for='sample in filteredSamples' :key='sample.index'>
            <v-col cols='6'>
              <h5 class='text-h6' v-text='$t("problem.input", { id: sample.index })' />
              <code v-text='sample.input' />
            </v-col>
            <v-col cols='6'>
              <h5 class='text-h6' v-text='$t("problem.output", { id: sample.index })' />
              <code v-text='sample.output' />
            </v-col>
          </v-row>
          <template v-if='problem.hint'>
            <h4 class='text-h5 mt-1' v-text='$t("problem.hint")' />
            <md-editor :value='problem.hint' mode='preview' />
          </template>
        </template>
        <v-row v-else>
          <v-col cols='7' md='auto'>
            <v-select
              v-model='selectedLanguage'
              :items='languages'
              item-text='name'
              item-value='slug'
              :label='$t("problem.selectLanguage")'
              return-object
              dense
              outlined
              hide-details
            ></v-select>
          </v-col>
          <v-col v-if='$vuetify.breakpoint.mdAndUp' md='auto'>
            <v-btn color='primary' block @click='uploadCodeFile'>
              <v-icon left>
                mdi-file
              </v-icon>
              {{ $t('problem.loadCodeFile') }}
            </v-btn>
            <input
              ref='codeFileInput'
              type='file'
              class='d-none'
              :accept='`.${selectedLanguage.ext}`'
              @change='readCodeFile'
            />
          </v-col>
          <v-col cols='5' md='auto'>
            <v-btn color='success' block @click='submitCode'>
              <v-icon left>
                mdi-upload
              </v-icon>
              {{ $t('problem.submitCode') }}
            </v-btn>
          </v-col>
          <v-col cols='12'>
            <codemirror
              ref='codemirror'
              v-model='code'
              :mime='selectedLanguage.mime'
            />
          </v-col>
        </v-row>
      </v-col>
      <v-col cols='12' md='4' lg='3' class='text-center'>
        <v-row class='mx-3 spaced' dense>
          <v-col cols='12' @click='showCode = !showCode'>
            <v-btn v-if='!showCode' color='primary' block>
              <v-icon left>
                mdi-xml
              </v-icon>
              {{ $t('problem.editCode') }}
            </v-btn>
            <v-btn v-else color='primary' block outlined>
              <v-icon left>
                mdi-text
              </v-icon>
              {{ $t('problem.showProblem') }}
            </v-btn>
          </v-col>
          <template v-if='!showCode && isAdmin'>
            <v-col cols='6'>
              <v-btn
                color='indigo'
                :to='`/problem/${problem.id}/edit`'
                exact
                dark
                block
              >
                <v-icon left>
                  mdi-pencil
                </v-icon>
                {{ $t('problem.problemEdit') }}
              </v-btn>
            </v-col>
            <v-col cols='6'>
              <v-btn
                color='blue-grey'
                :to='`/problem/${problem.id}/data`'
                exact
                dark
                block
              >
                <v-icon left>
                  mdi-database-cog
                </v-icon>
                {{ $t('problem.judgeSettings') }}
              </v-btn>
            </v-col>
          </template>
          <v-col cols='12'>
            <v-row dense>
              <v-col cols='12'>
                <v-chip
                  class='mr-2'
                  color='pink'
                  dark
                  :title='$t("problem.timeLimit")'
                >
                  <v-icon left>
                    mdi-clock
                  </v-icon>
                  {{ problem.time_limit / 1000 }}s
                </v-chip>
                <v-chip
                  color='light-blue'
                  dark
                  :title='$t("problem.memoryLimit")'
                >
                  <v-icon left>
                    mdi-memory
                  </v-icon>
                  {{ problem.memory_limit }}MB
                </v-chip>
              </v-col>
              <v-col cols='12'>
                <v-chip
                  class='mr-2'
                  color='green'
                  dark
                  :title='$t("problem.acceptedNumber")'
                >
                  <v-icon left>
                    mdi-flag
                  </v-icon>
                  1222
                </v-chip>
                <v-chip
                  color='purple lighten-1'
                  dark
                  :title='$t("problem.submittedNumber")'
                >
                  <v-icon left>
                    mdi-upload
                  </v-icon>
                  2000
                </v-chip>
              </v-col>
            </v-row>
          </v-col>
          <v-col cols='12'>
            <v-btn color='primary' text>
              <v-icon left>
                mdi-file-multiple-outline
              </v-icon>
              {{ $t('problem.mySubmissions') }}
            </v-btn>
          </v-col>
          <v-col cols='12'>
            <v-card>
              <v-list subheader dense class='text-left'>
                <v-subheader v-text='"最近提交"' />
                <v-list-item
                  v-for='item in recentSubmissions'
                  :key='item.id'
                >
                  <v-list-item-avatar>
                    <v-img :src='$utils.misc.avatar.get(item.email)' />
                  </v-list-item-avatar>
                  <v-list-item-content>
                    <v-list-item-title v-text='item.username' />
                    <v-list-item-subtitle v-text='item.status' />
                  </v-list-item-content>
                  <v-list-item-action>
                    <v-list-item-action-text v-text='item.time' />
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
import MdEditor from '~/components/md-editor'

export default {
  name: 'ProblemPage',
  components: {
    Codemirror,
    MdEditor
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
        { name: 'C', slug: 'c', mime: 'text/x-csrc', ext: 'c' },
        { name: 'C++', slug: 'cpp', mime: 'text/x-c++src', ext: 'cpp' }
      ],
      selectedLanguage: undefined,
      code: '',
      recentSubmissions: [
        { id: 1, username: '用户1', email: 'zhongtian.yang@qq.com', status: 'AC', time: '五分钟前' },
        { id: 2, username: '用户2', email: '1417269626@qq.com', status: 'WA', time: '八分钟前' }
      ]
    }
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
      return this.problem.samples && this.problem.samples.filter(v => {
        return Boolean(v.input && v.output)
      })
    }
  },
  mounted() {
    this.selectedLanguage = this.languages[1]
    this.problem = { id: this.$route.params.id }
    this.loadData()
  },
  methods: {
    async loadData() {
      await this.$store.dispatch('startLoading')
      this.problem = await this.$axios.get(`/problem/${this.problem.id}/`)
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
      reader.readAsText(file)
    },
    submitCode() {
      this.$axios.post('/submission/', {
        problem_id: this.problem.id,
        source: this.code,
        language: this.selectedLanguage.slug
      })
    }
  }
}
</script>
<style lang='scss' scoped>
::v-deep .CodeMirror {
  height: 500px;
}

::v-deep .vuepress-markdown-body {
  padding: 0 !important;
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