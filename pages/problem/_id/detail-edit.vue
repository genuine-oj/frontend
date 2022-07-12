<template>
  <div>
    <v-row>
      <v-col cols="12">
        <v-text-field
          v-model="problem.title"
          :placeholder="$t('problem.problemTitle')"
          :error-messages="errors.title"
          hide-details
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
        <v-card outlined>
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
      <v-col cols="12">
        <v-card>
          <v-toolbar flat color="primary" dark dense>
            <v-toolbar-title v-text="$t('problem.tags')" />
          </v-toolbar>
          <multiselect
            v-model="problem.tags"
            :options="tags"
            :tag-placeholder="$t('problem.tagPlaceHolder')"
            :select-label="$t('problem.tagSelectLabel')"
            :selected-label="$t('problem.tagSelected')"
            :deselect-label="$t('problem.tagRemoveLabel')"
            :placeholder="$t('problem.tagsPlaceHolder')"
            :multiple="true"
            :taggable="true"
            @tag="addTag"
          />
          <v-alert
            v-if="errors.tags"
            dense
            text
            type="error"
            class="rounded-0"
            v-text="errors.tags"
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
import Multiselect from 'vue-multiselect'
import 'vue-multiselect/dist/vue-multiselect.min.css'

import MdEditor from '~/components/md-editor'

export default {
  name: 'ProblemDetailEditPage',
  components: {
    MdEditor,
    Multiselect
  },
  validate({ params }) {
    if (this.mode === 'create') return true
    return /^\d+$/.test(params.id)
  },
  props: {
    mode: {
      type: String,
      default: 'edit'
    }
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
        ],
        tags: []
      },
      errors: {},
      tags: []
    }
  },
  mounted() {
    if (this.mode === 'edit') {
      this.problem.id = this.$route.params.id
      this.loadData()
    }
    this.loadTags()
  },
  methods: {
    async loadData() {
      await this.$store.dispatch('startLoading')
      const res = await this.$axios.get(`/problem/${this.problem.id}/`)
      this.problem = res.data
      await this.$store.dispatch('stopLoading')
    },
    saveData() {
      let res
      if (this.mode === 'create') {
        res = this.$axios.post(`/problem/`, this.problem)
      } else if (this.mode === 'edit') {
        res = this.$axios.put(`/problem/${this.problem.id}/`, this.problem)
      }
      res
        .then(res => {
          this.problem = res.data
          this.$swal(this.$t('success'), '', 'success')
        })
        .catch(err => {
          if (typeof err === 'string')
            this.$swal(this.$t('failed'), err, 'error')
          else this.errors = err
        })
    },
    loadTags() {
      this.$axios.get('/problem/tag/').then(res => {
        this.tags = res.data.map(v => v.name)
      })
    },
    addTag(value) {
      this.problem.tags.push(value)
    }
  }
}
</script>

<style lang="scss" scoped>
:deep(.bytemd) {
  height: 450px;
}

:deep(.multiselect__tags) {
  border-radius: 0;
}

.mono-space {
  font-family: Consolas, Monaco, Lucida Console, Liberation Mono, monospace;
}
</style>
