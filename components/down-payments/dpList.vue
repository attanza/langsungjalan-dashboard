<template>
  <div>
    <v-card class="pt-3">
      <v-toolbar card color="transparent">
        <Tbtn :bottom="true" :tooltip-text="'Tambah ' + title " icon-mode color="primary" icon="add" @onClick="showForm = true"/>
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
          <td>
            <v-checkbox
              :input-value="props.item.is_verified"
              hide-details
              color="primary"
              @change="editData(props.item)"
            />
          </td>
          <td><a @click="toDetail(props.item)">{{ props.item.target ? props.item.target.code : '' }}</a></td>
          <td>{{ props.item.name }}</td>
          <td>{{ props.item.phone }}</td>
          <td>{{ props.item.dp.toLocaleString('id') }}</td>
        </template>
      </v-data-table>
    </v-card>
    <dform :show="showForm" @onClose="showForm = false" @onAdd="addData"/>
    <DownloadDialog :show-dialog="showDownloadDialog" :data-to-export="dataToExport" :fillable="fillable" :type-dates="typeDates" model="Down Payments" @onClose="showDownloadDialog = false"/>

  </div>
</template>
<script>
import debounce from "lodash/debounce"
import { DP_URL } from "~/utils/apis"
import { global } from "~/mixins"
import dform from "./dform"
import axios from "axios"
import DownloadDialog from "~/components/DownloadDialog"
import catchError, { showNoty } from "~/utils/catchError"

export default {
  components: { dform, DownloadDialog },
  mixins: [global],

  props: {
    targetId: {
      type: String,
      required: false,
      default: ""
    }
  },
  data: () => ({
    title: "Down Payment",
    headers: [
      { text: "Verified", align: "left", value: "is_verified" },
      { text: "Kode Target", align: "left", value: "marketing_target_id" },
      { text: "Nama", align: "left", value: "name" },
      { text: "Telepon", align: "left", value: "phone" },
      { text: "DP", align: "left", value: "dp" }
    ],
    items: [],
    confirmMessage: "Yakin mau menghapus ?",
    showConfirm: false,
    dataToExport: [],
    fillable: ["id", "marketing_target_id", "name", "phone", "dp"],
    typeDates: ["created_at"],
    checkbox: false
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
  },

  methods: {
    async pupulateTable() {
      try {
        this.activateLoader()
        const { descending, sortBy } = this.pagination
        const endPoint = `${DP_URL}?${this.getQueryParams()}&marketing_target_id=${
          this.targetId
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
    },
    async editData(data) {
      try {
        data.is_verified = !data.is_verified
        this.activateLoader()
        const resp = await axios
          .put(`${DP_URL}/${data.id}`, data)
          .then(res => res.data)
        if (resp.meta.status === 200) {
          showNoty("Data diperbaharui", "success")
        }
        this.deactivateLoader()
      } catch (e) {
        this.deactivateLoader()
        catchError(e)
      }
    }
  }
}
</script>
