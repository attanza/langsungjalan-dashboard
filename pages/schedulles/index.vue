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
          <td v-if="props.item.marketing">{{ props.item.marketing.name }}</td>
          <td v-if="props.item.action">{{ props.item.action.name }}</td>
          <td v-if="props.item.study.studyName">{{ props.item.study.studyName.name }}</td>
          <td>{{ props.item.start_date | moment("DD MMM YYYY") }}</td>
          <td>{{ props.item.end_date | moment("DD MMM YYYY") }}</td>
          <!-- <td>{{ props.item.description }}</td> -->
          <td class="justify-center layout px-0">
            <v-btn icon class="mx-0" @click="toDetail(props.item)">
              <v-icon color="white">remove_red_eye</v-icon>
            </v-btn>
          </td>
        </template>
      </v-data-table>
    </v-card>
    <dform :show="showForm" @onClose="showForm = false" @onAdd="addData"/>
  </div>
</template>
<script>
import debounce from "lodash/debounce"
import { SCHEDULLE_URL } from "~/utils/apis"
import { global } from "~/mixins"
import { dform } from "~/components/schedulles"
import axios from "axios"
import catchError from "~/utils/catchError"

export default {
  middleware: "auth",
  components: { dform },
  mixins: [global],
  data: () => ({
    title: "Schedulle",
    headers: [
      { text: "Marketing", align: "left", value: "marketing_id" },
      { text: "Action", align: "left", value: "marketing_action_id" },
      { text: "Study Programs", align: "left", value: "study_id" },
      { text: "Start Date", align: "left", value: "start_date" },
      { text: "End Date", align: "left", value: "end_date" },
      // { text: "Description", align: "left", value: "description" },
      { text: "Actions", value: "", align: "center", sortable: false }
    ],
    items: []
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
    searchQuery: debounce(function() {
      this.pupulateTable()
    }, 500),
    async pupulateTable() {
      try {
        this.loading = true
        const { page, rowsPerPage, descending, sortBy } = this.pagination
        const endPoint = `${SCHEDULLE_URL}?page=${page}&limit=${rowsPerPage}&search=${
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
        this.loading = false
        catchError(e)
      }
    },
    toDetail(data) {
      this.$router.push(`/schedulles/${data.id}`)
    },
    addData(data) {
      this.items.unshift(data)
      this.showForm = false
    }
  }
}
</script>
