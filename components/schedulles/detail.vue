<template>
  <div>
    <v-card dark>
      <v-container grid-list-md>
        <div class="btn-group">
          <v-btn-toggle v-model="toggle_multiple" multiple>
            <Tbtn color="primary" icon="chevron_left" text="Back to List" @onClick="toHome"/>
            <Tbtn color="primary" icon="save" text="Save" @onClick="submit"/>              
            <!-- <Tbtn color="primary" icon="refresh" text="Refresh" @onClick="setFields"/>   -->
            <Tbtn color="primary" icon="delete" text="Delete" @onClick="confirmDelete"/>  
          </v-btn-toggle>
          <hr >
        </div>    
        <form>
          <v-layout row wrap class="mt-3 px-2">
            <v-flex v-if="comboData" sm6 xs12>
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
            <v-flex v-if="comboData3" sm6 xs12>
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
            <v-flex v-if="comboData2" sm6 xs12>
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
                <v-date-picker v-model="start_date" no-title scrollable>
                  <v-spacer/>
                  <v-btn flat color="primary" @click="menu = false">Cancel</v-btn>
                  <v-btn flat color="primary" @click="$refs.menu.save(start_date)">OK</v-btn>
                </v-date-picker>
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
                  label="Pick an End Date"
                  readonly
                />
                <v-date-picker v-model="end_date" no-title scrollable>
                  <v-spacer/>
                  <v-btn flat color="primary" @click="menu2 = false">Cancel</v-btn>
                  <v-btn flat color="primary" @click="$refs.menu2.save(end_date)">OK</v-btn>
                </v-date-picker>
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
      menu: false,
      menu2: false,
      marketing_id: "",
      marketing_action_id: "",
      study_id: "",
      start_date: null,
      end_date: null,
      description: "",

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
        this.marketing_action_id = data.marketing_action_id
        this.description = data.description
        this.start_date = moment(data.start_date).format("YYYY-MM-DD")
        this.end_date = moment(data.end_date).format("YYYY-MM-DD")
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
        marketing_id: this.marketing_id,
        marketing_action_id: this.marketing_action_id,
        study_id: this.study_id,
        start_date: this.start_date,
        end_date: this.end_date,
        description: this.description
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
