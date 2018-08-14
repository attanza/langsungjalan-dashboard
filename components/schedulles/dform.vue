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
              <v-layout row wrap>
                <v-flex v-if="comboData" xs12>
                  <label>Marketing</label>                
                  <v-autocomplete
                    v-validate="'required|numeric'"
                    :items="comboData"
                    :error-messages="errors.collect('marketing_id')"
                    :data-vv-name="'marketing_id'"
                    v-model="marketing_id"
                    label="Select Marketing"
                    single-line
                    item-text="name"
                    item-value="id"
                    cache-items
                  />
                </v-flex>
                <v-flex v-if="comboData3" xs12>
                  <label>Marketing Action</label>                
                  <v-autocomplete
                    v-validate="'required|numeric'"
                    :items="comboData3"
                    :error-messages="errors.collect('marketing_action_id')"
                    :data-vv-name="'marketing_action_id'"
                    v-model="marketing_action_id"
                    label="Select Marketing Action"
                    single-line
                    item-text="name"
                    item-value="id"
                    cache-items
                  />
                </v-flex>
                <v-flex v-if="comboData2" xs12>
                  <label>Study Program</label>                
                  <v-autocomplete
                    v-validate="'required|numeric'"
                    :items="comboData2"
                    :error-messages="errors.collect('study_id')"
                    :data-vv-name="'study_id'"
                    v-model="study_id"
                    label="Select Study Program"
                    single-line
                    item-text="name"
                    item-value="id"
                    cache-items
                  />
                </v-flex>

                <v-flex sm6 xs12>
                  <label>Start Date</label>                
                  <v-menu
                    ref="menu"
                    :close-on-content-click="false"
                    v-model="menu"
                    :nudge-right="40"
                    :return-value.sync="start_date"
                    lazy
                    transition="scale-transition"
                    offset-y
                    full-width
                    min-width="290px"
                  >
                    <v-text-field
                      v-validate="'required'"
                      slot="activator"
                      :error-messages="errors.collect('start_date')"
                      :data-vv-name="'start_date'"
                      v-model="start_date"
                      label="Pick a Start Date"
                      readonly
                    />
                    <v-date-picker v-model="start_date" @input="$refs.menu.save(start_date)"/>

                  </v-menu>
                </v-flex>

                <v-flex sm6 xs12>
                  <label>Start Time</label>                
                  <v-menu
                    ref="menuTime"
                    :close-on-content-click="false"
                    v-model="menuTime"
                    :nudge-right="40"
                    :return-value.sync="start_time"
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
                      :error-messages="errors.collect('start_time')"
                      :data-vv-name="'start_time'"
                      v-model="start_time"
                      label="Pick a Start Time"
                      readonly
                    />
                    <v-time-picker
                      v-if="menuTime"
                      v-model="start_time"
                      @change="$refs.menuTime.save(start_time)"
                    />
                  </v-menu>
                </v-flex>

                <v-flex sm6 xs12>
                  <label>End Date</label>                
                  <v-menu
                    ref="menu2"
                    :close-on-content-click="false"
                    v-model="menu2"
                    :nudge-right="40"
                    :return-value.sync="end_date"
                    lazy
                    transition="scale-transition"
                    offset-y
                    full-width
                    min-width="290px"
                  >
                    <v-text-field
                      v-validate="'required'"
                      slot="activator"
                      :error-messages="errors.collect('end_date')"
                      :data-vv-name="'end_date'"
                      v-model="end_date"
                      label="Pick a Start Date"
                      readonly
                    />
                    <v-date-picker v-model="end_date" @input="$refs.menu2.save(end_date)"/>

                  </v-menu>
                </v-flex>

                <v-flex sm6 xs12>
                  <label>End Time</label>                
                  <v-menu
                    ref="menuTime2"
                    :close-on-content-click="false"
                    v-model="menuTime2"
                    :nudge-right="40"
                    :return-value.sync="end_time"
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
                      :error-messages="errors.collect('end_time')"
                      :data-vv-name="'end_time'"
                      v-model="end_time"
                      label="Pick a Start Time"
                      readonly
                    />
                    <v-time-picker
                      v-if="menuTime2"
                      v-model="end_time"
                      @change="$refs.menuTime2.save(end_time)"
                    />
                  </v-menu>
                </v-flex>

                <v-flex sm12>
                  <label>Description</label>
                  <v-textarea
                    v-validate="'max:250'"
                    v-model="description"
                    :error-messages="errors.collect('description')"
                    name="description"
                    data-vv-name="description"
                  />
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
import { SCHEDULLE_URL, COMBO_DATA_URL } from "~/utils/apis"
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
      formTitle: "Add New Schedulle",
      menu: false,
      menu2: false,
      menuTime: false,
      menuTime2: false,
      marketing_id: "",
      marketing_action_id: "",
      study_id: "",
      start_date: null,
      end_date: null,
      start_time: null,
      end_time: null,
      description: ""
    }
  },
  watch: {
    show() {
      this.dialog = this.show
    }
  },
  async mounted() {
    // Marketing Combo Data
    let marketings = await axios.get(COMBO_DATA_URL + "MarketingAll")
    if (marketings) this.$store.commit("comboData", marketings.data)
    // Study Program Combo Data
    let studies = await axios.get(COMBO_DATA_URL + "StudyProgram")
    if (studies) this.$store.commit("comboData2", studies.data)
    // Marketing Action Combo Data
    let actions = await axios.get(COMBO_DATA_URL + "Action")
    if (actions) this.$store.commit("comboData3", actions.data)
  },
  methods: {
    onClose() {
      this.clearForm()
      this.$emit("onClose")
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
        console.log(this.getData())
        const resp = await axios
          .post(SCHEDULLE_URL, this.getData())
          .then(res => res.data)

        if (resp.meta.status === 201) {
          showNoty("Data Saved", "success")
          this.$emit("onAdd", resp.data)
          this.clearForm()
        }
      } catch (e) {
        catchError(e)
      }
    },

    getData() {
      return {
        marketing_id: this.marketing_id,
        marketing_action_id: this.marketing_action_id,
        study_id: this.study_id,
        start_date: this.start_date + " " + this.start_time,
        end_date: this.end_date + " " + this.end_time,
        description: this.description
      }
    },
    clearForm() {
      this.dialog = false
      this.menu = false
      this.menu2 = false
      this.menuTime = false
      this.menuTime2 = false
      this.marketing_id = ""
      this.marketing_action_id = ""
      this.study_id = ""
      this.start_date = null
      this.end_date = null
      this.start_time = null
      this.end_time = null
      this.description = ""
    }
  }
}
</script>
