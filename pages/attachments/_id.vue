<template>
  <div>
    <h2 class="primary--text mb-2">Detail Kontak</h2>
    <v-tabs align-with-title color="primary" class="white elevation-1" dark>
      <v-tabs-slider color="white"/>
      <v-tab href="#detail">Detail</v-tab>
      <v-tab-item :id="'detail'">
        <detail/>
      </v-tab-item>
    </v-tabs>
  </div>
</template>

<script>
import { CONTACT_URL } from "~/utils/apis"
import axios from "axios"
import { detail, dform } from "~/components/contacts"
import catchError from "~/utils/catchError"

export default {
  async fetch({ store, params, redirect }) {
    try {
      let resp = await axios.get(CONTACT_URL + "/" + params.id)
      store.commit("currentEdit", resp.data.data)
    } catch (e) {
      if (process.client) catchError(e)
      else {
        redirect("/")
      }
    }
  },
  components: { detail, dform }
}
</script>

<style scoped>
</style>
