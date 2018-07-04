<template>
  <div>
    <v-card dark>
      <v-card-text>
        <v-container>
          <h4>Permission List</h4>
          <v-layout row wrap>
            <v-flex v-for="permission in comboData" :key="permission.id" md3 sm4 xs6>
              <v-checkbox v-model="permissionArray" :label="permission.name" :value="permission.id" color="primary"/>
            </v-flex>
          </v-layout>
          <v-layout row wrap>
            <v-flex xs12>
              <v-btn color="primary" @click="showDialog = true">Update Permissions</v-btn>
            </v-flex>
          </v-layout>
        </v-container>
      </v-card-text>
    </v-card>
    <Dialog :showDialog="showDialog" text="Are you sure want to update ?" @onClose="showDialog = false" @onConfirmed="attachPermissions"/>
  </div>
</template>

<script>
import { global } from "~/mixins"
import { ROLE_PERMISSIONS_URL } from "~/utils/apis"
import axios from "axios"
import Dialog from "~/components/Dialog"
export default {
  components: { Dialog },
  mixins: [global],
  data() {
    return {
      showDialog: false,
      permissionArray: []
    }
  },
  created() {
    this.setPermissionArray()
  },
  methods: {
    setPermissionArray() {
      if (this.permissions) {
        this.permissions.forEach(p => {
          this.permissionArray.push(p.id)
        })
      }
    },
    async attachPermissions() {
      let formData = {
        role_id: this.currentEdit.id,
        permissions: this.permissionArray
      }
      const resp = await axios
        .put(ROLE_PERMISSIONS_URL, formData)
        .then(res => res.data)
      this.$store.commit("permissions", resp.data)

      this.showDialog = false
    }
  }
}
</script>

<style scoped>
</style>
