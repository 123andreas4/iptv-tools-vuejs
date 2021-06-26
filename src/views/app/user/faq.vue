<template>
  <erd-row>
    <erd-col xl="2" class="m-0 p-0">
      <ul class="faq-view-list">
        <li
          class="item"
          v-for="(view, index) in views"
          :key="`item-${index}`"
          :class="{ active: index === activeView }"
          @click.stop="changeView(index)"
        >
          <i class="las" :class="view.icon"></i>
          <a href="#" @click.prevent="changeView(index)">{{ view.title }}</a>
        </li>
      </ul>
    </erd-col>
    <erd-col xl="10" class="pl-0 m-0" id="faq">
      <transition name="fade">
        <!-- Start Here -->
        <erd-row class="p-0 m-0" v-if="activeView === 0">
          <erd-col xl="12">
            <erd-collapse :title="$t('faq.0-0-title')" key="faq-0-0">
              <p class="my-1">
                {{ $t("faq.0-0-body") }}
              </p>
            </erd-collapse>
            <erd-collapse :title="$t('faq.0-1-title')" key="faq-0-1">
              <p class="my-1">
                {{ $t("faq.0-1-body") }}
              </p>
            </erd-collapse>
            <erd-collapse :title="$t('faq.0-2-title')" key="faq-0-2">
              <p class="my-1">
                {{ $t("faq.0-2-body") }}
              </p>
            </erd-collapse>
            <erd-collapse :title="$t('faq.0-3-title')" key="faq-0-3">
              <p class="my-1">
                {{ $t("faq.0-3-body") }}
              </p>
            </erd-collapse>
            <erd-collapse :title="$t('faq.0-4-title')" key="faq-0-4">
              <p class="my-1">
                {{ $t("faq.0-4-body") }}
              </p>
            </erd-collapse>
          </erd-col>
        </erd-row>
        <!-- Account -->
        <erd-row class="p-0 m-0" v-if="activeView === 1">
          <erd-col xl="12">
            <erd-collapse :title="$t('faq.1-0-title')" key="faq-1-0">
              <p class="my-1">
                {{ $t("faq.1-0-body") }}
              </p>
            </erd-collapse>
            <erd-collapse :title="$t('faq.1-1-title')" key="faq-1-1">
              <p class="my-1">
                {{ $t("faq.1-1-body") }}
              </p>
            </erd-collapse>
            <erd-collapse :title="$t('faq.1-2-title')" key="faq-1-2">
              <p class="my-1">
                {{ $t("faq.1-2-body") }}
              </p>
            </erd-collapse>
          </erd-col>
        </erd-row>
        <!-- Subscription -->
        <erd-row class="p-0 m-0" v-if="activeView === 2">
          <erd-col xl="12">
            <erd-collapse :title="$t('faq.2-0-title')" key="faq-2-0">
              <p class="my-1">
                {{ $t("faq.2-0-body") }}
              </p>
            </erd-collapse>
            <erd-collapse :title="$t('faq.2-1-title')" key="faq-2-1">
              <p class="my-1">
                {{ $t("faq.2-1-body") }}
              </p>
            </erd-collapse>
            <erd-collapse :title="$t('faq.2-2-title')" key="faq-2-2">
              <p class="my-1">
                {{ $t("faq.2-2-body") }}
              </p>
            </erd-collapse>
            <erd-collapse :title="$t('faq.2-3-title')" key="faq-2-3">
              <p class="my-1">
                {{ $t("faq.2-3-body") }}
              </p>
            </erd-collapse>
            <erd-collapse :title="$t('faq.2-4-title')" key="faq-2-4">
              <p class="my-1">
                {{ $t("faq.2-4-body") }}
              </p>
            </erd-collapse>
            <erd-collapse :title="$t('faq.2-5-title')" key="faq-2-5">
              <p class="my-1">
                {{ $t("faq.2-5-body") }}
              </p>
            </erd-collapse>
          </erd-col>
        </erd-row>
        <!-- Security -->
        <erd-row class="p-0 m-0" v-if="activeView === 3">
          <erd-col xl="12">
            <erd-collapse :title="$t('faq.3-0-title')" key="faq-3-0">
              <p class="my-1">
                {{ $t("faq.3-0-body") }}
              </p>
            </erd-collapse>
            <erd-collapse :title="$t('faq.3-1-title')" key="faq-3-1">
              <p class="my-1">
                {{ $t("faq.3-1-body") }}
              </p>
            </erd-collapse>
            <erd-collapse :title="$t('faq.3-2-title')" key="faq-3-2">
              <p class="my-1">
                {{ $t("faq.3-2-body") }}
              </p>
            </erd-collapse>
            <erd-collapse :title="$t('faq.3-3-title')" key="faq-3-3">
              <p class="my-1">
                {{ $t("faq.3-3-body") }}
              </p>
            </erd-collapse>
          </erd-col>
        </erd-row>
        <!-- Finance -->
        <erd-row class="p-0 m-0" v-if="activeView === 4">
          <erd-col xl="12">
            <erd-collapse :title="$t('faq.4-0-title')" key="faq-4-0">
              <p class="my-1">
                {{ $t("faq.4-0-body") }}
              </p>
            </erd-collapse>
            <erd-collapse :title="$t('faq.4-1-title')" key="faq-4-1">
              <p class="my-1">
                {{ $t("faq.4-1-body") }}
              </p>
            </erd-collapse>
          </erd-col>
        </erd-row>
      </transition>
    </erd-col>
  </erd-row>
</template>

<script>
import { EventBus } from "../../../services/ebus";
import { mapGetters } from "vuex";

export default {
  data() {
    return {
      activeView: 0,
      views: [
        { icon: "la-paper-plane", title: this.$t("faq.get-started") },
        { icon: "la-user", title: this.$t("faq.account") },
        { icon: "la-user-tag", title: this.$t("faq.subscription") },
        { icon: "la-shield-alt", title: this.$t("faq.security") },
        { icon: "la-euro-sign", title: this.$t("faq.financial") },
      ],
    };
  },
  computed: {
    ...mapGetters({
      settings: "settings",
    }),
  },
  methods: {
    changeView(view) {
      this.activeView = view;
    },
    pagePrint() {
      document.getElementById("faq").print();
    },
    keywords(index) {
      return this.$t(`faq.${index}-keywords`).split(",");
    },
    searchKeyword(search) {
      var re = new RegExp(search, "i");
      var id = -1;
      for (var i = 0; i < this.views.length; i++) {
        var keywords = this.keywords(i);
        for (var x = 0; x < keywords.length; x++) {
          if (keywords[x].match(re)) {
            id = i;
            break;
          }
        }
      }
      if (id > -1) {
        this.activeView = id;
      }
    },
  },
  beforeMount() {
    EventBus.$on("print", this.pagePrint);
    EventBus.$on("search", this.searchKeyword);
  },
  beforeDestroy() {
    EventBus.$off("print", this.pagePrint);
    EventBus.$off("search", this.searchKeyword);
  },
};
</script>

<style scoped lang="scss">
.faq-view-list {
  list-style: none;
  padding-left: 8px;

  .item {
    line-height: 2.5rem;
    cursor: pointer;

    a {
      font-size: 12px;
      margin-left: 4px;
      transition: color 0.3s;
    }

    i {
      vertical-align: middle;
      font-size: 1.25rem;
      transition: color 0.3s;
    }
  }
  li {
    position: relative;
  }

  li:before {
    content: " ";
    transition: background 0.15s;
    background: $separator-color;
    border-radius: 10px;
    position: absolute;
    width: 1px;
    height: 2.5rem;
    top: 50%;
    transform: translateY(-50%);
    left: -6px;
  }

  li.active:before {
    background: $theme-color-1;
    width: 3px;
    left: -7px;
  }

  li:hover,
  li.active {
    i,
    a {
      color: $theme-color-1;
    }
  }
}
</style>
