<template>
  <div>
    <v-toolbar flat color="transparent">
      <v-toolbar-title style="margin-left: -10px;">Contact Person</v-toolbar-title>
    </v-toolbar>
    <table class="table is-fullwidth">
      <thead>
        <tr>
          <th>Nama</th>
          <th>Jabatan</th>
          <th>Telepon</th>
          <th>Email</th>
        </tr>
      </thead>
      <tbody v-if="contacts.length > 0">
        <tr v-for="contact in contacts" :key="contact.id">
          <td>{{ contact.name }}</td>
          <td>{{ contact.title }}</td>
          <td>{{ contact.phone }}</td>
          <td>{{ contact.email }}</td>
        </tr>
      </tbody>
      <tbody v-else>
        <tr>
          <td colspan="4" align="center">
            Belum ada kontak untuk laporan ini
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import { REPORT_CONTACT_URL } from "~/utils/apis"
import catchError from "~/utils/catchError"
import axios from "axios"
import { global } from "~/mixins"

export default {
  mixins: [global],
  data() {
    return {
      contacts: []
    }
  },
  mounted() {
    this.fetchData()
  },
  methods: {
    async fetchData() {
      try {
        this.activateLoader()
        this.contacts = await axios
          .get(
            `${REPORT_CONTACT_URL}?marketing_report_id=${
              this.currentEdit.id
            }&sort_by=name&sort_mode=asc`
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
