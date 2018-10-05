<template>
  <div>
    <v-toolbar flat color="transparent">
      <v-toolbar-title style="margin-left: -10px;">Marketing</v-toolbar-title>
      <v-spacer/>
      <Tbtn :bottom="true" tooltip-text="Kembali" icon-mode color="primary" icon="chevron_left" @onClick="toHome"/>
    </v-toolbar>
    <table class="table is-fullwidth">
      <tbody>
        <tr>
          <th>Nama</th>
          <td>{{ data.marketing.name }}</td>
        </tr>
        <tr>
          <th>Action</th>
          <td>{{ data.action.name }}</td>
        </tr>
        <tr>
          <th>Metode</th>
          <td>{{ data.method }}</td>
        </tr>
        <tr>
          <th>Hari/Tanggal</th>
          <td>{{ formatDate(data.schedulle.start_date) }}</td>
        </tr>
        <tr>
          <th>Waktu</th>
          <td>{{ formatTime(data.schedulle.start_date) }} - {{ formatTime(data.schedulle.end_date) }}</td>
        </tr>
        <tr>
          <th>Program Studi</th>
          <td>{{ data.schedulle.study.studyName.name }}</td>
        </tr>
        <tr>
          <th>Universitas</th>
          <td>{{ data.schedulle.study.university.name }}</td>
        </tr>
        <tr>
          <th>Alamat</th>
          <td>{{ data.schedulle.study.address }}</td>
        </tr>
        <tr>
          <th>Kota/Kabupaten</th>
          <td>{{ data.schedulle.study.university.city }}</td>
        </tr>
        <tr>
          <th>Provinsi</th>
          <td>{{ data.schedulle.study.university.province }}</td>
        </tr>
        <tr>
          <th>Telepon</th>
          <td>{{ data.schedulle.study.phone }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import moment from "moment"
import "moment/locale/id"
moment.locale("id")
import { global } from "~/mixins"

export default {
  mixins: [global],
  props: {
    data: {
      type: Object,
      required: true
    }
  },
  methods: {
    toHome() {
      this.$router.push("/marketing-reports")
    },
    formatDate(date) {
      return moment(date).format("dddd / D MMMM YYYY")
    },
    formatTime(date) {
      return moment(date).format("HH:mm")
    }
  }
}
</script>
