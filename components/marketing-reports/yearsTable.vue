<template>
  <div>
    <v-toolbar flat color="transparent">
      <v-toolbar-title style="margin-left: -10px;">Angkatan</v-toolbar-title>
    </v-toolbar>
    <table class="table is-fullwidth">
      <thead>
        <tr>
          <th>Tahun</th>
          <th>Jumlah Kelas</th>
          <th>Rata-rata Siswa / Kelas</th>
        </tr>
      </thead>
      <tbody v-if="years.length > 0">
        <tr v-for="year in years" :key="year.id">
          <td>{{ year.year }}</td>
          <td>{{ year.class }}</td>
          <td>{{ year.students }}</td>
        </tr>
      </tbody>
      <tbody v-else>
        <tr>
          <td colspan="4" align="center">
            Belum ada angkatan untuk laporan ini
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import { REPORT_YEARS } from "~/utils/apis"
import catchError from "~/utils/catchError"
import axios from "axios"
import { global } from "~/mixins"
export default {
  mixins: [global],
  data() {
    return {
      years: []
    }
  },
  mounted() {
    this.fetchData()
  },
  methods: {
    async fetchData() {
      try {
        this.activateLoader()
        this.years = await axios
          .get(
            `${REPORT_YEARS}?marketing_report_id=${
              this.currentEdit.id
            }&sort_by=year&sort_mode=asc`
          )
          .then(res => res.data.data)
        this.deactivateLoader()
      } catch (e) {
        this.deactivateLoader()
        catchError(e, null, this.$router)
      }
    }
  }
}
</script>

<style scoped>
</style>
