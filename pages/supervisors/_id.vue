<template>
  <div>
    <h2 class="primary--text mb-2">Supervisor Detail</h2>    
    <v-tabs align-with-title color="primary" class="white elevation-1" dark>
      <v-tabs-slider color="white"/>
      <v-tab href="#detail">
        Details
      </v-tab>
      <v-tab href="#marketings">
        Marketings
      </v-tab>
      <v-tab-item :id="'detail'">
        <detail/>
      </v-tab-item>
      <v-tab-item :id="'marketings'">
        <marketings/>
      </v-tab-item>
    </v-tabs>
  </div>
</template>

<script>
import { SUPERVISOR_URL } from "~/utils/apis"
import axios from "axios"
import { detail, dform, marketings } from "~/components/supervisors"
import catchError from "~/utils/catchError"

export default {
  async fetch({ store, params }) {
    try {
      let resp = await axios.get(SUPERVISOR_URL + "/" + params.id)
      store.commit("currentEdit", resp.data.data)
      // Combo / Select Data
      await store.dispatch("populateComboData", "Marketing")
    } catch (e) {
      catchError(e)
    }
  },
  components: { detail, dform, marketings }
}
</script>

<style scoped>
</style>
