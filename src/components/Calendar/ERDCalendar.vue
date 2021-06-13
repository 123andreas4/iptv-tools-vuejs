<template>
  <div class="erd-calendar">
    <transition name="fade">
      <div class="content">
        <div class="calendar">
          <div class="selected-field">
            <div class="selected-date">
              <button type="button" class="previous" @click="previous">
                <i class="las la-angle-left"></i>
              </button>
              <button
                type="button"
                class="month-year text-capitalize"
                @click="changeView('year')"
              >
                {{ monthYear }}
              </button>
              <button type="button" class="next" @click="next">
                <i class="las la-angle-right"></i>
              </button>
            </div>
            <div class="days" v-if="view === 'day'">
              <div
                class="day name text-capitalize"
                v-for="day in calendar.days"
                :key="`calendar-dayname-${day.dayNumber}`"
              >
                {{ day.name }}
              </div>
            </div>
          </div>
          <div class="days-selection">
            <div class="days" v-if="view === 'day'">
              <button
                class="day"
                v-for="(day, index) in calendar.showDates()"
                :key="`calendar-day-${index}`"
                :class="{
                  disabled: !day.isDayInMonth || !day.isUsable,
                  selected: isSelectedDate(day),
                }"
                @click="setSelectedDate(day)"
              >
                <span class="number">{{ day.day }}</span>
              </button>
            </div>
            <div class="viewmode">
              <div class="years" v-if="view === 'year'">
                <button
                  v-for="(year, index) in calendar.years"
                  :key="`calendar-year-${year}-${index}`"
                  class="year"
                  @click="setYear(year)"
                  :class="{ selected: year === currentDate.year }"
                >
                  {{ year }}
                </button>
              </div>
              <div class="months" v-if="view === 'month'">
                <button
                  v-for="(month, index) in calendar.months"
                  :key="`calendar-month-${index}`"
                  class="month text-capitalize"
                  @click="setMonth(month)"
                  :class="{ selected: month.index == currentDate.month }"
                >
                  {{ month.name }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
/* eslint-disable */
import Calendar from './calendar';

export default {
  model: {
    prop: 'date',
    event: 'click'
  },
  data () {
    return {
      view: 'day',
      selDate: null,
      currentDate: {
        year: new Date().getFullYear(),
        month: new Date().getMonth(),
        date: new Date().getDate(),
        firstDayOfWeek: this.firstDayOfWeek,
      }
    }
  },
  props: {
    date: {
      type: Date,
      default: () => {
        return new Date()
      }
    },
    dateFormat: {
      type: Object,
      default: () => {
        return { day: "2-digit", month: "long", year: "numeric" };
      },
    },
    firstDayOfWeek: {
      type: String,
      validator: (val) => ['monday', 'sunday'].indexOf(val) > -1,
      default: 'monday',
    },
    disabledStartDate: {
      type: Object,
      default: () => {
        return { from: null, to: null };
      },
    },
    dateLocale: {
      type: String,
      default: 'en-US'
    }
  },
  computed: {
    calendar() {
      return new Calendar(
        this.currentDate,
        this.dateLocale,
        'short',
        { ...this.dateFormat },
        this.disabledStartDate
      );
    },
    dayViewText () {
      return (
        `${this.calendar.months[this.currentDate.month].name} ${this.currentDate.year}`
      );
    },
    monthViewText () {
      return this.currentDate.year;
    },
    yearViewText () {
      let years = this.calendar.years;
      return `${years[0]} - ${years[years.length - 1]}`;
    },
    monthYear () {
      switch (this.view) {
        case 'day'   : return this.dayViewText;
        case 'month' : return this.monthViewText;
        case 'year'  : return this.yearViewText;
      }
      return this.dayViewText
    }
  },
  methods: {
    isSelectedDate (day) {
      if (this.selDate === null) {
        return false;
      }
      return this.selDate.getMonth() === day.month && this.selDate.getDate() === day.day;
    },
    setSelectedDate (day) {
      this.selDate = new Date(day.fullDate);
      this.$emit('click', this.selDate);
    },
    setPreviousMonth () {
      const currentDate = this.currentDate;
      currentDate.month = currentDate.month - 1;
      if (currentDate.month === -1) {
        currentDate.year = currentDate.year - 1;
        currentDate.month = 11;
      }
    },
    setNextMonth () {
      const currentDate = this.currentDate;
      currentDate.month = currentDate.month + 1;
      if (currentDate.month === 12) {
        currentDate.year = currentDate.year + 1;
        currentDate.month = 0;
      }
    },
    setYear (year) {
      this.currentDate.year = year;
      this.changeView('month');
    },
    setMonth (month) {
      this.currentDate.month = parseInt(month.index);
      this.changeView('day');
    },
    previous () {
      switch (this.view) {
        case 'day':
          this.setPreviousMonth();
          break;

        case 'year':
          let year = this.calendar.years[0] - 10;
          this.currentDate.year = year
          break;
      }
    },
    next () {
      switch (this.view) {
        case 'day':
          this.setNextMonth();
          break;

        case 'year':
          let year = this.calendar.years[9] + 1;
          this.currentDate.year = year
          break;
      }
    },
    changeView (view) {
      this.view = view;
    },
  },
  created () {
    this.selDate = this.date;
    this.currentDate.year  = this.date.getFullYear();
    this.currentDate.month = this.date.getMonth();
    this.currentDate.date  = this.date.getDate();
  }
};
</script>

<style>
.erd-calendar{}
</style>