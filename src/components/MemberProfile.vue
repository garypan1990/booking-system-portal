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
      <v-spacer></v-spacer>
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
      >
        <template v-slot:event="{ event }">
          <div>
            <div>{{ event.teacherName }}</div>
          </div>
        </template>
      </v-calendar>
    </v-sheet>
  </div>
</template>

<script>
import { axiosGet } from '../API/base';
export default {
  beforeMount() {
    this.memberId = this.$route.query.memberId;
    this.account = this.$route.query.account;
    axiosGet(`/getBookSchedule?account=${this.account}`)
      .then(res => {
        this.bookingSchedules = res.data;
        console.log(res);
        for (let i = 0; i < this.bookingSchedules.length; i++) {
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
            teacherName: this.bookingSchedules[i].teacherName,
          });
        }
      })
      .catch(e => {
        console.log(e);
      });
  },
  watch: {},
  data() {
    return {
      memberId: 0,
      account: '',
      bookingSchedules: [],
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
    backToPrePage() {
      this.$router.push('/index');
    },
    getEvents() {
      // getEvents({ start, end }) {
      // console.log(start, end);
      const events = [];

      // const min = new Date(`${start.date}T00:00:00`);
      // const max = new Date(`${end.date}T23:59:59`);
      // const days = (max.getTime() - min.getTime()) / 86400000;
      // const eventCount = this.rnd(days, days + 20);

      for (let i = 0; i < this.bookingSchedules.length; i++) {
        let startTime = new Date(this.bookingSchedules[i].bookingStartTime);
        let endTime = new Date(this.bookingSchedules[i].bookingEndTime);
        // const allDay = this.rnd(0, 3) === 0;
        // const firstTimestamp = this.rnd(min.getTime(), max.getTime());
        // const first = new Date(firstTimestamp - (firstTimestamp % 900000));
        // const secondTimestamp = this.rnd(2, allDay ? 288 : 8) * 900000;
        // const second = new Date(first.getTime() + secondTimestamp);
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
          teacherName: this.bookingSchedules[i].teacherName,
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
