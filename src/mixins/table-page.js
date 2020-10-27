import isEqual from 'lodash/isEqual'

export const DEFAULT_SORT_BY = 'id'
export const DEFAULT_SORT_DESC = true
export const DEFAULT_PER_PAGE = 20
export const PER_PAGE = [10, 20, 50, 100]

export const tablePageMixin = {
  created () {
    this.loadParams()
    this.$nextTick(() => {
      this.getDicts()
      this.inited = true
      this.getData({
        pagination: this.pagination,
        filter: this.filter
      })
    })
  },

  computed: {
    maxPages () {
      return this.rows && this.pagination.rowsNumber
        ? Math.ceil(this.pagination.rowsNumber / this.pagination.rowsPerPage) : 0
    }
  },

  data () {
    return {
      filter: '',
      inited: false,
      isAddingNew: false,
      rows: [],
      title: ''
    }
  },

  methods: {
    addNewObject () {
      this.isAddingNew = true
    },

    closeForm () {
      this.isAddingNew = false
    },

    dumpQuery () {
      if (!this.inited) {
        return null
      }

      const query = this.dumpParams()
      if (query && !isEqual(query, this.$route.query)) {
        this.$router.replace({ query })
      }
    },

    dumpParams (pagination, filter) { return {} },

    getDataParams (pagination, filter) {
      let data = this.dumpParams(pagination, filter)
      if (data && typeof (data.per_page) !== 'undefined' && typeof (data.page) !== 'undefined') {
      } else {
        data.per_page = DEFAULT_PER_PAGE
        data.page = 1
      }
      if (data && typeof (data.sort) !== 'undefined' && data.sort) {
        data.ordering = this.getSortField(data.sort)
        if (!Array.isArray(data.ordering)) {
          data.ordering = [data.ordering]
        }
        if (data.sort_desc && data.sort_desc === 'true') {
          data.ordering = data.ordering.map(o => '-' + o)
        }
        data.ordering = data.ordering.join(',')
        delete data.sort
        delete data.sort_desc
      }
      return data
    },
    getData () {},
    getDicts () {},
    getSortField (field) { return field },
    loadParams () {},
    onParamsChange (flushPage) {
      if (!this.inited) {
        return null
      }

      flushPage = typeof (flushPage) !== 'undefined' ? flushPage : true
      const page = this.pagination.page
      if (flushPage && page !== 1) {
        this.pagination.page = 1
      }
      this.dumpQuery()
      this.getData({
        pagination: this.pagination,
        filter: this.filter
      })
    }
  },

  watch: {
    filter () { this.dumpQuery() },
    isAddingNew () { this.dumpQuery() },
    'pagination.descending' () { this.dumpQuery() },
    'pagination.page' () {
      this.onParamsChange(false)
    },
    'pagination.rowsNumber' () { this.dumpQuery() },
    'pagination.rowsPerPage' () { this.dumpQuery() },
    'pagination.sortBy' () { this.dumpQuery() }
  }
}
