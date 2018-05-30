<template>
  <div>
    <v-card dark>
      <v-container grid-list-md>
        <form>
          <v-layout row wrap class="mt-3 px-2">
            <v-flex v-for="(value, key, index) in data" v-if="!inArray(notIncludedKey, key)" :key="index" sm6 xs12>
              <label>{{ setCase(key) }}</label>
              <v-text-field
                :label="key.name"
                :value="value"
              />
            </v-flex>
          </v-layout>
          <v-layout row wrap class="mt-3 px-2">
            <v-flex xs12>
              <v-btn to="/universities"> <v-icon>chevron_left</v-icon> </v-btn>
              <v-btn color="primary">Save</v-btn>
            </v-flex>
          </v-layout>          
        </form>
      </v-container>
    </v-card>
  </div>
</template>

<script>
import { global } from "~/mixins"
export default {
  mixins: [global],
  data() {
    return {
      notIncludedKey: ["id", "created_at", "updated_at", "lat", "lng"]
    }
  },
  computed: {
    data() {
      return this.$store.state.currentEdit
    }
  }
}
</script>

<style scoped>
</style>
