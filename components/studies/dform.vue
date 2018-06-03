<template>
  <v-layout row justify-center>
    <v-dialog v-model="dialog" persistent max-width="500px">
      <v-card dark>
        <v-card-title>
          <span class="headline primary--text">{{ formTitle }}</span>
        </v-card-title>
        <v-card-text>
          <v-container grid-list-md>
            <form>
              <v-layout row wrap class="mt-3 px-2">
                <v-flex v-for="(f, index) in fillable" :key="index" sm6 xs12>
                  <div v-if="f.key != 'year' && f.key != 'university_id'">
                    <label>{{ setCase(f.key) }}</label>
                    <v-text-field
                      v-validate="f.rules"
                      v-model="formData[f.key]"
                      :multi-line="f.key == 'address' || f.key == 'description'"
                      :error-messages="errors.collect(f.key)"
                      :name="f.key"
                      :data-vv-name="f.key"
                      :type="inArray(typeNumber, f.key) ? 'number': 'text'"
                    />
                  </div>
                  <div v-if="f.key == 'university_id' && comboData">
                    <label>University</label>                
                    <v-select
                      v-validate="'required|numeric'"
                      :items="comboData"
                      :error-messages="errors.collect('university_id')"
                      :data-vv-name="'university_id'"
                      v-model="formData['university_id']"
                      label="Select University"
                      single-line
                      item-text="name"
                      item-value="id"
                      autocomplete
                      cache-items
                    />
                  </div>
                  <div v-if="f.key == 'year'">
                    <label>Year</label>                
                    <v-select
                      v-validate="'required|max:4'"
                      :error-messages="errors.collect('year')"
                      :data-vv-name="'year'"
                      :items="years"
                      v-model="formData['year']"
                      label="Select Year"
                      single-line
                      autocomplete
                      cache-items
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
import { STUDIES_URL } from "~/utils/apis"
import axios from "axios"
import catchError, { showNoty } from "~/utils/catchError"
export default {
  $_veeValidate: {
    validator: "new"
  },
  mixins: [global],
  props: {
    showForm: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      dialog: false,
      fillable: [
        { key: "name", value: "", rules: "required|max:50" },
        { key: "university_id", value: "", rules: "required|integer" },
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
      formTitle: "Register New Study Programs",
      years: [],
      typeNumber: ["class_per_year", "students_per_class"]
    }
  },
  watch: {
    showForm() {
      this.dialog = this.showForm
    }
  },
  created() {
    this.setFields()
    this.setYears()
  },
  methods: {
    onClose() {
      this.$emit("onClose")
    },
    setFields() {
      this.errors.clear()
      if (this.currentEdit) {
        this.fillable.forEach(data => (this.formData[data.key] = data.value))
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
          this.saveData()
          return
        }
      })
    },
    async saveData() {
      try {
        const resp = await axios
          .post(STUDIES_URL, this.formData)
          .then(res => res.data)
        if (resp.meta.status === 201) {
          showNoty("Data Saved", "success")
          this.$emit("onAdd", resp.data)
          this.setFields()
        }
      } catch (e) {
        catchError(e)
      }
    }
  }
}
</script>
