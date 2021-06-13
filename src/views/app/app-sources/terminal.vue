<template>
  <erd-row class="m-0 p-0">
    <erd-spinner v-if="isLoading" size="lg" overlay absolute></erd-spinner>
    <v-shell
      class="terminal"
      :banner="banner"
      :shell_input="send_to_terminal"
      :commands="commands"
      @shell_output="prompt"
    ></v-shell>
  </erd-row>
</template>

<script>
/* eslint-disable no-unused-vars */
import { EventBus } from "../../../services/ebus";
import { httpService } from "../../../services/http";
import { mapGetters, mapActions } from "vuex";

export default {
  data() {
    return {
      isLoading: false,
      send_to_terminal: "",
    };
  },
  computed: {
    ...mapGetters(["currentUser", "settings", "appXmltvSync"]),
    banner() {
      return {
        header: this.$t("terminal.header-1"),
        subHeader: this.$t("terminal.header-2"),
        helpHeader: this.$t("terminal.header-3"),
        emoji: {
          first: "",
          second: "",
          time: 1000,
        },
        sign: `[${this.currentUser.user.username}@iptv-tools] $`,
        img: {
          align: "left",
          link:
            "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+CjxzdmcKICAgeG1sbnM6ZGM9Imh0dHA6Ly9wdXJsLm9yZy9kYy9lbGVtZW50cy8xLjEvIgogICB4bWxuczpjYz0iaHR0cDovL2NyZWF0aXZlY29tbW9ucy5vcmcvbnMjIgogICB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiCiAgIHhtbG5zOnN2Zz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciCiAgIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIKICAgeG1sbnM6c29kaXBvZGk9Imh0dHA6Ly9zb2RpcG9kaS5zb3VyY2Vmb3JnZS5uZXQvRFREL3NvZGlwb2RpLTAuZHRkIgogICB4bWxuczppbmtzY2FwZT0iaHR0cDovL3d3dy5pbmtzY2FwZS5vcmcvbmFtZXNwYWNlcy9pbmtzY2FwZSIKICAgdmVyc2lvbj0iMS4xIgogICB3aWR0aD0iMTI4MCIKICAgaGVpZ2h0PSIxMDI0IgogICB2aWV3Qm94PSIwIDAgMTI4MCAxMDI0IgogICB4bWw6c3BhY2U9InByZXNlcnZlIgogICBpZD0ic3ZnNDUiCiAgIHNvZGlwb2RpOmRvY25hbWU9IkZ1bGxDb2xvcl8xMjgweDEwMjQuc3ZnIgogICBpbmtzY2FwZTp2ZXJzaW9uPSIxLjAuMSAoM2JjMmU4MTNmNSwgMjAyMC0wOS0wNykiPjxtZXRhZGF0YQogICBpZD0ibWV0YWRhdGE0OSI+PHJkZjpSREY+PGNjOldvcmsKICAgICAgIHJkZjphYm91dD0iIj48ZGM6Zm9ybWF0PmltYWdlL3N2Zyt4bWw8L2RjOmZvcm1hdD48ZGM6dHlwZQogICAgICAgICByZGY6cmVzb3VyY2U9Imh0dHA6Ly9wdXJsLm9yZy9kYy9kY21pdHlwZS9TdGlsbEltYWdlIiAvPjwvY2M6V29yaz48L3JkZjpSREY+PC9tZXRhZGF0YT48c29kaXBvZGk6bmFtZWR2aWV3CiAgIHBhZ2Vjb2xvcj0iI2ZmZmZmZiIKICAgYm9yZGVyY29sb3I9IiM2NjY2NjYiCiAgIGJvcmRlcm9wYWNpdHk9IjEiCiAgIG9iamVjdHRvbGVyYW5jZT0iMTAiCiAgIGdyaWR0b2xlcmFuY2U9IjEwIgogICBndWlkZXRvbGVyYW5jZT0iMTAiCiAgIGlua3NjYXBlOnBhZ2VvcGFjaXR5PSIwIgogICBpbmtzY2FwZTpwYWdlc2hhZG93PSIyIgogICBpbmtzY2FwZTp3aW5kb3ctd2lkdGg9IjE5MTgiCiAgIGlua3NjYXBlOndpbmRvdy1oZWlnaHQ9Ijk5MyIKICAgaWQ9Im5hbWVkdmlldzQ3IgogICBzaG93Z3JpZD0iZmFsc2UiCiAgIGlua3NjYXBlOnpvb209IjAuMzcyMDcwMzEiCiAgIGlua3NjYXBlOmN4PSIzNDcuMzAxOTQiCiAgIGlua3NjYXBlOmN5PSI3MTEuOTI5NzIiCiAgIGlua3NjYXBlOndpbmRvdy14PSIxOTIwIgogICBpbmtzY2FwZTp3aW5kb3cteT0iMjYiCiAgIGlua3NjYXBlOndpbmRvdy1tYXhpbWl6ZWQ9IjEiCiAgIGlua3NjYXBlOmN1cnJlbnQtbGF5ZXI9InN2ZzQ1IgogICBpbmtzY2FwZTpkb2N1bWVudC1yb3RhdGlvbj0iMCIgLz4KPGRlc2MKICAgaWQ9ImRlc2MyIj5DcmVhdGVkIHdpdGggRmFicmljLmpzIDMuNi4zPC9kZXNjPgo8ZGVmcwogICBpZD0iZGVmczQiPgo8L2RlZnM+CjxnCiAgIHRyYW5zZm9ybT0ibWF0cml4KDEuOTY5Mjc4MDMzNzk0MTYyOSAwIDAgMS45NjkyNzgwMzM3OTQxNjI5IDY0MC4wMTUzODQ2MTUzODQ2IDUxMi4wMTIzMTI0MTg3NjQpIgogICBpZD0iYmFja2dyb3VuZC1sb2dvIj4KCjwvZz4KPGcKICAgdHJhbnNmb3JtPSJtYXRyaXgoMy41ODE2Mzc1LDAsMCwzLjc2NDUxMzksNjQ1Ljc3Mzc0LDUxMi41MDEzMykiCiAgIGlkPSJsb2dvLWxvZ28iCiAgIHN0eWxlPSJzdHJva2Utd2lkdGg6MS4wMDAxO3N0cm9rZS1taXRlcmxpbWl0OjQ7c3Ryb2tlLWRhc2hhcnJheTpub25lIj4KPGcKICAgcGFpbnQtb3JkZXI9InN0cm9rZSIKICAgaWQ9ImczOSIKICAgc3R5bGU9InN0cm9rZS13aWR0aDoxLjAwMDE7c3Ryb2tlLW1pdGVybGltaXQ6NDtzdHJva2UtZGFzaGFycmF5Om5vbmUiPgoJCTxnCiAgIHRyYW5zZm9ybT0ibWF0cml4KDAuMTk1MjM3NDEsMCwwLC0wLjE5NTIzNzQxLDAsLTAuNDcwNTc5ODEpIgogICBpZD0iZzIwIgogICBzdHlsZT0ic3Ryb2tlLXdpZHRoOjUuMTIyNDY7c3Ryb2tlLW1pdGVybGltaXQ6NDtzdHJva2UtZGFzaGFycmF5Om5vbmUiPgo8bGluZWFyR3JhZGllbnQKICAgaWQ9IlNWR0lEXzFfNTkwNDA3IgogICBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSIKICAgZ3JhZGllbnRUcmFuc2Zvcm09Im1hdHJpeCgwLC0yMDMxLjc3LC0yMDMxLjc3LDAsMjk4My44Miw5MTA1LjQyKSIKICAgeDE9IjAiCiAgIHkxPSIwIgogICB4Mj0iMSIKICAgeTI9IjAiPgo8c3RvcAogICBvZmZzZXQ9IjAlIgogICBzdHlsZT0ic3RvcC1jb2xvcjpyZ2IoMjQ3LDE1MCwxNSk7c3RvcC1vcGFjaXR5OiAxIgogICBpZD0ic3RvcDkiIC8+CjxzdG9wCiAgIG9mZnNldD0iNTMuMDMxMyUiCiAgIHN0eWxlPSJzdG9wLWNvbG9yOnJnYigyNDEsNzEsMjkpO3N0b3Atb3BhY2l0eTogMSIKICAgaWQ9InN0b3AxMSIgLz4KPHN0b3AKICAgb2Zmc2V0PSI1OC4yNjA0MzMlIgogICBzdHlsZT0ic3RvcC1jb2xvcjpyZ2IoMjQxLDcxLDI5KTtzdG9wLW9wYWNpdHk6IDEiCiAgIGlkPSJzdG9wMTMiIC8+CjxzdG9wCiAgIG9mZnNldD0iMTAwJSIKICAgc3R5bGU9InN0b3AtY29sb3I6cmdiKDIxMyw0MCw0MCk7c3RvcC1vcGFjaXR5OiAxIgogICBpZD0ic3RvcDE1IiAvPgo8L2xpbmVhckdyYWRpZW50Pgo8cGF0aAogICBzdHlsZT0ib3BhY2l0eToxO2ZpbGw6I2VkNzExNztmaWxsLW9wYWNpdHk6MTtmaWxsLXJ1bGU6ZXZlbm9kZDtzdHJva2U6bm9uZTtzdHJva2Utd2lkdGg6NS4xMjI0NjtzdHJva2UtbGluZWNhcDpidXR0O3N0cm9rZS1saW5lam9pbjptaXRlcjtzdHJva2UtbWl0ZXJsaW1pdDo0O3N0cm9rZS1kYXNoYXJyYXk6bm9uZTtzdHJva2UtZGFzaG9mZnNldDowIgogICBwYWludC1vcmRlcj0ic3Ryb2tlIgogICB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtMjk4My44MiwtODE0OC45MDUpIgogICBkPSJtIDM0OTAuMzgsODUwMS4xMiBjIC0xODguNjIsLTUyLjQyIC0zODQuNzMsLTcuNTggLTQ3Ni4yOSwxMDIuNzMgLTE1Ljg4LDE5LjEyIC00NC42NiwxOS4xMiAtNjAuNTQsMCAtOTEuNTcsLTExMC4zMSAtMjg3LjY2LC0xNTUuMTUgLTQ3Ni4yOSwtMTAyLjczIC0yNi4yNyw3LjMgLTUyLjA5LC0xMi41IC01MC40OCwtMzkuNzEgMTMuNDQsLTIyNi42MiA3NC41MywtNzg4Ljc2IDQ1NC4yOSwtOTk4LjUyIC0yNDMuNDcsODIuNzMgLTUzNS41OCw1MDcuODYgLTY1NC41NSw5ODQuNzMgLTI1Ljg4LDEwMy43NCAyNS44NSwyMTIuMjEgMTIyLjU1LDI1Ny44NCAxODIuOSw4Ni4zMSA0MDguODMsMTI5LjQ2IDYzNC43NSwxMjkuNDYgMjI1LjkzLDAgNDUxLjg0LC00My4xNSA2MzQuNzUsLTEyOS40NiA5Ni43LC00NS42NCAxNDguNDMsLTE1NC4xIDEyMi41NSwtMjU3Ljg0IC0xMTguOTcsLTQ3Ni44NyAtNDExLjA3LC05MDIgLTY1NC41NywtOTg0LjczIDM3OS43NywyMDkuNzYgNDQwLjg3LDc3MS45IDQ1NC4zMSw5OTguNTIgMS42MSwyNy4yMSAtMjQuMjEsNDcuMDEgLTUwLjQ4LDM5LjcxIgogICBzdHJva2UtbGluZWNhcD0icm91bmQiCiAgIGlkPSJwYXRoMTgiIC8+CjwvZz4KCQk8ZwogICB0cmFuc2Zvcm09Im1hdHJpeCgwLjE5NjYwODM0LDAsMCwtMC4xOTY2MDgzNCwtOS44MzA0MTY4ZS00LDIwLjMwMjkzNCkiCiAgIGlkPSJnMzciCiAgIHN0eWxlPSJzdHJva2Utd2lkdGg6NS4wODY3NDtzdHJva2UtbWl0ZXJsaW1pdDo0O3N0cm9rZS1kYXNoYXJyYXk6bm9uZSI+CjxsaW5lYXJHcmFkaWVudAogICBpZD0iU1ZHSURfMl81OTA0MDgiCiAgIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIgogICBncmFkaWVudFRyYW5zZm9ybT0ibWF0cml4KDAsMTg5NC43NywxODk0Ljc3LDAsMjk4My44Miw2Njk3Ljc0KSIKICAgeDE9IjAiCiAgIHkxPSIwIgogICB4Mj0iMSIKICAgeTI9IjAiPgo8c3RvcAogICBvZmZzZXQ9IjAlIgogICBzdHlsZT0ic3RvcC1jb2xvcjpyZ2IoMjM3LDUyLDY2KTtzdG9wLW9wYWNpdHk6IDEiCiAgIGlkPSJzdG9wMjIiIC8+CjxzdG9wCiAgIG9mZnNldD0iNC4yNjg1OTElIgogICBzdHlsZT0ic3RvcC1jb2xvcjpyZ2IoMjM3LDUyLDY2KTtzdG9wLW9wYWNpdHk6IDEiCiAgIGlkPSJzdG9wMjQiIC8+CjxzdG9wCiAgIG9mZnNldD0iMzguMzQwOTk5OTk5OTk5OTk0JSIKICAgc3R5bGU9InN0b3AtY29sb3I6cmdiKDE5NCwyMSw0NCk7c3RvcC1vcGFjaXR5OiAxIgogICBpZD0ic3RvcDI2IiAvPgo8c3RvcAogICBvZmZzZXQ9Ijg2LjI0NzcwNjk5OTk5OTk5JSIKICAgc3R5bGU9InN0b3AtY29sb3I6cmdiKDEwMSw5LDE4KTtzdG9wLW9wYWNpdHk6IDEiCiAgIGlkPSJzdG9wMjgiIC8+CjxzdG9wCiAgIG9mZnNldD0iOTguNzUwNCUiCiAgIHN0eWxlPSJzdG9wLWNvbG9yOnJnYigxMDEsOSwxOCk7c3RvcC1vcGFjaXR5OiAxIgogICBpZD0ic3RvcDMwIiAvPgo8c3RvcAogICBvZmZzZXQ9IjEwMCUiCiAgIHN0eWxlPSJzdG9wLWNvbG9yOnJnYigxMDEsOSwxOCk7c3RvcC1vcGFjaXR5OiAxIgogICBpZD0ic3RvcDMyIiAvPgo8L2xpbmVhckdyYWRpZW50Pgo8cGF0aAogICBzdHlsZT0ib3BhY2l0eToxO2ZpbGw6dXJsKCNTVkdJRF8yXzU5MDQwOCk7ZmlsbC1ydWxlOmV2ZW5vZGQ7c3Ryb2tlOm5vbmU7c3Ryb2tlLXdpZHRoOjUuMDg2NzQ7c3Ryb2tlLWxpbmVjYXA6YnV0dDtzdHJva2UtbGluZWpvaW46bWl0ZXI7c3Ryb2tlLW1pdGVybGltaXQ6NDtzdHJva2UtZGFzaGFycmF5Om5vbmU7c3Ryb2tlLWRhc2hvZmZzZXQ6MCIKICAgcGFpbnQtb3JkZXI9InN0cm9rZSIKICAgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTI5ODMuODE1LC04MDQzLjI0NTYpIgogICBkPSJtIDI5NjAuMDQsODYxMiBjIC05MC4zLC0xMTguNTUgLTI5Ny42MywtMTY2LjQ4IC00OTQuMzMsLTEwNy41NSAtMjAuNDgsNi4xNCAtNDAuNzYsLTkuNyAtMzkuNjEsLTMxLjA0IDEyLjAzLC0yMjIuOTYgNjguNCwtNzk2Ljk5IDQ1NC45NywtMTAxMC41MiB2IDM1Mi4yMiBjIDAsMjMuNjggLTEzLjMxLDQ0LjgyIC0zMy43Niw1Ni43NSAtODAuNjQsNDcuMDIgLTEzNC44MywxMzQuNDQgLTEzNC44MywyMzQuNTUgMCwxMDIuMzEgNTYuNjQsMTkxLjM5IDE0MC4yNiwyMzcuNjEgMTMuMzEsNy4zNSAyOS43MiwtMi42MyAyOS43MiwtMTcuODQgdiAtMjA0LjM3IGMgMCwtMjcuODYgMTQuODcsLTUzLjYxIDM5LC02Ny41NCBsIDIzLjM4LC0xMy40OSBjIDI0LjEyLC0xMy45MyA1My44NCwtMTMuOTMgNzcuOTYsMCBsIDIzLjM3LDEzLjQ5IGMgMjQuMTMsMTMuOTMgMzksMzkuNjggMzksNjcuNTQgdiAyMDQuMzcgYyAwLDE1LjIxIDE2LjQxLDI1LjE5IDI5LjcxLDE3Ljg0IDgzLjYzLC00Ni4yMiAxNDAuMjcsLTEzNS4yOSAxNDAuMjcsLTIzNy42MSAwLC0xMDAuMTEgLTU0LjE4LC0xODcuNTMgLTEzNC44MiwtMjM0LjU1IC0yMC40NiwtMTEuOTMgLTMzLjc3LC0zMy4wNyAtMzMuNzcsLTU2Ljc1IGwgLTAuMDEsLTM1Mi4yMiBjIDM4Ni41OCwyMTMuNTMgNDQyLjk2LDc4Ny41NiA0NTQuOTgsMTAxMC41MiAxLjE1LDIxLjM0IC0xOS4xMywzNy4xOCAtMzkuNjEsMzEuMDQgLTE5Ni42OSwtNTguOTMgLTQwNC4wMywtMTEgLTQ5NC4zMSwxMDcuNTQgLTExLjc5LDE1LjQ4IC0zNS43OSwxNS40OCAtNDcuNTcsMC4wMSIKICAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogICBpZD0icGF0aDM1IiAvPgo8L2c+CjwvZz4KPC9nPgo8ZwogICB0cmFuc2Zvcm09Im1hdHJpeCgyLjkxMTkyNjYsMCwwLDIuODkxNTU2Nyw2NDcuNzk2NTEsOTI1LjQ3NTA3KSIKICAgaWQ9InRleHQtbG9nby1wYXRoIj4KCjwvZz4KPC9zdmc+Cg==",
          width: 50,
          height: 100,
        },
      };
    },
    commands() {
      return [
        {
          name: "user",
          get: this.cmdUser,
        },
        {
          name: "info",
          get() {
            return `<p>With ❤️ By Salah Bentayeb @halasproject.</p>`;
          },
        },
        {
          name: "uname",
          get() {
            return navigator.appVersion;
          },
        },
      ];
    },
  },
  methods: {
    ...mapActions(["syncXmltv"]),
    cmdUser() {
      let user = this.currentUser.user;
      return `Created........: ${this.formatDate(
        user.created
      )}<br>Last Updated...: ${this.formatDate(
        user.last_updated
      )}<br>Role...........: ${user.role} (${this.$t(
        `roles.${user.role}`
      )})<br>Status.........: ${user.status}<br>id.............: ${
        user.id
      }<br>username.......: ${user.username}`;
    },
    prompt(value) {
      console.log(this.currentUser);
      console.log(value);
    },
    formatDate(date) {
      return new Date(date).toLocaleString(
        this.$t("date.locale"),
        this.dateOptions
      );
    },
  },
  beforeMount() {},
  beforeDestroy() {},
};
</script>

<style lang="scss">
.terminal {
  .prompt {
    color: $theme-color-1 !important;
  }

  p {
    margin-top: 0.2rem;
    margin-bottom: 0.2rem;
  }

  h2 {
    margin-bottom: 0.35rem;
  }

  img {
    vertical-align: middle;
  }
}
</style>
