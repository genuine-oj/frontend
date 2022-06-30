<template>
  <div>
    <v-breadcrumbs :items="breadCrumbs" />
    <v-row>
      <v-col>
        <h4 class="text-h4" v-text="$t('problem.problemCreate')" />
      </v-col>
      <v-col cols="12">
        <v-text-field
          v-model="problem.title"
          :placeholder="$t('problem.problemTitle')"
          :error-messages="errors.title"
          outlined
          dense
        />
      </v-col>
      <v-col cols="12" class="pt-0">
        <v-card>
          <v-toolbar flat color="primary" dark dense>
            <v-toolbar-title v-text="$t('problem.problemDescription')" />
          </v-toolbar>
          <md-editor v-model="problem.description" />
          <v-alert
            v-if="errors.description"
            dense
            text
            type="error"
            class="rounded-0"
            v-text="errors.description"
          />
        </v-card>
      </v-col>
      <v-col cols="12">
        <v-card>
          <v-toolbar flat color="primary" dark dense>
            <v-toolbar-title v-text="$t('problem.inputFormat')" />
          </v-toolbar>
          <md-editor v-model="problem.input_format" />
          <v-alert
            v-if="errors.input_format"
            dense
            text
            type="error"
            class="rounded-0"
            v-text="errors.input_format"
          />
        </v-card>
      </v-col>
      <v-col cols="12">
        <v-card>
          <v-toolbar flat color="primary" dark dense>
            <v-toolbar-title v-text="$t('problem.outputFormat')" />
          </v-toolbar>
          <md-editor v-model="problem.output_format" />
          <v-alert
            v-if="errors.output_format"
            dense
            text
            type="error"
            class="rounded-0"
            v-text="errors.output_format"
          />
        </v-card>
      </v-col>
      <v-col cols="12">
        <v-card>
          <v-toolbar flat color="primary" dark dense>
            <v-toolbar-title v-text="$t('problem.samples')" />
          </v-toolbar>
          <v-tabs vertical>
            <v-tab
              v-for="sample in problem.samples"
              :key="sample.index"
              v-text="`#${sample.index}`"
            />
            <v-tab-item v-for="sample in problem.samples" :key="sample.index">
              <v-card flat>
                <v-card-text>
                  <v-row>
                    <v-col cols="12" md="6">
                      <h6
                        class="text-h6"
                        v-text="$t('problem.input', { id: sample.index })"
                      />
                      <v-textarea
                        v-model="sample.input"
                        class="mono-space"
                        outlined
                      />
                    </v-col>
                    <v-col cols="12" md="6">
                      <h6
                        class="text-h6"
                        v-text="$t('problem.output', { id: sample.index })"
                      />
                      <v-textarea
                        v-model="sample.output"
                        class="mono-space"
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
      <v-col cols="12">
        <v-card>
          <v-toolbar flat color="primary" dark dense>
            <v-toolbar-title v-text="$t('problem.hint')" />
          </v-toolbar>
          <md-editor v-model="problem.hint" />
          <v-alert
            v-if="errors.hint"
            dense
            text
            type="error"
            class="rounded-0"
            v-text="errors.hint"
          />
        </v-card>
      </v-col>
    </v-row>
    <v-row class="justify-center">
      <v-col cols="4" md="2">
        <v-btn color="primary" block @click="saveData">
          <v-icon left> mdi-content-save-all</v-icon>
          {{ $t('save') }}
        </v-btn>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import MdEditor from '~/components/md-editor'

export default {
  name: 'ProblemCreatePage',
  components: {
    MdEditor
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
