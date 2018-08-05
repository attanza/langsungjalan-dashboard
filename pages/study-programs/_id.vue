<template>
  <div>
    <h2 class="primary--text mb-2">Study Programs Detail</h2>    
    <v-tabs align-with-title color="primary" class="white elevation-1" dark>
      <v-tabs-slider color="white"/>
      <v-tab href="#detail">
        Details
      </v-tab>
      <v-tab href="#years">
        Years
      </v-tab>
      <v-tab href="#maps">
        Maps
      </v-tab>
      <v-tab-item :id="'detail'">
        <detail/>
      </v-tab-item>
      <v-tab-item :id="'years'">
        <list/>
      </v-tab-item>
      <v-tab-item :id="'maps'">
        <maps/>
      </v-tab-item>
    </v-tabs>
  </div>
</template>

<script>
import { STUDIES_URL, COMBO_DATA_URL } from "~/utils/apis"
import axios from "axios"
import { detail, dform, maps } from "~/components/studies"
import { list } from "~/components/studies/years"

import catchError from "~/utils/catchError"
export default {
  async fetch({ store, params }) {
    try {
      // Current Edit
      let resp = await axios.get(STUDIES_URL + "/" + params.id)
      store.commit("currentEdit", resp.data.data)
      // Combo / Select Data
      let resp2 = await await axios
        .get(COMBO_DATA_URL + "University")
        .then(res => res.data)
        .catch(e => catchError(e))
      store.commit("comboData", resp2)

      let resp3 = await await axios
        .get(COMBO_DATA_URL + "StudyName")
        .then(res => res.data)
      store.commit("comboData2", resp3)
    } catch (e) {
      catchError(e)
    }
  },
  components: { detail, dform, maps, list }
}
</script>

<style scoped>
</style>
