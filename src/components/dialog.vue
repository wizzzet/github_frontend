<template lang="pug">
.alert
</template>

<script>
import eventHub from '../utils/eventHub'

export default {
  name: 'ProjectDialog',

  beforeDestroy () {
    eventHub.$off('global:alert', this.alert)
  },

  created () {
    eventHub.$on('global:alert', this.alert)
  },

  methods: {
    alert (payload) {
      let title = payload.title || ''
      let message = payload.message || ''
      if (message.errors) {
        message = message.errors.map(o => o.message).join('. ')
      }

      this.$q.dialog({
        title,
        message,
        html: true
      })
    }
  }
}
</script>

<style lang="stylus">
.form-dialog
  .q-dialog__inner--minimized
    padding-top 50px
    padding-bottom 0

.lightbox-dialog
  cursor pointer

  img
    max-width: calc(100% - 50px)
    max-height calc(100% - 50px)
</style>
