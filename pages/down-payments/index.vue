<template>
  <div>
    <h2 class="primary--text mb-3">{{ title }}</h2>
    <v-card class="pt-3">
      <v-toolbar card color="transparent">
        <Tbtn :bottom="true" :tooltip-text="'Tambah ' + title " icon-mode color="primary" icon="add" @onClick="showForm = true"/>
        <Tbtn :bottom="true" :tooltip-text="'Download ' + title + ' data'" icon-mode color="primary" icon="cloud_download" @onClick="downloadData"/>       

        <v-spacer/>
        <v-text-field
          v-model="search"
          append-icon="search"
          label="Cari"
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
        :rows-per-page-items="rowsPerPage"
        class="elevation-1"

      >
        <template slot="items" slot-scope="props">
          <td>{{ props.item.target ? props.item.target.code : '' }}</td>
          <td>{{ props.item.name }}</td>
          <td>{{ props.item.phone }}</td>
          <td>{{ props.item.dp.toLocaleString('id') }}</td>
          <td>
            <span v-if="props.item.is_verified"><v-chip color="green" text-color="white">Verified</v-chip></span>
            <span v-else><v-chip>Not Verified</v-chip></span>
          </td>
          <td class="justify-center layout px-0">
            <v-btn icon class="mx-0" @click="toDetail(props.item)">
              <v-icon color="primary">remove_red_eye</v-icon>
            </v-btn>
          </td>
        </template>
      </v-data-table>
    </v-card>
    <dform :show="showForm" @onClose="showForm = false" @onAdd="addData"/>
    <DownloadDialog :show-dialog="showDownloadDialog" :data-to-export="dataToExport" :fillable="fillable" :type-dates="typeDates" model="Product" @onClose="showDownloadDialog = false"/>

  </div>
</template>
<script>
import _ from "lodash"
import { DP_URL } from "~/utils/apis"
import { global } from "~/mixins"
import { dform } from "~/components/down-payments"
import axios from "axios"
import DownloadDialog from "~/components/DownloadDialog"

export default {
  middleware: "auth",
  components: { dform, DownloadDialog },
  mixins: [global],
  data: () => ({
    title: "Down Payment",
    headers: [
      { text: "Kode Target", align: "left", value: "marketing_target_id" },
      { text: "Nama", align: "left", value: "name" },
      { text: "Telepon", align: "left", value: "phone" },
      { text: "DP", align: "left", value: "dp" },
      { text: "Verified", align: "left", value: "is_verified" },
      { text: "Aksi", value: "", sortable: false }
    ],
    items: [],
    confirmMessage: "Yakin mau menghapus ?",
    showConfirm: false,
    dataToExport: [],
    fillable: ["id", "marketing_target_id", "name", "phone", "dp"],
    typeDates: ["created_at"]
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
      this.activateLoader()
      this.loading = true
      const { page, rowsPerPage, descending, sortBy } = this.pagination
      const endPoint = `${DP_URL}?page=${page}&limit=${rowsPerPage}&search=${
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
    },
    toDetail(data) {
      this.$router.push(`/down-payments/${data.id}`)
    },
    addData(data) {
      this.items.unshift(data)
      this.showForm = false
    },
    downloadData() {
      this.dataToExport = []
      this.items.forEach(data => {
        let d = Object.assign({}, data)

        // Target Marketing
        delete d.target
        delete d.marketing_target_id
        if (data.target) d.target = data.target.code

        this.dataToExport.push(d)
      })
      if (this.dataToExport.length) {
        this.showDownloadDialog = true
      }
    }
  }
}
</script>
