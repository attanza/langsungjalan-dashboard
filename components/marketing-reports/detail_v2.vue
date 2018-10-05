<template>
  <v-container fluid>
    <marketingTable :data="currentEdit"/>
    <contactTable/>
    <yearsTable/>
  </v-container>
</template>

<script>
import { global } from "~/mixins"
import marketingTable from "./marketingTable"
import contactTable from "./contactTable"
import yearsTable from "./yearsTable"

export default {
  components: { marketingTable, contactTable, yearsTable },
  mixins: [global],

  data() {
    return {}
  }
}
</script>

<style scoped>
</style>
