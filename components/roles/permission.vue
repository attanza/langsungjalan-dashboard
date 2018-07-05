<template>
  <div>
    <v-card dark>
      <v-card-text>
        <v-container>
          <v-layout row wrap>
            <v-flex xs6>
              <h4>Permission List</h4>
            </v-flex>
            <v-flex xs6>
              <div class="btn-group">
                <Tbtn color="primary" icon="done" text="Select all" @onClick="selectAll"/>
                <Tbtn color="primary" icon="clear" text="Unselect all" @onClick="clearAll"/>               
              </div>
            </v-flex>
          </v-layout>
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
import catchError, { showNoty } from "~/utils/catchError"

export default {
  components: { Dialog },
  mixins: [global],
  data() {
    return {
      toggle_multiple: [0, 1],
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
      try {
        let formData = {
          role_id: this.currentEdit.id,
          permissions: this.permissionArray
        }
        const resp = await axios
          .put(ROLE_PERMISSIONS_URL, formData)
          .then(res => res.data)
        this.$store.commit("permissions", resp.data)
        showNoty("Data Saved", "success")
        this.showDialog = false
      } catch (e) {
        catchError(e)
      }
    },
    selectAll() {
      if (this.comboData) {
        this.permissionArray = []
        this.comboData.forEach(c => {
          this.permissionArray.push(c.id)
        })
      }
    },
    clearAll() {
      this.permissionArray = []
    }
  }
}
</script>

<style scoped>
.btn-group {
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
}
</style>
