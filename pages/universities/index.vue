<template>
  <div>
    <h2 class="primary--text mb-3">{{ title }}</h2>
    <v-card dark class="pt-3">
      <v-toolbar card color="transparent">
        <Tbtn :bottom="true" :tooltip-text="'Register New ' + title " icon-mode color="primary" icon="add" @onClick="showForm = true"/>
        <v-spacer/>
        <v-text-field
          v-model="search"
          append-icon="search"
          label="Search"
          single-line
          hide-details
        />
      </v-toolbar>
      <v-data-table
        :headers="headers"
        :items="items"
        :loading="loading"
        :pagination.sync="pagination"
        :total-items="totalItems"
        class="elevation-1"
      >
        <template slot="items" slot-scope="props">
          <td>{{ props.item.name }}</td>
          <!-- <td class="text-xs-left">{{ props.item.address }}</td> -->
          <td class="text-xs-left">{{ props.item.contact_person }}</td>
          <td class="text-xs-left">{{ props.item.phone }}</td>
          <td class="text-xs-left">{{ props.item.email }}</td>
          <td class="text-xs-left">{{ props.item.city }}</td>
          <td class="justify-center layout px-0">
            <v-btn icon class="mx-0" @click="toDetail(props.item)">
              <Tbtn :tooltip-text="'Show '+title" icon-mode flat color="white" icon="remove_red_eye" @onClick="toDetail(props.item)"/>
            </v-btn>
          </td>
        </template>
      </v-data-table>
    </v-card>
    <dform :show="showForm" @onClose="showForm = false" @onAdd="addData"/>
  </div>
</template>
<script>
import _ from "lodash"
import { UNIVERSITY_URL } from "~/utils/apis"
import { global } from "~/mixins"
import { dform } from "~/components/university"
import axios from "axios"
export default {
  middleware: "auth",
  components: { dform },
  mixins: [global],
  data: () => ({
    title: "University",
    headers: [
      { text: "Name", align: "left", value: "name" },
      // { text: "Address", value: "address", align: "left" },
      { text: "Contact Person", value: "contact_person", align: "left" },
      { text: "Phone", value: "phone", align: "left" },
      { text: "Email", value: "email", align: "left" },
      { text: "City", value: "city", align: "left" },
      { text: "Actions", value: "name", sortable: false }
    ],
    items: [],
    itemEdit: {},
    userIdDelete: "",
    confirmMessage: "Are you sure want to delete this ?",
    showConfirm: false
  }),

  watch: {
    pagination: {
      handler() {
        this.pupulateTable()
      },
      deep: true
    },
    search() {
      if (this.search != "") {
        this.searchQuery()
      }
    }
  },

  mounted() {
    this.pupulateTable()
  },

  methods: {
    searchQuery: _.debounce(function() {
      this.pupulateTable()
    }, 500),
    async pupulateTable() {
      this.loading = true
      const { page, rowsPerPage, descending, sortBy } = this.pagination
      const endPoint = `${UNIVERSITY_URL}?page=${page}&limit=${rowsPerPage}&search=${
        this.search
      }`
      const res = await axios.get(endPoint).then(res => res.data)
      this.items = res.data
      this.totalItems = res.meta.total
      if (this.pagination.sortBy) {
        this.items = this.items.sort((a, b) => {
          const sortA = a[sortBy]
          const sortB = b[sortBy]

          if (descending) {
            if (sortA < sortB) return 1
            if (sortA > sortB) return -1
            return 0
          } else {
            if (sortA < sortB) return -1
            if (sortA > sortB) return 1
            return 0
          }
        })
      }
      this.loading = false
    },
    toDetail(data) {
      this.$router.push(`/universities/${data.id}`)
    },
    addData(data) {
      this.items.unshift(data)
      this.showForm = false
    }
  }
}
</script>
