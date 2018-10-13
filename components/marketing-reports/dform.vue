<template>
  <v-layout row justify-center>
    <v-dialog v-model="dialog" fullscreen hide-overlay transition="dialog-bottom-transition">
      <v-card>
        <v-toolbar dark color="primary">
          <v-btn icon dark @click.native="onClose">
            <v-icon>close</v-icon>
          </v-btn>
          <!-- <v-toolbar-title>Settings</v-toolbar-title> -->
          <v-spacer/>
          <v-toolbar-items>
            <v-btn dark flat @click.native="onClose">Save</v-btn>
          </v-toolbar-items>
        </v-toolbar>
        <v-card-text>
          <form>
            <v-container fluid grid-list-md>
              <v-layout row wrap>
                <v-flex v-if="comboData2" md4 sm6 xs12>
                  <label>Marketing</label>                
                  <v-autocomplete
                    v-validate="'required|numeric'"
                    :items="comboData2"
                    :error-messages="errors.collect('marketing_id')"
                    :data-vv-name="'marketing_id'"
                    :data-vv-as="'Marketing'"
                    v-model="marketing_id"
                    label="Pilih Marketing"
                    single-line
                    item-text="name"
                    item-value="id"
                    cache-items
                  />
                </v-flex>
                <v-flex v-if="comboData" md4 sm6 xs12>
                  <label>Aksi Marketing</label>                
                  <v-autocomplete
                    v-validate="'required|numeric'"
                    :items="comboData"
                    :error-messages="errors.collect('marketing_action_id')"
                    :data-vv-name="'marketing_action_id'"
                    :data-vv-as="'Aksi Marketing'"
                    v-model="marketing_action_id"
                    label="Pilih Aksi Marketing"
                    single-line
                    item-text="name"
                    item-value="id"
                    cache-items
                  />
                </v-flex>
              </v-layout>
              <v-layout>
                <v-flex md4 sm6 xs12>
                  <label>Metode</label>
                  <v-text-field
                    v-validate="'max:50'"
                    v-model="method"
                    :error-messages="errors.collect('method')"
                    name="method"
                    data-vv-name="method"
                    data-vv-as="Metode"
                  />
                </v-flex>
              </v-layout>
              <v-layout>
                <v-flex md4 sm6 xs12>
                  <label>Tanggal</label>                
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
                      :data-vv-as="'Tanggal'"
                      v-model="start_date"
                      label="Pilih tanggal"
                      readonly
                    />
                    <v-date-picker v-model="start_date" @input="$refs.menu.save(start_date)"/>

                  </v-menu>
                </v-flex>

                <v-flex md4 sm6 xs12>
                  <label>Waktu</label>                
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
                      :data-vv-as="'Waktu'"
                      v-model="start_time"
                      label="Pilih waktu"
                      readonly
                    />
                    <v-time-picker
                      v-if="menuTime"
                      v-model="start_time"
                      @change="$refs.menuTime.save(start_time)"
                    />
                  </v-menu>
                </v-flex>
              </v-layout>
              <v-layout>
                <v-flex v-if="comboData3" md4 sm6 xs12>
                  <label>University</label>                
                  <v-autocomplete
                    v-validate="'required|numeric'"
                    :items="comboData3"
                    :error-messages="errors.collect('university_id')"
                    :data-vv-name="'university_id'"
                    :data-vv-as="'Universitas'"
                    v-model="university_id"
                    label="Pilih Universitas"
                    single-line
                    item-text="name"
                    item-value="id"
                    cache-items
                  />
                </v-flex>
                <v-flex v-if="studies" md4 sm6 xs12>
                  <label>University</label>                
                  <v-autocomplete
                    v-validate="'required|numeric'"
                    :items="studies"
                    :error-messages="errors.collect('university_id')"
                    :data-vv-name="'university_id'"
                    :data-vv-as="'Universitas'"
                    v-model="university_id"
                    label="Pilih Universitas"
                    single-line
                    item-text="name"
                    item-value="id"
                    cache-items
                  />
                </v-flex>
              </v-layout>
            </v-container>
          </form>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-layout>
</template>
<script>
import { global } from "~/mixins"
import { COMBO_DATA_URL } from "~/utils/apis"
import axios from "axios"
import catchError from "~/utils/catchError"
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
      marketing_id: "",
      marketing_action_id: "",
      method: "",
      start_date: "",
      start_time: "",
      menu: false,
      menuTime: false,
      university_id: "",
      studies: []
    }
  },
  watch: {
    show() {
      this.dialog = this.show
    },
    university_id() {
      if (this.university_id != "") {
        try {
          axios
            .get(
              COMBO_DATA_URL +
                "StudyProgram&university_id=" +
                this.university_id
            )
            .then(res => {
              this.studies = res.data
            })
        } catch (e) {
          catchError(e)
        }
      }
    }
  },
  methods: {
    onClose() {
      this.$emit("onClose")
    }
  }
}
</script>
