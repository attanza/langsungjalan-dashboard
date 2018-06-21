<template>
  <div>
    <h2 class="primary--text mb-2">Product Detail</h2>    
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
import { PRODUCT_URL } from "~/utils/apis"
import axios from "axios"
import { detail, dform } from "~/components/products"
export default {
  async fetch({ store, params }) {
    try {
      let resp = await axios.get(PRODUCT_URL + "/" + params.id)
      store.commit("currentEdit", resp.data.data)
    } catch (e) {
      console.log(e)
    }
  },
  components: { detail, dform }
}
</script>

<style scoped>
</style>
