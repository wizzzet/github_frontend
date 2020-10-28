<template lang="pug">
  .page.row.wrap.items-start
    .row.page-toolbar
      .col-shrink
        h1.page-toolbar__title {{ title }}

    .page-contents
      .row
        .col
          q-table.full-width.no-shadow.data-table(
            square
            :data="rows"
            :columns="columns"
            :filter="filter"
            :loading="loading"
            row-key="id"
            :pagination.sync="pagination"
            @request="getData"
          )
            template(v-slot:top-left)
              .row.full-width.q-mb-md
                q-input.data-table__search-input(
                  outlined stack-label dense
                  debounce="500"
                  v-model="filter"
                  name="filter"
                  placeholder="Поиск по логину"
                )
                  template(v-slot:prepend)
                    q-icon.data-table__search-icon(v-if="!filter" name="ion-search")
                    q-icon.cursor-pointer(v-else name="ion-ios-close" @click="filter = ''")

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
                    v-if="['id', 'login'].indexOf(col.name) >= 0"
                    :to="{ name: 'user-card', params: { id: props.row.login } }"
                  )
                    span {{ col.value }}

                  .row.items-center.no-wrap(v-else-if="col.name === 'avatar_url'")
                    router-link.link(
                      :to="{ name: 'user-card', params: { id: props.row.login } }"
                    )
                      img.avatar(
                        :src="col.value || '~assets/images/logo_hor_white.svg'"
                        alt=""
                      )

                  .row.no-wrap(v-else-if="col.name === 'html_url'")
                    a.link(
                      :href="col.value"
                      target="_blank"
                    ) {{ col.value }}

                  span(v-else v-html="col.value")

            template(v-slot:bottom)
              .flex.justify-center.full-width(v-if="filter")
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
import { pageMixin } from '../../mixins/pages'
import columns from './components/columns'
import { DEFAULT_PER_PAGE, DEFAULT_SORT_BY, DEFAULT_SORT_DESC, PER_PAGE, tablePageMixin } from '../../mixins/table-page'
import API from '../../api'
import { Alert } from '../../utils/alert'
import { getErrorText } from '../../utils/response'

export default {
  name: 'PageUsers',

  beforeRouteUpdate (to, from, next) {
    const keyLen = Object.keys(to.query).length
    if (!keyLen || (keyLen === 1 && to.query.add)) {
      this.loadParams(to.query)
    }
    next()
  },

  data () {
    return {
      columns: columns.slice(),
      pagination: {
        sortBy: DEFAULT_SORT_BY,
        descending: DEFAULT_SORT_DESC,
        page: 1,
        rowsNumber: 0,
        rowsPerPage: DEFAULT_PER_PAGE
      },
      DEFAULT_PER_PAGE,
      rows: [],
      title: 'Пользователи'
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

      this.$axios.get(API.github.users(), { params })
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

  mixins: [tablePageMixin, pageMixin]
}
</script>
