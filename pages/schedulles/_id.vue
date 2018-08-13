<template>
  <div>
    <h2 class="primary--text mb-2">Schedule Detail</h2>    
    <v-tabs align-with-title color="primary" class="white elevation-1" dark>
      <v-tabs-slider color="white"/>
      <v-tab href="#detail">
        Details
      </v-tab>
      <v-tab-item :id="'detail'">
        <detail/>
      </v-tab-item>
    </v-tabs>
  </div>
</template>

<script>
import { SCHEDULLE_URL, COMBO_DATA_URL } from "~/utils/apis"
import axios from "axios"
import { detail, dform } from "~/components/schedulles"
export default {
  async fetch({ store, params }) {
    try {
      let currentEdit = await axios.get(SCHEDULLE_URL + "/" + params.id)
      if (currentEdit) store.commit("currentEdit", currentEdit.data.data)

      // Marketing Combo Data
      let marketings = await axios.get(COMBO_DATA_URL + "MarketingAll")
      if (marketings) store.commit("comboData", marketings.data)
      // Study Program Combo Data
      let studies = await axios.get(COMBO_DATA_URL + "StudyProgram")
      if (studies) store.commit("comboData2", studies.data)
      // Marketing Action Combo Data
      let actions = await axios.get(COMBO_DATA_URL + "Action")
      if (actions) store.commit("comboData3", actions.data)
    } catch (e) {
      console.log(e)
    }
  },
  components: { detail, dform }
}
</script>

<style scoped>
</style>
