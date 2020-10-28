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
    this.$nextTick(() => {
      this.inited = true

      if (!this.bindSource()) {
        this.$router.replace({ name: 'error-404', params: [this.$route.fullPath] })
      }
    })
  },

  data () {
    return {
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

  mixins: [pageMixin]
}
