<template>
  <div>
    <h2 class="primary--text mb-2">Detail Perguruan Tinggi</h2>
    <v-tabs align-with-title color="primary" class="white elevation-1" dark>
      <v-tabs-slider color="white"/>
      <v-tab href="#detail">Detail</v-tab>
      <v-tab href="#study">Program Studi</v-tab>
      <v-tab href="#reports">Laporan</v-tab>

      <v-tab href="#maps">Peta</v-tab>
      <v-tab-item :id="'detail'">
        <detail/>
      </v-tab-item>
      <v-tab-item :id="'study'">
        <studyList/>
      </v-tab-item>
      <v-tab-item :id="'reports'">
        <reportList/>
      </v-tab-item>
      <v-tab-item :id="'maps'">
        <maps/>
      </v-tab-item>
    </v-tabs>
  </div>
</template>

<script>
import { UNIVERSITY_URL } from "~/utils/apis"
import axios from "axios"
import { detail, dform, maps } from "~/components/university"
import { studyList } from "~/components/studies"
import { reportList } from "~/components/marketing-reports"

import catchError from "~/utils/catchError"

export default {
  async fetch({ store, params, redirect }) {
    try {
      store.commit("universityId", params.id || null)
      let resp = await axios.get(UNIVERSITY_URL + "/" + params.id)
      if (resp) store.commit("currentEdit", resp.data.data)
    } catch (e) {
      if (process.client) catchError(e)
      else {
        redirect("/")
      }
    }
  },
  components: { detail, dform, maps, studyList, reportList },
  mounted() {
    this.$store.commit("universityId", this.$route.params.id || null)
  }
}
</script>

<style scoped>
</style>
