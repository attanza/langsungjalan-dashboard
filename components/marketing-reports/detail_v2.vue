<template>
  <v-container fluid>
    <marketingTable :data="currentEdit"/>
    <contactTable/>
    <yearsTable/>
    <table class="table is-fullwidth">
      <tbody>
        <tr>
          <th width="30%">Birokrasi Perizinan</th>
          <td width="70%">{{ currentEdit.terms }}</td>
        </tr>
        <tr>
          <th>Kodisi Lapangan</th>
          <td>{{ currentEdit.description }}</td>
        </tr>
      </tbody>
    </table>
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
