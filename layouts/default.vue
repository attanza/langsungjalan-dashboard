<template>
  <v-app>
    <sidebar/>
    <v-content>
      <v-container fluid grid-list-lg>
        <nuxt />
      </v-container>
    </v-content>
    <v-footer fixed app>
      <span>&copy; 2018</span>
    </v-footer>
  </v-app>
</template>

<script>
import sidebar from "@/components/nav/sidebar"
export default {
  middleware: "auth",
  components: { sidebar }
}
</script>
