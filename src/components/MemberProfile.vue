<template>
  <div>
    <v-sheet tile height="54" class="d-flex">
      <!-- <v-btn icon class="ma-2" @click="backToPrePage"
        ><v-icon>mdi-arrow-left</v-icon></v-btn
      > -->
      <v-btn icon class="ma-2" @click="$refs.calendar.prev()">
        <v-icon>mdi-chevron-left</v-icon>
      </v-btn>
      <v-select
        v-model="type"
        :items="types"
        dense
        outlined
        hide-details
        class="ma-2"
        label="type"
      ></v-select>
      <v-select
        v-model="mode"
        :items="modes"
        dense
        outlined
        hide-details
        label="event-overlap-mode"
        class="ma-2"
      ></v-select>
      <v-select
        v-model="weekday"
        :items="weekdays"
        dense
        outlined
        hide-details
        label="weekdays"
        class="ma-2"
      ></v-select>
      <!-- <v-spacer></v-spacer> -->
      <v-btn icon class="ma-2" @click="$refs.calendar.next()">
        <v-icon>mdi-chevron-right</v-icon>
      </v-btn>
    </v-sheet>
    <v-sheet height="600">
      <v-calendar
        ref="calendar"
        v-model="value"
        :weekdays="weekday"
        :type="type"
        :events="events"
        :event-overlap-mode="mode"
        :event-overlap-threshold="30"
        :event-color="getEventColor"
        @change="getEvents"
        @click:date="addSchedule"
      >
        <template v-slot:event="{ event }">
          <div>
            <div @click="editSchdeule(event)">{{ event.teacherName }}</div>
          </div>
        </template>
      </v-calendar>
    </v-sheet>
    <scheduleDialog
      ref="schdueleDialog"
      @close-dialog="closeDialog"
      @save-dialog="saveDialog"
      @del-dialog="delDialog"
      :openDialog="openDialog"
      :scheduleDetails="bookingScheduleDetail"
    ></scheduleDialog>
  </div>
</template>

<script>
import moment from 'moment';
import scheduleDialog from './ScheduleDialogDetail.vue';
import { axiosGet } from '../API/base';
export default {
  name: 'MemberProfile',
  components: {
    scheduleDialog,
  },
  beforeMount() {
    this.memberId = this.$route.query.memberId;
    this.account = this.$route.query.account;
    this.purchaseOrderId = this.$route.query.purchaseOrderId;
    this.orderId = this.$route.query.orderId;
    this.getMemberDetail();
  },
  data() {
    return {
      memberId: 0,
      account: '',
      purchaseOrderId: 0,
      orderId: 0,
      bookingSchedules: [],
      bookingScheduleDetail: {},
      openDialog: false,
      type: 'month',
      types: ['month', 'week', 'day', '4day'],
      mode: 'stack',
      modes: ['stack', 'column'],
      weekday: [0, 1, 2, 3, 4, 5, 6],
      weekdays: [
        { text: 'Sun - Sat', value: [0, 1, 2, 3, 4, 5, 6] },
        { text: 'Mon - Sun', value: [1, 2, 3, 4, 5, 6, 0] },
        { text: 'Mon - Fri', value: [1, 2, 3, 4, 5] },
        { text: 'Mon, Wed, Fri', value: [1, 3, 5] },
      ],
      value: '',
      events: [],
      colors: ['green', 'red', 'grey darken-1'],
      names: ['success', 'failed', 'none'],
    };
  },
  methods: {
    // test(data) {
    //   console.log('test');
    //   console.log(data);
    // },
    backToPrePage() {
      this.$router.push('/index');
    },
    editSchdeule(data) {
      this.bookingScheduleDetail = data;
      console.log(this.bookingScheduleDetail);
      this.bookingScheduleDetail.type = 'edit';
      this.openDialog = true;
    },
    closeDialog() {
      this.openDialog = false;
    },
    saveDialog() {
      this.openDialog = false;
      this.bookingSchedules = [];
      this.getMemberDetail();
    },
    delDialog() {
      this.openDialog = false;
      this.getMemberDetail();
    },
    addSchedule(value) {
      let todayHours = moment().toDate().getHours();

      this.bookingScheduleDetail = {
        type: 'add',
        account: this.$route.query.account,
        orderId: this.$route.query.orderId,

        start: moment(value.date, 'YYYY-MM-DD')
          .hour(todayHours)
          .minutes(0)
          .toDate(),
        end: moment(value.date, 'YYYY-MM-DD')
          .hour(todayHours)
          .minutes(this.$refs.schdueleDialog.classMiniutes)
          .toDate(),
        teacherId: 103,
        teacherName: '',
        teachingType: 0,
      };

      this.openDialog = true;
    },
    getMemberDetail() {
      axiosGet(
        `/getBookSchedule?account=${this.account}&purchaseOrderId=${this.purchaseOrderId}`
      )
        .then(res => {
          this.events = [];
          this.bookingSchedules = res.data;

          for (let i = 0; i < this.bookingSchedules.length; i++) {
            this.bookingSchedules[i].account = this.account;
            this.bookingSchedules[i].orderId = this.orderId;
            let startTime = new Date(this.bookingSchedules[i].bookingStartTime);
            let endTime = new Date(this.bookingSchedules[i].bookingEndTime);
            this.events.push({
              name:
                this.bookingSchedules[i].bookingStatus == null
                  ? 'None'
                  : this.bookingSchedules[i].bookingStatus == true
                  ? 'Success'
                  : 'Failed',
              start: startTime,
              end: endTime,
              color:
                this.bookingSchedules[i].bookingStatus == null
                  ? 'grey darken-1'
                  : this.bookingSchedules[i].bookingStatus == true
                  ? 'green'
                  : 'red',
              timed: false,
              bookingScheduleId: this.bookingSchedules[i].bookingScheduleId,
              account: this.bookingSchedules[i].account,
              orderId: this.bookingSchedules[i].orderId,
              purchaseOrderId: this.bookingSchedules[i].purchaseOrderId,
              lessonId: this.bookingSchedules[i].lessonId,
              teacherName: this.bookingSchedules[i].teacherName,
              teacherId: this.bookingSchedules[i].teacherId,
              teachingType: this.bookingSchedules[i].teachingType,
            });
          }
        })
        .catch(e => {
          console.log(e);
        });
    },
    getEvents() {
      // getEvents({ start, end }) {

      const events = [];

      for (let i = 0; i < this.bookingSchedules.length; i++) {
        let startTime = new Date(this.bookingSchedules[i].bookingStartTime);
        let endTime = new Date(this.bookingSchedules[i].bookingEndTime);
        // this.bookingSchedules[i].account = this.accout;
        events.push({
          name:
            this.bookingSchedules[i].bookingStatus == null
              ? 'None'
              : this.bookingSchedules[i].bookingStatus == true
              ? 'Success'
              : 'Failed',
          start: startTime,
          end: endTime,
          color:
            this.bookingSchedules[i].bookingStatus == null
              ? 'grey darken-1'
              : this.bookingSchedules[i].bookingStatus == true
              ? 'green'
              : 'red',
          timed: false,
          bookingScheduleId: this.bookingSchedules[i].bookingScheduleId,
          account: this.bookingSchedules[i].account,
          orderId: this.bookingSchedules[i].orderId,
          purchaseOrderId: this.bookingSchedules[i].purchaseOrderId,
          lessonId: this.bookingSchedules[i].lessonId,
          teacherName: this.bookingSchedules[i].teacherName,
          teacherId: this.bookingSchedules[i].teacherId,
          teachingType: this.bookingSchedules[i].teachingType,
        });
      }

      this.events = events;
    },
    getEventColor(event) {
      return event.color;
    },
    rnd(a, b) {
      return Math.floor((b - a + 1) * Math.random()) + a;
    },
  },
};
</script>
