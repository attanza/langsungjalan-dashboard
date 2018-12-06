<template>
  <v-content>
    <v-container fluid fill-height>
      <v-layout align-center justify-center>
        <v-flex xs12 sm8 md6>
          <v-card class="elevation-12">
            <v-toolbar color="primary" dark>
              <v-toolbar-title>Verifikasi Pembayaran</v-toolbar-title>
              <v-spacer/>
            </v-toolbar>
            <v-card-text>
              <form>
                <v-text-field
                  v-validate="'required|max:20'"
                  v-model="targetId"
                  :error-messages="errors.collect('targetId')"
                  name="targetId"
                  prepend-icon="code"
                  label="15426xxxxx"
                  data-vv-name="Kode Target"
                />
                <v-text-field
                  v-validate="'required'"
                  v-model="university"
                  :error-messages="errors.collect('university')"
                  name="university"
                  prepend-icon="account_balance"
                  label="Perguruan Tinggi"
                  data-vv-name="Perguruan Tinggi"
                  disabled
                />
                <v-text-field
                  v-validate="'required'"
                  v-model="study"
                  :error-messages="errors.collect('study')"
                  name="study"
                  prepend-icon="description"
                  label="Program Studi"
                  data-vv-name="Kode Target"
                  disabled
                />
                <div v-if="isVerified">
                  <v-text-field
                    v-validate="'required|max:50'"
                    v-model="name"
                    :error-messages="errors.collect('name')"
                    name="name"
                    prepend-icon="account_box"
                    label="Nama Mahasiswa"
                    data-vv-name="Nama Mahasiswa"
                  />
                  <v-text-field
                    v-validate="'required'"
                    v-model="phone"
                    :error-messages="errors.collect('phone')"
                    name="phone"
                    prepend-icon="contact_phone"
                    label="Nomor Telpon"
                    data-vv-name="Nomor Telpon"
                  />
                  <v-text-field
                    v-validate="'required'"
                    v-model="dp"
                    :error-messages="errors.collect('dp')"
                    name="dp"
                    prepend-icon="money"
                    label="Down payment"
                    data-vv-name="Down payment"
                    type="number"
                  />
                </div>
              </form>
            </v-card-text>
            <v-card-actions>
              <v-spacer/>
              <v-btn v-if="!isVerified" :disabled="checkBtnDisabled" color="primary" @click="checkVerified">Check</v-btn>
              <v-btn v-if="isVerified" :disabled="btnSubmitDisabled" :loading="loading" color="primary" @click="submit">Submit</v-btn>

            </v-card-actions>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>
  </v-content>
</template>

<script>
// import superagent from "superagent"
import axios from "axios"
import SetClientToken from "~/utils/SetClientToken"
import { CHECK_TARGET_CODE_URL } from "~/utils/apis"
import catchError from "~/utils/catchError"

export default {
  layout: "guest",
  $_veeValidate: {
    validator: "new"
  },
  mixins: [global],
  data: () => ({
    targetId: "",
    university: "",
    study: "",
    name: "",
    phone: "",
    dp: 0,
    isVerified: false,
    loading: false,
    checkBtnDisabled: true,
    btnSubmitDisabled: true
  }),
  watch: {
    targetId() {
      if (this.targetId.length > 8) {
        this.checkBtnDisabled = false
      } else {
        this.checkBtnDisabled = true
      }
    },
    dp() {
      if (this.name.length > 3 && this.phone > 3 && this.dp.length > 3) {
        this.btnSubmitDisabled = false
      } else {
        this.btnSubmitDisabled = true
      }
    }
  },
  methods: {
    async checkVerified() {
      try {
        if (this.targetId.length > 8) {
          const date = Math.floor(Date.now() / 1000).toString()
          const endpoint = `${CHECK_TARGET_CODE_URL}/${this.targetId}`
          const response = await axios
            .get(endpoint, {
              headers: {
                token: SetClientToken(date),
                "x-dsi-restful": date
              }
            })
            .then(resp => resp.data)
          console.log(response)
          if (response) {
            this.study = response.study.studyName.name
            this.university = response.study.university.name
            this.isVerified = true
          }
        }
      } catch (e) {
        console.log(e)
        catchError(e)
      }
    },
    submit() {
      this.$validator.validateAll().then(result => {
        if (result) {
          return
        }
      })
    }
  }
}
</script>
