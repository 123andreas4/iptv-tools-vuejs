<template>
  <erd-row class="m-0 p-0">
    <erd-spinner v-if="isLoading" size="lg" overlay absolute></erd-spinner>
    <erd-col xl="12" id="archived-tickets" v-if="!editor">
      <b-table :items="paged" :fields="fields" striped small>
        <template v-slot:cell(user_id)="row">
          <router-link
            :to="{
              name: 'users',
              params: { editor: true, id: row.item.user_id },
            }"
            >{{ row.item.user_id }}</router-link
          >
        </template>
        <template v-slot:cell(priority)="row">
          <erd-badge :variant="priorityVariant(row.item.priority)">{{
            $t(`priority.${row.item.priority}`)
          }}</erd-badge>
        </template>
        <template v-slot:cell(departement)="row">
          {{ $t(`departement.${row.item.departement}`) }}
        </template>
        <template v-slot:cell(created)="row">
          {{ formatDate(row.item.created) }}
        </template>
        <template v-slot:cell(last_updated)="row">
          {{ formatDate(row.item.last_updated) }}
        </template>
        <template v-slot:cell(tags)="row">
          <erd-badge
            v-for="(tag, index) in row.item.tags"
            :key="`tag-${row.item.id}-${index}`"
            >{{ tag }}</erd-badge
          >
        </template>
        <template v-slot:cell(lang)="row">
          <span class="text-capitalize">{{
            languages[row.item.lang].name
          }}</span>
        </template>
        <template v-slot:cell(actions)="row">
          <erd-button
            variant="info"
            class="btn-table"
            @click="replyTicket(row.item)"
            ><i class="las la-reply"></i
          ></erd-button>
          <erd-button
            variant="danger"
            class="btn-table"
            @click="deleteTicket(row.item.id)"
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
    <erd-row v-if="editor" class="m-0 p-0">
      <erd-col xl="3" lg="4" md="5">
        <label for="priority">{{ $t("tickets.priority") }}</label>
        <erd-select
          :items="priorities"
          v-model="editorTicket.priority"
          class="w-100 mb-2"
          id="priority"
        ></erd-select>
        <label for="departement">{{ $t("tickets.departement") }}</label>
        <erd-select
          :items="departements"
          v-model="editorTicket.departement"
          class="w-100 mb-2"
          id="departement"
        ></erd-select>
        <label for="title">{{ $t("tickets.tags") }}</label>
        <erd-tag-input
          class="mb-2 w-100"
          v-model="editorTicket.tags"
        ></erd-tag-input>
        <label>{{ $t("tickets.notes") }}</label>
        <erd-textarea
          class="mb-2 w-100"
          v-model="editorTicket.notes"
        ></erd-textarea>
      </erd-col>
      <erd-col xl="9" lg="8" md="7">
        <label for="title">{{ $t("tickets.title") }}</label>
        <erd-input
          v-model="editorTicket.title"
          class="w-100 mb-2"
          id="title"
        ></erd-input>
        <label>{{ $t("tickets.message") }}</label>
        <wysiwyg class="mb-2" v-model="editorMessage" />
      </erd-col>
    </erd-row>
    <erd-row class="m-0 p-0" v-if="editor">
      <erd-col xl="12" sm="12" class="mt-0">
        <div
          class="ticket-conversation reader"
          v-for="(conversation, index) in editorTicket.conversation"
          :key="`conversation-${index}`"
          id="ticket"
        >
          <div class="ticket-title">
            <span class="sender">
              <i class="las la-2x" :class="conversation.user.icon"></i>
              <span class="font-weight-bold">{{
                conversation.user.title
              }}</span>
              <erd-badge
                :variant="roleVariant(conversation.user.role)"
                class="ml-2 pb-1"
                >{{ $t(`roles.${conversation.user.role}`) }}</erd-badge
              >
            </span>
            <span class="date">{{ formatDate(conversation.date) }}</span>
          </div>
          <div class="ticket-body">
            <div v-html="conversation.message"></div>
          </div>
        </div>
      </erd-col>
    </erd-row>
  </erd-row>
</template>

<script>
/* eslint-disable vue/no-side-effects-in-computed-properties */
import { EventBus } from "../../../services/ebus";
import { httpService } from "../../../services/http";
import { mapGetters } from "vuex";
import { languages } from "../../../helpers";

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
      editorTicket: null,
      editorMessage: "",
      tickets: [],
      languages,
      fields: [
        { key: "user_id", label: this.$t("users.id"), sortable: true },
        { key: "priority", label: this.$t("tickets.priority"), sortable: true },
        {
          key: "departement",
          label: this.$t("tickets.departement"),
          sortable: true,
        },
        { key: "title", label: this.$t("tickets.title"), sortable: true },
        { key: "created", label: this.$t("users.created"), sortable: true },
        {
          key: "last_updated",
          label: this.$t("users.last-updated"),
          sortable: true,
        },
        { key: "notes", label: this.$t("tickets.notes"), sortable: true },
        { key: "tags", label: this.$t("tickets.tags"), sortable: true },
        { key: "lang", label: this.$t("tickets.lang"), sortable: true },
        {
          key: "actions",
          label: this.$t("users.actions"),
          sortable: false,
          thClass: "text-right",
          tdClass: "text-right",
        },
      ],
      priorities: [
        { text: this.$t("priority.0"), value: 0 },
        { text: this.$t("priority.1"), value: 1 },
        { text: this.$t("priority.2"), value: 2 },
        { text: this.$t("priority.3"), value: 3 },
      ],
      departements: [
        { text: this.$t("departement.0"), value: 0 },
        { text: this.$t("departement.1"), value: 1 },
        { text: this.$t("departement.2"), value: 2 },
        { text: this.$t("departement.3"), value: 3 },
        { text: this.$t("departement.4"), value: 4 },
        { text: this.$t("departement.5"), value: 5 },
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
        return this.tickets;
      } else {
        var re = new RegExp(this.search, "i");
        return this.tickets.filter((ticket) => {
          return (
            String(ticket.user_id).match(re) ||
            String(ticket.title).match(re) ||
            this.formatDate(ticket.created).match(re) ||
            this.formatDate(ticket.last_updated).match(re) ||
            JSON.stringify(ticket.conversation).match(re) ||
            String(ticket.attachments).match(re) ||
            String(ticket.notes).match(re) ||
            JSON.stringify(ticket.tags).match(re) ||
            this.$t(`priority.${ticket.priority}`).match(re) ||
            this.$t(`departement.${ticket.departement}`).match(re)
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
    userTitle() {
      return this.currentUser.profile &&
        this.currentUser.profile.name_first.length > 0 &&
        this.currentUser.profile.name_last.length > 0
        ? `${this.currentUser.profile.name_first} ${this.currentUser.profile.name_last}`
        : this.currentUser.user.username;
    },
  },
  methods: {
    formatDate(date) {
      return new Date(date).toLocaleString(
        this.$t("date.locale"),
        this.dateOptions
      );
    },
    priorityVariant(priority) {
      switch (priority) {
        case 0:
          return "success";
        case 1:
          return "info";
        case 2:
          return "warning";
        case 3:
          return "danger";
      }
    },
    roleVariant(role) {
      switch (role) {
        case 1:
        case 1985:
          return "danger";

        case 2:
        case 4:
        case 5:
          return "info";

        case 3:
          return "primary";
      }
    },
    loadTickets() {
      this.isLoading = true;
      httpService
        .get("administration/tickets/3")
        .then((res) => {
          this.isLoading = false;
          if (res.status === true) {
            this.tickets = res.data;
          }
        })
        .catch(() => {
          this.isLoading = false;
          this.$notify(
            "error",
            this.$t("profile.failed"),
            this.$t("tickets.load-error"),
            "la-user-shield",
            { duration: 5000, permanent: false }
          );
        });
    },
    deleteTicket(id) {
      httpService
        .post("administration/ticket/delete", { id: id })
        .then((res) => {
          this.isLoading = false;
          if (res.status === true) {
            this.$notify(
              "primary",
              this.$t("profile.success"),
              this.$t("tickets.delete-success"),
              "la-user-shield",
              { duration: 5000, permanent: false }
            );
            this.loadTickets();
          }
        })
        .catch(() => {
          this.isLoading = false;
          this.$notify(
            "error",
            this.$t("profile.failed"),
            this.$t("tickets.delete-error"),
            "la-user-shield",
            { duration: 5000, permanent: false }
          );
        });
    },
    replyTicket(ticket) {
      this.editorTicket = Object.assign({}, ticket);
      this.editorMessage = "";
      this.editor = true;
    },
    cancelTicket() {
      this.editor = false;
    },
    saveTicket() {
      let ticket = Object.assign({}, this.editorTicket);
      delete ticket.id;
      ticket.ticket_status = 1;
      ticket.last_updated = new Date();

      if (this.editorMessage.length) {
        ticket.conversation.unshift({
          date: new Date(),
          message: this.editorMessage,
          user: {
            icon: "la-user-tie",
            role: this.currentUser.user.role,
            title: this.userTitle,
          },
        });
      }

      let id = this.editorTicket.id;

      httpService
        .post("administration/ticket/update", {
          id: id,
          ticket: ticket,
        })
        .then((res) => {
          this.isLoading = false;
          if (res.status === true) {
            this.editor = false;
            this.$notify(
              "primary",
              this.$t("profile.success"),
              this.$t("tickets.save-success"),
              "la-user-shield",
              { duration: 5000, permanent: false }
            );
            this.loadTickets();
          }
        })
        .catch(() => {
          this.isLoading = false;
          this.$notify(
            "error",
            this.$t("profile.failed"),
            this.$t("tickets.save-error"),
            "la-user-shield",
            { duration: 5000, permanent: false }
          );
        });
    },
    searchTicket(search) {
      if (search.length === 0) {
        this.search = null;
      } else {
        this.search = search;
      }
    },
    printTickets() {
      if (this.editor) {
        document.getElementById("ticket").print();
      } else {
        document.getElementById("archived-tickets").print();
      }
    },
  },
  beforeMount() {
    this.loadTickets();
    EventBus.$on("refresh", this.loadTickets);
    EventBus.$on("search", this.searchTicket);
    EventBus.$on("print", this.printTickets);
    EventBus.$on("save", this.saveTicket);
    EventBus.$on("cancel", this.cancelTicket);
  },
  beforeDestroy() {
    EventBus.$off("refresh", this.loadTickets);
    EventBus.$off("search", this.searchTicket);
    EventBus.$off("print", this.printTickets);
    EventBus.$off("save", this.saveTicket);
    EventBus.$off("cancel", this.cancelTicket);
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

<style lang="scss" scoped>
.ticket-conversation {
  background-color: $background-color;
  border-radius: 10px;
  padding: 1rem 1rem;
  border: 1px solid $separator-color;
  margin-bottom: 0.5rem;

  img {
    max-width: 50%;
    max-height: 50%;
  }

  .ticket-title {
    display: flex;
    justify-content: space-between;
    line-height: 30px;
  }

  .ticket-body {
    margin-top: 1rem;
  }

  &.reader {
    background-color: $foreground-color;
    margin-bottom: 0;
    margin-top: 0.5rem;
  }
}
</style>
