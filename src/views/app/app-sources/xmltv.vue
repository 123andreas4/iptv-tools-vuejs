<template>
  <erd-row class="m-0 p-0">
    <erd-spinner v-if="isLoading" size="lg" overlay absolute></erd-spinner>
    <erd-col xl="12" v-if="!editor" id="xmltv">
      <b-table :items="paged" :fields="fields" striped small>
        <template v-slot:cell(created)="row">
          {{ formatDate(row.item.created) }}
        </template>
        <template v-slot:cell(last_updated)="row">
          {{ formatDate(row.item.last_updated) }}
        </template>
        <template v-slot:cell(format)="row">
          {{ $t(`xmltv-formats.${row.item.format}`) }}
        </template>
        <template v-slot:cell(url)="row">
          <a :href="row.item.url" target="_blank">{{ row.item.url }}</a>
        </template>
        <template v-slot:cell(country)="row">
          {{ countryText(row.item.country) }}
        </template>
        <template v-slot:cell(sync_interval)="row">
          {{ $t(`sync-interval.${row.item.sync_interval}`) }}
        </template>
        <template v-slot:cell(synced_at)="row">
          {{
            row.item.synced_at && row.item.synced_at !== "0000-00-00 00:00:00"
              ? formatDate(row.item.synced_at)
              : $t("general.not-available")
          }}
        </template>
        <template v-slot:cell(actions)="row">
          <erd-button
            variant="info"
            class="btn-table"
            :disabled="appXmltvSync"
            @click="syncXmltv(row.item.id)"
            ><i class="las la-sync"></i
          ></erd-button>
          <erd-button
            variant="primary"
            class="btn-table"
            @click="editXmltv(row.item)"
            ><i class="las la-pen"></i
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
      <label for="title">{{ $t("xmltv.title") }}</label>
      <erd-input
        id="title"
        class="mt-1 mb-2 w-100"
        :placeholder="$t('xmltv.title')"
        v-model="editorXmltv.title"
      ></erd-input>
      <label for="country">{{ $t("xmltv.country") }}</label>
      <erd-select
        id="country"
        :items="countries"
        class="w-100 mt-1 mb-2"
        v-model="editorXmltv.country"
      ></erd-select>
      <label for="url">{{ $t("xmltv.url") }}</label>
      <erd-input
        id="url"
        class="mt-1 mb-2 w-100"
        :placeholder="$t('xmltv.url')"
        v-model="editorXmltv.url"
      ></erd-input>
      <label class="d-block" for="format">{{ $t("xmltv.format") }}</label>
      <erd-select
        id="format"
        class="mt-1 mb-2 w-100"
        v-model="editorXmltv.format"
        ref="xmltv-format"
        :items="xmltvFormats"
      ></erd-select>
      <label class="d-block" for="sync-interval">{{
        $t("xmltv.sync-interval")
      }}</label>
      <erd-select
        id="sync-interval"
        class="mt-1 mb-2 w-100"
        v-model="editorXmltv.sync_interval"
        :items="syncIntervals"
      ></erd-select>
    </erd-col>
  </erd-row>
</template>

<script>
/* eslint-disable vue/no-side-effects-in-computed-properties */
import { EventBus } from "../../../services/ebus";
import { httpService } from "../../../services/http";
import { mapGetters, mapActions } from "vuex";

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
      editorXmltv: null,
      xmltv: [],
      fields: [
        { key: "id", label: this.$t("xmltv.id"), sortable: true },
        {
          key: "created",
          label: this.$t("xmltv.created"),
          sortable: true,
        },
        {
          key: "last_updated",
          label: this.$t("xmltv.last-updated"),
          sortable: true,
        },
        { key: "title", label: this.$t("xmltv.title"), sortable: true },
        { key: "country", label: this.$t("xmltv.country"), sortable: true },
        { key: "url", label: this.$t("xmltv.url"), sortable: true },
        { key: "format", label: this.$t("xmltv.format"), sortable: true },
        {
          key: "sync_interval",
          label: this.$t("xmltv.sync-interval"),
          sortable: true,
        },
        { key: "synced_at", label: this.$t("xmltv.synced-at"), sortable: true },
        { key: "stations", label: this.$t("xmltv.stations"), sortable: true },
        {
          key: "actions",
          label: this.$t("users.actions"),
          sortable: false,
          thClass: "text-right",
          tdClass: "text-right",
        },
      ],
      syncIntervals: [
        { text: this.$t("sync-interval.48"), value: 48 },
        { text: this.$t("sync-interval.24"), value: 24 },
        { text: this.$t("sync-interval.12"), value: 12 },
        { text: this.$t("sync-interval.6"), value: 6 },
        { text: this.$t("sync-interval.1"), value: 1 },
      ],
      xmltvFormats: [
        { text: this.$t("xmltv-formats.1"), value: 1 },
        { text: this.$t("xmltv-formats.2"), value: 2 },
        { text: this.$t("xmltv-formats.3"), value: 3 },
        { text: this.$t("xmltv-formats.4"), value: 4 },
      ],
      countries: [
        { text: "Afghanistan", value: "AF" },
        { text: "Åland Islands", value: "AX" },
        { text: "Albania", value: "AL" },
        { text: "Algeria", value: "DZ" },
        { text: "American Samoa", value: "AS" },
        { text: "AndorrA", value: "AD" },
        { text: "Angola", value: "AO" },
        { text: "Anguilla", value: "AI" },
        { text: "Antarctica", value: "AQ" },
        { text: "Antigua and Barbuda", value: "AG" },
        { text: "Argentina", value: "AR" },
        { text: "Armenia", value: "AM" },
        { text: "Aruba", value: "AW" },
        { text: "Australia", value: "AU" },
        { text: "Austria", value: "AT" },
        { text: "Azerbaijan", value: "AZ" },
        { text: "Bahamas", value: "BS" },
        { text: "Bahrain", value: "BH" },
        { text: "Bangladesh", value: "BD" },
        { text: "Barbados", value: "BB" },
        { text: "Belarus", value: "BY" },
        { text: "Belgium", value: "BE" },
        { text: "Belize", value: "BZ" },
        { text: "Benin", value: "BJ" },
        { text: "Bermuda", value: "BM" },
        { text: "Bhutan", value: "BT" },
        { text: "Bolivia", value: "BO" },
        { text: "Bosnia and Herzegovina", value: "BA" },
        { text: "Botswana", value: "BW" },
        { text: "Bouvet Island", value: "BV" },
        { text: "Brazil", value: "BR" },
        { text: "British Indian Ocean Territory", value: "IO" },
        { text: "Brunei Darussalam", value: "BN" },
        { text: "Bulgaria", value: "BG" },
        { text: "Burkina Faso", value: "BF" },
        { text: "Burundi", value: "BI" },
        { text: "Cambodia", value: "KH" },
        { text: "Cameroon", value: "CM" },
        { text: "Canada", value: "CA" },
        { text: "Cape Verde", value: "CV" },
        { text: "Cayman Islands", value: "KY" },
        { text: "Central African Republic", value: "CF" },
        { text: "Chad", value: "TD" },
        { text: "Chile", value: "CL" },
        { text: "China", value: "CN" },
        { text: "Christmas Island", value: "CX" },
        { text: "Cocos (Keeling) Islands", value: "CC" },
        { text: "Colombia", value: "CO" },
        { text: "Comoros", value: "KM" },
        { text: "Congo", value: "CG" },
        { text: "Congo, The Democratic Republic of the", value: "CD" },
        { text: "Cook Islands", value: "CK" },
        { text: "Costa Rica", value: "CR" },
        { text: "Cote D'Ivoire", value: "CI" },
        { text: "Croatia", value: "HR" },
        { text: "Cuba", value: "CU" },
        { text: "Cyprus", value: "CY" },
        { text: "Czech Republic", value: "CZ" },
        { text: "Denmark", value: "DK" },
        { text: "Djibouti", value: "DJ" },
        { text: "Dominica", value: "DM" },
        { text: "Dominican Republic", value: "DO" },
        { text: "Ecuador", value: "EC" },
        { text: "Egypt", value: "EG" },
        { text: "El Salvador", value: "SV" },
        { text: "Equatorial Guinea", value: "GQ" },
        { text: "Eritrea", value: "ER" },
        { text: "Estonia", value: "EE" },
        { text: "Ethiopia", value: "ET" },
        { text: "Falkland Islands (Malvinas)", value: "FK" },
        { text: "Faroe Islands", value: "FO" },
        { text: "Fiji", value: "FJ" },
        { text: "Finland", value: "FI" },
        { text: "France", value: "FR" },
        { text: "French Guiana", value: "GF" },
        { text: "French Polynesia", value: "PF" },
        { text: "French Southern Territories", value: "TF" },
        { text: "Gabon", value: "GA" },
        { text: "Gambia", value: "GM" },
        { text: "Georgia", value: "GE" },
        { text: "Germany", value: "DE" },
        { text: "Ghana", value: "GH" },
        { text: "Gibraltar", value: "GI" },
        { text: "Greece", value: "GR" },
        { text: "Greenland", value: "GL" },
        { text: "Grenada", value: "GD" },
        { text: "Guadeloupe", value: "GP" },
        { text: "Guam", value: "GU" },
        { text: "Guatemala", value: "GT" },
        { text: "Guernsey", value: "GG" },
        { text: "Guinea", value: "GN" },
        { text: "Guinea-Bissau", value: "GW" },
        { text: "Guyana", value: "GY" },
        { text: "Haiti", value: "HT" },
        { text: "Heard Island and Mcdonald Islands", value: "HM" },
        { text: "Holy See (Vatican City State)", value: "VA" },
        { text: "Honduras", value: "HN" },
        { text: "Hong Kong", value: "HK" },
        { text: "Hungary", value: "HU" },
        { text: "Iceland", value: "IS" },
        { text: "India", value: "IN" },
        { text: "Indonesia", value: "ID" },
        { text: "Iran, Islamic Republic Of", value: "IR" },
        { text: "Iraq", value: "IQ" },
        { text: "Ireland", value: "IE" },
        { text: "Isle of Man", value: "IM" },
        { text: "Israel", value: "IL" },
        { text: "Italy", value: "IT" },
        { text: "Jamaica", value: "JM" },
        { text: "Japan", value: "JP" },
        { text: "Jersey", value: "JE" },
        { text: "Jordan", value: "JO" },
        { text: "Kazakhstan", value: "KZ" },
        { text: "Kenya", value: "KE" },
        { text: "Kiribati", value: "KI" },
        { text: "Korea, Democratic People'S Republic of", value: "KP" },
        { text: "Korea, Republic of", value: "KR" },
        { text: "Kuwait", value: "KW" },
        { text: "Kyrgyzstan", value: "KG" },
        { text: "Lao People'S Democratic Republic", value: "LA" },
        { text: "Latvia", value: "LV" },
        { text: "Lebanon", value: "LB" },
        { text: "Lesotho", value: "LS" },
        { text: "Liberia", value: "LR" },
        { text: "Libyan Arab Jamahiriya", value: "LY" },
        { text: "Liechtenstein", value: "LI" },
        { text: "Lithuania", value: "LT" },
        { text: "Luxembourg", value: "LU" },
        { text: "Macao", value: "MO" },
        { text: "Macedonia, The Former Yugoslav Republic of", value: "MK" },
        { text: "Madagascar", value: "MG" },
        { text: "Malawi", value: "MW" },
        { text: "Malaysia", value: "MY" },
        { text: "Maldives", value: "MV" },
        { text: "Mali", value: "ML" },
        { text: "Malta", value: "MT" },
        { text: "Marshall Islands", value: "MH" },
        { text: "Martinique", value: "MQ" },
        { text: "Mauritania", value: "MR" },
        { text: "Mauritius", value: "MU" },
        { text: "Mayotte", value: "YT" },
        { text: "Mexico", value: "MX" },
        { text: "Micronesia, Federated States of", value: "FM" },
        { text: "Moldova, Republic of", value: "MD" },
        { text: "Monaco", value: "MC" },
        { text: "Mongolia", value: "MN" },
        { text: "Montserrat", value: "MS" },
        { text: "Morocco", value: "MA" },
        { text: "Mozambique", value: "MZ" },
        { text: "Myanmar", value: "MM" },
        { text: "Namibia", value: "NA" },
        { text: "Nauru", value: "NR" },
        { text: "Nepal", value: "NP" },
        { text: "Netherlands", value: "NL" },
        { text: "Netherlands Antilles", value: "AN" },
        { text: "New Caledonia", value: "NC" },
        { text: "New Zealand", value: "NZ" },
        { text: "Nicaragua", value: "NI" },
        { text: "Niger", value: "NE" },
        { text: "Nigeria", value: "NG" },
        { text: "Niue", value: "NU" },
        { text: "Norfolk Island", value: "NF" },
        { text: "Northern Mariana Islands", value: "MP" },
        { text: "Norway", value: "NO" },
        { text: "Oman", value: "OM" },
        { text: "Pakistan", value: "PK" },
        { text: "Palau", value: "PW" },
        { text: "Palestinian Territory, Occupied", value: "PS" },
        { text: "Panama", value: "PA" },
        { text: "Papua New Guinea", value: "PG" },
        { text: "Paraguay", value: "PY" },
        { text: "Peru", value: "PE" },
        { text: "Philippines", value: "PH" },
        { text: "Pitcairn", value: "PN" },
        { text: "Poland", value: "PL" },
        { text: "Portugal", value: "PT" },
        { text: "Puerto Rico", value: "PR" },
        { text: "Qatar", value: "QA" },
        { text: "Reunion", value: "RE" },
        { text: "Romania", value: "RO" },
        { text: "Russian Federation", value: "RU" },
        { text: "RWANDA", value: "RW" },
        { text: "Saint Helena", value: "SH" },
        { text: "Saint Kitts and Nevis", value: "KN" },
        { text: "Saint Lucia", value: "LC" },
        { text: "Saint Pierre and Miquelon", value: "PM" },
        { text: "Saint Vincent and the Grenadines", value: "VC" },
        { text: "Samoa", value: "WS" },
        { text: "San Marino", value: "SM" },
        { text: "Sao Tome and Principe", value: "ST" },
        { text: "Saudi Arabia", value: "SA" },
        { text: "Senegal", value: "SN" },
        { text: "Serbia and Montenegro", value: "CS" },
        { text: "Seychelles", value: "SC" },
        { text: "Sierra Leone", value: "SL" },
        { text: "Singapore", value: "SG" },
        { text: "Slovakia", value: "SK" },
        { text: "Slovenia", value: "SI" },
        { text: "Solomon Islands", value: "SB" },
        { text: "Somalia", value: "SO" },
        { text: "South Africa", value: "ZA" },
        { text: "South Georgia and the South Sandwich Islands", value: "GS" },
        { text: "Spain", value: "ES" },
        { text: "Sri Lanka", value: "LK" },
        { text: "Sudan", value: "SD" },
        { text: "Suriname", value: "SR" },
        { text: "Svalbard and Jan Mayen", value: "SJ" },
        { text: "Swaziland", value: "SZ" },
        { text: "Sweden", value: "SE" },
        { text: "Switzerland", value: "CH" },
        { text: "Syrian Arab Republic", value: "SY" },
        { text: "Taiwan, Province of China", value: "TW" },
        { text: "Tajikistan", value: "TJ" },
        { text: "Tanzania, United Republic of", value: "TZ" },
        { text: "Thailand", value: "TH" },
        { text: "Timor-Leste", value: "TL" },
        { text: "Togo", value: "TG" },
        { text: "Tokelau", value: "TK" },
        { text: "Tonga", value: "TO" },
        { text: "Trinidad and Tobago", value: "TT" },
        { text: "Tunisia", value: "TN" },
        { text: "Turkey", value: "TR" },
        { text: "Turkmenistan", value: "TM" },
        { text: "Turks and Caicos Islands", value: "TC" },
        { text: "Tuvalu", value: "TV" },
        { text: "Uganda", value: "UG" },
        { text: "Ukraine", value: "UA" },
        { text: "United Arab Emirates", value: "AE" },
        { text: "United Kingdom", value: "GB" },
        { text: "United States", value: "US" },
        { text: "United States Minor Outlying Islands", value: "UM" },
        { text: "Uruguay", value: "UY" },
        { text: "Uzbekistan", value: "UZ" },
        { text: "Vanuatu", value: "VU" },
        { text: "Venezuela", value: "VE" },
        { text: "Viet Nam", value: "VN" },
        { text: "Virgin Islands, British", value: "VG" },
        { text: "Virgin Islands, U.S.", value: "VI" },
        { text: "Wallis and Futuna", value: "WF" },
        { text: "Western Sahara", value: "EH" },
        { text: "Yemen", value: "YE" },
        { text: "Zambia", value: "ZM" },
        { text: "Zimbabwe", value: "ZW" },
      ],
    };
  },
  computed: {
    ...mapGetters(["currentUser", "settings", "appXmltvSync"]),
    perPage() {
      return this.settings.perPage;
    },
    searchFiltered() {
      if (this.search === null) {
        return this.xmltv;
      } else {
        var re = new RegExp(this.search, "i");
        return this.xmltv.filter((xmltv) => {
          return (
            String(xmltv.title).match(re) ||
            String(xmltv.country).match(re) ||
            String(xmltv.notes).match(re) ||
            String(xmltv.error).match(re) ||
            String(this.countryText(xmltv.country)).match(re) ||
            this.formatDate(xmltv.created).match(re) ||
            this.formatDate(xmltv.last_updated).match(re) ||
            this.formatDate(xmltv.synced_at).match(re)
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
  },
  methods: {
    ...mapActions(["syncXmltv"]),
    countryText(country) {
      let c = this.countries.find((c) => {
        return c.value === country;
      });
      return c ? c.text : "-";
    },
    updatePerPage(perPage) {
      this.perPage = perPage;
    },
    formatDate(date) {
      return new Date(date).toLocaleString(
        this.$t("date.locale"),
        this.dateOptions
      );
    },
    loadXmltv() {
      this.isLoading = true;
      httpService
        .get("administration/xmltv")
        .then((res) => {
          this.isLoading = false;
          if (res.status === true) {
            this.xmltv = res.data;
          }
        })
        .catch(() => {
          this.isLoading = false;
          this.$notify(
            "error",
            this.$t("profile.failed"),
            this.$t("xmltv.load-error"),
            "la-user-shield",
            { duration: 5000, permanent: false }
          );
        });
    },
    editXmltv(xmltv) {
      this.editorXmltv = Object.assign({}, xmltv);
      this.editor = true;
    },
    addXmltv() {
      this.editorXmltv = {
        title: "",
        country: "NL",
        url: "",
        format: 1,
        sync_interval: 24,
      };
      this.editor = true;
    },
    saveUser() {
      this.editor = false;
      let xmltv = Object.assign({}, this.editorXmltv);
      if (xmltv.id !== undefined) {
        delete xmltv.id;
        httpService
          .post("administration/xmltv/update", {
            id: this.editorXmltv.id,
            xmltv: xmltv,
          })
          .then((res) => {
            this.isLoading = false;
            if (res.status === true) {
              this.$notify(
                "primary",
                this.$t("profile.success"),
                this.$t("xmltv.save-success"),
                "la-user-shield",
                { duration: 5000, permanent: false }
              );
              this.loadXmltv();
              this.editor = false;
            }
          })
          .catch(() => {
            this.isLoading = false;
            this.$notify(
              "error",
              this.$t("profile.failed"),
              this.$t("xmltv.save-error"),
              "la-user-shield",
              { duration: 5000, permanent: false }
            );
          });
      } else {
        httpService
          .post("administration/xmltv/insert", xmltv)
          .then((res) => {
            this.isLoading = false;
            if (res.status === true) {
              this.$notify(
                "primary",
                this.$t("profile.success"),
                this.$t("xmltv.save-success"),
                "la-user-shield",
                { duration: 5000, permanent: false }
              );
              this.loadXmltv();
              this.editor = false;
            }
          })
          .catch(() => {
            this.isLoading = false;
            this.$notify(
              "error",
              this.$t("profile.failed"),
              this.$t("xmltv.save-error"),
              "la-user-shield",
              { duration: 5000, permanent: false }
            );
          });
      }
    },
    deleteUser(id) {
      httpService
        .post("administration/xmltv/delete", { id: id })
        .then((res) => {
          this.isLoading = false;
          if (res.status === true) {
            this.$notify(
              "primary",
              this.$t("profile.success"),
              this.$t("xmltv.delete-success"),
              "la-user-shield",
              { duration: 5000, permanent: false }
            );
            this.loadXmltv();
          }
        })
        .catch(() => {
          this.isLoading = false;
          this.$notify(
            "error",
            this.$t("profile.failed"),
            this.$t("xmltv.delete-error"),
            "la-user-shield",
            { duration: 5000, permanent: false }
          );
        });
    },
    cancelXmltv() {
      this.editor = false;
    },
    searchXmltv(search) {
      if (search.length === 0) {
        this.search = null;
      } else {
        this.search = search;
      }
    },
    printUsers() {
      document.getElementById("xmltv").print();
    },
  },
  beforeMount() {
    this.loadXmltv();
    EventBus.$on("refresh", this.loadXmltv);
    EventBus.$on("save", this.saveUser);
    EventBus.$on("cancel", this.cancelXmltv);
    EventBus.$on("search", this.searchXmltv);
    EventBus.$on("print", this.printUsers);
    EventBus.$on("add", this.addXmltv);
  },
  beforeDestroy() {
    EventBus.$off("refresh", this.loadXmltv);
    EventBus.$off("save", this.saveUser);
    EventBus.$off("cancel", this.cancelXmltv);
    EventBus.$off("search", this.searchXmltv);
    EventBus.$off("print", this.printUsers);
    EventBus.$off("add", this.addXmltv);
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
    appXmltvSync: function () {
      this.loadXmltv();
    },
  },
};
</script>
