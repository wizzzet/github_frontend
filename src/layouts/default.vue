<template lang="pug">
q-layout(view="lHh lpr lfr")
  q-drawer(
    v-if="!loading"
    show-if-above
    v-model="leftDrawerOpen"
    :overlay="$q.screen.lt.md"
    content-class="flex column no-wrap justify-between bg-grey-2 text-white icon-white"
    :width="200"
    side="left"
    :breakpoint="1023"
    persistent
  )
    .drawer-top
      router-link.logo(:to="{ name: 'index' }")
        img(src="~assets/images/logo_hor_white.svg" alt="")

      q-list(dark padding)
        template(v-for="item in menu")
          q-item(
            :key="item.to"
            clickable
            :to="{ name: item.to }"
            dark
            :active="$route.name === 'index' ? $route.name === item.to : $route.fullPath.indexOf(item.to) >= 0"
          )
            q-item-section.flex(avatar)
              q-icon(:name="`app:white:${item.icon}`" size="xs")
            q-item-section
              q-item-label.text-white
                span {{ item.title }}

  q-page-container(v-if="!loading")
    transition
      router-view
</template>

<script>
import menu from '../components/menu'
import { iconsMixin } from '../mixins/icons'
import { formatDate } from '../filters'

export default {
  name: 'layout-default',

  beforeDestroy () {
    if (this.timer) {
      clearInterval(this.timer)
    }
  },

  created () {
    this.$q.loading.show({ delay: 200 })
    this.timeout = setTimeout(this.hideLoading, 1000)
  },

  data () {
    return {
      leftDrawerOpen: this.$q.platform.is.desktop,
      menu: menu.slice(),
      title: 'GitHub Demo',
      loading: true,
      timeout: null
    }
  },

  filters: { formatDate },

  methods: {
    hideLoading () {
      this.loading = false
      if (this.timeout) {
        clearTimeout(this.timeout)
      }
      this.$q.loading.hide()
    }
  },

  mixins: [iconsMixin]
}
</script>
