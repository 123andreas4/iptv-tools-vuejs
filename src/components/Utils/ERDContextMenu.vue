<template>
  <div
    ref="contextMenu"
    @click.stop
    @contextmenu.stop
    :id="id"
    :style="contextStyle"
    class="context-menu-container"
  >
    <div class="context">
      <ul
        role="menu"
        class="menu"
        :class="[{ 'menu-align-right': right }, depthClass]"
      >
        <li
          v-for="(item, index) in items"
          :key="`context-menu-${index}`"
          @click.prevent="menuItemClick(item)"
        >
          <div class="hr px-4" v-if="item.divider"></div>
          <a
            class="context-menu-item"
            :class="{ disabled: item.disabled }"
            href="#"
            v-else
            @click.prevent
            ><i class="las" :class="item.icon"></i>{{ item.text }}</a
          >
        </li>
        <slot></slot>
      </ul>
    </div>
  </div>
</template>

<script>
/* eslint-disable */
import { createBodyClickListener } from './../../helpers';

export default {
  props: {
    id: {
      type: String,
      default: 'context-menu'
    },
    right: {
      type: Boolean,
      default: false
    },
    items: {
      type: Array,
      default: () => {
        return []
      }
    },
    depth: {
      type: [String, Number],
      default: 1
    }
  },
  data() {
    return {
      locals: {},
      align: 'left',
      top: 0,
      left: 0,
      visible: false,
      bodyClickListener: createBodyClickListener(
        (e) => {
          let isOpen = !!this.visible
          let outsideClick = isOpen && !this.$el.contains(e.target)

          if (outsideClick) {
            if (e.which !== 1) {
              e.preventDefault()
              e.stopPropagation()
              return false;
            } else {
              this.visible = false
              this.$emit('cancel', this.locals)
              e.stopPropagation()
            }
          } else {
            this.visible = false
            this.$emit('close', this.locals)
          }
        }
      )
    }
  },
  methods: {
    setPositionFromEvent(e) {
      e = e || window.event

      const scrollingElement = document.scrollingElement || document.documentElement

      if (e.pageX || e.pageY) {
        this.left = e.pageX
        this.top = e.pageY - scrollingElement.scrollTop
      } else if (e.clientX || e.clientY) {
        this.left = e.clientX + scrollingElement.scrollLeft
        this.top = e.clientY + scrollingElement.scrollTop
      }

      this.$nextTick(() => {
        const menu = this.$el
        const minHeight = (menu.style.minHeight || menu.style.height).replace('px', '') || 32
        const minWidth = (menu.style.minWidth || menu.style.width).replace('px', '') || 32
        const scrollHeight = menu.scrollHeight || minHeight
        const scrollWidth = menu.scrollWidth || minWidth

        const largestHeight = window.innerHeight - scrollHeight - 25;
        const largestWidth = window.innerWidth - scrollWidth - 25;

        if (this.top > largestHeight) this.top = largestHeight;
        if (this.left > largestWidth) this.left = largestWidth;
      })
      return e
    },
    open (e, data) {
      if (this.visible) this.visible = false
      this.visible = true
      this.$emit('open', this.locals = data || {})
      this.setPositionFromEvent(e)
      this.$el.setAttribute('tab-index', -1)
      this.bodyClickListener.start()
      return this
    },
    menuItemClick (item) {
      this.$emit('menu-click', item, this.locals);
      if (item.onClick && {}.toString.call(item.onClick) === '[object Function]') {
        item.onClick(item, this.locals);
      }
    }
  },
  watch: {
    visible (newVal, oldVal) {
      if (oldVal === true && newVal === false) {
        this.bodyClickListener.stop((e) => {
          // console.log('context menu sequence finished', e)
          // this.locals = {}
        })
      }
    }
  },
  computed: {
    depthClass () {
      return `depth-${this.depth}`;
    },
    contextStyle() {
      return {
        'display' : this.visible ? 'block' : 'none',
        'top'     : (this.top || 0) + 'px',
        'left'    : (this.left || 0) + 'px'
      }
    }
  }
}
</script>