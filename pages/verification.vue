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
                  v-model="targetCode"
                  :error-messages="errors.collect('targetCode')"
                  name="targetCode"
                  prepend-icon="code"
                  label="Kode"
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
import { CHECK_TARGET_CODE_URL, STORE_DP_URL } from "~/utils/apis"
import catchError, { showNoty } from "~/utils/catchError"

export default {
  layout: "guest",
  $_veeValidate: {
    validator: "new"
  },
  mixins: [global],
  data: () => ({
    targetCode: "",
    targetId: "",
    university: "",
    study: "",
    name: "",
    phone: "",
    dp: 0,
    isVerified: false,
    loading: false,
    checkBtnDisabled: true,
    btnSubmitDisabled: false
  }),
  watch: {
    targetCode() {
      if (this.targetCode.length > 6) {
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
        if (this.targetCode.length > 6) {
          const date = Math.floor(Date.now() / 1000).toString()
          const endpoint = `${CHECK_TARGET_CODE_URL}/${this.targetCode}`
          const response = await axios
            .get(endpoint, {
              headers: {
                token: SetClientToken(date),
                "x-dsi-restful": date
              }
            })
            .then(resp => resp.data)
          if (response) {
            this.study = response.study.studyName.name
            this.university = response.study.university.name
            this.isVerified = true
            this.targetId = response.id
          }
        }
      } catch (e) {
        catchError(e)
      }
    },
    submit() {
      this.$validator.validateAll().then(result => {
        if (result) {
          this.submitDp()
          return
        }
      })
    },
    async submitDp() {
      try {
        if (this.targetId) {
          this.loading = true
          const date = Math.floor(Date.now() / 1000).toString()
          const endpoint = `${STORE_DP_URL}`
          const response = await axios
            .post(endpoint, this.getData(), {
              headers: {
                token: SetClientToken(date),
                "x-dsi-restful": date
              }
            })
            .then(resp => resp.data)
          if (response.meta.status === 201) {
            showNoty("Data berhasil disimpan. Terimakasih.", "success")
            this.resetData()
          }
        }
      } catch (e) {
        this.resetData()

        catchError(e)
      }
    },
    getData() {
      return {
        marketing_target_id: this.targetId,
        name: this.name,
        phone: this.phone,
        dp: this.dp
      }
    },
    resetData() {
      this.targetId = ""
      this.targetCode = ""
      this.university = ""
      this.study = ""
      this.name = ""
      this.phone = ""
      this.dp = 0
      this.isVerified = false
      this.loading = false
      this.checkBtnDisabled = true
      this.btnSubmitDisabled = true
    }
  }
}
</script>
