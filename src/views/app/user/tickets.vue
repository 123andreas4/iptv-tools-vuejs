<template>
  <erd-row class="m-0 p-0">
    <erd-spinner v-if="isLoading" size="lg" overlay absolute></erd-spinner>
    <erd-col xl="2" lg="3" md="4" v-if="!editorOpen && !ticketOpen">
      <erd-button icon="la-user-edit" block @click="newTicket">
        {{ $t("tickets.new-ticket") }}
      </erd-button>
      <erd-card class="mt-3 p-2 boxes">
        <a
          class="ticket-box"
          href="#"
          :class="{ active: activeBox === 0 }"
          @click.prevent="changeBox(0)"
        >
          <i class="las la-user"></i>
          <span>{{ $t("tickets.open") }}</span>
        </a>
        <a
          class="ticket-box"
          href="#"
          :class="{ active: activeBox === 1 }"
          @click.prevent="changeBox(1)"
        >
          <i class="las la-user-check"></i>
          <span>{{ $t("tickets.answered") }}</span>
        </a>
        <a
          class="ticket-box"
          href="#"
          :class="{ active: activeBox === 2 }"
          @click.prevent="changeBox(2)"
        >
          <i class="las la-user-check"></i>
          <span>{{ $t("tickets.closed") }}</span>
        </a>
        <a
          class="ticket-box"
          href="#"
          :class="{ active: activeBox === 3 }"
          @click.prevent="changeBox(3)"
        >
          <i class="las la-user-lock"></i>
          <span>{{ $t("tickets.archived") }}</span>
        </a>
      </erd-card>
    </erd-col>
    <erd-col xl="2" lg="3" md="4" v-if="editorOpen && !ticketOpen">
      <erd-button
        class="mb-1"
        icon="la-paper-plane"
        @click="saveTicket"
        block
        >{{ $t("general.submit") }}</erd-button
      >
      <erd-button
        variant="danger"
        @click="editorOpen = false"
        class="mb-3"
        block
        >{{ $t("general.cancel") }}</erd-button
      >
      <label for="priority">{{ $t("tickets.priority") }}</label>
      <erd-select
        :items="priorities"
        v-model="editor.priority"
        class="w-100 mb-2"
        id="priority"
      ></erd-select>
      <label for="departement">{{ $t("tickets.departement") }}</label>
      <erd-select
        :items="departements"
        v-model="editor.departement"
        class="w-100"
        id="departement"
      ></erd-select>
    </erd-col>
    <erd-col xl="2" lg="3" md="4" v-if="!editorOpen && ticketOpen">
      <erd-button
        class="mb-1"
        icon="la-reply"
        @click="editTicket"
        v-if="activeBox < 2"
        block
        >{{ $t("tickets.reply") }}</erd-button
      >
      <erd-button
        variant="info"
        icon="la-user-lock"
        @click="archiveTicket"
        class="mb-1"
        v-if="activeBox < 2"
        block
        >{{ $t("tickets.archive") }}</erd-button
      >
      <erd-button
        variant="danger"
        @click="ticketOpen = false"
        class="mb-3"
        block
        >{{ $t("general.cancel") }}</erd-button
      >
    </erd-col>
    <erd-col xl="10" lg="9" md="8" class="m-0 p-0">
      <erd-row class="m-0 p-0" v-if="!editorOpen && !ticketOpen">
        <erd-col xl="3" md="6" class="d-none d-md-block">
          <erd-card>
            <erd-card-body class="ticket-card">
              <i class="las la-user la-5x color-theme-1"></i>
              <div class="ticket-card-title" style="">
                <h5 class="m-0">{{ $t("tickets.open") }}</h5>
                <p class="m-0 color-theme-1">{{ openTickets }}</p>
              </div>
            </erd-card-body>
          </erd-card>
        </erd-col>
        <erd-col xl="3" md="6" class="d-none d-md-block">
          <erd-card>
            <erd-card-body class="ticket-card">
              <i class="las la-user-check la-5x text-success"></i>
              <div class="ticket-card-title" style="">
                <h5 class="m-0">{{ $t("tickets.answered") }}</h5>
                <p class="m-0 text-success">{{ answeredTickets }}</p>
              </div>
            </erd-card-body>
          </erd-card>
        </erd-col>
        <erd-col xl="3" md="6" class="d-none d-md-block">
          <erd-card>
            <erd-card-body class="ticket-card">
              <i class="las la-user-shield la-5x text-danger"></i>
              <div class="ticket-card-title" style="">
                <h5 class="m-0">{{ $t("tickets.closed") }}</h5>
                <p class="m-0 text-danger">{{ closedTickets }}</p>
              </div>
            </erd-card-body>
          </erd-card>
        </erd-col>
        <erd-col xl="3" md="6" class="d-none d-md-block">
          <erd-card>
            <erd-card-body class="ticket-card">
              <i class="las la-user-lock la-5x text-info"></i>
              <div class="ticket-card-title" style="">
                <h5 class="m-0">{{ $t("tickets.archived") }}</h5>
                <p class="m-0 text-info">{{ archivedTickets }}</p>
              </div>
            </erd-card-body>
          </erd-card>
        </erd-col>
        <erd-col xl="12">
          <erd-card class="p-2 ticket-list-view">
            <div class="ticket-list-header">
              <h5>{{ boxTitle }}</h5>
              <div class="buttons">
                <erd-button
                  icon="la-check"
                  variant="info"
                  class="mr-1"
                  :disabled="!canSelectAll"
                  @click="toggleSelectAll"
                ></erd-button>
                <erd-button
                  icon="la-trash"
                  variant="danger"
                  class="mr-1"
                  :disabled="!canDelete"
                  @click="deleteTicket"
                ></erd-button>
                <erd-button icon="la-sync" @click="loadTickets"></erd-button>
              </div>
            </div>
            <div class="ticket-list">
              <div class="empty-list" v-if="ticketsInBox.length === 0">
                <i class="las la-box-open"></i>
                <p>{{ $t("tickets.empty") }}</p>
              </div>
              <div
                class="d-flex flex-row px-2 py-2 justify-content-between ticket-list-item"
                v-for="ticket in ticketsInBox"
                :key="`ticket-${ticket.id}`"
              >
                <div class="flex-fill">
                  <erd-checkbox
                    :value="ticket.id"
                    v-model="selected"
                  ></erd-checkbox>
                  <a href="#" @click.prevent="openTicket(ticket)"
                    >{{ ticket.title }}
                    <erd-badge
                      class="ml-2"
                      v-for="(tag, index) in ticket.tags"
                      :key="`ticket-${ticket.id}-tag-${index}`"
                      variant="primary"
                      >{{ tag }}</erd-badge
                    ></a
                  >
                </div>
                <div class="flex-grow-0 flex-shrink-0">
                  <erd-button
                    icon="la-reply"
                    variant="primary"
                    class="mx-1"
                    v-if="canAnswer"
                    @click="editTicket(ticket)"
                  ></erd-button>
                  <erd-button
                    icon="la-trash"
                    variant="danger"
                    class="mr-3"
                    @click="deleteTicket(ticket.id)"
                  ></erd-button>
                  <span
                    class="text-small text-muted d-none d-md-inline-block"
                    >{{ formatDate(ticket.last_updated) }}</span
                  >
                  <span
                    class="text-small text-muted d-sm-inline-block d-md-none"
                    >{{ formatDate(ticket.last_updated, false) }}</span
                  >
                </div>
              </div>
            </div>
          </erd-card>
        </erd-col>
      </erd-row>
      <erd-row class="m-0 p-0" v-if="editorOpen && !ticketOpen">
        <div class="ticket-editor">
          <label for="title">{{ $t("tickets.title") }}</label>
          <erd-input
            v-model="editor.title"
            class="w-100 mb-2"
            id="title"
          ></erd-input>
          <label>{{ $t("tickets.message") }}</label>
          <wysiwyg v-model="editor.message" class="mb-2" />
          <label v-if="hasHistory">{{ $t("tickets.history") }}</label>
          <div
            class="form-control w-100 pt-4 mt-print-4 pt-print-2"
            v-if="hasHistory"
            id="ticket-editor"
          >
            <div
              class="ticket-conversation"
              v-for="(conversation, index) in editor.conversation"
              :key="`conversation-${index}`"
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
          </div>
        </div>
      </erd-row>
      <erd-row class="p-0" v-if="!editorOpen && ticketOpen" id="ticket-reader">
        <h1 class="mb-0 ml-0 pl-0 pb-0 mt-print-4">{{ reader.title }}</h1>
        <div
          class="ticket-conversation reader"
          v-for="(conversation, index) in reader.conversation"
          :key="`conversation-${index}`"
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
      </erd-row>
    </erd-col>

    <!---->
  </erd-row>
</template>

<script>
/* eslint-disable no-unused-vars */
import { mapGetters } from "vuex";
import { httpService } from "../../../services/http";
import { EventBus } from "../../../services/ebus";

export default {
  data() {
    return {
      isLoading: false,
      activeBox: 0,
      tickets: [],
      editorOpen: false,
      ticketOpen: false,
      selected: [],
      editor: {
        title: "",
        conversation: [],
        attachments: [],
        tags: [],
        priority: 0,
        status: 0,
        departement: 1,
        message: "",
        id: null,
      },
      reader: {
        ticket: null,
        title: "",
        conversation: [],
      },
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
    ...mapGetters(["currentUser"]),
    // eslint-disable-next-line vue/return-in-computed-property
    boxTitle() {
      switch (this.activeBox) {
        case 0:
          return this.$t("tickets.open");
        case 1:
          return this.$t("tickets.answered");
        case 2:
          return this.$t("tickets.closed");
        case 3:
          return this.$t("tickets.archived");
      }
    },
    ticketsInBox() {
      return this.tickets.filter((ticket) => {
        return ticket.ticket_status === this.activeBox;
      });
    },
    openTickets() {
      return (
        this.tickets.filter((ticket) => {
          return ticket.ticket_status === 0;
        }).length + ` ${this.$t("navbar.tickets")}`
      );
    },
    answeredTickets() {
      return (
        this.tickets.filter((ticket) => {
          return ticket.ticket_status === 1;
        }).length + ` ${this.$t("navbar.tickets")}`
      );
    },
    closedTickets() {
      return (
        this.tickets.filter((ticket) => {
          return ticket.ticket_status === 2;
        }).length + ` ${this.$t("navbar.tickets")}`
      );
    },
    archivedTickets() {
      return (
        this.tickets.filter((ticket) => {
          return ticket.ticket_status === 3;
        }).length + ` ${this.$t("navbar.tickets")}`
      );
    },
    canAnswer() {
      return this.activeBox < 2;
    },
    canDelete() {
      return this.selected.length > 0;
    },
    canSelectAll() {
      return this.ticketsInBox.length > 0;
    },
    hasHistory() {
      return this.editor.conversation.length;
    },
  },
  methods: {
    formatDate(date, long = true) {
      return long
        ? new Date(date).toLocaleString(this.$t("date.locale"))
        : new Date(date).toLocaleDateString(this.$t("date.locale"));
    },
    changeBox(box) {
      this.editorOpen = false;
      this.selected.length = 0;
      this.activeBox = box;
    },
    toggleSelectAll() {
      if (this.selected.length > 0) {
        this.selected.splice(0, this.selected.length);
      } else {
        this.ticketsInBox.map((ticket) => {
          this.selected.push(ticket.id);
        });
      }
    },
    loadTickets() {
      this.isLoading = true;
      httpService
        .get("users/tickets")
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
            this.$t("tickets.tickets-loading-failed"),
            "la-user-shield",
            { duration: 5000, permanent: false }
          );
        });
    },
    deleteTicket(id) {
      this.isLoading = true;
      httpService
        .delete(`users/tickets/${id !== undefined ? id : this.selected.join()}`)
        .then((res) => {
          this.isLoading = false;
          if (res.status === true) {
            this.loadTickets();
          }
        })
        .catch(() => {
          this.isLoading = false;
          this.$notify(
            "error",
            this.$t("profile.failed"),
            this.$t("tickets.tickets-removing-failed"),
            "la-user-shield",
            { duration: 5000, permanent: false }
          );
        });
    },
    saveTicket() {
      let title =
        this.currentUser.profile &&
        this.currentUser.profile.name_first.length &&
        this.currentUser.profile.name_last.length
          ? `${this.currentUser.profile.name_first} ${this.currentUser.profile.name_last}`
          : this.currentUser.user.username;

      // Add message to conversation
      this.editor.conversation.unshift({
        date: new Date(),
        message: this.editor.message,
        user: {
          title: title,
          icon: "la-user",
          role: this.currentUser.user.role,
        },
      });

      let data = {
        user_id: this.currentUser.user.id,
        title: this.editor.title,
        priority: this.editor.priority,
        ticket_status: 0,
        departement: this.editor.departement,
        conversation: this.editor.conversation,
        lang: this.$i18n.locale,
      };

      if (!isNaN(this.editor.id) && this.editor.id !== null) {
        data.id = this.editor.id;
      }

      this.isLoading = true;
      httpService
        .post("users/tickets", data)
        .then((res) => {
          this.isLoading = false;
          if (res.status === true) {
            this.editorOpen = false;
            this.$notify(
              "primary",
              this.$t("profile.success"),
              this.$t("tickets.tickets-saving-success"),
              "la-paper-plane",
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
            this.$t("tickets.tickets-saving-failed"),
            "la-user-shield",
            { duration: 5000, permanent: false }
          );
        });
    },
    newTicket() {
      let e = this.editor;
      e.title = "";
      e.conversation = [];
      e.attachments = [];
      e.tags = [];
      e.priority = 0;
      e.status = 0;
      e.departement = 1;
      e.message = "";
      e.id = null;
      this.editorOpen = true;
    },
    editTicket(ticket) {
      let e = this.editor;
      let t;
      if (ticket) {
        t = Object.assign({}, ticket);
      } else {
        t = Object.assign({}, this.reader.ticket);
      }
      e.title = t.title;
      e.conversation = t.conversation;
      e.attachments = t.attachments;
      e.tags = t.tags;
      e.priority = t.priority;
      e.status = 0;
      e.departement = t.departement;
      e.message = "";
      e.id = t.id;
      this.ticketOpen = false;
      this.editorOpen = true;
    },
    archiveTicket() {
      httpService
        .post("users/tickets", {
          id: this.reader.ticket.id,
          user_id: this.currentUser.user.id,
          ticket_status: 3,
        })
        .then((res) => {
          this.isLoading = false;
          if (res.status === true) {
            this.editorOpen = false;
            this.ticketOpen = false;
            this.loadTickets();
          }
        })
        .catch(() => {
          this.isLoading = false;
          this.$notify(
            "error",
            this.$t("profile.failed"),
            this.$t("tickets.tickets-saving-failed"),
            "la-user-shield",
            { duration: 5000, permanent: false }
          );
        });
    },
    openTicket(ticket) {
      this.reader.title = ticket.title;
      this.reader.conversation = ticket.conversation;
      this.reader.ticket = ticket;
      this.ticketOpen = true;
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
    pagePrint() {
      if (this.ticketOpen) {
        document.getElementById("ticket-reader").print();
      } else if (this.editorOpen) {
        document.getElementById("ticket-editor").print();
      }
    },
    searchInConversations(conversations, search) {
      let found = false;
      let re = new RegExp(search, "i");
      conversations.map((conversation) => {
        if (conversation.message.match(re)) {
          found = true;
        }
      });
      return found;
    },
    searchTicket(search) {
      if (search === undefined || search === null || search.length === 0) {
        this.loadTickets();
      } else {
        httpService
          .get("users/tickets")
          .then((res) => {
            this.isLoading = false;
            if (res.status === true) {
              this.tickets = res.data.filter((ticket) => {
                var re = new RegExp(search, "i");
                var foundInTitle = ticket.title.match(re);
                var foundInConversation = this.searchInConversations(
                  ticket.conversation,
                  search
                );
                return foundInTitle || foundInConversation;
              });
            }
          })
          .catch(() => {
            this.tickets = [];
          });
      }
    },
  },
  mounted() {
    this.loadTickets();
  },
  beforeMount() {
    EventBus.$on("print", this.pagePrint);
    EventBus.$on("search", this.searchTicket);
  },
  beforeDestroy() {
    EventBus.$off("print", this.pagePrint);
    EventBus.$off("search", this.searchTicket);
  },
};
</script>

<style scoped lang="scss">
.ticket-card {
  display: table;
}
.ticket-card-title {
  display: table-cell;
  vertical-align: middle;
  width: 100%;
  padding-left: 0.5rem;
}
.ticket-box {
  user-select: none;
  display: block;
  padding: 0.5rem 1rem 0.5rem 0.25rem;

  i {
    margin-right: 0.3rem;
    font-size: 18px;
  }

  span {
    line-height: 18px;
  }

  &.active {
    font-weight: bold;
  }

  &:not(:last-child) {
    border-bottom: 1px solid $separator-color-light;
  }
}
.boxes {
  box-sizing: border-box;
}
.ticket-list-header {
  padding: 0.5rem;
  border-bottom: 1px solid $separator-color-light;

  h5 {
    display: inline-block;
    margin: 0.25rem;
  }

  .buttons {
    float: right;

    .btn {
      width: 29px;
      height: 29px;
      padding: 0.25rem;
      border-radius: 50%;
    }
  }
}
.ticket-list {
  padding: 0.5rem 0;

  .empty-list {
    user-select: none;
    margin-top: 2rem;
    margin-bottom: 2rem;
    text-align: center;

    i {
      font-size: 32px;
      color: $muted-color;
    }

    p {
      margin-top: 0;
      color: $muted-color;
    }
  }

  .ticket-list-item {
    line-height: 30px;
    vertical-align: middle;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;

    &:hover {
      a {
        color: $theme-color-1;
      }
    }

    .erd-checkbox {
      display: inline-block;
      vertical-align: middle;
      line-height: normal;
      box-sizing: border-box;
      max-width: 20px;
    }

    a {
      display: inline-block;
      box-sizing: border-box;
      margin: 0;
      width: 100%;
    }

    .btn {
      width: 29px;
      height: 29px;
      padding: 0.25rem;
      border-radius: 50%;
    }

    &:not(:last-child) {
      border-bottom: 1px solid $separator-color-light;
    }
  }
}
.ticket-list-view {
  box-sizing: border-box;
}
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
