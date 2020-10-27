import { pageMixin } from './pages'

export const cardMixin = {
  computed: {
    objectTitle () {
      return ''
    },

    metaTitle () {
      return `${this.title} ${this.objectTitle}`
    }
  },

  created () {
    this.$q.loading.show({ delay: 200 })
    this.loadParams()
    this.$nextTick(() => {
      this.inited = true

      if (!this.bindSource()) {
        this.$router.replace({ name: 'error-404', params: [this.$route.fullPath] })
      }
    })
  },

  data () {
    return {
      isEditing: false,
      inited: false,
      page: null,
      title: ''
    }
  },

  meta () {
    return {
      title: this.metaTitle
    }
  },

  methods: {
    dumpQuery () {
      return {}
    },

    edit () {
      this.isEditing = true
    },

    loadParams () {},

    submitted (data) {
      this.isEditing = false
      this.bindSource()
    }
  },

  mixins: [pageMixin],

  watch: {
    isEditing () {
      this.dumpQuery()
    }
  }
}
