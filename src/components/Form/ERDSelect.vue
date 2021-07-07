<template>
  <div
    class="erd-select"
    :class="{ 'select-open': isOpen }"
    @mouseenter="isOver = true"
    @mouseleave="isOver = false"
  >
    <button
      type="button"
      class="erd-select-opener"
      @click.stop="toggleDropdown"
      @keydown.up.alt.stop.prevent="toggleDropdown()"
      @keydown.up.exact.stop.prevent="selectPrevious()"
      @keydown.down.alt.stop.prevent="toggleDropdown()"
      @keydown.down.exact.stop.prevent="selectNext()"
      @keydown.home.stop.prevent="selectFirst()"
      @keydown.end.stop.prevent="selectLast()"
      :disabled="disabled || items.length === 0"
    >
      <span
        class="erd-select-opener-txt"
        :class="{ 'erd-select-is-placeholder': isPlaceholder }"
        >{{ currentText }}</span
      >
      <i class="las erd-select-opener-ico" :class="openerIcon"></i>
    </button>
    <transition name="fade">
      <div class="erd-select-dropdown" v-show="isOpen">
        <perfect-scrollbar
          class="scroll"
          :settings="{ suppressScrollX: true, wheelPropagation: true }"
          watch-options
        >
          <button
            class="erd-select-option"
            v-for="(item, index) in filteredItems"
            :class="{ 'erd-select-option--cur': index === selectedIndex }"
            :key="`select-item-${index}`"
            :disabled="item.disabled"
            @click="selectItem(index)"
          >
            {{ item.text }}
          </button>
        </perfect-scrollbar>
      </div>
    </transition>
  </div>
</template>

<script>
/* eslint-disable */
export default {
  model: {
    prop: 'selected',
    event: 'blur'
  },
  props: {
    selected: {
      type: [String, Number, Boolean],
      default: undefined
    },
    items: {
      type: Array,
      required: true
    },
    disabled: {
      type: Boolean,
      default: false
    },
    placeholder: {
      type: String,
      default: ''
    },
    openerIcon: {
      type: String,
      default: 'la-angle-down'
    }
  },
  data () {
    return {
      selectedIndex: -1,
      isOpen: false,
      isOver: false
    }
  },
  computed: {
    currentOption () {
      return this.items[this.selectedIndex]
    },
    currentOptionValue () {
      return this.currentOption.value;
    },
    isPlaceholder () {
      return !this.currentOption;
    },
    currentText () {
      return this.isPlaceholder ? this.placeholder : this.currentOption.text;
    },
    filteredItems () {
      return this.items.filter(item => {
        return item.text && String(item.text).length
      })
    }
  },
  methods: {
    toggleDropdown () {
      if (this.isOpen) {
        this.hideDropdown()
      } else {
        this.showDropdown()
      }
    },
    hideDropdown () {
      this.isOpen = false;
      this.unlistenKeys();
      this.removeEvents();
    },
    showDropdown () {
      this.isOpen = true;
      this.listenKeys();
      this.addEvents();
    },
    selectItem (index) {
      this.$emit('blur', this.items[index].value);
      this.selectedIndex = index;
      this.hideDropdown();
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
      if (!this.isMenuOver) {
        this.toggleDropdown();
      }
    },
    listenKeys () {
      document.addEventListener('keydown', this.listenKeyDown)
    },
    unlistenKeys () {
      document.removeEventListener('keydown', this.listenKeyDown)
    },
    listenKeyDown (event) {
      switch (event.key) {
        case 'Esc':
        case 'Escape':
        case 'Tab':
        case 'Enter':
          event.preventDefault()
          event.stopPropagation()
          return this.hideDropdown()

        case 'Up':
        case 'ArrowUp':
          event.preventDefault()
          event.stopPropagation()
          if (event.altKey)
            return this.toggleDropdown()
          return this.selectPrev()

        case 'Down':
        case 'ArrowDown':
          event.preventDefault()
          event.stopPropagation()
          if (event.altKey)
            return this.toggleDropdown()
          return this.selectNext()

        case 'Home':
          event.preventDefault()
          event.stopPropagation()
          return this.selectFirst()

        case 'End':
          event.preventDefault()
          event.stopPropagation()
          return this.selectLast()

        default: break
      }
    },
    selectByIndex (index) {
      this.selectedIndex = index;
    },
    selectByValue (value = '') {
      let index = this.filteredItems.findIndex(item => {
        return item.value == value;
      })
      this.selectByIndex(index);
    },
    selectNext (offset = 1, startIndex = this.selectedIndex) {
      const nextIndex  = startIndex + offset
      const nextOption = this.filteredItems[nextIndex];
      if (!nextOption) {
        return
      }
      if (nextOption.disabled) {
        return this.selectNext(offset, nextIndex);
      }
      this.selectByIndex(nextIndex);
    },
    selectPrevious () {
      if (this.selectedIndex < 0) {
        return this.selectLast();
      }
      this.selectNext(-1);
    },
    selectFirst () {
      this.selectNext(1, -1)
    },
    selectLast () {
      this.selectNext(-1, this.filteredItems.length)
    },
  },
  beforeMount () {
    this.selectedIndex = this.items.findIndex(item => {
      return item.value == this.selected;
    });
  },
  beforeDestroy () {
    this.unlistenKeys();
  }
};
</script>

<style>
.ng-select{}
</style>