<template>
  <div>
    <v-navigation-drawer
      v-model="drawer"
      :mini-variant.sync="mini"
      fixed
      app
    >
      <v-toolbar flat>
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
    <v-toolbar fixed app>
      <v-toolbar-side-icon @click="drawer = !drawer"/>
      <v-spacer/>
      <v-toolbar-items>
        <v-menu
          origin="center center"
          transition="scale-transition"
          bottom
        >
          <v-btn slot="activator" icon large>
            <v-avatar>
              <img
                :src="avatar"
                :alt="user.name"
              >
            </v-avatar>
          </v-btn>
          <v-list>
            <v-list-tile avatar color="primary">
              <v-list-tile-avatar>
                <v-img
                  :src="avatar"
                  aspect-ratio="1"
                />
              </v-list-tile-avatar>
              <v-list-tile-content>
                <v-list-tile-title v-html="user.name"/>
                <v-list-tile-sub-title v-html="user.email"/>
              </v-list-tile-content>
            </v-list-tile>
            <v-divider/>
            <v-list-tile v-for="(item, index) in righItems" :key="index" @click="itemActions(item.title)">
              <v-list-tile-action>
                <v-icon>{{ item.icon }}</v-icon>
              </v-list-tile-action>
              <v-list-tile-content>
                <v-list-tile-title>{{ item.title }}</v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
          </v-list>
        </v-menu>
      </v-toolbar-items>
    </v-toolbar>
  </div>
</template>

<script>
import Cookie from "js-cookie"
import { adminItems, supervisorItems } from "./menu"
export default {
  data() {
    return {
      clipped: false,
      drawer: true,
      items: null,
      mini: false,
      right: true,
      rightDrawer: false,
      title: "Langsung Jalan",
      righItems: [
        { title: "Profile", icon: "account_box" },
        { title: "Logout", icon: "exit_to_app" }
      ]
    }
  },
  computed: {
    user() {
      return this.$store.state.user
    },
    avatar() {
      if (this.user && this.user.photo != "") {
        return this.user.photo
      }
      return "/images/user.png"
    }
  },
  mounted() {
    this.getMenus()
  },
  methods: {
    getMenus() {
      if (this.user && this.user.roles) {
        const role = this.user.roles[0].slug
        switch (role) {
          case "super-administrator":
            this.items = adminItems
            break

          case "administrator":
            this.items = adminItems
            break

          case "supervisor":
            this.items = supervisorItems
            break

          default:
            this.items = null
            break
        }
      }
    },
    logout() {
      Cookie.remove("lj_token")
      this.$store.commit("token", null)
      this.$store.commit("user", {})
      this.$router.push("/login")
    },
    toProfile() {
      this.$router.push("/profile")
    },
    itemActions(title) {
      switch (title) {
        case "Logout":
          this.logout()
          break
        case "Profile":
          this.toProfile()
          break

        default:
          break
      }
    }
  }
}
</script>

<style scoped>
</style>
