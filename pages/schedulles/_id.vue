<template>
  <div>
    <h2 class="primary--text mb-2">Detail Jadwal</h2>    
    <v-tabs align-with-title color="primary" class="white elevation-1" dark>
      <v-tabs-slider color="white"/>
      <v-tab href="#detail">
        Detail
      </v-tab>
      <v-tab-item :id="'detail'">
        <detail/>
      </v-tab-item>
    </v-tabs>
  </div>
</template>

<script>
import { SCHEDULLE_URL } from "~/utils/apis"
import axios from "axios"
import { detail, dform } from "~/components/schedulles"
import catchError from "~/utils/catchError"

export default {
  async fetch({ store, params }) {
    try {
      let currentEdit = await axios.get(SCHEDULLE_URL + "/" + params.id)
      if (currentEdit) store.commit("currentEdit", currentEdit.data.data)
    } catch (e) {
      catchError(e)
    }
  },
  components: { detail, dform }
}
</script>

<style scoped>
</style>
