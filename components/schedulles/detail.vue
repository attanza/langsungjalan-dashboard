<template>
  <div>
    <v-card>
      <v-container grid-list-md fluid style="padding-top: 5px;">
        <v-toolbar color="transparent" card>
          <v-spacer/>
          <Tbtn color="primary" icon="chevron_left" icon-mode tooltip-text="Kembali" @onClick="toHome"/>
          <Tbtn color="primary" icon="save" icon-mode tooltip-text="Simpan" @onClick="submit"/>              
          <Tbtn color="primary" icon="refresh" icon-mode tooltip-text="Refresh" @onClick="setField"/>  
          <Tbtn color="primary" icon="delete" icon-mode tooltip-text="Hapus" @onClick="confirmDelete"/>  
        </v-toolbar> 
        <form>
          <v-layout row wrap class="mt-3 px-2">
            <v-flex v-if="comboData" sm6 xs12>
              <label>Marketing</label>                
              <v-autocomplete
                v-validate="'required|numeric'"
                :items="comboData"
                :error-messages="errors.collect('marketing_id')"
                :data-vv-name="'marketing_id'"
                :data-vv-as="'Marketing'"

                v-model="marketing_id"
                label="Pilih marketing"
                single-line
                item-text="name"
                item-value="id"
                cache-items
              />
            </v-flex>
            <v-flex v-if="comboData3" sm6 xs12>
              <label>Aksi</label>                
              <v-autocomplete
                v-validate="'required|numeric'"
                :items="comboData3"
                :error-messages="errors.collect('marketing_action_id')"
                :data-vv-name="'marketing_action_id'"
                :data-vv-as="'Aksi'"

                v-model="marketing_action_id"
                label="Pilih aksi"
                single-line
                item-text="name"
                item-value="id"
                cache-items
              />
            </v-flex>
            <v-flex v-if="comboData2" sm6 xs12>
              <label>Program Studi</label>                
              <v-autocomplete
                v-validate="'required|numeric'"
                :items="comboData2"
                :error-messages="errors.collect('study_id')"
                :data-vv-name="'study_id'"
                :data-vv-as="'Program Studi'"

                v-model="study_id"
                label="Select Study Program"
                single-line
                item-text="university"
                item-value="id"
                cache-items
              />
            </v-flex>
          </v-layout>
          <v-layout row wrap>
            <v-flex sm6 xs12>
              <label>Tanggal Mulai</label>                
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
                  :data-vv-as="'Tanggal mulai'"

                  v-model="start_date"
                  label="Pilih tanggal mulai"
                  readonly
                />
                <v-date-picker v-model="start_date" @input="$refs.menu.save(start_date)"/>

              </v-menu>
            </v-flex>

            <v-flex sm6 xs12>
              <label>Waktu Mulai</label>                
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
                  :data-vv-as="'Waktu mulai'"

                  v-model="start_time"
                  label="Pilih waktu mulai"
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
              <label>Tanggal Akhir</label>                
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
                  :data-vv-as="'Tanggal Akhir'"
                  v-model="end_date"
                  label="Pilih tanggal akhir"
                  readonly
                />
                <v-date-picker v-model="end_date" @input="$refs.menu2.save(end_date)"/>

              </v-menu>
            </v-flex>

            <v-flex sm6 xs12>
              <label>Waktu Akhir</label>                
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
                  :data-vv-as="'Waktu Akhir'"

                  v-model="end_time"
                  label="Pilih waktu akhir"
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
              <label>Deskripsi</label>
              <v-textarea
                v-validate="'max:250'"
                v-model="description"
                :error-messages="errors.collect('description')"
                name="description"
                data-vv-name="description"
                data-vv-as="Deskripsi"

              />
            </v-flex>
          </v-layout>       
        </form>
      </v-container>
    </v-card>
    <Dialog :showDialog="dialog" text="Yakin mau menghapus ?" @onClose="dialog = false" @onConfirmed="removeData"/>
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
      dialog: false,
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
        this.start_time = moment(data.start_date).format("HH:mm:ss")
        this.end_date = moment(data.end_date).format("YYYY-MM-DD")
        this.end_time = moment(data.end_date).format("HH:mm:ss")
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
        this.activateLoader()
        if (this.currentEdit) {
          const resp = await axios
            .put(SCHEDULLE_URL + "/" + this.currentEdit.id, this.getData())
            .then(res => res.data)
          this.$store.commit("currentEdit", resp.data)
          this.setField()
          showNoty("Data diperbaharui", "success")
        }
        this.deactivateLoader()
      } catch (e) {
        this.deactivateLoader()
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
    confirmDelete() {
      this.dialog = false
      this.dialog = true
    },
    async removeData() {
      try {
        this.activateLoader()
        if (this.currentEdit) {
          const resp = await axios
            .delete(SCHEDULLE_URL + "/" + this.currentEdit.id)
            .then(res => res.data)
          if (resp.meta.status === 200) {
            showNoty("Data dihapus", "success")
            this.$router.push("/schedulles")
          }
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
