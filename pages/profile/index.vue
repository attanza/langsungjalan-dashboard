<template>
  <div>
    <h2 class="primary--text mb-2">Profile Detail</h2>    
    <v-tabs align-with-title color="primary" class="white elevation-1" dark>
      <v-tabs-slider color="white"/>
      <v-tab href="#detail">
        Info
      </v-tab>
      <v-tab-item :id="'detail'">
        <detail/>
      </v-tab-item>
    </v-tabs>
  </div>
</template>

<script>
import { detail } from "~/components/profile"

export default {
  components: { detail }
}
</script>

<style scoped>
</style>
