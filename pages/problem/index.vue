<template>
  <div>
    <v-breadcrumbs :items='breadCrumbs' />
    <v-row>
      <v-col cols='12' md='8'>
        <v-data-table
          :headers='headers'
          :items='problems'
          item-key='id'
          :items-per-page='10'
          :options.sync='options'
          :server-items-length='count'
          :loading='loading'
          mobile-breakpoint='0'
          multi-sort
          @click:row='showDetail'
        >
          <template #item.ac_rate='{ item }'>
            <v-progress-linear
              :value='item.ac_count / item.submit_count * 100'
              color='teal lighten-2'
              height='25'
              striped
              rounded
            >
              {{ item.ac_count }} / {{ item.submit_count }}
            </v-progress-linear>
          </template>
        </v-data-table>
      </v-col>
    </v-row>
  </div>
</template>

<script>

const throttle = (function() {
  let timer = 0
  return (callback) => {
    clearTimeout(timer)
    timer = setTimeout(callback, 500)
  }
})()

export default {
  name: 'ProblemIndexPage',
  data() {
    return {
      problems: [],
      loading: false,
      count: 0,
      search: '',
      options: {}
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
        { text: 'ID', value: 'id', width: '20%' },
        { text: this.$t('problems.title'), value: 'title', width: '50%' },
        { text: this.$t('problems.acRate'), value: 'ac_rate', width: '30%', sortable: false }
      ]
    }
  },
  watch: {
    options: {
      handler() {
        this.loadData()
      },
      deep: true
    },
    search() {
      throttle(this.loadData)
    }
  },
  mounted() {
    this.loadData()
  },
  methods: {
    showDetail(item) {
      this.$router.push({
        path: `/problem/${item.id}`
      })
    },
    loadData() {
      const limit = this.options.itemsPerPage
      const offset = (this.options.page - 1) * this.options.itemsPerPage
      const ordering = []
      this.options.sortBy.forEach((value, index) => {
        const desc = this.options.sortDesc[index] ? '-' : ''
        ordering.push(desc + value)
      })
      this.loading = true
      this.$axios.get('/problem/', {
        params: {
          limit,
          offset,
          ordering: ordering.join(','),
          search: this.search
        }
      }).then(res => {
        this.count = res.count
        this.problems = res.results
      }).catch(err => {
        this.$swal('题目加载失败', err, 'error')
      }).finally(() => {
        this.loading = false
      })
    }
  }
}
</script>
