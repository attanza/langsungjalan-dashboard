<template>
  <div>
    <h2 class="primary--text mb-2">Detail Produk</h2>    
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
import { DP_URL } from "~/utils/apis"
import axios from "axios"
import { detail } from "~/components/down-payments"
import catchError from "~/utils/catchError"

export default {
  async fetch({ store, params }) {
    try {
      let resp = await axios.get(DP_URL + "/" + params.id)
      store.commit("currentEdit", resp.data.data)
    } catch (e) {
      catchError(e)
    }
  },
  components: { detail }
}
</script>

<style scoped>
</style>
