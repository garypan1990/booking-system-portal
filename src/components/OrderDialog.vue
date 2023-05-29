<template>
  <v-dialog v-model="dialog" persistent max-width="500px">
    <v-card>
      <v-card-title v-if="formData.type == 'add'" class="text-h5">
        Add Order Detail
      </v-card-title>
      <v-card-title v-else class="text-h5"> Delete Order Detail </v-card-title>
      <v-card-text>
        <v-container>
          <v-row>
            <v-col cols="12" sm="6">
              <v-text-field
                regular
                :readonly="formData.type == 'delete'"
                v-model="formData.purchaseOrderId"
                label="Purchase Order Number"
              ></v-text-field>
            </v-col>
            <v-col cols="12" sm="6">
              <v-text-field
                regular
                :readonly="formData.type == 'delete'"
                v-model="formData.lessonId"
                label="Lesson Number"
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <span style="color: red">{{ errorMsg }}</span>
          </v-row>
        </v-container>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue darken-1" text @click="closeDialog"> Close </v-btn>
        <v-btn
          v-if="formData.type == 'add'"
          color="blue darken-1"
          text
          @click="saveDialog"
        >
          Save
        </v-btn>
        <v-btn v-else color="blue darken-1" text @click="deleteDialog">
          OK
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { axiosPost, axiosDel } from '../API/base';
export default {
  name: 'OrderDialog',
  props: {
    openDialog: {
      type: Boolean,
      default: () => false,
    },
    formData: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      dialog: false,
      purchaseOrderId: 0,
      lessonId: 0,
      errorMsg: '',
      localAccount: '',
    };
  },
  watch: {
    openDialog(val) {
      this.dialog = val;
    },
    // formData: {
    //   handler(val) {
    //     this.localAccount = val.account;
    //   },
    //   deep: true,
    // },
  },
  methods: {
    restoreInitValue() {
      this.formData.purchaseOrderId = 0;
      this.formData.lessonId = 0;
      this.errorMsg = '';
    },
    saveDialog() {
      let body = {
        account: this.formData.account,
        purchaseOrderId: this.formData.purchaseOrderId,
        lessonId: this.formData.lessonId,
      };
      axiosPost('/addOrder/', body)
        .then(() => {
          this.restoreInitValue();
          this.dialog = false;
          this.$emit('save-dialog', false);
        })
        .catch(e => {
          this.errorMsg = e.response.data.message;
        });
    },
    closeDialog() {
      this.dialog = false;
      this.restoreInitValue();
      this.$emit('close-dialog', false);
    },
    deleteDialog() {
      axiosDel(`/deleteOrder/${this.formData.account}/${this.formData.orderId}`)
        .then(() => {
          this.restoreInitValue();
          this.$emit('delete-dialog', false);
          this.dialog = false;
        })
        .catch(e => {
          this.errorMsg = e.response.data.message;
        });
    },
  },
};
</script>
