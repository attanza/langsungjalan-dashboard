<template>
  <div>
    <h2 class="primary--text mb-2">Detail Program Studi</h2>
    <v-tabs align-with-title color="primary" class="white elevation-1" dark>
      <v-tabs-slider color="white"/>
      <v-tab href="#detail">Detail</v-tab>
      <v-tab href="#years">Angkatan</v-tab>
      <v-tab href="#maps">Peta</v-tab>
      <v-tab href="#targets">Target</v-tab>
      <v-tab-item :id="'detail'">
        <detail/>
      </v-tab-item>
      <v-tab-item :id="'years'">
        <list/>
      </v-tab-item>
      <v-tab-item :id="'maps'">
        <maps/>
      </v-tab-item>
      <v-tab-item :id="'targets'">
        <targets/>
      </v-tab-item>
    </v-tabs>
  </div>
</template>

<script>
import { STUDIES_URL, COMBO_DATA_URL } from "~/utils/apis"
import axios from "axios"
import { detail, dform, maps } from "~/components/studies"
import { list } from "~/components/studies/years"
import { list as targets } from "~/components/targets"

import catchError from "~/utils/catchError"
export default {
  async fetch({ store, params, redirect }) {
    try {
      store.commit("studyId", params.id || null)
      // Current Edit
      let currentEdit = await axios.get(STUDIES_URL + "/" + params.id)
      if (currentEdit) store.commit("currentEdit", currentEdit.data.data)

      let resp = await axios.get(COMBO_DATA_URL + "University")
      if (resp) store.commit("comboData", resp.data)
      let resp2 = await axios.get(COMBO_DATA_URL + "StudyName")
      if (resp2) store.commit("comboData2", resp2.data)
    } catch (e) {
      if (process.client) catchError(e)
      else {
        redirect("/")
      }
    }
  },
  components: { detail, dform, maps, list, targets },
  data() {
    return {
      studyId: ""
    }
  },
  created() {
    this.$store.commit("studyId", this.$route.params.id || null)
  }
}
</script>

<style scoped>
</style>
