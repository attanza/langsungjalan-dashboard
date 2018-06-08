<template>
  <div>
    <h2 class="primary--text mb-3">Marketings</h2>
    <v-card dark>
      <v-card-title>
        <Tbtn :bottom="true" color="primary" icon="add" text="Register New Supervisor" @onClick="showForm = true"/>
        <v-spacer/>
        <v-text-field
          v-model="search"
          append-icon="search"
          label="Search"
          single-line
          hide-details
        />
      </v-card-title>
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
          <td>{{ props.item.email }}</td>
          <td>{{ props.item.phone }}</td>
          <td>
            <span v-if="props.item.supervisors.length > 0">{{ props.item.supervisors[0].name }}</span>
            <span v-else/>
          </td>
          <td>
            <span v-if="props.item.is_active"><v-chip color="green" text-color="white">Active</v-chip></span>
            <span v-else><v-chip>Not Active</v-chip></span>
          </td>
          <td class="justify-center layout px-0">
            <v-btn icon class="mx-0" @click="toDetail(props.item)">
              <v-icon color="white">remove_red_eye</v-icon>
            </v-btn>
          </td>
        </template>
      </v-data-table>
    </v-card>
    <dform :show-form="showForm" @onClose="showForm = false" @onAdd="addData"/>
  </div>
</template>
<script>
import _ from "lodash"
import { USER_URL } from "~/utils/apis"
import { global } from "~/mixins"
import { dform } from "~/components/supervisors"
import axios from "axios"
import catchError from "~/utils/catchError"

export default {
  middleware: "auth",
  components: { dform },
  mixins: [global],
  data: () => ({
    loading: false,
    showForm: false,
    totalItems: 0,
    search: "",
    pagination: {
      sortBy: "",
      descending: false,
      page: 1,
      rowsPerPage: 10
    },
    headers: [
      { text: "Name", align: "left", value: "name" },
      { text: "Email", align: "left", value: "email" },
      { text: "Phone", align: "left", value: "phone" },
      { text: "Supervisor", align: "left", value: "supervisor_id" },
      { text: "Status", align: "left", value: "is_active" },
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
      try {
        this.loading = true
        const { page, rowsPerPage, descending, sortBy } = this.pagination
        const endPoint = `${USER_URL}?page=${page}&limit=${rowsPerPage}&search=${
          this.search
        }&role_id=4`
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
      } catch (e) {
        catchError(e)
      }
    },
    toDetail(data) {
      this.$router.push(`/supervisors/${data.id}`)
    },
    addData(data) {
      this.items.unshift(data)
      this.showForm = false
    }
  }
}
</script>
