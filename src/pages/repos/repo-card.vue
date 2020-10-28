<template lang="pug">
  .page.row.wrap.items-start
    .row.page-toolbar
      .col-shrink
        h1.page-toolbar__title.person-title
          q-btn.page-toolbar__back.q-mr-md(dense flat @click.native="$router.back()")
            q-icon(name="ion-arrow-back" size="sm")
          | {{ objectTitle }}

    .page-contents.card-contents(v-if="page")
      //
        q-tabs(v-model="tab" dense)
          q-tab(name="info" label="Общая информация")

      q-card.card.full-width.person-card.no-shadow
        q-card-section(v-if="tab === 'info'")
          .row.q-gutter-lg.content-start
            .col
              .person-card__right.full-width
                .person-definitions
                  dl
                    dt Название:
                    dd {{ page.full_name }}

                  dl
                    dt ID:
                    dd {{ page.id }}

                  dl
                    dt Ссылка:
                    dd
                      a.link(:href="page.html_url" target="_blank") {{ page.html_url }}

                  dl(v-if="page.description")
                    dt Описание:
                    dd
                      div {{ page.description }}

                  dl(v-if="page.language")
                    dt Язык:
                    dd {{ page.language }}

                  dl
                    dt Создан:
                    dd {{ page.created_at | formatDate('DD.MM.YYYY HH:mm') }}

                  dl
                    dt Обновлен:
                    dd {{ page.updated_at | formatDate('DD.MM.YYYY HH:mm') }}

                  .row.q-gutter-lg.content-start.items-start.q-mt-lg
                    .col-none
                      q-btn(
                        v-if="page.git_url"
                        color="primary"
                        @click="copyToClipboard(page.git_url)"
                      ) GIT

                    .col-none
                      q-btn(
                        v-if="page.ssh_url"
                        color="primary"
                        @click="copyToClipboard(page.ssh_url)"
                      ) SSH

                    .col-none
                      q-btn(
                        v-if="page.clone_url"
                        color="primary"
                        @click="copyToClipboard(page.clone_url)"
                      ) HTTPS
</template>

<script>
import { cardMixin } from '../../mixins/card'
import API from '../../api'
import { intComma, formatDate } from '../../filters'
import { getErrorText } from '../../utils/response'
import { Alert } from '../../utils/alert'
import { lighten } from 'quasar/src/utils/colors'

export default {
  name: 'PageRepoCard',

  beforeRouteUpdate (to, from, next) {
    if (from.params.id !== to.params.id) {
      this.$nextTick(() => {
        this.tab = 'info'
        this.$q.loading.show()
        this.page = null
        this.bindSource()
      })
    }
    next()
  },

  computed: {
    objectTitle () {
      if (this.page) {
        return `Репозиторий ${this.page.full_name}`
      }
      return ''
    }
  },

  data () {
    return {
      tab: 'info'
    }
  },

  filters: { formatDate, intComma },

  methods: {
    bindSource () {
      const userId = this.$route.params.id
      const repoId = this.$route.params.repoId

      const vm = this
      this.$axios.get(API.github.repo(userId, repoId))
        .then(response => { vm.page = response.data })
        .catch(error => Alert('Ошибка', getErrorText(error)))
        .finally(() => this.$q.loading.hide())

      return true
    },

    copyToClipboard (str) {
      const el = document.createElement('textarea')
      el.value = str
      el.readOnly = true
      el.style = { position: 'absolute', left: '-9999px' }
      document.body.appendChild(el)
      el.select()
      document.execCommand('copy')
      document.body.removeChild(el)
      Alert('Ссылка скопирована')
    },

    lighten
  },

  mixins: [cardMixin]
}
</script>
