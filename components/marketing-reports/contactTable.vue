<template>
  <div>
    <v-toolbar flat color="transparent">
      <v-toolbar-title style="margin-left: -10px;">Contact Person</v-toolbar-title>
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
        <td>{{ props.item.name }}</td>
        <td>{{ props.item.title }}</td>
        <td>{{ props.item.phone }}</td>
        <td>{{ props.item.email }}</td>
        <td class="justify-center layout px-0">
          <Tbtn :tooltip-text="'Hapus'" icon-mode flat color="primary" icon="delete" @onClick="showConfirm(props.item)"/>
        </td>
      </template>
    </v-data-table>
    <Dialog :showDialog="showDialog" text="Yakin mau menghapus ?" @onClose="showDialog = false" @onConfirmed="removeData"/>
  </div>
</template>

<script>
import { REPORT_CONTACT_URL } from "~/utils/apis"
import catchError, { showNoty } from "~/utils/catchError"
import axios from "axios"
import { global } from "~/mixins"
import _ from "lodash"
import Dialog from "~/components/Dialog"

export default {
  components: { Dialog },
  mixins: [global],
  data() {
    return {
      headers: [
        { text: "Nama", align: "left", value: "name" },
        { text: "Jabatan", align: "left", value: "title" },
        { text: "Telepon", align: "left", value: "phone" },
        { text: "Email", align: "left", value: "email" },
        { text: "Aksi", value: "name", sortable: false }
      ],
      items: [],
      showDialog: false,
      dataToDelete: null
    }
  },
  watch: {
    pagination: {
      handler() {
        this.pupulateTable()
      },
      deep: true
    },
    search() {
      if (this.search == "" || this.search.length > 2) {
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
        const endPoint = `${REPORT_CONTACT_URL}?page=${page}&limit=${rowsPerPage}&search=${
          this.search
        }&marketing_report_id=${this.currentEdit.id}&sort_by=name&sort_mode=asc`
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
    showConfirm(data) {
      this.showDialog = true
      this.dataToDelete = data
    },
    removeData() {
      try {
        this.activateLoader()
        axios
          .delete(REPORT_CONTACT_URL + "/" + this.dataToDelete.id)
          .then(resp => {
            if (resp.status === 200) {
              let index = _.findIndex(
                this.items,
                item => item.id == this.dataToDelete.id
              )
              this.items.splice(index, 1)
              showNoty("Data dihapus", "success")
              this.showDialog = false
              this.dataToDelete = null
            }
          })
        this.deactivateLoader()
      } catch (e) {
        this.deactivateLoader()
        catchError(e)
      }
    }
  }
}
</script>

<style scoped>
</style>
