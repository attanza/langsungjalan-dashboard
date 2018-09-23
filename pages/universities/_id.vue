<template>
  <div>
    <h2 class="primary--text mb-2">University Detail</h2>    
    <v-tabs align-with-title color="primary" class="white elevation-1" dark>
      <v-tabs-slider color="white"/>
      <v-tab href="#detail">
        Details
      </v-tab>
      <v-tab href="#study">
        Study Programs
      </v-tab>
      <v-tab href="#maps">
        Maps
      </v-tab>
      <v-tab-item :id="'detail'">
        <detail/>
      </v-tab-item>
      <v-tab-item :id="'study'">
        <study/>
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
import { detail, dform, maps, study } from "~/components/university"
import catchError from "~/utils/catchError"

export default {
  async fetch({ store, params }) {
    try {
      let resp = await axios.get(UNIVERSITY_URL + "/" + params.id)
      if (resp) store.commit("currentEdit", resp.data.data)
    } catch (e) {
      catchError(e)
    }
  },
  components: { detail, dform, maps, study }
}
</script>

<style scoped>
</style>
