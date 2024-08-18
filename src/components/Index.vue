<template>
  <div>
    <v-data-table
      :headers="headers"
      :items="items"
      :search="search"
      :sort-by.sync="sortBy"
      :sort-desc.sync="sortDesc"
      :items-per-page="perPage"
      :loading="loading"
      :no-data-text="noDataText"
      :footer-props="footerProps"
    >
      <template v-slot:top>
        <v-toolbar flat>
          <v-toolbar-title>Member List</v-toolbar-title>
          <v-divider class="mx-4" inset vertical></v-divider>
          <v-spacer></v-spacer>
          <v-text-field
            v-model="search"
            append-icon="mdi-magnify"
            label="Search"
            single-line
            hide-details
          ></v-text-field>
        </v-toolbar>
      </template>
      <template v-slot:item.orderOpts="{ item }">
        <v-select
          full-width
          v-model="item.selectedPurchaseOrderId"
          :items="item.orderOpts"
        ></v-select>
      </template>
      <template v-slot:item.actions="{ item }">
        <!-- Custom actions for each row item -->
        <v-icon @click="addNewOrder(item)">mdi-plus</v-icon>
        <v-icon @click="deleteOrder(item)">mdi-delete</v-icon>
        <v-icon @click="editItem(item)">mdi-pencil</v-icon>
      </template>
    </v-data-table>
    <OrderDialog
      @save-dialog="orderDialogSave"
      @delete-dialog="orderDialogDelete"
      @close-dialog="orderDialog = false"
      :openDialog="orderDialog"
      :formData="orderFormData"
    ></OrderDialog>
  </div>
</template>

<script>
import { axiosGet } from '../API/base';
import OrderDialog from './OrderDialog';
export default {
  name: 'Index',
  components: {
    OrderDialog,
  },
  data() {
    return {
      orderDialog: false,
      orderFormData: {
        type: '',
        purchaseOrderId: 0,
        lessonId: 0,
        account: '',
      },
      headers: [
        { text: 'Account', value: 'account' },
        { text: 'First Name', value: 'firstName' },
        { text: 'Last Name', value: 'lastName' },
        { text: 'HiTutor Account', value: 'hiTutorAccount' },
        { text: 'Purchase Order Number', value: 'orderOpts' },
        { text: 'Actions', value: 'actions', sortable: false },
      ],
      items: [],
      search: '',
      sortBy: 'account',
      sortDesc: false,
      perPage: 10,
      loading: false,
      noDataText: 'No data available',
      footerProps: {
        'items-per-page-options': [10, 20, 50, { text: 'All', value: -1 }],
      },
    };
  },
  beforeMount() {
    this.getMemberList();
  },
  watch: {
    items(val) {
      this.items = val;
    },
  },
  methods: {
    getMemberList() {
      axiosGet('/memberList/').then(res => {
        this.items = [];
        this.items = res.data;
        this.items.forEach(item => {
          let result = [];
          for (let i of item.orders) {
            let obj = {
              text: i.purchaseOrderId,
              value: i.purchaseOrderId,
            };
            result.push(obj);
          }
          if (item.orders[0]) {
            item.selectedPurchaseOrderId = item.orders[0].purchaseOrderId;
          } else {
            item.selectedPurchaseOrderId = '';
          }

          item.orderOpts = result;

          return item;
        });
      });
    },
    editItem(item) {
      let orderObj = item.orders.find(e => {
        if (e.purchaseOrderId == item.selectedPurchaseOrderId) {
          return e.orderId;
        }
      });

      this.$router.push({
        path: `${this.$route.path}/${item.memberId}`,
        query: {
          memberId: item.memberId,
          account: item.account,
          purchaseOrderId: item.selectedPurchaseOrderId,
          orderId: orderObj.orderId,
        },
      });
    },
    addNewOrder(item) {
      this.orderFormData.account = item.account;
      this.orderFormData.type = 'add';

      this.orderDialog = true;
    },
    deleteOrder(item) {
      let res = item.orders.find(i => {
        if (i.purchaseOrderId === item.selectedPurchaseOrderId) {
          return i;
        }
      });
      this.orderFormData.type = 'delete';
      this.orderFormData.account = item.account;
      this.orderFormData.purchaseOrderId = item.selectedPurchaseOrderId;
      this.orderFormData.lessonId = res.lessonId;
      this.orderFormData.orderId = res.orderId;
      this.orderDialog = true;
    },
    orderDialogSave() {
      this.orderDialog = false;
      this.getMemberList();
    },
    orderDialogDelete() {
      this.orderDialog = false;
      window.location.reload();
    },
    // deleteItem(item) {
    //   // Handle delete action
    // },
  },
};
</script>

<style>
.order-plus-col {
  margin-top: 20px;
}
</style>
