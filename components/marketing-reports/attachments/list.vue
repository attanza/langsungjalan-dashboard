<template>
  <div>
    <v-card dark>
      <v-card dark class="pt-3">
        <v-toolbar card color="transparent">
          <v-text-field
            v-model="search"
            append-icon="search"
            label="Search"
            single-line
            hide-details
          />
          <v-spacer/>
          <Tbtn color="primary" icon="chevron_left" icon-mode tooltip-text="Back to List" @onClick="toHome"/>
          <Tbtn :bottom="true" :tooltip-text="'Upload New ' + title " icon-mode color="primary" icon="add" @onClick="showForm = true"/>
          
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
            <td>
              <a :href="props.item.url" target="_blank">
                <v-avatar
                  tile
                  size="36"
                  color="grey lighten-4"
                >
                  <img :src="props.item.url" :alt="props.item.caption">
                </v-avatar>
              </a>
            
            </td>
            <td>{{ props.item.caption }}</td>
            <td>{{ props.item.tags }}</td>
            <td>
              <v-btn icon class="mx-0" @click="showEdit(props.item)">
                <v-icon color="white">edit</v-icon>
              </v-btn>
              <v-btn icon class="mx-0" @click="showConfirm(props.item)">
                <v-icon color="white">delete</v-icon>
              </v-btn>
            </td>
          </template>
        </v-data-table>
      </v-card>
      <dform :show="showForm" :is-edit="isEdit" :data="dataToEdit" @onClose="showForm = false" @onAdd="addData" @onEdit="editData"/>
      <Dialog :showDialog="showDialog" text="Are you sure want to delete ?" @onClose="showDialog = false" @onConfirmed="removeData"/>

  </v-card></div>
</template>
<script>
import _ from "lodash"
import { MARKETING_REPORT_ATTACHMENTS_URL } from "~/utils/apis"
import { global } from "~/mixins"
import Dialog from "~/components/Dialog"
import axios from "axios"
import dform from "./dform"
import catchError, { showNoty } from "~/utils/catchError"

export default {
  components: { dform, Dialog },
  mixins: [global],
  data: () => ({
    title: "Attachment",
    headers: [
      { text: "Preview", align: "left", value: "url" },
      { text: "Caption", value: "caption" },
      { text: "Tags", value: "tags" },
      { text: "Actions", value: "name", sortable: false }
    ],
    items: [],
    confirmMessage: "Are you sure want to delete this ?",
    showDialog: false,
    isEdit: false,
    dataToEdit: null,
    dataToDelete: null
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
    toHome() {
      this.$router.push("/marketing-reports")
    },
    searchQuery: _.debounce(function() {
      this.pupulateTable()
    }, 500),
    async pupulateTable() {
      try {
        this.activateLoader()
        this.loading = true
        const { page, rowsPerPage, descending, sortBy } = this.pagination
        const endPoint = `${MARKETING_REPORT_ATTACHMENTS_URL}?page=${page}&limit=${rowsPerPage}&search=${
          this.search
        }&marketing_report_id=${this.currentEdit.id}`
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
      }
    },
    showEdit(data) {
      this.dataToEdit = data
      this.isEdit = true
      this.showForm = true
    },
    addData(data) {
      this.items.unshift(data)
      this.showForm = false
    },
    editData(data) {
      let index = _.findIndex(this.items, item => item.id == data.id)
      this.items.splice(index, 1, data)
      this.dataToEdit = null
      this.isEdit = false
      this.showForm = false
    },
    showConfirm(data) {
      this.showDialog = true
      this.dataToDelete = data
    },
    removeData() {
      try {
        this.activateLoader()
        axios
          .delete(MARKETING_REPORT_ATTACHMENTS_URL + "/" + this.dataToDelete.id)
          .then(resp => {
            if (resp.status === 200) {
              let index = _.findIndex(
                this.items,
                item => item.id == this.dataToDelete.id
              )
              this.items.splice(index, 1)
              showNoty("Data deleted", "success")
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
