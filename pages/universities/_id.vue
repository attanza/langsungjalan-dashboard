<template>
  <div>
    <h2 class="mb-2 primary--text">University Detail</h2>
    <v-tabs align-with-title color="primary" class="white elevation-1" dark>
      <v-tabs-slider color="white"/>
      <v-tab href="#detail">
        Details
      </v-tab>
      <v-tab href="#maps">
        Maps
      </v-tab>
      <v-tab-item :id="'detail'">
        <detail/>
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
export default {
  async fetch({ store, params }) {
    try {
      let resp = await axios.get(UNIVERSITY_URL + "/" + params.id)
      store.commit("currentEdit", resp.data.data)
    } catch (e) {
      console.log(e)
    }
  },
  components: { detail, dform, maps }
}
</script>

<style scoped>
</style>
