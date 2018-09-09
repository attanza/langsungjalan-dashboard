<template>
  <div>
    <h2 class="primary--text mb-3">{{ title }}s</h2>
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
          <td v-if="props.item.studyName">{{ props.item.studyName.name }}</td>
          <td v-if="props.item.university">{{ props.item.university.name }}</td>
          <!-- <td>{{ props.item.address }}</td> -->
          <td>{{ props.item.contact_person }}</td>
          <td>{{ props.item.phone }}</td>
          <td>{{ props.item.email }}</td>
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
import { STUDIES_URL } from "~/utils/apis"
import { global } from "~/mixins"
import { dform } from "~/components/studies"
import axios from "axios"
import catchError from "~/utils/catchError"
export default {
  middleware: "auth",
  components: { dform },
  mixins: [global],
  data: () => ({
    title: "Study Program",

    headers: [
      { text: "Name", align: "left", value: "study_name_id" },
      { text: "University", align: "left", value: "university_id" },
      // { text: "Address", value: "address", align: "left" },
      { text: "Contact Person", value: "contact_person", align: "left" },
      { text: "Phone", value: "phone", align: "left" },
      { text: "Email", value: "email", align: "left" },
      { text: "Actions", value: "", sortable: false }
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
        this.activateLoader()
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
        this.deactivateLoader()
      } catch (e) {
        this.deactivateLoader()
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
