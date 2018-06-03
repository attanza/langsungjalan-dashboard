<template>
  <div>
    <v-card dark>
      <v-container grid-list-md>
        <div class="btn-group">
          <v-btn-toggle v-model="toggle_multiple" multiple>
            <Tbtn color="primary" icon="chevron_left" text="Back to University List" @onClick="toHome"/>
            <Tbtn color="primary" icon="save" text="Save" @onClick="submit"/>              
            <Tbtn color="primary" icon="refresh" text="Refresh" @onClick="setFields"/>  
            <Tbtn color="primary" icon="delete" text="Delete university" @onClick="confirmDelete"/>  
            
          </v-btn-toggle>
          <hr >
        </div>    
        <form>
          <v-layout row wrap class="mt-3 px-2">
            <v-flex v-for="(f, index) in fillable" :key="index" sm6 xs12>
              <label>{{ setCase(f.key) }}</label>
              <v-text-field
                v-validate="f.rules"
                v-model="formData[f.key]"
                :multi-line="f.key == 'address' || f.key == 'description'"
                :error-messages="errors.collect(f.key)"
                :name="f.key"
                :data-vv-name="f.key"
              />
            </v-flex>
          </v-layout>     
        </form>
      </v-container>
    </v-card>
    <Dialog :showDialog="showDialog" text="Are you sure want to delete ?" @onClose="showDialog = false" @onConfirmed="removeData"/>
    <Noty :snackbar="showNoty" :text="notyText" :color="notyColor" @onClose="showNoty = false"/>
  </div>
</template>

<script>
import { global } from "~/mixins"
import { UNIVERSITY_URL } from "~/utils/apis"
import axios from "axios"
import Noty from "~/components/Noty"
import Dialog from "~/components/Dialog"

export default {
  $_veeValidate: {
    validator: "new"
  },
  components: { Noty, Dialog },
  mixins: [global],
  data() {
    return {
      fillable: [
        { key: "name", value: "", rules: "required|max:50" },
        { key: "phone", value: "", rules: "required|max:30" },
        { key: "email", value: "", rules: "required|email" },
        { key: "contact_person", value: "", rules: "required|max:50" },
        { key: "province", value: "", rules: "required|max:50" },
        { key: "city", value: "", rules: "required|max:50" },
        { key: "address", value: "", rules: "required|max:250" },
        { key: "description", value: "", rules: "max:250" }
      ],
      formData: {},
      showNoty: false,
      showDialog: false,
      notyText: "",
      notyColor: "success",
      toggle_multiple: [0, 1, 2, 3]
    }
  },
  created() {
    this.setFields()
  },
  methods: {
    toHome() {
      this.$router.push("/universities")
    },
    setFields() {
      this.errors.clear()
      if (this.currentEdit) {
        this.fillable.forEach(
          data => (this.formData[data.key] = this.currentEdit[data.key])
        )
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
          const resp = await axios
            .put(UNIVERSITY_URL + "/" + this.currentEdit.id, this.formData)
            .then(res => res.data)
          this.$store.commit("currentEdit", resp.data)
          this.setFields()
          this.showNoty = true
          this.notyText = "Data Saved"
        }
      } catch (e) {
        console.log(e)
      }
    },
    confirmDelete() {
      this.showDialog = false
      this.showDialog = true
    },
    async removeData() {
      try {
        if (this.currentEdit) {
          const resp = await axios
            .delete(UNIVERSITY_URL + "/" + this.currentEdit.id)
            .then(res => res.data)
          console.log(resp)

          if (resp.status === 200) {
            this.showNoty = true
            this.notyText = "Data Deleted"
            this.$router.push("/universities")
          }
        }
      } catch (e) {
        console.log(e)
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
