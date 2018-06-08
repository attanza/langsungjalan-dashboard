<template>
  <div>
    <v-navigation-drawer
      v-model="drawer"
      :mini-variant.sync="mini"
      color="grey darken-4"
      dark
      fixed
      app
    >
      <v-toolbar flat class="transparent">
        <v-list class="pa-0">
          <v-list-tile>
            <v-list-tile-content v-if="!mini">
              <img src="/images/logo2.png" width="50%" style="margin-left: -10px;">
            </v-list-tile-content>
            <v-list-tile-avatar v-if="mini">
              <img src="/images/logo.png" >
            </v-list-tile-avatar>
            <v-list-tile-action>
              <v-btn icon @click.native.stop="mini = !mini">
                <v-icon>chevron_left</v-icon>
              </v-btn>
            </v-list-tile-action>
          </v-list-tile>
        </v-list>
      </v-toolbar>
      <v-list>
          
        <div v-for="(item, i) in items" :key="i" >
          <v-list-tile
            v-if="!item.hasChild"
            :to="item.to"
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
          <v-list-group
            v-if="item.hasChild"
            :prepend-icon="item.icon"
            value="true"
            no-action
          >
            <v-list-tile slot="activator">
              <v-list-tile-title>{{ item.title }}</v-list-tile-title>
            </v-list-tile>
            <v-list-tile
              v-for="(item, i) in item.children"
              :key="i"
              :to="item.to"
              router
              exact
            >

              <v-list-tile-content>
                <v-list-tile-title v-text="item.title"/>
              </v-list-tile-content>
              <v-list-tile-action>
                <v-icon v-html="item.icon"/>
              </v-list-tile-action>
            </v-list-tile>
        </v-list-group></div>
        
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
      items: [
        { title: "Dashboard", icon: "dashboard", to: "/" },
        { title: "Universities", icon: "account_balance", to: "/universities" },
        {
          title: "Studi Programs",
          icon: "library_books",
          to: "/study-programs"
        },
        {
          title: "Users",
          icon: "account_circle",
          to: "/universities",
          hasChild: true,
          children: [
            { title: "Supervisors", icon: "perm_identity", to: "/supervisors" },
            {
              title: "Marketings",
              icon: "supervised_user_circle",
              to: "/marketings"
            }
          ]
        }
      ],
      mini: false,
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
