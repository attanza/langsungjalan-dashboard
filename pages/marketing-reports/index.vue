<template>
  <div>
    <h2 class="primary--text mb-3">{{ title }}</h2>
    <v-card class="pt-3">
      <v-toolbar card color="transparent">
        <!-- <Tbtn :bottom="true" :tooltip-text="'Tambah ' + title " icon-mode color="primary" icon="add" @onClick="showForm = true"/>
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
          <td>{{ props.item.schedulle ? props.item.schedulle.code : "" }}</td>
          <td>{{ props.item.schedulle.marketing ? props.item.schedulle.marketing.name : "" }}</td>
          <td>{{ props.item.method }}</td>
          <td>{{ props.item.schedulle.study.university ? props.item.schedulle.study.university.name : "" }}</td>
          <td>{{ props.item.schedulle.study.studyName ? props.item.schedulle.study.studyName.name : "" }}</td>

          <td>{{ props.item.schedulle_date }}</td>
          <td class="justify-center layout px-0">
            <v-btn icon class="mx-0" @click="toDetail(props.item)">
              <v-icon color="primary">remove_red_eye</v-icon>
            </v-btn>
          </td>
        </template>
      </v-data-table>
    </v-card>
    <dform :show="showForm" @onClose="onClose"/>
  </div>
</template>
<script>
import debounce from "lodash/debounce"
import { MARKETING_REPORTS_URL, COMBO_DATA_URL } from "~/utils/apis"
import { global } from "~/mixins"
import catchError from "~/utils/catchError"
import axios from "axios"
import { dform } from "~/components/marketing-reports"

export default {
  components: { dform },
  mixins: [global],
  data: () => ({
    title: "Laporan Marketing",
    headers: [
      { text: "Kode Jadwal", align: "left", value: "schedulle.code" },
      { text: "Marketing", align: "left", value: "schedulle.marketing.name" },
      { text: "Metode", align: "left", value: "method" },
      {
        text: "Universitas",
        align: "left",
        value: "schedulle.study.university.name"
      },
      {
        text: "Program Studi",
        align: "left",
        value: "schedulle.study.studyName.name"
      },
      { text: "Tanggal", align: "left", value: "schedulle_date" },
      { text: "Aksi", value: "", align: "center", sortable: false }
    ],
    items: [],
    confirmMessage: "Yakin mau menghapus ?",
    showConfirm: false,
    showForm: false
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
    // this.initStore()
  },

  methods: {
    async initStore() {
      let action = await axios.get(COMBO_DATA_URL + "Action")
      if (action) this.$store.commit("comboData", action.data)
      let marketing = await axios.get(COMBO_DATA_URL + "MarketingAll")
      if (marketing) this.$store.commit("comboData2", marketing.data)
      let university = await axios.get(COMBO_DATA_URL + "University")
      if (university) this.$store.commit("comboData3", university.data)
    },
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
    },
    onClose() {
      this.showForm = false
    }
  }
}
</script>
