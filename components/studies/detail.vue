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
              <div v-if="f.key != 'year'">
                <label>{{ setCase(f.key) }}</label>
                <v-text-field
                  v-validate="f.rules"
                  v-model="formData[f.key]"
                  :multi-line="f.key == 'address' || f.key == 'description'"
                  :error-messages="errors.collect(f.key)"
                  :name="f.key"
                  :data-vv-name="f.key"
                />
              </div>
              <div v-if="f.key == 'year'">
                <label>Year</label>                
                <v-select
                  :items="years"
                  v-model="formData['year']"
                  label="Select Year"
                  single-line
                />
              </div>
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
import { STUDIES_URL } from "~/utils/apis"
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
        { key: "university_id", value: "", rules: "integer" },
        { key: "phone", value: "", rules: "required|max:30" },
        { key: "email", value: "", rules: "required|email" },
        { key: "contact_person", value: "", rules: "required|max:50" },
        { key: "year", value: "", rules: "required|max:4" },
        { key: "class_per_year", value: "", rules: "required|integer" },
        { key: "students_per_class", value: "", rules: "required|integer" },
        { key: "address", value: "", rules: "max:250" },
        { key: "description", value: "", rules: "max:250" }
      ],
      formData: {},
      showNoty: false,
      showDialog: false,
      notyText: "",
      notyColor: "success",
      toggle_multiple: [0, 1, 2, 3],
      years: []
    }
  },
  created() {
    this.setFields()
    this.setYears()
  },
  methods: {
    toHome() {
      this.$router.push("/study-programs")
    },
    setFields() {
      this.errors.clear()
      if (this.currentEdit) {
        this.fillable.forEach(
          data => (this.formData[data.key] = this.currentEdit[data.key])
        )
      }
    },
    setYears() {
      for (let i = 2000; i < 2030; i++) {
        this.years.push(i.toString())
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
            .put(STUDIES_URL + "/" + this.currentEdit.id, this.formData)
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
      this.showDialog = false
      this.showDialog = true
    },
    async removeData() {
      try {
        if (this.currentEdit) {
          const resp = await axios
            .delete(STUDIES_URL + "/" + this.currentEdit.id)
            .then(res => res.data)
          if (resp.meta.status === 200) {
            showNoty("Data Deleted", "success")
            this.$router.push("/study-programs")
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
