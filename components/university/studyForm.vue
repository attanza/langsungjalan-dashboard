<template>
  <v-layout row justify-center>
    <v-dialog v-model="dialog" persistent max-width="600px">
      <v-card dark>
        <v-card-title>
          <span class="headline primary--text">{{ formTitle }}</span>
        </v-card-title>
        <v-card-text>
          <v-container grid-list-md>
            <form>
              <v-layout row wrap class="mt-3 px-2">
                <v-flex v-for="(f, index) in fillable" :key="index" xs12>
                  <div v-if="!inArray(notIncluded, f.key)">
                    <label>{{ setCase(f.key) }}</label>
                    <v-text-field
                      v-validate="f.rules"
                      v-model="formData[f.key]"
                      :error-messages="errors.collect(f.key)"
                      :name="f.key"
                      :data-vv-name="f.key"
                    />
                  </div>
                  <div v-if="f.key == 'study_name_id' && comboData">
                    <label>Study Program Name</label>                
                    <v-autocomplete
                      v-validate="'required|numeric'"
                      :items="comboData"
                      :error-messages="errors.collect('study_name_id')"
                      :data-vv-name="'study_name_id'"
                      v-model="formData['study_name_id']"
                      label="Select Study Program Name"
                      single-line
                      item-text="name"
                      item-value="id"
                      cache-items
                    />
                  </div>
                  <div v-if="f.key == 'address' || f.key == 'description'">
                    <label>{{ setCase(f.key) }}</label>
                    <v-textarea
                      v-validate="f.rules"
                      v-model="formData[f.key]"
                      :error-messages="errors.collect(f.key)"
                      :name="f.key"
                      :data-vv-name="f.key"
                    />
                  </div>
                </v-flex>
              </v-layout>      
            </form>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer/>
          <v-btn color="primary" flat @click.native="onClose">Close</v-btn>
          <v-btn color="primary" flat @click.native="submit">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-layout>
</template>
<script>
import { global } from "~/mixins"
import { STUDIES_URL, COMBO_DATA_URL } from "~/utils/apis"
import axios from "axios"
import catchError, { showNoty } from "~/utils/catchError"
export default {
  $_veeValidate: {
    validator: "new"
  },
  mixins: [global],
  props: {
    show: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      dialog: false,
      fillable: [
        { key: "study_name_id", value: "", rules: "required|integer" },
        { key: "university_id", value: "", rules: "required|integer" },
        { key: "phone", value: "", rules: "required|max:30" },
        { key: "email", value: "", rules: "required|email" },
        { key: "contact_person", value: "", rules: "required|max:50" },
        { key: "address", value: "", rules: "max:250" },
        { key: "description", value: "", rules: "max:250" }
      ],
      notIncluded: ["description", "address", "university_id", "study_name_id"],
      formData: {},
      formTitle: "Register New Study Programs",
      years: []
    }
  },
  watch: {
    show() {
      this.dialog = this.show
    }
  },
  async created() {
    try {
      this.setAuth()
      let resp = await axios.get(COMBO_DATA_URL + "StudyName")
      if (resp) this.$store.commit("comboData", resp.data)
      this.setFields()
    } catch (e) {
      catchError(e)
    }
  },
  methods: {
    onClose() {
      this.$emit("onClose")
    },
    setFields() {
      this.errors.clear()
      this.fillable.forEach(data => (this.formData[data.key] = data.value))
      if (this.currentEdit) {
        this.formData.university_id = this.currentEdit.id
        this.formData.phone = this.currentEdit.phone
        this.formData.email = this.currentEdit.email
        this.formData.contact_person = this.currentEdit.contact_person
        this.formData.address = this.currentEdit.address
        this.formData.description = this.currentEdit.description
        this.formData.lat = this.currentEdit.lat
        this.formData.lng = this.currentEdit.lng
      }
      console.log("formData", this.formData)
    },
    submit() {
      this.$validator.validateAll().then(result => {
        if (result) {
          this.saveData()
          return
        }
      })
    },
    async saveData() {
      try {
        this.activateLoader()
        const resp = await axios
          .post(STUDIES_URL, this.formData)
          .then(res => res.data)
        if (resp.meta.status === 201) {
          showNoty("Data Saved", "success")
          this.$emit("onAdd", resp.data)
          this.setFields()
        }
        this.deactivateLoader()
      } catch (e) {
        this.deactivateLoader()
        catchError(e)
      }
    }
  }
}
</script>
