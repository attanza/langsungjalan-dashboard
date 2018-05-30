<template>
  <v-card>
    <v-container>
      <v-layout row wrap>
        <v-flex sm6 xs12>
          <h3>Name</h3>
          <p>{{ data.name }}</p>
        </v-flex>
      </v-layout>
    </v-container>
  </v-card>
</template>

<script>
export default {
  computed: {
    data() {
      return this.$store.state.currentEdit
    }
  }
}
</script>

<style scoped>
</style>
