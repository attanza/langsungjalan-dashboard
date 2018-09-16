<template>
  <div>
    <v-card dark>
      <v-container grid-list-md fluid style="padding: 0px;">
        <v-toolbar color="transparent" card>
          <v-spacer/>
          <Tbtn color="primary" icon="chevron_left" icon-mode tooltip-text="Back to List" @onClick="toHome"/>
          <Tbtn color="primary" icon="save" icon-mode tooltip-text="Save" @onClick="submit"/>              
          <Tbtn color="primary" icon="refresh" icon-mode tooltip-text="Refresh" @onClick="setFields"/>  
          <Tbtn color="primary" icon="delete" icon-mode tooltip-text="Delete" @onClick="confirmDelete"/>  
        </v-toolbar>
        <v-card-text>
          <form>
            <v-layout row wrap class="mt-3 px-2">
              <v-flex v-for="(f, index) in fillable" :key="index" sm6 xs12>
                <div v-if="!inArray(notIncluded, f.key)">
                  <label>{{ setCase(f.key) }}</label>
                  <v-text-field
                    v-validate="f.rules"
                    v-model="formData[f.key]"
                    :error-messages="errors.collect(f.key)"
                    :name="f.key"
                    :data-vv-name="f.key"
                    :type="inArray(typeNumber, f.key) ? 'number': 'text'"
                  />
                </div>
                <div v-if="f.key == 'marketing_id' && comboData">
                  <label>Marketing</label>                
                  <v-autocomplete
                    v-validate="f.rules"
                    :items="comboData"
                    :error-messages="errors.collect('marketing_id')"
                    :data-vv-name="'marketing_id'"
                    v-model="formData['marketing_id']"
                    label="Select Marketing"
                    single-line
                    item-text="name"
                    item-value="id"
                    cache-items
                  />
                </div>
                <div v-if="f.key == 'marketing_action_id' && comboData2">
                  <label>Action</label>                
                  <v-autocomplete
                    v-validate="f.rules"
                    :items="comboData2"
                    :error-messages="errors.collect('marketing_action_id')"
                    :data-vv-name="'marketing_action_id'"
                    v-model="formData['marketing_action_id']"
                    label="Select Action"
                    single-line
                    item-text="name"
                    item-value="id"
                    cache-items
                  />
                </div>
                <div v-if="f.key == 'method' && marketingMethods">
                  <label>Method</label>                
                  <v-autocomplete
                    v-validate="f.rules"
                    :items="marketingMethods"
                    :error-messages="errors.collect('method')"
                    :data-vv-name="'method'"
                    v-model="formData['method']"
                    label="Select Action"
                    single-line
                    cache-items
                  />
                </div>
                <div v-if="f.key == 'schedulle_date'">
                  <label>Schedulle Date</label>                
                  <v-menu
                    ref="menu"
                    :close-on-content-click="false"
                    v-model="menu"
                    :nudge-right="40"
                    :return-value.sync="formData['schedulle_date']"
                    lazy
                    transition="scale-transition"
                    offset-y
                    full-width
                    min-width="290px"
                  >
                    <v-text-field
                      v-validate="'required'"
                      slot="activator"
                      :error-messages="errors.collect('schedulle_date')"
                      :data-vv-name="'schedulle_date'"
                      v-model="formData['schedulle_date']"
                      label="Pick a Schedulle Date"
                      readonly
                    />
                    <v-date-picker v-model="formData['schedulle_date']" @input="$refs.menu.save(formData['schedulle_date'])"/>
                  </v-menu>
                </div>
                <div v-if="f.key == 'schedulle_time'">
                  <label>Schedulle Time</label>                
                  <v-menu
                    ref="menuTime"
                    :close-on-content-click="false"
                    v-model="menuTime"
                    :nudge-right="40"
                    :return-value.sync="formData['schedulle_time']"
                    lazy
                    transition="scale-transition"
                    offset-y
                    full-width
                    max-width="290px"
                    min-width="290px"
                  >
                    <v-text-field
                      v-validate="'required'"
                      slot="activator"
                      :error-messages="errors.collect('schedulle_time')"
                      :data-vv-name="'schedulle_time'"
                      v-model="formData['schedulle_time']"
                      label="Pick a Schedulle Time"
                      readonly
                    />
                    <v-time-picker
                      v-if="menuTime"
                      v-model="start_time"
                      @change="$refs.menuTime.save(formData['schedulle_time'])"
                    />
                  </v-menu>
                </div>
                <div v-if="f.key == 'terms' || f.key == 'description'">
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
        </v-card-text>
      </v-container> 
    </v-card>
    <Dialog :showDialog="showDialog" text="Are you sure want to delete ?" @onClose="showDialog = false" @onConfirmed="removeData"/>
  </div>
</template>

<script>
import { global } from "~/mixins"
import { MARKETING_REPORTS_URL } from "~/utils/apis"
import axios from "axios"
import Dialog from "~/components/Dialog"
import catchError, { showNoty } from "~/utils/catchError"
import moment from "moment"

export default {
  $_veeValidate: {
    validator: "new"
  },
  components: { Dialog },
  mixins: [global],
  data() {
    return {
      fillable: [
        { key: "marketing_id", value: "", rules: "required|integer" },
        { key: "marketing_action_id", value: "", rules: "required|integer" },
        { key: "method", value: "", rules: "required|max:50" },
        { key: "contact_person", value: "", rules: "max:50" },
        { key: "contact_person_phone", value: "", rules: "max:50" },
        { key: "count_year", value: "", rules: "integer" },
        { key: "count_class", value: "", rules: "integer" },
        { key: "average_students", value: "", rules: "integer" },
        { key: "count_attendances", value: "", rules: "integer" },
        { key: "count_student_dps", value: "", rules: "integer" },
        { key: "count_shared_packages", value: "", rules: "integer" },
        { key: "count_orders", value: "", rules: "integer" },
        { key: "count_dps", value: "", rules: "integer" },
        { key: "count_payments", value: "", rules: "integer" },
        { key: "schedulle_date", value: "", rules: "date" },
        { key: "schedulle_time", value: "", rules: "date" },
        { key: "result", value: "", rules: "" },
        { key: "terms", value: "", rules: "" },
        { key: "lng", value: "", rules: "number" },
        { key: "lat", value: "", rules: "number" },
        { key: "description", value: "", rules: "" }
      ],
      notIncluded: [
        "marketing_id",
        "marketing_action_id",
        "method",
        "lng",
        "lat",
        "terms",
        "description",
        "schedulle_date",
        "schedulle_time"
      ],
      typeNumber: [
        "count_year",
        "count_class",
        "average_students",
        "count_attendances",
        "count_student_dps",
        "count_shared_packages",
        "count_orders",
        "count_dps",
        "count_payments"
      ],
      marketingMethods: ["By Phone", "By Meeting"],
      formData: {},
      showDialog: false,
      menu: false,
      menuTime: false
    }
  },
  created() {
    this.setFields()
  },
  methods: {
    toHome() {
      this.$router.push("/marketing-reports")
    },
    setFields() {
      this.errors.clear()
      if (this.currentEdit) {
        this.fillable.forEach(
          data => (this.formData[data.key] = this.currentEdit[data.key])
        )
      }
      this.formData["schedulle_date"] = moment(
        this.formData["schedulle_date"]
      ).format("YYYY-MM-DD")
      this.formData["schedulle_time"] = moment(
        this.formData["schedulle_time"]
      ).format("HH:mm:ss")
      this.formData["schedulle_id"] = this.currentEdit.schedulle_id
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
        this.activateLoader()
        if (this.currentEdit) {
          this.formData.schedulle_date =
            this.formData.schedulle_date + " " + this.formData.schedulle_time
          const resp = await axios
            .put(
              MARKETING_REPORTS_URL + "/" + this.currentEdit.id,
              this.formData
            )
            .then(res => res.data)
          this.$store.commit("currentEdit", resp.data)
          this.setFields()
          showNoty("Data Updated", "success")
          this.deactivateLoader()
        }
      } catch (e) {
        this.deactivateLoader()
        catchError(e)
      }
    },
    confirmDelete() {
      this.showDialog = false
      this.showDialog = true
    },
    async removeData() {
      try {
        this.activateLoader()
        if (this.currentEdit) {
          const resp = await axios
            .delete(MARKETING_REPORTS_URL + "/" + this.currentEdit.id)
            .then(res => res.data)
          if (resp.meta.status === 200) {
            showNoty("Data Deleted", "success")
            this.$router.push("/marketing-reports")
          }
        }
        this.deactivateLoader()
      } catch (e) {
        this.deactivateLoader()
        this.showDialog = false
        catchError(e)
      }
    }
  }
}
</script>
