import eventHub from '../utils/eventHub'

export const pageMixin = {
  beforeRouteEnter (to, from, next) {
    next(vm => {
      eventHub.$emit('title:changed', vm.title)
    })
  },

  data () {
    return {
      loading: true,
      title: ''
    }
  },

  meta () {
    return {
      title: this.title
    }
  }
}
