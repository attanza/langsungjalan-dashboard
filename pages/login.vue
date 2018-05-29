<template>
  <v-content>
    <v-container fluid fill-height>
      <v-layout align-center justify-center>
        <v-flex xs12 sm8 md4>
          <v-card class="elevation-12">
            <v-toolbar dark color="primary">
              <v-toolbar-title>Login form</v-toolbar-title>
              <v-spacer/>
            </v-toolbar>
            <v-card-text>
              <form>
                <v-text-field
                  v-validate="'required|email'"
                  v-model="email"
                  :error-messages="errors.collect('email')"
                  name="email"
                  prepend-icon="email"
                  label="E-mail Address"
                  data-vv-name="email"
                />

                <v-text-field
                  v-validate="'required'"
                  v-model="password"
                  :append-icon="e1 ? 'visibility' : 'visibility_off'"
                  :append-icon-cb="() => (e1 = !e1)"
                  :type="e1 ? 'text' : 'password'"
                  :error-messages="errors.collect('password')"
                  prepend-icon="lock"
                  name="password"
                  label="Enter your password"
                  hint="At least 6 characters"
                  min="6"
                />
              </form>
            </v-card-text>
            <v-card-actions>
              <v-btn flat><span class="primary--text">Forgot Password ?</span></v-btn>
              <v-spacer/>
              <v-btn :loading="loading" :disabled="loading" color="primary" @click="submit">Login</v-btn>
            </v-card-actions>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>
  </v-content>
</template>

<script>
import Cookie from "js-cookie"
import { postLogin } from "~/utils/apis/auth"
export default {
  layout: "nonav",
  $_veeValidate: {
    validator: "new"
  },
  data: () => ({
    email: "rihdo@rin.lr",
    password: "password",
    e1: false,
    loading: false
  }),
  methods: {
    submit() {
      this.$validator.validateAll().then(result => {
        if (result) {
          this.doLogin()
          return
        }
      })
    },
    async doLogin() {
      try {
        this.loading = true
        let credential = {
          email: this.email,
          password: this.password
        }
        const resp = await postLogin(credential)
        console.log(resp)
        Cookie.set("lj_token", JSON.stringify(resp.data), { expires: 1 })
        this.$store.commit("user", resp.data.user)
        this.$store.commit("token", resp.data.token)
        this.$router.push("/")
      } catch (e) {
        this.loading = false
        console.log(e)
        console.log(e.response)
      }
    }
  }
}
</script>
