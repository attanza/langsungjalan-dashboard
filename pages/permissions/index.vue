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
          <td><a @click="toDetail(props.item)">{{ props.item.name }}</a></td>
          <td>{{ props.item.description }}</td>
        </template>
      </v-data-table>
    </v-card>
    <dform :show="showForm" @onClose="showForm = false" @onAdd="addData"/>
    <DownloadDialog :show-dialog="showDownloadDialog" :data-to-export="dataToExport" :fillable="fillable" :type-dates="typeDates" model="Permission" @onClose="showDownloadDialog = false"/>

  </div>
</template>
<script>
import debounce from "lodash/debounce"
import { PERMISSION_URL } from "~/utils/apis"
import { global } from "~/mixins"
import { dform } from "~/components/permissions"
import axios from "axios"
import catchError from "~/utils/catchError"
import DownloadDialog from "~/components/DownloadDialog"

export default {
  middleware: "auth",
  components: { dform, DownloadDialog },
  mixins: [global],
  data: () => ({
    title: "Permission",
    headers: [
      { text: "Permission", align: "left", value: "name" },
      { text: "Deskripsi", align: "left", value: "description" }
    ],
    items: [],
    confirmMessage: "Yakin mau menghapus ?",
    showConfirm: false,
    dataToExport: [],
    fillable: ["id", "name", "slug", "description"],
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
    searchQuery: debounce(function() {
      this.pupulateTable()
    }, 500),
    async pupulateTable() {
      try {
        this.activateLoader()
        this.loading = true
        const { page, rowsPerPage, descending, sortBy } = this.pagination
        const endPoint = `${PERMISSION_URL}?page=${page}&limit=${rowsPerPage}&search=${
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
        this.loading = false
        this.showForm = false
        this.deactivateLoader()
        catchError(e)
      }
    },
    toDetail(data) {
      this.$router.push(`/permissions/${data.id}`)
    },
    addData(data) {
      this.items.unshift(data)
      this.showForm = false
    },
    downloadData() {
      this.dataToExport = []
      this.dataToExport = this.items
      if (this.dataToExport.length) {
        this.showDownloadDialog = true
      }
    }
  }
}
</script>
