<template>
  <div>
    <v-menu
      ref="menu"
      v-model="menu"
      :close-on-content-click="false"
      :return-value.sync="date"
      transition="scale-transition"
      max-width="290px"
      min-width="290px"
    >
      <template v-slot:activator="{ on, attrs }">
        <v-text-field
          v-model="date"
          :label="label"
          prepend-icon="mdi-calendar"
          readonly
          v-bind="attrs"
          v-on="on"
        ></v-text-field>
      </template>
      <v-date-picker v-model="date" no-title scrollable>
        <v-spacer></v-spacer>
        <v-btn text color="primary" @click="menu = false"> Cancel </v-btn>
        <v-btn text color="primary" @click="clickSave"> OK </v-btn>
      </v-date-picker>
    </v-menu>
  </div>
</template>

<script>
export default {
  name: 'DatePicker',
  props: {
    label: {
      type: String,
      default: '',
    },
    dateTime: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      date: this.dateTime,
      menu: false,
    };
  },
  computed: {},
  watch: {
    label(value) {
      this.label = value;
    },
    dateTime(val) {
      this.date = val;
    },
  },
  methods: {
    clickSave() {
      this.$refs.menu.save(this.date);
      this.$emit('click-save', this.date);
    },
  },
};
</script>
