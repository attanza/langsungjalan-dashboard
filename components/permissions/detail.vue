<template>
  <div>
    <v-card>
      <v-container grid-list-md fluid style="padding-top: 0px;">
        <v-toolbar color="transparent" card>
          <v-spacer/>
          <Tbtn color="primary" icon="chevron_left" icon-mode tooltip-text="Kembali" @onClick="toHome"/>
          <Tbtn color="primary" icon="save" icon-mode tooltip-text="Simpan" @onClick="submit"/>              
          <Tbtn color="primary" icon="refresh" icon-mode tooltip-text="Refresh" @onClick="setFields"/>  
          <Tbtn color="primary" icon="delete" icon-mode tooltip-text="Hapus" @onClick="confirmDelete"/>  
        </v-toolbar> 
        <form>
          <v-layout row wrap class="mt-3 px-2">
            <v-flex v-for="(f, index) in fillable" :key="index" xs12>
              <label>{{ f.caption }}</label>
              <v-text-field
                v-validate="f.rules"
                v-model="formData[f.key]"
                :error-messages="errors.collect(f.key)"
                :name="f.key"
                :data-vv-name="f.key"
              />
            </v-flex>
          </v-layout>     
        </form>
      </v-container>
    </v-card>
    <Dialog :showDialog="showDialog" text="Yakin mau menghapus ?" @onClose="showDialog = false" @onConfirmed="removeData"/>
  </div>
</template>

<script>
import { global } from "~/mixins"
import { PERMISSION_URL } from "~/utils/apis"
import axios from "axios"
import Dialog from "~/components/Dialog"
import catchError, { showNoty } from "~/utils/catchError"

export default {
  $_veeValidate: {
    validator: "new"
  },
  components: { Dialog },
  mixins: [global],
  data() {
    return {
      fillable: [
        {
          key: "name",
          caption: "Permission",
          value: "",
          rules: "required|max:50"
        },
        // { key: "slug", value: "", rules: "required|max:100" },
        {
          key: "description",
          caption: "Deskripsi",
          value: "",
          rules: "max:250"
        }
      ],
      formData: {},
      showDialog: false
    }
  },
  created() {
    this.setFields()
  },
  methods: {
    toHome() {
      // this.$router.push("/permissions")
      this.$router.go(-1)
    },
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
        this.activateLoader()
        if (this.currentEdit) {
          const resp = await axios
            .put(PERMISSION_URL + "/" + this.currentEdit.id, this.formData)
            .then(res => res.data)
          this.$store.commit("currentEdit", resp.data)
          this.setFields()
          showNoty("Data diperbaharui", "success")
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
        if (this.currentEdit) {
          const resp = await axios
            .delete(PERMISSION_URL + "/" + this.currentEdit.id)
            .then(res => res.data)
          if (resp.meta.status === 200) {
            showNoty("Data dihapus", "success")
            this.$router.push("/permissions")
          }
        }
      } catch (e) {
        catchError(e)
      }
    }
  }
}
</script>
