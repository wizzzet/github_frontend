<template lang="pug">
q-table.full-width.no-shadow.data-table(
  square
  :data="rows"
  :columns="columns"
  :loading="loading"
  row-key="id"
  :pagination.sync="pagination"
  @request="getData"
)
  template(v-slot:body="props")
    q-tr.non-selectable(
      :props="props"
    )
      q-td(
        v-for="col in props.cols"
        :key="col.name"
        :props="props"
      )
        router-link.link(
          v-if="['id', 'name'].indexOf(col.name) >= 0"
          :to="{ name: 'repo-card', params: { id: user, repoId: props.row.name } }"
        )
          span {{ col.value }}

        .row.no-wrap(v-else-if="col.name === 'html_url'")
          a.link(
            :href="col.value"
            target="_blank"
          ) {{ col.value }}

        p.descr(v-else-if="col.name === 'description'") {{ col.value }}

        span(v-else) {{ col.value }}

  template(v-slot:bottom)
    .flex.justify-center.full-width
      q-btn.self-center.q-mx-md.q-mt-md(
        color="primary"
        size="md"
        :disabled="pagination.page <= 1"
        @click.native="pagination.page -= 1"
      ) Предыдущая
      q-btn.self-center.q-mx-md.q-mt-md(
        color="primary"
        size="md"
        :disabled="rows && rows.length < DEFAULT_PER_PAGE"
        @click.native="pagination.page += 1"
      ) Следующая

  template(v-slot:no-data="{ icon, message, filter }")
    .full-width.row.flex-center.text-accent.q-gutter-sm
      .text-grey-9 {{ message }}
</template>

<script>
import {
  DEFAULT_PER_PAGE, DEFAULT_SORT_BY, DEFAULT_SORT_DESC, PER_PAGE, tablePageMixin
} from '../../../../mixins/table-page'
import columns from './columns'
import API from '../../../../api'
import { Alert } from '../../../../utils/alert'
import { getErrorText } from '../../../../utils/response'

export default {
  name: 'PersonReposTable',

  data () {
    return {
      DEFAULT_PER_PAGE,
      columns: columns.slice(),
      loading: true,
      pagination: {
        sortBy: DEFAULT_SORT_BY,
        descending: DEFAULT_SORT_DESC,
        page: 1,
        rowsNumber: 0,
        rowsPerPage: DEFAULT_PER_PAGE
      },
      rows: []
    }
  },

  methods: {
    dumpParams (pagination, filter) {
      pagination = pagination || this.pagination
      filter = filter || this.filter
      let query = {}

      query.page = '' + pagination.page
      query.per_page = '' + (pagination.rowsPerPage || DEFAULT_PER_PAGE)
      query.sort = pagination.sortBy
      query.sort_desc = pagination.descending ? 'true' : 'false'

      if (filter) {
        query.query = filter
      }

      return query
    },

    getData ({ pagination, filter }) {
      this.loading = true
      const vm = this
      const params = this.getDataParams(pagination, filter)

      this.$axios.get(API.github.repos(this.user), { params })
        .then(response => {
          vm.pagination = pagination
          vm.filter = filter
          vm.rows = response.data
          vm.pagination.rowsNumber = 0
        })
        .catch(error => Alert('Error', getErrorText(error, true)))
        .finally(() => { vm.loading = false })
    },

    loadParams (query) {
      query = query || this.$route.query

      if (query.query) {
        this.filter = query.query
      } else {
        this.filter = ''
      }

      if (query.page) {
        const page = parseInt(query.page)
        this.pagination.page = !isNaN(page) ? page : 1
      } else {
        this.pagination.page = 1
      }

      if (query.per_page) {
        const perPage = parseInt(query.per_page)
        this.pagination.rowsPerPage = !isNaN(perPage) && PER_PAGE.indexOf(perPage) !== -1 ? perPage : DEFAULT_PER_PAGE
      } else {
        this.pagination.rowsPerPage = DEFAULT_PER_PAGE
      }

      if (query.sort && columns.map(s => s.name).indexOf(query.sort) !== -1) {
        this.pagination.sortBy = query.sort
      } else {
        this.pagination.sortBy = null
      }
      this.pagination.descending = !!(query.sort_desc && query.sort_desc === 'true')
    },

    refreshData () {
      // update status counts
      this.getData({
        pagination: this.pagination,
        filter: this.filter
      })
    }
  },

  mixins: [tablePageMixin],

  props: {
    user: {
      type: String,
      required: true
    }
  }
}
</script>
