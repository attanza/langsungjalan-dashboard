<template>
  <div>
    <h2 class="primary--text mb-3">{{ title }}</h2>
    <v-card class="pt-3">
      <v-toolbar card color="transparent">
        <!-- <Tbtn :bottom="true" :tooltip-text="'Register New ' + title " icon-mode color="primary" icon="add" @onClick="showForm = true"/>
        <v-spacer/> -->
        <v-text-field
          v-model="search"
          append-icon="search"
          label="Cari"
          single-line
          hide-details
        />
      </v-toolbar>
      <v-data-table 
        v-if="items"
        :headers="headers"
        :items="items"
        :loading="loading"
        :pagination.sync="pagination"
        :total-items="totalItems"
        :rows-per-page-items="rowsPerPage"
        class="elevation-1"

      >
        <template slot="items" slot-scope="props">
          <td>{{ props.item.marketing.name }}</td>
          <td>{{ props.item.action.name }}</td>
          <td>{{ props.item.method }}</td>
          <td>{{ props.item.result }}</td>
          <td class="justify-center layout px-0">
            <v-btn icon class="mx-0" @click="toDetail(props.item)">
              <v-icon color="primary">remove_red_eye</v-icon>
            </v-btn>
          </td>
        </template>
      </v-data-table>
    </v-card>
  </div>
</template>
<script>
import debounce from "lodash/debounce"
import { MARKETING_REPORTS_URL } from "~/utils/apis"
import { global } from "~/mixins"
import catchError from "~/utils/catchError"
import axios from "axios"

export default {
  mixins: [global],
  data: () => ({
    title: "Laporan Marketing",
    headers: [
      { text: "Marketing", align: "left", value: "marketing_id" },
      { text: "Aksi", align: "left", value: "marketing_action_id" },
      { text: "Metode", align: "left", value: "method" },
      { text: "Hasil", align: "left", value: "result" },
      { text: "Aksi", value: "", align: "center", sortable: false }
    ],
    items: [],
    confirmMessage: "Yakin mau menghapus ?",
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
    searchQuery: debounce(function() {
      this.pupulateTable()
    }, 500),
    async pupulateTable() {
      try {
        this.activateLoader()
        const { page, rowsPerPage, descending, sortBy } = this.pagination
        const endPoint = `${MARKETING_REPORTS_URL}?page=${page}&limit=${rowsPerPage}&search=${
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
        this.deactivateLoader()
      } catch (e) {
        this.deactivateLoader()
        this.showForm = false
        catchError(e, null, this.$router)
      }
    },
    toDetail(data) {
      this.$router.push(`/marketing-reports/${data.id}`)
    },
    addData(data) {
      this.items.unshift(data)
      this.showForm = false
    }
  }
}
</script>
