<template>
  <v-layout row justify-center>
    <v-dialog v-model="dialog" persistent max-width="600px">
      <v-card>
        <v-card-title>
          <span class="headline primary--text">{{ formTitle }}</span>
        </v-card-title>
        <v-card-text>
          <v-container grid-list-md>
            <form>
              <v-layout row wrap class="mt-3 px-2">
                <v-flex xs12>
                  <label>Label</label>
                  <v-text-field
                    v-validate="'required|max:50'"
                    v-model="caption"
                    :error-messages="errors.collect('caption')"
                    name="caption"
                    data-vv-name="caption"
                    data-vv-as="Label"

                  />
                </v-flex>
                <v-flex xs12>
                  <label>Tags</label>
                  <v-text-field
                    v-validate="'max:50'"
                    v-model="tags"
                    :error-messages="errors.collect('tags')"
                    name="tags"
                    data-vv-name="tags"
                  />
                </v-flex>
                <v-flex v-if="!isEdit" xs12>
                  <v-text-field v-model="imageName" label="Select Image" prepend-icon="attach_file" @click="pickFile"/>
                  <input
                    ref="image"
                    type="file"
                    style="display: none"
                    accept="image/*"
                    @change="onFilePicked"
            
                  >
                </v-flex>
              </v-layout>       
            </form>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer/>
          <v-btn color="primary" @click.native="onClose">Tutup</v-btn>
          <v-btn color="primary" @click.native="submit">Simpan</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-layout>
</template>
<script>
import { global } from "~/mixins"
import { MARKETING_REPORT_ATTACHMENTS_URL } from "~/utils/apis"
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
    },
    isEdit: {
      type: Boolean,
      required: true
    },
    data: {
      type: Object,
      required: false,
      default: null
    }
  },
  data() {
    return {
      dialog: false,
      formTitle: "Upload Lampiran",
      caption: "",
      tags: "",
      marketing_report_id: "",
      file: null,
      imageName: "",
      imageUrl: "",
      imageFile: ""
    }
  },
  watch: {
    show() {
      this.dialog = this.show
    },
    isEdit() {
      if (this.isEdit) {
        this.setFields()
      }
    }
  },
  created() {
    if (this.currentEdit) {
      this.marketing_report_id = this.currentEdit.id
    }
  },
  methods: {
    pickFile() {
      this.$refs.image.click()
    },

    onFilePicked(e) {
      const files = e.target.files
      if (files[0] !== undefined) {
        this.imageName = files[0].name
        if (this.imageName.lastIndexOf(".") <= 0) {
          return
        }
        const fr = new FileReader()
        fr.readAsDataURL(files[0])
        fr.addEventListener("load", () => {
          this.imageUrl = fr.result
          this.imageFile = files[0] // this is an image file that can be sent to server...
        })
      } else {
        this.clearData()
      }
    },
    onClose() {
      this.$emit("onClose")
    },
    setFields() {
      this.errors.clear()
      if (this.data) {
        this.marketing_report_id = this.data.marketing_report_id
        this.caption = this.data.caption
        this.tags = this.data.tags
      }
    },
    submit() {
      this.$validator.validateAll().then(result => {
        if (result) {
          if (this.isEdit) {
            this.putData()
          } else {
            this.postData()
          }
          return
        }
      })
    },
    async postData() {
      try {
        this.activateLoader()
        const resp = await axios
          .post(MARKETING_REPORT_ATTACHMENTS_URL, this.getFormData(), {
            headers: {
              "Content-Type": "multipart/form-data"
            }
          })
          .then(res => res.data)
        if (resp.meta.status === 201) {
          showNoty("Data disimpan", "success")
          this.$emit("onAdd", resp.data)
          this.clearForm()
          this.deactivateLoader()
        }
      } catch (e) {
        this.clearForm()
        this.deactivateLoader()
        catchError(e)
      }
    },

    async putData() {
      try {
        this.activateLoader()
        const resp = await axios
          .put(
            MARKETING_REPORT_ATTACHMENTS_URL + "/" + this.data.id,
            this.getEditData()
          )
          .then(res => res.data)
        if (resp.meta.status === 200) {
          showNoty("Data diperbaharui", "success")
          this.$emit("onEdit", resp.data)
          this.clearForm()
        }
        this.deactivateLoader()
      } catch (e) {
        this.clearForm()
        this.deactivateLoader()
        catchError(e)
      }
    },
    getFormData() {
      let formData = new FormData()
      formData.append("marketing_report_id", this.marketing_report_id)
      formData.append("file", this.imageFile)
      formData.append("caption", this.caption)
      formData.append("tags", this.tags)
      return formData
    },
    getEditData() {
      return {
        marketing_report_id: this.data.marketing_report_id,
        caption: this.caption,
        tags: this.tags
      }
    },
    clearForm() {
      this.errors.clear()
      this.dialog = false
      this.imageName = ""
      this.imageUrl = ""
      this.imageFile = ""
      this.marketing_report_id = ""
      this.caption = ""
      this.tags = ""
      this.file = null
    }
  }
}
</script>
