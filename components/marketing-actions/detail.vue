<template>
  <div>
    <v-card dark>
      <v-container grid-list-md fluid style="padding-top: 5px;">
        <v-toolbar color="transparent" card>
          <v-spacer/>
          <Tbtn color="primary" icon="chevron_left" icon-mode tooltip-text="Back to List" @onClick="toHome"/>
          <Tbtn color="primary" icon="save" icon-mode tooltip-text="Save" @onClick="submit"/>              
          <Tbtn color="primary" icon="refresh" icon-mode tooltip-text="Refresh" @onClick="setFields"/>  
          <Tbtn color="primary" icon="delete" icon-mode tooltip-text="Delete" @onClick="confirmDelete"/>  
        </v-toolbar>
        <form>
          <form>
            <v-layout row wrap class="mt-3 px-2">
            
              <v-flex v-for="(f, index) in fillable" :key="index" xs12>
                <label>{{ setCase(f.key) }}</label>
                <v-text-field
                  v-validate="f.rules"
                  v-model="formData[f.key]"
                  :error-messages="errors.collect(f.key)"
                  :name="f.key"
                  :data-vv-name="f.key"
                />
              </v-flex>
            </v-layout>     
          </form>
      </form></v-container>
    </v-card>
    <Dialog :showDialog="showDialog" text="Are you sure want to delete ?" @onClose="showDialog = false" @onConfirmed="removeData"/>
  </div>
</template>

<script>
import { global } from "~/mixins"
import { MARKETING_ACTION_URL } from "~/utils/apis"
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
        { key: "description", value: "", rules: "max:250" }
      ],

      formData: {},
      showDialog: false,
      toggle_multiple: [0, 1, 2, 3],
      switch1: false
    }
  },
  created() {
    this.setFields()
  },
  methods: {
    toHome() {
      this.$router.push("/marketing-actions")
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
            .put(
              MARKETING_ACTION_URL + "/" + this.currentEdit.id,
              this.formData
            )
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
            .delete(MARKETING_ACTION_URL + "/" + this.currentEdit.id)
            .then(res => res.data)
          if (resp.meta.status === 200) {
            showNoty("Data Deleted", "success")
            this.$router.push("/marketing-actions")
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
