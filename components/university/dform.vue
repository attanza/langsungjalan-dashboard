<template>
  <div>
    <v-card dark>
      <v-container grid-list-md>
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
          <v-layout row wrap class="mt-3 px-2">
            <v-flex xs12>
              <v-btn to="/universities" color="primary"> <v-icon>chevron_left</v-icon> </v-btn>
              <v-btn color="primary" @click="submit"><v-icon>save</v-icon></v-btn>
              <v-btn color="primary" @click="setFields"><v-icon>refresh</v-icon></v-btn>
            </v-flex>
          </v-layout>          
        </form>
      </v-container>
    </v-card>
    <Noty :snackbar="showNoty" :text="notyText" :color="notyColor" @onClose="showNoty = false"/>
  </div>
</template>

<script>
import { global, states } from "~/mixins"
import { UNIVERSITY_URL } from "~/utils/apis"
import axios from "axios"
import Noty from "~/components/Noty"
export default {
  $_veeValidate: {
    validator: "new"
  },
  components: { Noty },
  mixins: [global, states],
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
      notyText: "",
      notyColor: "success"
    }
  },
  computed: {
    currentEdit() {
      return this.$store.state.currentEdit
    }
  },
  created() {
    this.setFields()
  },
  methods: {
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
    }
  }
}
</script>

<style scoped>
</style>
