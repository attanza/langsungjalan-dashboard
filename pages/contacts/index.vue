<template>
  <div>
    <h2 class="primary--text mb-3">{{ title }}</h2>
    <v-card class="pt-3">
      <v-toolbar card color="transparent">
        <Tbtn
          :bottom="true"
          :tooltip-text="'Tambah ' + title "
          icon-mode
          color="primary"
          icon="add"
          @onClick="showForm = true"
        />
        <Tbtn
          :bottom="true"
          :tooltip-text="'Download ' + title + ' data'"
          icon-mode
          color="primary"
          icon="cloud_download"
          @onClick="downloadData"
        />
        <v-spacer/>
        <v-text-field
          v-model="pagination.search"
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
          <td>
            <a @click="toDetail(props.item)">{{ props.item.target.code }}</a>
          </td>
          <td>{{ props.item.name }}</td>
          <td>{{ props.item.title }}</td>
          <td>{{ props.item.email }}</td>
          <td>{{ props.item.phone }}</td>
        </template>
      </v-data-table>
    </v-card>
    <dform :show="showForm" @onClose="showForm = false" @onAdd="addData"/>
    <DownloadDialog
      :show-dialog="showDownloadDialog"
      :data-to-export="dataToExport"
      :fillable="fillable"
      :type-dates="typeDates"
      model="Contact"
      @onClose="showDownloadDialog = false"
    />
  </div>
</template>
<script>
import debounce from "lodash/debounce"
import { CONTACT_URL } from "~/utils/apis"
import { global } from "~/mixins"
import { dform } from "~/components/contacts"
import axios from "axios"
import DownloadDialog from "~/components/DownloadDialog"
import catchError from "~/utils/catchError"

export default {
  middleware: "auth",
  components: { dform, DownloadDialog },
  mixins: [global],
  data: () => ({
    title: "Kontak",
    headers: [
      { text: "Kode Target", align: "left", value: "target.code" },
      { text: "Nama", align: "left", value: "name" },
      { text: "Jabatan", align: "left", value: "title" },
      { text: "Email", align: "left", value: "email" },
      { text: "Telepon", align: "left", value: "phone" }
    ],
    items: [],
    confirmMessage: "Yakin mau menghapus ?",
    showConfirm: false,
    dataToExport: [],
    fillable: ["id", "name", "title", "email", "phone"],
    typeDates: ["created_at"]
  }),

  watch: {
    pagination: {
      handler: debounce(function() {
        this.pupulateTable()
      }, 500),
      deep: true
    }
  },

  mounted() {
    this.pupulateTable()
    this.clearStore()
  },

  methods: {
    async pupulateTable() {
      try {
        this.activateLoader()
        this.loading = true

        const { descending, sortBy } = this.pagination
        const endPoint = `${CONTACT_URL}?${this.getQueryParams()}`

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
        this.loading = false
        this.deactivateLoader()
        catchError(e)
      }
    },
    toDetail(data) {
      this.$router.push(`/contacts/${data.id}`)
    },
    addData(data) {
      this.items.unshift(data)
      this.showForm = false
    },
    downloadData() {
      this.dataToExport = []
      this.items.forEach(data => {
        let d = Object.assign({}, data)

        // Target
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
