<template>
  <div>
    <h2 class="primary--text mb-3">{{ title }}</h2>
    <v-card class="pt-3">
      <v-toolbar card color="transparent">
        <Tbtn :bottom="true" :tooltip-text="'Tambah ' + title " icon-mode color="primary" icon="add" @onClick="showForm = true"/>
        <Tbtn :bottom="true" :tooltip-text="'Download ' + title + ' data'" icon-mode color="primary" icon="cloud_download" @onClick="downloadData"/>       
        <v-spacer/>
        <Tbtn :bottom="true" :tooltip-text="'Refresh'" color="primary" icon="refresh" @onClick="resetTable"/>
        <Tbtn :bottom="true" :tooltip-text="'Cari'" color="primary" icon="search" @onClick="showSearch = true"/>

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
          <td >{{ props.item.code }}</td>
          <td v-if="props.item.marketing">{{ props.item.marketing.name }}</td>
          <td v-if="props.item.action">{{ props.item.action.name }}</td>
          <td vif="props.item.study.university">{{ props.item.study.university.name }}</td>
          <td v-if="props.item.study.studyName">{{ props.item.study.studyName.name }} </td>
          <td>{{ props.item.start_date | moment("DD MMM YYYY HH:mm:ss") }}</td>
          <td>{{ props.item.end_date | moment("DD MMM YYYY HH:mm:ss") }}</td>
          <!-- <td>{{ props.item.description }}</td> -->
          <td class="justify-center layout px-0">
            <v-btn icon class="mx-0" @click="toDetail(props.item)">
              <v-icon color="primary">remove_red_eye</v-icon>
            </v-btn>
          </td>
        </template>
      </v-data-table>
    </v-card>
    <dform :show="showForm" @onClose="showForm = false" @onAdd="addData"/>
    <searchForm :show-search="showSearch" @onClose="showSearch = false" @onSearch="onSearch"/>
    <DownloadDialog :show-dialog="showDownloadDialog" :data-to-export="dataToExport" :fillable="fillable" :type-dates="typeDates" model="Schedulle" @onClose="showDownloadDialog = false"/>


  </div>
</template>
<script>
import { COMBO_DATA_URL, SCHEDULLE_URL } from "~/utils/apis"
import { global } from "~/mixins"
import { dform, searchForm } from "~/components/schedulles"
import axios from "axios"
import catchError from "~/utils/catchError"
import DownloadDialog from "~/components/DownloadDialog"

export default {
  middleware: "auth",
  components: { dform, searchForm, DownloadDialog },
  mixins: [global],
  data: () => ({
    title: "Jadwal Marketing",
    headers: [
      { text: "Kode Jadwal", align: "left", value: "code" },
      { text: "Marketing", align: "left", value: "marketing_id" },
      { text: "Aksi Kegiatan", align: "left", value: "marketing_action_id" },
      { text: "Universitas", align: "left", value: "university_id" },
      { text: "Program Studi", align: "left", value: "study_id" },
      { text: "Tanggal Mulai", align: "left", value: "start_date" },
      { text: "Tanggal Akhir", align: "left", value: "end_date" },
      // { text: "Description", align: "left", value: "description" },
      { text: "Aksi", value: "", align: "center", sortable: false }
    ],
    items: [],
    showSearch: false,
    dataToExport: [],
    fillable: [
      "id",
      "marketing_id",
      "study_id",
      "marketing_action_id",
      "start_date",
      "end_date",
      "description",
      "created_at"
    ],
    typeDates: ["created_at"]
  }),
  watch: {
    pagination: {
      handler() {
        this.pupulateTable()
      },
      deep: true
    }
  },

  mounted() {
    this.pupulateTable()
    this.initStore()
  },

  methods: {
    async initStore() {
      try {
        this.activateLoader()

        // Marketing Combo Data
        let marketings = await axios.get(COMBO_DATA_URL + "MarketingAll")
        if (marketings) this.$store.commit("comboData", marketings.data)
        // Study Program Combo Data
        let studies = await axios.get(COMBO_DATA_URL + "University")
        if (studies) this.$store.commit("comboData2", studies.data)
        // Marketing Action Combo Data
        let actions = await axios.get(COMBO_DATA_URL + "Action")
        if (actions) this.$store.commit("comboData3", actions.data)
        this.deactivateLoader()
      } catch (e) {
        this.deactivateLoader()
        catchError(e)
      }
    },
    async pupulateTable() {
      try {
        this.activateLoader()
        this.loading = true

        const { descending, sortBy } = this.pagination
        const endPoint = `${SCHEDULLE_URL}?${this.getQueryParams()}`

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
      this.$router.push(`/schedulles/${data.id}`)
    },
    addData(data) {
      this.items.unshift(data)
      this.showForm = false
    },
    resetTable() {
      this.resetPagination()
      this.pupulateTable()
    },
    onSearch(data) {
      if (data.start_date == "null null") data.start_date = null
      if (data.end_date == "null null") data.end_date = null
      this.pagination.search_by = data.search_by || null
      this.pagination.search_query = data.search_query || null
      this.pagination.start_date = data.start_date
      this.pagination.end_date = data.end_date
      this.pagination.between_date = "start_date"
      this.showSearch = false
      this.pupulateTable()
    },
    downloadData() {
      this.dataToExport = []
      this.items.forEach(data => {
        let d = Object.assign({}, data)

        // Schedulle Marketing
        delete d.marketing
        delete d.marketing_id
        if (data.marketing) d.marketing = data.marketing.name

        // Add University Data
        d.university = data.study.university.name

        // Schedulle Study Program
        delete d.study
        delete d.study_id
        if (data.study) d.study = data.study.studyName.name

        // Schedulle Study Program
        delete d.action
        delete d.marketing_action_id
        if (data.action) d.action = data.action.name

        // Add Address Data
        d.address = data.study.address

        this.dataToExport.push(d)
      })
      if (this.dataToExport.length) {
        this.showDownloadDialog = true
      }
    }
  }
}
</script>
