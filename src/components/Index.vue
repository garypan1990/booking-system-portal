<template>
  <!-- <v-container> -->
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

    <template v-slot:item.actions="{ item }">
      <!-- Custom actions for each row item -->
      <v-icon @click="editItem(item)">mdi-pencil</v-icon>
      <!-- <v-icon @click="deleteItem(item)">mdi-delete</v-icon> -->
    </template>
  </v-data-table>
  <!-- </v-container> -->
</template>

<script>
import { axiosGet } from '../API/base';
export default {
  data() {
    return {
      headers: [
        { text: 'Account', value: 'account' },
        { text: 'First Name', value: 'firstName' },
        { text: 'Last Name', value: 'lastName' },
        { text: 'HiTutor Account', value: 'hiTutorAccount' },
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
  mounted() {
    axiosGet('/memberList/').then(res => {
      this.items = res.data;
    });
  },
  methods: {
    editItem(item) {
      this.$router.push({
        path: `${this.$route.path}/${item.memberId}`,
        query: { memberId: item.memberId, account: item.account },
      });
    },
    // deleteItem(item) {
    //   // Handle delete action
    // },
  },
};
</script>
