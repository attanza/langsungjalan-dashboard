<template>
  <div>
    <h2 class="primary--text mb-3">Study Programs</h2>
    <v-card dark>
      <v-card-title>
        <Tbtn :bottom="true" color="primary" icon="add" text="Register new Study Program" @onClick="showForm = true"/>
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
          <td>{{ props.item.university.name }}</td>
          <td>{{ props.item.address }}</td>
          <td>{{ props.item.contact_person }}</td>
          <td>{{ props.item.phone }}</td>
          <td>{{ props.item.email }}</td>
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
import { STUDIES_URL, COMBO_DATA_URL } from "~/utils/apis"
import { global } from "~/mixins"
import { dform } from "~/components/studies"
import axios from "axios"
import catchError from "~/utils/catchError"
export default {
  middleware: "auth",
  components: { dform },
  mixins: [global],
  async fetch({ store }) {
    try {
      // Combo / Select Data
      let resp2 = await await axios
        .get(COMBO_DATA_URL + "University")
        .then(res => res.data)
      store.commit("comboData", resp2)
    } catch (e) {
      catchError(e)
    }
  },
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
      { text: "University", align: "left", value: "name" },
      { text: "Address", value: "address", align: "left" },
      { text: "Contact Person", value: "contact_person", align: "left" },
      { text: "Phone", value: "phone", align: "left" },
      { text: "Email", value: "email", align: "left" },
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
        const endPoint = `${STUDIES_URL}?page=${page}&limit=${rowsPerPage}&search=${
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
      } catch (e) {
        catchError(e)
      }
    },
    toDetail(data) {
      this.$router.push(`/study-programs/${data.id}`)
    },
    addData(data) {
      this.items.unshift(data)
      this.showForm = false
    }
  }
}
</script>
