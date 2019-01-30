<template>
  <div>
    <h2 class="primary--text mb-2">Detail Target</h2>
    <v-tabs align-with-title color="primary" class="white elevation-1" dark>
      <v-tabs-slider color="white"/>
      <v-tab href="#detail">Detail</v-tab>
      <v-tab href="#schedulles">Jadwal</v-tab>
      <v-tab href="#reports">Laporan</v-tab>
      <v-tab href="#dps">Down Payment</v-tab>
      <v-tab-item :id="'detail'">
        <detail/>
      </v-tab-item>
      <v-tab-item :id="'schedulles'">
        <schedulleList/>
      </v-tab-item>
      <v-tab-item :id="'reports'">
        <reportList/>
      </v-tab-item>
      <v-tab-item :id="'dps'">
        <dpList/>
      </v-tab-item>
    </v-tabs>
  </div>
</template>

<script>
import { TARGET_URL, COMBO_DATA_URL } from "~/utils/apis"
import axios from "axios"
import { detail } from "~/components/targets"
import { schedulleList } from "~/components/schedulles"
import { reportList } from "~/components/marketing-reports"
import { dpList } from "~/components/down-payments"

import catchError from "~/utils/catchError"

export default {
  async fetch({ store, params, redirect }) {
    try {
      store.commit("targetId", params.id || null)
      let currentEdit = await axios.get(TARGET_URL + "/" + params.id)
      if (currentEdit) store.commit("currentEdit", currentEdit.data.data)
      // University Combo Data
      let universities = await axios.get(COMBO_DATA_URL + "University")
      if (universities) store.commit("comboData", universities.data)
      // Study Program Combo Data
      let studies = await axios.get(COMBO_DATA_URL + "StudyProgram")
      if (studies) store.commit("comboData2", studies.data)
    } catch (e) {
      if (process.client) catchError(e)
      else {
        redirect("/")
      }
    }
  },
  components: { schedulleList, detail, reportList, dpList },
  mounted() {
    this.$store.commit("targetId", this.$route.params.id || null)
  }
}
</script>
