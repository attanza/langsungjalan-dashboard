<template>
  <div>
    <v-card dark>
      <v-container grid-list-md>
        <div class="btn-group">
          <v-btn-toggle v-model="toggle_multiple" multiple>
            <Tbtn color="primary" icon="chevron_left" text="Back to Schedulle List" @onClick="toHome"/>
            <Tbtn color="primary" icon="save" text="Save" @onClick="submit"/>              
            <!-- <Tbtn color="primary" icon="refresh" text="Refresh" @onClick="setFields"/>   -->
            <Tbtn color="primary" icon="delete" text="Delete Schedulle" @onClick="confirmDelete"/>  
          </v-btn-toggle>
          <hr >
        </div>    
        <form>
          <v-layout row wrap class="mt-3 px-2">
            <v-flex sm6 xs12>
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
            <v-flex sm6 xs12>
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
              <label>Action</label>
              <v-text-field
                v-validate="'required|max:200'"
                :error-messages="errors.collect('action')"
                :data-vv-name="'action'"
                v-model="action"
                name="action"
              />
            </v-flex>
            <v-flex sm6 xs12>
              <label>Description</label>
              <v-text-field
                v-validate="'required|max:200'"
                :error-messages="errors.collect('description')"
                :data-vv-name="'description'"
                v-model="description"
                name="description"
              />
            </v-flex>
            <v-flex xs12 sm6>
              <label>Start Date</label>
              <v-menu
                ref="menu_start_date"
                :close-on-content-click="false"
                v-model="menu_start_date"
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
                  v-model="start_date"
                  :error-messages="errors.collect('start_date')"
                  :data-vv-name="'start_date'"
                  name="start_date"
                  readonly
                />
                <v-date-picker v-model="start_date" @input="$refs.menu_start_date.save(start_date)"/>
              </v-menu>
            </v-flex>
            <v-flex xs12 sm6>
              <label>Start Time</label>
              <v-menu
                ref="menu_start_time"
                :close-on-content-click="false"
                v-model="menu_start_time"
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
                  v-model="start_time"
                  :error-messages="errors.collect('start_time')"
                  :data-vv-name="'start_time'"
                  name="start_time"
                  readonly
                />
                <v-time-picker v-model="start_time" @change="$refs.menu_start_time.save(start_time)"/>
              </v-menu>
            </v-flex>
            <v-flex xs12 sm6>
              <label>End Date</label>
              <v-menu
                ref="menu_end_date"
                :close-on-content-click="false"
                v-model="menu_end_date"
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
                  v-model="end_date"
                  :error-messages="errors.collect('end_date')"
                  :data-vv-name="'end_date'"
                  name="end_date"
                  readonly
                />
                <v-date-picker v-model="end_date" @input="$refs.menu_end_date.save(end_date)"/>
              </v-menu>
            </v-flex>
            <v-flex xs12 sm6>
              <label>End Time</label>
              <v-menu
                ref="menu_end_time"
                :close-on-content-click="false"
                v-model="menu_end_time"
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
                  v-model="end_time"
                  :error-messages="errors.collect('end_time')"
                  :data-vv-name="'end_time'"
                  name="end_time"
                  readonly
                />
                <v-time-picker v-model="end_time" @change="$refs.menu_end_time.save(end_time)"/>
              </v-menu>
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
import { SCHEDULLE_URL } from "~/utils/apis"
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
      study_id: "",
      marketing_id: "",
      action: "",
      description: "",
      start_date: null,
      start_time: null,
      end_date: null,
      end_time: null,
      menu_start_date: false,
      menu_end_date: false,
      menu_start_time: false,
      menu_end_time: false,

      showDialog: false,
      toggle_multiple: [0, 1, 2, 3]
    }
  },
  created() {
    this.setField()
  },
  methods: {
    setField() {
      if (this.currentEdit) {
        const data = this.currentEdit
        this.study_id = data.study_id
        this.marketing_id = data.marketing_id
        this.action = data.action
        this.description = data.description
        this.start_date = moment(data.start_date).format("YYYY-MM-DD")
        this.start_time = moment(data.start_date).format("HH:mm")
        this.end_date = moment(data.end_date).format("YYYY-MM-DD")
        this.end_time = moment(data.end_date).format("HH:mm")
      }
    },
    toHome() {
      this.$router.push("/schedulles")
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
            .put(SCHEDULLE_URL + "/" + this.currentEdit.id, this.getData())
            .then(res => res.data)
          this.$store.commit("currentEdit", resp.data)
          this.setField()
          showNoty("Data Updated", "success")
        }
      } catch (e) {
        catchError(e)
      }
    },
    getData() {
      return {
        study_id: this.study_id,
        marketing_id: this.marketing_id,
        action: this.action,
        description: this.description,
        start_date: this.start_date + " " + this.start_time,
        end_date: this.end_date + " " + this.end_time
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
            .delete(SCHEDULLE_URL + "/" + this.currentEdit.id)
            .then(res => res.data)
          if (resp.meta.status === 200) {
            showNoty("Data Deleted", "success")
            this.$router.push("/schedulles")
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
