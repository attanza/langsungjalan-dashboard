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
      let resp = await axios.get(SCHEDULLE_URL + "/" + params.id)
      store.commit("currentEdit", resp.data.data)

      // Marketing Combo Data
      let marketing = await axios
        .get(COMBO_DATA_URL + "MarketingAll")
        .then(res => res.data)
      store.commit("comboData", marketing)
      // Study Program Combo Data
      let study = await axios
        .get(COMBO_DATA_URL + "StudyProgram")
        .then(res => res.data.data)
      store.commit("comboData2", study)
      // Marketing Action Combo Data
      let action = await axios
        .get(COMBO_DATA_URL + "Action")
        .then(res => res.data)
      store.commit("comboData3", action)
    } catch (e) {
      console.log(e)
    }
  },
  components: { detail, dform }
}
</script>

<style scoped>
</style>
