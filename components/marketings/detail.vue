<template>
  <div>
    <v-card dark>
      <v-container grid-list-md>
        <div class="btn-group">
          <v-btn-toggle v-model="toggle_multiple" multiple>
            <Tbtn color="primary" icon="chevron_left" text="Back to Supervisor List" @onClick="toHome"/>
            <Tbtn color="primary" icon="save" text="Save" @onClick="submit"/>              
            <Tbtn color="primary" icon="refresh" text="Refresh" @onClick="setFields"/>  
            <Tbtn color="primary" icon="delete" text="Delete Supervisor" @onClick="confirmDelete"/>  
          </v-btn-toggle>
        </div>    
        <form>
          <v-layout row wrap class="mt-3 px-2">
            
            <v-flex v-for="(f, index) in fillable" v-if="!inArray(['is_active', 'password'], f.key)" :key="index" sm6 xs12>
              <label>{{ setCase(f.key) }}</label>
              <v-text-field
                v-validate="f.rules"
                v-model="formData[f.key]"
                :error-messages="errors.collect(f.key)"
                :name="f.key"
                :data-vv-name="f.key"
              />
            </v-flex>
            <v-flex sm6 xs12>
              <v-switch
                v-model="switch1"
                label="Active"
                color="primary"
              />
            </v-flex>
          </v-layout>     
        </form>
      </v-container>
    </v-card>
    <Dialog :showDialog="showDialog" text="Are you sure want to delete ?" @onClose="showDialog = false" @onConfirmed="removeData"/>
  </div>
</template>

<script>
import { global } from "~/mixins"
import { USER_URL } from "~/utils/apis"
import axios from "axios"
import Dialog from "~/components/Dialog"
import catchError, { showNoty } from "~/utils/catchError"

export default {
  $_veeValidate: {
    validator: "new"
  },
  components: { Dialog },
  mixins: [global],
  data() {
    return {
      fillable: [
        { key: "name", value: "", rules: "required|max:50" },
        { key: "email", value: "", rules: "required|email" },
        { key: "phone", value: "", rules: "required|max:30" },
        { key: "password", value: "", rules: "required|min:6" },
        { key: "is_active", value: "", rules: "required" },
        { key: "address", value: "", rules: "required|max:250" },
        { key: "description", value: "", rules: "max:250" }
      ],

      formData: {},
      showDialog: false,
      toggle_multiple: [0, 1, 2, 3],
      switch1: false
    }
  },
  watch: {
    switch1() {
      if (this.switch1 || !this.switch1) {
        this.formData.is_active = this.switch1
      }
    }
  },
  created() {
    this.setFields()
  },
  methods: {
    toHome() {
      this.$router.push("/supervisors")
    },
    setFields() {
      this.errors.clear()
      if (this.currentEdit) {
        this.fillable.forEach(
          data => (this.formData[data.key] = this.currentEdit[data.key])
        )
        this.switch1 = this.formData.is_active
      }
    },
    submit() {
      this.$validator.validateAll().then(result => {
        if (result) {
          this.editData()
          return
        }
      })
    },
    async editData() {
      try {
        if (this.currentEdit) {
          this.formData.role_id = 3
          const resp = await axios
            .put(USER_URL + "/" + this.currentEdit.id, this.formData)
            .then(res => res.data)
          this.$store.commit("currentEdit", resp.data)
          this.setFields()
          showNoty("Data Updated", "success")
        }
      } catch (e) {
        console.log(e)
        catchError(e)
      }
    },
    confirmDelete() {
      this.showDialog = true
    },
    async removeData() {
      try {
        if (this.currentEdit) {
          const resp = await axios
            .delete(USER_URL + "/" + this.currentEdit.id)
            .then(res => res.data)
          if (resp.meta.status === 200) {
            showNoty("Data Deleted", "success")
            this.$router.push("/supervisors")
          }
        }
      } catch (e) {
        console.log(e)
        catchError(e)
      }
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
