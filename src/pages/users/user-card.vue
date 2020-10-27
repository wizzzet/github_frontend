<template lang="pug">
.page.row.wrap.items-start
  .row.page-toolbar
    .col-shrink
      h1.page-toolbar__title.person-title
        q-btn.page-toolbar__back.q-mr-md(dense flat @click.native="$router.back()")
          q-icon(name="ion-arrow-back" size="sm")
        | {{ objectTitle }}

    .col(v-if="page")
      .person-tags
        q-badge.person-tag.cursor-pointer.q-mr-sm(
          v-if="page.status"
          outline
          :label="page.status.title"
          :style="page.status.color ? { background: lighten(page.status.color, 93), color: page.status.color, borderColor: lighten(page.status.color, 45) } : null"
          @click="changeStatus"
        )

    .col-shrink
      q-btn.q-mr-md.gt-xs.with-icon(
        color="primary"
        size="md"
        @click.native="edit"
      )
        q-icon.q-mr-sm(name="app:white:edit" size="xs")
        | Edit

      q-btn(dense flat text-color="grey-9")
        q-icon(name="ion-more")
        q-menu
          q-item(
            clickable
            color="black"
            @click.native="remove"
          )
            q-item-section(avatar)
              q-icon(name="ion-trash")
            q-item-section Remove

  .page-contents.card-contents(v-if="page")
    q-card.card.full-width.person-card.no-shadow
      q-card-section
        .row.q-gutter-lg.no-wrap.content-start
          .col
            .person-card__right.full-width
              .person-definitions
                dl
                  dt Customer:
                  dd(v-if="page.customer")
                    router-link.link(:to="{ name: 'customer-card', params: { id: page.customer.id } }")
                      | {{ page.customer.first_name || '' }} {{ page.customer.last_name || '' }}
                  dd(v-else) Unknown

                dl
                  dt Contractor:
                  dd(v-if="page.contractor")
                    router-link.link(:to="{ name: 'contractor-card', params: { id: page.contractor.id } }")
                      | {{ page.contractor.first_name || '' }} {{ page.contractor.last_name || '' }}
                  dd(v-else) Unknown

                dl(
                  v-for="assignee in page.assignees"
                  :key="assignee.id"
                )
                  dt {{ assignee.employee_role.title }}:
                  dd(v-if="assignee.employee")
                    router-link.link(
                      :to="{ name: 'employee-card', params: { id: assignee.employee.id } }"
                    ) {{ assignee.employee.first_name || '' }} {{ assignee.employee.last_name || '' }}
                  dd(v-else) Unknown

                dl
                  dt Location:
                  dd(v-if="page.location")
                    router-link.link(
                      v-if="!page.booking_type.external_locations"
                      :to="{ name: 'room-card', params: { id: page.location.id } }"
                    ) {{ page.location.title || '' }} {{ page.location.address || '' }}
                    a.link(
                      v-else-if="page.location.place_id"
                      :href="`https://www.google.com/maps/place/?q=place_id:${page.location.place_id}`"
                      target="_blank"
                    ) {{ page.location.title || '' }} {{ page.location.address || '' }}
                    span(v-else) {{ page.location.title || '' }} {{ page.location.address || '' }}
                  dd(v-else) Unknown

              .columns-definitions
                .row
                  dl
                    dt Total
                    dd {{ page.currency.short_code }}{{ page.total_price | intComma(true) }}

                  dl
                    dt House
                    dd {{ page.currency.short_code }}{{ page.location_price | intComma(true) }}

                  dl
                    dt Girl
                    dd {{ page.currency.short_code }}{{ page.contractor_price | intComma(true) }}

                  dl
                    dt Surcharge
                    dd {{ page.currency.short_code }}{{ page.surcharge | intComma(true) }}

                  dl(
                    v-for="assignee in page.assignees"
                    :key="assignee.id"
                  )
                    dt {{ assignee.employee_role.title }}
                    dd {{ assignee.currency.short_code }}{{ assignee.price | intComma(true) }}

                  dl
                    dt Customer Payment Type
                    dd {{ page.payment_type.title }}

                  dl
                    dt Date and Time to Appointment
                    dd(v-if="page.datetime_to_appointment") {{ page.datetime_to_appointment | formatDate('MM/DD/YYYY HH:mm') }}
                    dd(v-else) Unknown

      q-card-section.q-mt-xl
        person-accounts-table(
          is-payer
          :selected-booking="page.id"
        )
</template>

<script>
import { cardMixin } from '../../mixins/card'
import API from '../../api'
import { intComma, formatDate } from '../../filters'
import { getErrorText } from '../../utils/response'
import { Alert } from '../../utils/alert'
import isEqual from 'lodash/isEqual'
import { lighten } from 'quasar/src/utils/colors'

export default {
  name: 'PageBookingCard',

  beforeRouteUpdate (to, from, next) {
    if (from.params.id !== to.params.id) {
      this.$nextTick(() => {
        this.bindSource()
      })
    }
    next()
  },

  computed: {
    objectTitle () {
      if (this.page) {
        return `Booking #${this.page.id}`
      }
      return ''
    }
  },

  created () {
    this.getDicts()
  },

  data () {
    return {
      chat: null,
      bookingTypes: [],
      isEditingStatus: false,
      statuses: []
    }
  },

  filters: { formatDate, intComma },

  methods: {
    bindSource () {
      const id = parseInt(this.$route.params.id)
      if (isNaN(id)) {
        return false
      }

      const vm = this
      this.$axios.get(API.bookings.booking(id))
        .then(response => { vm.page = response.data })
        .catch(error => Alert('Error', getErrorText(error)))
        .finally(() => this.$q.loading.hide())

      return true
    },

    changeStatus () {
      this.isEditingStatus = true
    },

    dumpQuery () {
      if (!this.inited) {
        return {}
      }

      let query = {}
      if (this.isEditing) {
        query.edit = 'true'
      }

      if (query && !isEqual(query, this.$route.query)) {
        this.$router.replace({ query })
      }
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
    },

    submittedStatus () {
      this.isEditingStatus = false
      this.bindSource()
    }
  },

  mixins: [cardMixin]
}
</script>
