<template>
  <div>
    <v-dialog
      ref="dialog"
      v-model="dialog"
      :close-on-content-click="false"
      :nudge-right="40"
      transition="scale-transition"
      offset-y
      max-width="290px"
      min-width="290px"
    >
      <template v-slot:activator="{ on }">
        <v-text-field
          v-model="time"
          :label="label"
          readonly
          v-on="on"
        ></v-text-field>
      </template>
      <v-time-picker
        :allowed-minutes="allowedMinutes"
        v-model="time"
        full-width
      >
        <v-spacer></v-spacer>
        <v-btn text color="primary" @click="dialog = false"> Cancel </v-btn>
        <v-btn text color="primary" @click="save"> OK </v-btn>
      </v-time-picker>
    </v-dialog>
  </div>
</template>

<script>
export default {
  props: {
    label: {
      type: String,
      default: 'Time',
    },
    timeInfo: {
      type: String,
      default: '',
    },
    allowedMinutes: {
      type: Function,
      default: () => {},
    },
  },
  watch: {
    labed(value) {
      this.label = value;
    },
    timeInfo(value) {
      this.time = value;
    },
  },
  methods: {
    save() {
      //console.log('save');
      this.dialog = false;
      this.$emit('save-dialog', this.time);
    },
  },
  data() {
    return {
      dialog: false,
      time: this.timeInfo,
    };
  },
};
</script>
