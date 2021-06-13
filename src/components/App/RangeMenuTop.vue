<template>
  <div
    class="d-print-none"
    :class="[{ shown: isOpen }, 'range-menu']"
    @mouseenter="isMenuOver = true"
    @mouseleave="isMenuOver = false"
  >
    <div class="body">
      <div class="range-input-group">
        <label class="from" for="range-from">From</label>
        <label class="to" for="range-to">To</label>
        <input
          id="range-from"
          :value="inputRangeFrom"
          @click.stop="openRangeFrom"
          @blur="blurFrom"
        />
        <i
          class="las la-magnet r-180 la-2x text-primary"
          v-if="snap"
          @dblclick="toggleSnap"
        ></i>
        <i class="las la-arrow-right" v-else @dblclick="toggleSnap"></i>
        <input
          id="range-to"
          :value="inputRangeTo"
          @click.stop="openRangeTo"
          @blur="blurTo"
        />
        <transition name="fade">
          <div class="range-calendar-1" v-if="rangeFromOpen" @click.stop>
            <ng-calendar
              v-model="mRangeFrom"
              :date-locale="dateFormat"
            ></ng-calendar>
          </div>
        </transition>
        <transition name="fade">
          <div class="range-calendar-2" v-if="rangeToOpen" @click.stop>
            <ng-calendar
              v-model="mRangeTo"
              :date-locale="dateFormat"
            ></ng-calendar>
          </div>
        </transition>
      </div>
    </div>
    <div class="body">
      <ng-button
        icon="la-angle-left"
        variant="primary"
        dense
        rounded
        outline
      ></ng-button>
      <ul>
        <li
          v-for="(range, index) in ranges"
          :key="`range-${index}`"
          :class="[{ active: mRange === index }, 'range']"
          @click="activeRange = index"
        >
          {{ range }}
        </li>
      </ul>
      <ng-button
        icon="la-angle-right"
        variant="primary"
        dense
        rounded
        outline
      ></ng-button>
      <ng-button icon="la-calendar-day" class="ml-2">Today</ng-button>
    </div>
    <a href="#" class="range-menu-button" @click.prevent="toggle">
      <i class="las la-calendar"></i>
    </a>
  </div>
</template>

<script>
/* eslint-disable */
import { mapGetters, mapMutations, mapActions } from 'vuex';
export default {
  data() {
    return {
      isOpen: false,
      isMenuOver: false,
      ranges: ['H', 'D', 'W', 'M', 'Q', 'Y'],
      snap: false,
      rangeFromOpen: false,
      rangeToOpen: false
    };
  },
  computed: {
    ...mapGetters({
      rangeFrom  : 'rangeFrom',
      rangeTo    : 'rangeTo',
      range      : 'range',
      rangeSnap  : 'rangeSnap',
      dateFormat : 'dateFormat'
    }),
    mRange: {
      get () {
        return this.range
      },
      set (val) {
        this.$store.commit('setRange', val)
      }
    },
    mRangeFrom: {
      get () {
        return this.rangeFrom
      },
      set (val) {
        this.$store.commit('setRangeFrom', val)
      }
    },
    mRangeTo: {
      get () {
        return this.rangeTo
      },
      set (val) {
        this.$store.commit('setRangeTo', val)
      }
    },
    inputRangeFrom () {
      return this.rangeFrom.toLocaleString(this.dateFormat, {
        hourCycle : 'h23',
        year      : 'numeric',
        month     : '2-digit',
        day       : '2-digit',
        hour      : '2-digit',
        minute    : '2-digit',
        second    : '2-digit'
      });
    },
    inputRangeTo () {
      return this.rangeTo.toLocaleString(this.dateFormat, {
        hourCycle : 'h23',
        year      : 'numeric',
        month     : '2-digit',
        day       : '2-digit',
        hour      : '2-digit',
        minute    : '2-digit',
        second    : '2-digit'
      });
    }
  },
  methods: {
    blurFrom (val) {
      if (!this.rangeFromOpen) {
        this.$store.commit('setRangeFrom', val.target.value);
      }
    },
    blurTo (val) {
      if (!this.rangeToOpen) {
        this.$store.commit('setRangeTo', val.target.value);
      }
    },
    addEvents() {
      document.addEventListener("click", this.handleDocumentClick);
      document.addEventListener("touchstart", this.handleDocumentClick);
    },
    removeEvents() {
      document.removeEventListener("click", this.handleDocumentClick);
      document.removeEventListener("touchstart", this.handleDocumentClick);
    },
    handleDocumentClick(e) {
      if (this.rangeFromOpen) {
        this.rangeFromOpen = false;
      } else
      if (this.rangeToOpen) {
        this.rangeToOpen = false;
      } else
      if (!this.isMenuOver) {
        this.toggle();
      }
    },
    toggle() {
      this.isOpen = !this.isOpen;
    },
    toggleSnap () {
      this.snap = !this.snap;
    },
    openRangeFrom () {
      if (this.rangeFromOpen) {
        this.rangeFromOpen = false;
      } else {
        this.rangeToOpen   = false;
        this.rangeFromOpen = true;
      }
    },
    openRangeTo () {
      if (this.rangeToOpen) {
        this.rangeToOpen   = false;
      } else {
        this.rangeFromOpen = false;
        this.rangeToOpen   = true;
      }
    }
  },
  watch: {
    isOpen (val) {
      if (val) {
        this.addEvents();
      } else {
        this.removeEvents();
      }
    },
    rangeFrom (val) {
      if (this.rangeFromOpen) {
        this.rangeFromOpen = false;
      }
    },
    rangeTo (val) {
      if (this.rangeToOpen) {
        this.rangeToOpen = false;
      }
    }
  },
  beforeDestroy() {
    this.removeEvents();
  }
};
</script>
