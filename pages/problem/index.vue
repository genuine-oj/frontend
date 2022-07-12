<template>
  <div>
    <v-breadcrumbs :items="breadCrumbs" />
    <v-row>
      <v-col cols="12" md="9">
        <v-data-table
          :headers="headers"
          :items="problems"
          item-key="id"
          :items-per-page="10"
          :options.sync="options"
          :server-items-length="count"
          :loading="loading"
          mobile-breakpoint="0"
          multi-sort
        >
          <template #header.difficulty="{ header }">
            {{ header.text }}
            <v-tooltip bottom>
              <template #activator="{ on, attrs }">
                <v-btn
                  icon
                  x-small
                  v-bind="attrs"
                  v-on="on"
                  @click="switchHeader"
                >
                  <v-icon> mdi-swap-horizontal</v-icon>
                </v-btn>
              </template>
              <span v-text="$t('problems.showTags')" />
            </v-tooltip>
          </template>
          <template #header.tags="{ header }">
            {{ header.text }}
            <v-tooltip bottom>
              <template #activator="{ on, attrs }">
                <v-btn
                  icon
                  x-small
                  v-bind="attrs"
                  v-on="on"
                  @click="switchHeader"
                >
                  <v-icon> mdi-swap-horizontal</v-icon>
                </v-btn>
              </template>
              <span v-text="$t('problems.showDifficulty')" />
            </v-tooltip>
          </template>
          <template #item.title="{ item }">
            <nuxt-link
              :to="{ name: 'problem-id', params: { id: item.id } }"
              no-prefetch
              v-text="item.title"
            />
          </template>
          <template #item.difficulty="{ item }">
            {{ difficultyMap[item.difficulty] }}
          </template>
          <template #item.tags="{ item }">
            <v-chip
              v-for="(tag, index) in item.tags"
              :key="index"
              class="ma-1"
              small
              v-text="tag"
            />
          </template>
          <template #item.ac_rate="{ item }">
            <v-progress-linear
              :value="(item.ac_count / item.submit_count) * 100"
              color="teal lighten-2"
              height="25"
              striped
              rounded
            >
              {{ item.ac_count }} / {{ item.submit_count }}
            </v-progress-linear>
          </template>
        </v-data-table>
      </v-col>
      <v-col cols="12" md="3">
        <v-row class="mx-3">
          <v-col cols="12">
            <v-text-field
              v-model="search"
              solo
              dense
              :label="$t('problems.problemSearch')"
              append-icon="mdi-magnify"
              hide-details
              @click:append="loadData"
            />
          </v-col>
          <v-col cols="12">
            <v-select
              v-model="difficultySelect"
              solo
              dense
              :items="difficulties"
              item-text="text"
              item-value="value"
              :label="$t('problems.difficulty')"
              hide-details
            />
          </v-col>
          <v-col cols="12">
            <v-btn color="primary" block :to="{ name: 'problem-create' }">
              {{ $t('problem.problemCreate') }}
            </v-btn>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </div>
</template>

<script>
export default {
  name: 'ProblemIndexPage',
  data() {
    return {
      problems: [],
      loading: false,
      count: 0,
      search: '',
      options: {},
      switch: false,
      difficultySelect: -1
    }
  },
  meta: {
    title: 'problem.problemDetail'
  },
  head() {
    return {
      title: this.$t('pages.problems')
    }
  },
  computed: {
    breadCrumbs() {
      return [
        {
          text: this.$t('problem.problemList'),
          disabled: true
        }
      ]
    },
    headers() {
      return [
        {
          text: 'ID',
          width: '8%',
          value: 'id'
        },
        {
          text: this.$t('problems.title'),
          value: 'title'
        },
        {
          text: this.$t('problems.difficulty'),
          value: 'difficulty',
          width: '14%',
          switch: false,
          sortable: false
        },
        {
          text: this.$t('problems.tags'),
          value: 'tags',
          width: '18%',
          switch: true,
          sortable: false
        },
        {
          text: this.$t('problems.acRate'),
          value: 'ac_rate',
          width: '20%',
          sortable: false
        }
      ].filter(
        value => value.switch === undefined || value.switch === this.switch
      )
    },
    difficulties() {
      return [
        { text: this.$t('difficulties.ALL'), value: -1 },
        { text: this.$t('difficulties.NOT_ASSIGNED'), value: 0 },
        { text: this.$t('difficulties.PRIMARY'), value: 1 },
        { text: this.$t('difficulties.CSPJ-'), value: 2 },
        { text: this.$t('difficulties.CSPJ_CSPS-'), value: 3 },
        { text: this.$t('difficulties.CSPJ+_CSPS'), value: 4 },
        { text: this.$t('difficulties.CSPS+_PS-'), value: 5 },
        { text: this.$t('difficulties.PS_NOI-'), value: 6 },
        { text: this.$t('difficulties.NOI_NOI+_CTSC'), value: 7 }
      ]
    },
    difficultyMap() {
      const map = {}
      this.difficulties.forEach(e => {
        map[e.value] = e.text
      })
      return map
    }
  },
  watch: {
    options: {
      handler() {
        this.loadData()
      },
      deep: true
    },
    difficultySelect() {
      this.loadData()
    }
  },
  mounted() {
    this.loadData()
  },
  methods: {
    loadData() {
      const limit = this.options.itemsPerPage
      const offset = (this.options.page - 1) * this.options.itemsPerPage
      const ordering = []
      this.options.sortBy.forEach((value, index) => {
        const desc = this.options.sortDesc[index] ? '-' : ''
        ordering.push(desc + value)
      })
      this.loading = true
      this.$axios
        .get('/problem/', {
          params: {
            limit,
            offset,
            difficulty:
              this.difficultySelect !== -1 ? this.difficultySelect : '',
            ordering: ordering.join(','),
            search: this.search
          }
        })
        .then(res => {
          this.count = res.data.count
          this.problems = res.data.results
        })
        .catch(err => {
          this.$swal(this.$t('failed'), err, 'error')
        })
        .finally(() => {
          this.loading = false
        })
    },
    switchHeader() {
      this.switch = !this.switch
    }
  }
}
</script>
