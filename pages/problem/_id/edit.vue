<template>
  <div>
    <v-breadcrumbs :items='breadCrumbs' />
    <v-row>
      <v-col>
        <h4 class='text-h4' v-text='$t("problem.problemEdit")' />
      </v-col>
    </v-row>
    <v-row>
      <v-col cols='12'>
        <v-text-field
          v-model='problem.title'
          outlined
          hide-details
        />
      </v-col>
    </v-row>
    <v-row>
      <v-col cols='12'>
        <v-card>
          <v-toolbar
            flat
            color='primary'
            dark
            dense
          >
            <v-toolbar-title v-text='$t("problem.problemDescription")' />
          </v-toolbar>
          <md-editor v-model='problem.description' mode='editpreview' />
        </v-card>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols='12'>
        <v-card>
          <v-toolbar
            flat
            color='primary'
            dark
            dense
          >
            <v-toolbar-title v-text='$t("problem.inputFormat")' />
          </v-toolbar>
          <md-editor v-model='problem.input_format' />
        </v-card>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols='12'>
        <v-card>
          <v-toolbar
            flat
            color='primary'
            dark
            dense
          >
            <v-toolbar-title v-text='$t("problem.outputFormat")' />
          </v-toolbar>
          <md-editor v-model='problem.output_format' />
        </v-card>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols='12'>
        <v-card>
          <v-toolbar
            flat
            color='primary'
            dark
            dense
          >
            <v-toolbar-title v-text='$t("problem.samples")' />
          </v-toolbar>
          <v-tabs vertical>
            <v-tab
              v-for='sample in problem.samples'
              :key='sample.index'
              v-text='`#${sample.index}`'
            />
            <v-tab-item
              v-for='sample in problem.samples'
              :key='sample.index'
            >
              <v-card flat>
                <v-card-text>
                  <v-row>
                    <v-col cols='12' md='6'>
                      <h6 class='text-h6' v-text='$t("problem.input", { id: sample.index })' />
                      <v-textarea
                        v-model='sample.input'
                        class='mono-space'
                        outlined
                      />
                    </v-col>
                    <v-col cols='12' md='6'>
                      <h6 class='text-h6' v-text='$t("problem.output", { id: sample.index })' />
                      <v-textarea
                        v-model='sample.output'
                        class='mono-space'
                        outlined
                      />
                    </v-col>
                  </v-row>
                </v-card-text>
              </v-card>
            </v-tab-item>
          </v-tabs>
        </v-card>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols='12'>
        <v-card>
          <v-toolbar
            flat
            color='primary'
            dark
            dense
          >
            <v-toolbar-title v-text='$t("problem.hint")' />
          </v-toolbar>
          <md-editor v-model='problem.hint' />
        </v-card>
      </v-col>
    </v-row>
    <v-row class='justify-center'>
      <v-col cols='4' md='2'>
        <v-btn color='primary' block @click='saveData'>
          <v-icon left>
            mdi-content-save-all
          </v-icon>
          {{ $t('save') }}
        </v-btn>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import MdEditor from '~/components/md-editor'

export default {
  name: 'ProblemEditPage',
  components: {
    MdEditor
  },
  validate({ params }) {
    return /^\d+$/.test(params.id)
  },
  data() {
    return {
      problem: {}
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
          to: `/problem/${this.problem.id}`,
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
  mounted() {
    this.problem = { id: this.$route.params.id }
    this.loadData()
  },
  methods: {
    async loadData() {
      await this.$store.dispatch('startLoading')
      this.problem = await this.$axios.get(`/problem/${this.problem.id}/`)
      await this.$store.dispatch('stopLoading')
    },
    saveData() {
      this.$axios.put(`/problem/${this.problem.id}/`, this.problem).then(res => {
        this.problem = res
        this.$swal(this.$t('problemEdit.saveSuccess'), '', 'success')
      }).catch(err => {
        if (typeof (err) === 'string') this.$swal(this.$t('problemEdit.saveFailed'), err, 'error')
      })
    }
  }
}
</script>

<style lang='scss' scoped>
.v-md-editor {
  height: 350px;
}

.mono-space {
  font-family: Consolas, Monaco, Lucida Console, Liberation Mono, monospace;
}
</style>
