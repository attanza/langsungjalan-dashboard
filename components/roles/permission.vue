<template>
  <div>
    <v-card dark>
      <v-card-text>
        <v-container>
          <h4>Permission List</h4>
          <v-layout row wrap>
            <v-flex v-for="permission in comboData" :key="permission.id" md3 sm4 xs6>
              <v-checkbox v-model="permssionArray" :label="permission.name" :value="permission.id" color="primary"/>
            </v-flex>
          </v-layout>
        </v-container>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
import { global } from "~/mixins"
export default {
  mixins: [global],
  data() {
    return {
      permssionArray: []
    }
  },
  created() {
    this.setPermissionArray()
  },
  methods: {
    setPermissionArray() {
      if (this.permissions) {
        this.permissions.forEach(p => {
          this.permssionArray.push(p.id)
        })
      }
    }
  }
}
</script>

<style scoped>
</style>
