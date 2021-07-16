<template>
  <erd-row>
    <erd-col xl="12" class="pl-0 m-0" id="versions">
      <transition name="fade">
        <!-- Versions -->
        <erd-row class="p-0 m-0">
          <erd-col xl="12" v-for="(version, index) in searchFiltered" :key="`version-${version.id}-col-${index}`">
            <erd-collapse :title="version.version" :subtitle="formatDate(version.created)" :key="`version-${index}`">
              <div class="version-item" v-for="(item, itemindex) in version.items" :key="`version-${index}-item-${itemindex}`">
                <div class="version-tags">
                  <erd-badge :variant="item.tag.variant"><i class="las mr-1" :class="item.tag.icon"></i>{{ item.tag.text }}</erd-badge>
                </div>
                <div class="version-text">
                  <p class="my-1">{{ item.text }}</p>
                </div>
              </div>
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
import { httpService } from "../../../services/http";

export default {
  data() {
    return {
      isLoading: false,
      dateOptions: { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' },
      versions: [],
      search: "",
    };
  },
  computed: {
    ...mapGetters({
      settings: "settings",
    }),
    searchFiltered() {
      if (this.search === null) {
        return this.versions;
      } else {
        var re = new RegExp(this.search, "i");
        return this.versions.filter((version) => {
          return (
            String(version.version).match(re) ||
            version.items.find(item => {
              return String(item.text).match(re)
            })
          )
        });
      }
    },
  },
  methods: {
    pagePrint() {
      document.getElementById("versions").print();
    },
    formatDate(date) {
      return new Date(date).toLocaleDateString(
        this.$t("date.locale"),
        this.dateOptions
      );
    },
    loadVersions() {
      this.isLoading = true;
      httpService.get("versions").then((res) => {
        if (res.status === true) {
          this.versions = res.data;
          this.isLoading = false;
        }
      });
    },
    searchVersion(search) {
      this.search = search;
    }
  },
  beforeMount() {
    this.loadVersions();
    EventBus.$on("print", this.pagePrint);
    EventBus.$on("search", this.searchVersion);
  },
  beforeDestroy() {
    EventBus.$off("print", this.pagePrint);
    EventBus.$off("search", this.searchVersion);
  },
};
</script>

<style scoped lang="scss">
.version-item {

  .version-tags {
    width: 120px;
    display: inline-block;
  }

  .version-text {
    display: inline-block;
    width: calc(100% - 120px);

    p:first-child {
      margin-top: 0.5rem !important;
    }
  }

}
</style>
