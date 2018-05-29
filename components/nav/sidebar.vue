<template>
  <div>
    <v-navigation-drawer
      v-model="drawer"
      color="grey darken-4"
      dark
      fixed
      app
    >
      <v-list>
        <v-list-tile>
          <img src="/images/logo2.png" alt="" width="50%" style="margin-left: -10px;">
        </v-list-tile>
      </v-list>
      <v-list>
        <v-list-tile
          v-for="(item, i) in items"
          :to="item.to"
          :key="i"
          router
          exact
        >
          <v-list-tile-action>
            <v-icon v-html="item.icon"/>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title v-text="item.title"/>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>
    <v-toolbar color="primary" dark fixed app>
      <v-toolbar-side-icon @click="drawer = !drawer"/>
      <v-spacer/>
      <v-toolbar-items>
        <v-btn icon @click="logout">
          <v-icon>exit_to_app</v-icon>
        </v-btn>
      </v-toolbar-items>
    </v-toolbar>
  </div>
</template>

<script>
import Cookie from "js-cookie"

export default {
  data() {
    return {
      clipped: false,
      drawer: true,
      fixed: false,
      items: [],
      miniVariant: false,
      right: true,
      rightDrawer: false,
      title: "Langsung Jalan"
    }
  },
  methods: {
    logout() {
      Cookie.remove("lj_token")
      this.$store.commit("token", null)
      this.$store.commit("user", {})
      this.$router.push("/login")
    }
  }
}
</script>

<style scoped>
</style>
