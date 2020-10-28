<template lang="pug">
.page.row.wrap.items-start
  .row.page-toolbar
    .col-shrink
      h1.page-toolbar__title.person-title
        q-btn.page-toolbar__back.q-mr-md(dense flat @click.native="$router.back()")
          q-icon(name="ion-arrow-back" size="sm")
        | {{ objectTitle }}

  .page-contents.card-contents(v-if="page")
    q-tabs(v-model="tab" dense)
      q-tab(name="info" label="Информация")
      q-tab(name="followers" label="Подписчики")
      q-tab(name="repos" label="Репозитории")

    q-card.card.full-width.person-card.no-shadow
      q-card-section(v-if="tab === 'info'")
        .row.q-gutter-lg.content-start
          .col-auto.col-xs-12.col-sm-12.col-md-auto.q-mr-sm
            .person-card__left
              q-img.person-card__avatar(
                v-if="page.avatar_url"
                :src="page.avatar_url"
                alt=""
                :ratio="1"
              )

          .col.col-xs-12.col-sm-12.col-md-auto
            .person-card__right.full-width
              .person-definitions
                dl
                  dt Имя:
                  dd(v-if="page.name") {{ page.name }}
                  dd(v-else) Неизвестно

                dl
                  dt ID:
                  dd(v-if="page.id") {{ page.id }}
                  dd(v-else) Неизвестно

                dl
                  dt Ссылка:
                  dd
                    a.link(:href="page.html_url" target="_blank") {{ page.html_url }}

                dl
                  dt Публичных репозиториев:
                  dd {{ page.public_repos }}

                dl
                  dt Публичных гистов:
                  dd {{ page.public_gists }}

                dl
                  dt Подписчиков:
                  dd {{ page.followers }}

                dl
                  dt Подписан(а) на пользователей:
                  dd {{ page.following }}

                dl
                  dt Аккаунт создан:
                  dd {{ page.created_at | formatDate('DD.MM.YYYY HH:mm') }}

                dl
                  dt Аккаунт обновлен:
                  dd {{ page.updated_at | formatDate('DD.MM.YYYY HH:mm') }}

                dl
                  dt Локация:
                  dd(v-if="page.location") {{ page.location }}
                  dd(v-else) Неизвестно

      q-card-section.q-mt-xl(v-if="tab === 'followers'")
          person-followers-table(
            :user="page.login"
          )

      q-card-section.q-mt-xl(v-if="tab === 'repos'")
        person-repos-table(
          :user="page.login"
        )
</template>

<script>
import { cardMixin } from '../../mixins/card'
import API from '../../api'
import { intComma, formatDate } from '../../filters'
import { getErrorText } from '../../utils/response'
import { Alert } from '../../utils/alert'
import { lighten } from 'quasar/src/utils/colors'
import PersonFollowersTable from './components/person-followers-table/person-followers-table'
import PersonReposTable from './components/person-repos-table/person-repos-table'

export default {
  name: 'PageUserCard',

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

  components: {
    PersonFollowersTable,
    PersonReposTable
  },

  computed: {
    objectTitle () {
      if (this.page) {
        return `Пользователь ${this.page.login}`
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
      const id = this.$route.params.id

      const vm = this
      this.$axios.get(API.github.user(id))
        .then(response => { vm.page = response.data })
        .catch(error => Alert('Ошибка', getErrorText(error)))
        .finally(() => this.$q.loading.hide())

      return true
    },

    lighten,

    loadParams (query) {
      query = query || this.$route.query

      if (query.edit && query.edit === 'true') {
        this.isEditing = true
      }
    },

    remove () {
      if (!this.page || !this.page.id) {
        return
      }
      this.$q.dialog({
        title: 'Booking deletion',
        message: 'Are you sure to remove the booking?',
        cancel: true
      }).onOk(() => {
        this.$axios.delete(API.bookings.booking(this.page.id))
          .then(() => {
            Alert('Success', 'Booking removed successfully.')
            this.$router.replace({ name: 'bookings' })
          })
          .catch(error => Alert('Error', getErrorText(error)))
      })
    }
  },

  mixins: [cardMixin]
}
</script>
