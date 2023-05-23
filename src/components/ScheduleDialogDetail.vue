<template>
  <v-dialog v-model="dialog" persistent max-width="600px">
    <v-card>
      <v-card-title>
        <span class="text-h5">Booking Schedule</span>
      </v-card-title>
      <v-card-text>
        <v-container>
          <v-row>
            <v-col cols="12">
              <v-text-field
                regular
                :readonly="true"
                :value="scheduleDetails.account"
                label="User Account"
              ></v-text-field>
            </v-col>
            <!-- <v-col cols="12" sm="6" md="4">
              <v-text-field
                label="Legal middle name"
                hint="example of helper text only on focus"
              ></v-text-field>
            </v-col>
            <v-col cols="12" sm="6" md="4">
              <v-text-field
                label="Legal last name*"
                hint="example of persistent helper text"
                persistent-hint
                required
              ></v-text-field>
            </v-col> -->

            <v-col cols="12" sm="6" md="4">
              <v-text-field
                v-model="scheduleDetails.teacherId"
                label="Teacher ID"
                required
              ></v-text-field>
            </v-col>
            <v-col cols="12" sm="6" md="4">
              <v-text-field
                v-model="scheduleDetails.teacherName"
                label="Teacher Name"
                required
              ></v-text-field>
            </v-col>
            <v-col cols="12" sm="6" md="4">
              <v-select
                v-model="scheduleDetails.teachingType"
                label="Class Minutes"
                :items="[
                  { text: 'Skype', value: 0 },
                  { text: 'J Mode', value: 4 },
                ]"
              ></v-select>
              <!-- <v-text-field
                v-model="teachingTypeTrasform"
                label="Teacher Type"
                required
              ></v-text-field> -->
            </v-col>

            <v-col cols="12" sm="6">
              <DatePicker
                @click-save="datePickerSave"
                :dateTime="scheduleDetails.start"
                :label="'Booking Date'"
              />
            </v-col>
            <v-col cols="12" sm="6">
              <v-select
                v-model="classMiniutes"
                label="Class Minutes"
                :items="[25, 50]"
              ></v-select>
            </v-col>
            <v-col cols="12" sm="6">
              <TimePicker
                @save-dialog="startTimeChanged"
                label="Start Time"
                :timeInfo="startTimeFormat"
                :allowedMinutes="allowStartMin"
              ></TimePicker>
            </v-col>
            <v-col cols="12" sm="6">
              <v-text-field
                v-model="bookingEndTime"
                label="End Time"
                readonly
              ></v-text-field>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue darken-1" text @click="closeDialog"> Close </v-btn>
        <v-btn color="blue darken-1" text @click="saveDialog"> Save </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import DatePicker from './DatePicker.vue';
import TimePicker from './TimePicker.vue';
// import { axiosPut } from '../API/base';
export default {
  name: 'ScheduleDialogDetail',
  components: {
    DatePicker,
    TimePicker,
  },
  props: {
    openDialog: {
      type: Boolean,
      default: () => false,
    },
    scheduleDetails: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      dialog: false,
      teachingTypeMap: { 0: 'Skype', 4: 'J Mode' },
      bookingDate: '',
      bookingStartTime: '',
      bookingEndTime: '',
      classMiniutes: 50,
    };
  },
  watch: {
    openDialog($event) {
      this.dialog = $event;
    },
    'scheduleDetails.start': {
      // caculate end time
      handler(newVal) {
        this.bookingEndTime =
          newVal.getHours().toString() +
          ':' +
          (newVal.getMinutes() + this.classMiniutes)
            .toString()
            .padStart(2, '0');
      },
      deep: true,
    },
    bookingDate() {},
    classMiniutes() {
      // caculate end time
      if (this.classMiniutes === 50) {
        this.scheduleDetails.start = new Date(this.scheduleDetails.start);
        this.scheduleDetails.start.setMinutes(0);
      }
      this.bookingEndTime =
        this.scheduleDetails.start.getHours().toString() +
        ':' +
        this.classMiniutes.toString().padStart(2, '0');
    },
  },
  computed: {
    startTimeFormat() {
      return (
        this.scheduleDetails.start.getHours().toString() +
        ':' +
        this.scheduleDetails.start.getMinutes().toString().padStart(2, '0')
      );
    },
  },
  methods: {
    closeDialog() {
      this.dialog = false;
      this.$emit('close-dialog', false);
    },
    saveDialog() {
      console.log(this.scheduleDetails);
      let body = {
        bookingScheduleId: this.scheduleDetails.bookingScheduleId,
        account: this.scheduleDetails.account,
        teacherName: this.scheduleDetails.teacherName,
        teacherId: this.scheduleDetails.teacherId,
        teachingType: this.scheduleDetails.teachingType,
        bookingStartTime: this.scheduleDetails.start
          .toISOString()
          .replace('Z', '+00:00'),
        bookingEndTime: this.caculateBookingEndTime(),
      };
      console.log(body);
      // axiosPut('/updateBookSchedule/',).then(res=>{

      // })

      this.dialog = false;
      this.$emit('close-dialog', false);
    },
    datePickerSave($event) {
      this.bookingDate = $event;
    },
    startTimeChanged($event) {
      let time = $event;
      time = time.split(':');
      this.scheduleDetails.start = new Date(this.scheduleDetails.start);
      this.scheduleDetails.start.setHours(time[0]);
      this.scheduleDetails.start.setMinutes(time[1]);
      console.log(this.scheduleDetails.start);
    },
    endTimeCompute() {
      if (!this.scheduleDetails.start) return '';
      return (
        this.scheduleDetails.start.getHours().toString() +
        ':' +
        this.classMiniutes.toString().padStart(2, '0')
      );
    },
    allowStartMin(v) {
      if (this.classMiniutes === 25) {
        return v == 0 || v == 30;
      } else {
        return v == 0;
      }
    },
    allowEndMin: v => v == 25 || v == 50,
    caculateBookingStartTime() {},
    caculateBookingEndTime() {
      const endDate = new Date(this.scheduleDetails.start);
      endDate.setMinutes(this.classMiniutes);
      const isoEndDatee = endDate.toISOString().replace('Z', '+00:00');
      console.log(isoEndDatee);
      return isoEndDatee;
    },
  },
};
</script>
