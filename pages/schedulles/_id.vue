<template>
  <div>
    <h2 class="primary--text mb-2">Detail Jadwal</h2>    
    <v-tabs align-with-title color="primary" class="white elevation-1" dark>
      <v-tabs-slider color="white"/>
      <v-tab href="#detail">
        Detail
      </v-tab>
      <v-tab href="#report">
        Report
      </v-tab>
      <v-tab-item :id="'detail'">
        <detail/>
      </v-tab-item>
      <v-tab-item :id="'report'">
        <report/>
      </v-tab-item>
    </v-tabs>
  </div>
</template>

<script>
import { SCHEDULLE_URL, COMBO_DATA_URL } from "~/utils/apis"
import axios from "axios"
import { detail, dform, report } from "~/components/schedulles"
import catchError from "~/utils/catchError"

export default {
  async fetch({ store, params }) {
    try {
      let currentEdit = await axios.get(SCHEDULLE_URL + "/" + params.id)
      if (currentEdit) store.commit("currentEdit", currentEdit.data.data)
      // Marketing Combo Data
      let marketings = await axios.get(COMBO_DATA_URL + "MarketingAll")
      if (marketings) store.commit("comboData", marketings.data)
      // Marketing Action Combo Data
      let actions = await axios.get(COMBO_DATA_URL + "Action")
      if (actions) store.commit("comboData2", actions.data)
    } catch (e) {
      catchError(e)
    }
  },
  components: { detail, dform, report }
}
</script>

<style scoped>
</style>
