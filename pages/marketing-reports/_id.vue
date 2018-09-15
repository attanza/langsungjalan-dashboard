<template>
  <div>
    <h2 v-if="currentEdit" class="primary--text mb-2">Marketing Report</h2>    
    <v-tabs align-with-title color="primary" class="white elevation-1" dark>
      <v-tabs-slider color="white"/>
      <v-tab href="#detail">
        Details
      </v-tab>
      <v-tab href="#maps">
        Maps
      </v-tab>
      <v-tab href="#attachments">
        Attachments
      </v-tab>
      <v-tab-item :id="'detail'">
        <detail/>
      </v-tab-item>
      <v-tab-item :id="'maps'">
        <maps/>
      </v-tab-item>
      <v-tab-item :id="'attachments'">
        <list/>
      </v-tab-item>
    </v-tabs>
  </div>
</template>

<script>
import { MARKETING_REPORTS_URL, COMBO_DATA_URL } from "~/utils/apis"
import axios from "axios"
import { detail, maps } from "~/components/marketing-reports"
import { list } from "~/components/marketing-reports/attachments"

import { global } from "~/mixins"
import catchError from "~/utils/catchError"

export default {
  async fetch({ store, params }) {
    try {
      let resp = await axios.get(MARKETING_REPORTS_URL + "/" + params.id)
      if (resp) store.commit("currentEdit", resp.data.data)

      let marketings = await axios.get(COMBO_DATA_URL + "MarketingAll")
      if (marketings) store.commit("comboData", marketings.data)

      let actions = await axios.get(COMBO_DATA_URL + "Action")
      if (actions) store.commit("comboData2", actions.data)
    } catch (e) {
      catchError(e)
    }
  },
  components: { detail, maps, list },
  mixins: [global]
}
</script>

<style scoped>
</style>
