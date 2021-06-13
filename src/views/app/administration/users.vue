<template>
  <erd-row class="m-0 p-0">
    <erd-spinner v-if="isLoading" size="lg" overlay absolute></erd-spinner>
    <erd-col xl="12" v-if="!editor" id="users">
      <b-table :items="paged" :fields="fields" striped small>
        <template v-slot:cell(created)="row">
          {{ formatDate(row.item.created) }}
        </template>
        <template v-slot:cell(last_updated)="row">
          {{ formatDate(row.item.last_updated) }}
        </template>
        <template v-slot:cell(username)="row">
          <span class="text-capitalize">{{ row.item.username }}</span>
        </template>
        <template v-slot:cell(status)="row">
          {{ $t(`user-status.${row.item.status}`) }}
        </template>
        <template v-slot:cell(role)="row">
          {{ $t(`roles.${row.item.role}`) }}
        </template>
        <template v-slot:cell(actions)="row">
          <erd-button
            variant="info"
            class="btn-table"
            @click="userSubscription(row.item.id)"
            ><i class="las la-user-tag"></i
          ></erd-button>
          <erd-button
            variant="info"
            class="btn-table"
            @click="userProfile(row.item.id)"
            ><i class="las la-user"></i
          ></erd-button>
          <erd-button
            variant="primary"
            class="btn-table"
            @click="editUser(row.item)"
            ><i class="las la-user-edit"></i
          ></erd-button>
          <erd-button
            variant="danger"
            class="btn-table"
            @click="deleteUser(row.item.id)"
            ><i class="las la-trash"></i
          ></erd-button>
        </template>
      </b-table>
      <b-pagination
        class="w-100 my-3"
        size="sm"
        align="center"
        :total-rows="total"
        :per-page="perPage"
        v-model="currentPage"
      >
        <template v-slot:next-text>
          <i class="las la-angle-right" />
        </template>
        <template v-slot:prev-text>
          <i class="las la-angle-left" />
        </template>
        <template v-slot:first-text>
          <i class="las la-angle-double-left" />
        </template>
        <template v-slot:last-text>
          <i class="las la-angle-double-right" />
        </template>
      </b-pagination>
    </erd-col>
    <erd-col xl="12" v-if="editor">
      <label for="username">{{ $t("users.username") }}</label>
      <erd-input
        id="username"
        class="mt-1 mb-2 w-100"
        :placeholder="$t('users.username')"
        v-model="editorUser.username"
      ></erd-input>
      <label for="password">{{ $t("users.password") }}</label>
      <erd-input
        id="password"
        class="mt-1 mb-2 w-100"
        :placeholder="$t('users.password')"
        v-model="editorUser.password"
      ></erd-input>
      <label for="status">{{ $t("users.status") }}</label>
      <erd-select
        id="status"
        class="mt-1 mb-2 w-100"
        :items="statusList"
        v-model="editorUser.status"
      ></erd-select>
      <label for="role">{{ $t("users.role") }}</label>
      <erd-select
        id="role"
        class="mt-1 mb-2 w-100"
        :items="filteredRoleList"
        v-model="editorUser.role"
      ></erd-select>
    </erd-col>
  </erd-row>
</template>

<script>
/* eslint-disable vue/no-side-effects-in-computed-properties */
import { EventBus } from "../../../services/ebus";
import { httpService } from "../../../services/http";
import { mapGetters } from "vuex";

export default {
  data() {
    return {
      search: null,
      isLoading: false,
      from: 0,
      to: 0,
      total: 0,
      currentPage: 1,
      editor: false,
      editorUser: null,
      users: [],
      fields: [
        { key: "id", label: this.$t("users.id"), sortable: true },
        { key: "username", label: this.$t("users.username"), sortable: true },
        { key: "status", label: this.$t("users.status"), sortable: true },
        { key: "role", label: this.$t("users.role"), sortable: true },
        {
          key: "created",
          label: this.$t("users.created"),
          sortable: true,
        },
        {
          key: "last_updated",
          label: this.$t("users.last-updated"),
          sortable: true,
        },
        {
          key: "actions",
          label: this.$t("users.actions"),
          sortable: false,
          thClass: "text-right",
          tdClass: "text-right",
        },
      ],
      statusList: [
        { value: 1, text: this.$t("user-status.1") },
        { value: 2, text: this.$t("user-status.2") },
        { value: 3, text: this.$t("user-status.3") },
        { value: 4, text: this.$t("user-status.4") },
        { value: 5, text: this.$t("user-status.5") },
      ],
      roleList: [
        { value: 1, text: this.$t("roles.1") },
        { value: 2, text: this.$t("roles.2") },
        { value: 3, text: this.$t("roles.3") },
        { value: 4, text: this.$t("roles.4") },
        { value: 5, text: this.$t("roles.5") },
        { value: 1985, text: this.$t("roles.1985") },
      ],
    };
  },
  computed: {
    ...mapGetters(["currentUser", "settings"]),
    perPage() {
      return this.settings.perPage;
    },
    searchFiltered() {
      if (this.search === null) {
        return this.users;
      } else {
        var re = new RegExp(this.search, "i");
        return this.users.filter((user) => {
          return (
            String(user.id).match(re) ||
            String(user.username).match(re) ||
            String(user.created).match(re) ||
            String(user.last_updated).match(re) ||
            this.formatDate(user.created).match(re) ||
            this.formatDate(user.last_updated).match(re)
          );
        });
      }
    },
    paged() {
      this.total = this.searchFiltered.length;
      this.from = (this.currentPage - 1) * this.perPage;
      this.to =
        this.from + this.perPage > this.total
          ? this.total
          : this.from + this.perPage;
      return this.searchFiltered.slice(this.from, this.to);
    },
    filteredRoleList() {
      let roles = [...this.roleList];
      roles.map((role) => {
        if (this.currentUser.user.role === 1985) {
          role.disabled = false;
        } else {
          if (role.value === 1985) {
            role.disabled = true;
          } else {
            role.disabled = role.value <= this.currentUser.user.role;
          }
        }
      });
      return roles;
    },
  },
  methods: {
    updatePerPage(perPage) {
      this.perPage = perPage;
    },
    formatDate(date) {
      return new Date(date).toLocaleString(
        this.$t("date.locale"),
        this.dateOptions
      );
    },
    loadUsers() {
      this.isLoading = true;
      httpService
        .get("administration/users")
        .then((res) => {
          this.isLoading = false;
          if (res.status === true) {
            this.users = res.data;
          }
        })
        .catch(() => {
          this.isLoading = false;
          this.$notify(
            "error",
            this.$t("profile.failed"),
            this.$t("users.load-error"),
            "la-user-shield",
            { duration: 5000, permanent: false }
          );
        });
    },
    editUser(user) {
      this.editorUser = Object.assign({}, user);
      this.editor = true;
    },
    saveUser() {
      this.editor = false;
      let user = Object.assign({}, this.editorUser);
      delete user.id;
      httpService
        .post("administration/user/update", {
          id: this.editorUser.id,
          user: user,
        })
        .then((res) => {
          this.isLoading = false;
          if (res.status === true) {
            this.$notify(
              "primary",
              this.$t("profile.success"),
              this.$t("users.save-success"),
              "la-user-shield",
              { duration: 5000, permanent: false }
            );
            this.loadUsers();
            this.editor = false;
          }
        })
        .catch(() => {
          this.isLoading = false;
          this.$notify(
            "error",
            this.$t("profile.failed"),
            this.$t("users.save-error"),
            "la-user-shield",
            { duration: 5000, permanent: false }
          );
        });
    },
    deleteUser(id) {
      httpService
        .post("administration/user/delete", { id: id })
        .then((res) => {
          this.isLoading = false;
          if (res.status === true) {
            this.$notify(
              "primary",
              this.$t("profile.success"),
              this.$t("users.delete-success"),
              "la-user-shield",
              { duration: 5000, permanent: false }
            );
            this.loadUsers();
          }
        })
        .catch(() => {
          this.isLoading = false;
          this.$notify(
            "error",
            this.$t("profile.failed"),
            this.$t("users.delete-error"),
            "la-user-shield",
            { duration: 5000, permanent: false }
          );
        });
    },
    cancelUser() {
      this.editor = false;
    },
    userProfile(id) {
      this.$router.push({
        name: "profiles",
        params: { editor: true, id: id },
      });
    },
    userSubscription(id) {
      this.$router.push({
        name: "subscriptions",
        params: { editor: true, id: id },
      });
    },
    searchUser(search) {
      if (search.length === 0) {
        this.search = null;
      } else {
        this.search = search;
      }
    },
    printUsers() {
      document.getElementById("users").print();
    },
  },
  beforeMount() {
    if (this.$route.params.editor && this.$route.params.id !== undefined) {
      httpService
        .get("administration/users")
        .then((res) => {
          this.isLoading = false;
          if (res.status === true) {
            this.users = res.data;
            let user = this.users.find(
              (user) => user.id === this.$route.params.id
            );
            if (user) {
              this.editUser(user);
            }
          }
        })
        .catch(() => {
          this.isLoading = false;
          this.$notify(
            "error",
            this.$t("profile.failed"),
            this.$t("users.load-error"),
            "la-user-shield",
            { duration: 5000, permanent: false }
          );
        });
    } else {
      this.loadUsers();
    }
    EventBus.$on("refresh", this.loadUsers);
    EventBus.$on("save", this.saveUser);
    EventBus.$on("cancel", this.cancelUser);
    EventBus.$on("search", this.searchUser);
    EventBus.$on("print", this.printUsers);
  },
  beforeDestroy() {
    EventBus.$off("refresh", this.loadUsers);
    EventBus.$off("save", this.saveUser);
    EventBus.$off("cancel", this.cancelUser);
    EventBus.$off("search", this.searchUser);
    EventBus.$off("print", this.printUsers);
  },
  watch: {
    from: function (val) {
      EventBus.$emit("update-from", val);
    },
    to: function (val) {
      EventBus.$emit("update-to", val);
    },
    total: function (val) {
      EventBus.$emit("update-total", val);
    },
    editor: function (val) {
      EventBus.$emit("update-editor", val);
    },
  },
};
</script>
