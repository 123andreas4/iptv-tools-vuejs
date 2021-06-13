<template>
  <erd-row class="m-0 p-0">
    <erd-spinner v-if="isLoading" size="lg" overlay absolute></erd-spinner>
    <erd-col xl="12" v-if="!editor" id="profiles">
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
        <template v-slot:cell(email)="row">
          <a :href="`mailto:${row.item.email}`">{{ row.item.email }}</a>
        </template>
        <template v-slot:cell(phone)="row">
          <a :href="`tel:${row.item.phone}`">{{ row.item.phone }}</a>
        </template>
        <template v-slot:cell(gender)="row">
          {{ $t(`profile.${row.item.gender.toLowerCase()}`) }}
        </template>
        <template v-slot:cell(actions)="row">
          <erd-button
            variant="info"
            class="btn-table"
            @click="user(row.item.user_id)"
            ><i class="las la-user"></i
          ></erd-button>
          <erd-button
            variant="primary"
            class="btn-table"
            @click="editProfile(row.item)"
            ><i class="las la-user-edit"></i
          ></erd-button>
          <erd-button
            variant="danger"
            class="btn-table"
            @click="deleteProfile(row.item.id)"
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
      <label for="name_first">{{ $t("profiles.name_first") }}</label>
      <erd-input
        id="name_first"
        class="mt-1 mb-2 w-100"
        :placeholder="$t('profiles.name_first')"
        v-model="editorProfile.name_first"
      ></erd-input>
      <label for="name_last">{{ $t("profiles.name_last") }}</label>
      <erd-input
        id="name_last"
        class="mt-1 mb-2 w-100"
        :placeholder="$t('profiles.name_last')"
        v-model="editorProfile.name_last"
      ></erd-input>
      <label for="gender">{{ $t("profiles.gender") }}</label>
      <erd-select
        id="gender"
        :items="genders"
        class="w-100 mt-1 mb-2"
        v-model="editorProfile.gender"
      ></erd-select>
      <label for="address">{{ $t("profiles.address") }}</label>
      <erd-input
        id="address"
        class="mt-1 mb-2 w-100"
        :placeholder="$t('profiles.address')"
        v-model="editorProfile.address"
      ></erd-input>
      <label for="city">{{ $t("profiles.city") }}</label>
      <erd-input
        id="city"
        class="mt-1 mb-2 w-100"
        :placeholder="$t('profiles.city')"
        v-model="editorProfile.city"
      ></erd-input>
      <label for="zipcode">{{ $t("profiles.zipcode") }}</label>
      <erd-input
        id="zipcode"
        class="mt-1 mb-2 w-100"
        :placeholder="$t('profiles.zipcode')"
        v-model="editorProfile.zipcode"
      ></erd-input>
      <label for="country">{{ $t("profiles.country") }}</label>
      <erd-select
        id="country"
        :items="countries"
        class="w-100 mt-1 mb-2"
        v-model="editorProfile.country"
      ></erd-select>
      <label for="phone">{{ $t("profiles.phone") }}</label>
      <erd-input
        id="phone"
        class="mt-1 mb-2 w-100"
        :placeholder="$t('profiles.phone')"
        v-model="editorProfile.phone"
      ></erd-input>
      <label for="email">{{ $t("profiles.email") }}</label>
      <erd-input
        id="email"
        class="mt-1 mb-2 w-100"
        :placeholder="$t('profiles.email')"
        v-model="editorProfile.email"
      ></erd-input>
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
      editorProfile: null,
      profiles: [],
      fields: [
        { key: "user_id", label: this.$t("profiles.user_id"), sortable: true },
        {
          key: "name_first",
          label: this.$t("profiles.name_first"),
          sortable: true,
        },
        {
          key: "name_last",
          label: this.$t("profiles.name_last"),
          sortable: true,
        },
        { key: "address", label: this.$t("profiles.address"), sortable: true },
        { key: "country", label: this.$t("profiles.country"), sortable: true },
        { key: "city", label: this.$t("profiles.city"), sortable: true },
        { key: "zipcode", label: this.$t("profiles.zipcode"), sortable: true },
        { key: "phone", label: this.$t("profiles.phone"), sortable: true },
        { key: "email", label: this.$t("profiles.email"), sortable: true },
        { key: "gender", label: this.$t("profiles.gender"), sortable: true },
        {
          key: "actions",
          label: this.$t("users.actions"),
          sortable: false,
          thClass: "text-right",
          tdClass: "text-right",
        },
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
    ...mapGetters(["currentUser", "settings"]),
    perPage() {
      return this.settings.perPage;
    },
    searchFiltered() {
      if (this.search === null) {
        return this.profiles;
      } else {
        var re = new RegExp(this.search, "i");
        return this.profiles.filter((profile) => {
          return (
            String(profile.user_id).match(re) ||
            String(profile.name_first).match(re) ||
            String(profile.name_last).match(re) ||
            String(profile.address).match(re) ||
            String(profile.country).match(re) ||
            String(profile.city).match(re) ||
            String(profile.zipcode).match(re) ||
            String(profile.phone).match(re) ||
            String(profile.email).match(re) ||
            String(profile.gender).match(re) ||
            String(profile.tags).match(re)
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
    genders() {
      return [
        { text: this.$t("profile.male"), value: "Male" },
        { text: this.$t("profile.female"), value: "Female" },
        { text: this.$t("profile.transgender"), value: "Transgender" },
        { text: this.$t("profile.non-binary"), value: "Non Binary" },
        { text: this.$t("profile.gender-fluid"), value: "Gender Fluid" },
        { text: this.$t("profile.gender-neutral"), value: "Gender Neutral" },
        { text: this.$t("profile.other"), value: "Other" },
        { text: this.$t("profile.neutral"), value: "Neutral" },
      ];
    },
  },
  methods: {
    formatDate(date) {
      return new Date(date).toLocaleString(
        this.$t("date.locale"),
        this.dateOptions
      );
    },
    loadProfiles() {
      this.isLoading = true;
      httpService
        .get("administration/profiles")
        .then((res) => {
          this.isLoading = false;
          if (res.status === true) {
            this.profiles = res.data;
          }
        })
        .catch(() => {
          this.isLoading = false;
          this.$notify(
            "error",
            this.$t("profile.failed"),
            this.$t("profiles.load-error"),
            "la-user-shield",
            { duration: 5000, permanent: false }
          );
        });
    },
    editProfile(profile) {
      this.editorProfile = Object.assign({}, profile);
      this.editor = true;
    },
    saveProfile() {
      this.editor = false;
      let profile = Object.assign({}, this.editorProfile);
      profile.last_updated = new Date();
      delete profile.id;
      httpService
        .post("administration/profile/update", {
          id: this.editorProfile.id,
          profile: profile,
        })
        .then((res) => {
          this.isLoading = false;
          if (res.status === true) {
            this.$notify(
              "primary",
              this.$t("profile.success"),
              this.$t("profiles.save-success"),
              "la-user-shield",
              { duration: 5000, permanent: false }
            );
            this.loadProfiles();
            this.editor = false;
          }
        })
        .catch(() => {
          this.isLoading = false;
          this.$notify(
            "error",
            this.$t("profile.failed"),
            this.$t("profiles.save-error"),
            "la-user-shield",
            { duration: 5000, permanent: false }
          );
        });
    },
    deleteProfile(id) {
      httpService
        .post("administration/profile/delete", { id: id })
        .then((res) => {
          this.isLoading = false;
          if (res.status === true) {
            this.$notify(
              "primary",
              this.$t("profile.success"),
              this.$t("profiles.delete-success"),
              "la-user-shield",
              { duration: 5000, permanent: false }
            );
            this.loadProfiles();
          }
        })
        .catch(() => {
          this.isLoading = false;
          this.$notify(
            "error",
            this.$t("profile.failed"),
            this.$t("profiles.delete-error"),
            "la-user-shield",
            { duration: 5000, permanent: false }
          );
        });
    },
    cancelProfile() {
      this.editor = false;
    },
    user(user_id) {
      this.$router.push({
        name: "users",
        params: { editor: true, id: user_id },
      });
    },
    searchProfile(search) {
      if (search.length === 0) {
        this.search = null;
      } else {
        this.search = search;
      }
    },
    printProfiles() {
      document.getElementById("profiles").print();
    },
  },
  beforeMount() {
    if (this.$route.params.editor && this.$route.params.id !== undefined) {
      httpService
        .get("administration/profiles")
        .then((res) => {
          this.isLoading = false;
          if (res.status === true) {
            this.profiles = res.data;
            let profile = this.profiles.find(
              (profile) => profile.user_id === this.$route.params.id
            );
            if (profile) {
              this.editProfile(profile);
            }
          }
        })
        .catch(() => {
          this.isLoading = false;
          this.$notify(
            "error",
            this.$t("profile.failed"),
            this.$t("profiles.load-error"),
            "la-user-shield",
            { duration: 5000, permanent: false }
          );
        });
    } else {
      this.loadProfiles();
    }
    EventBus.$on("refresh", this.loadProfiles);
    EventBus.$on("save", this.saveProfile);
    EventBus.$on("cancel", this.cancelProfile);
    EventBus.$on("search", this.searchProfile);
    EventBus.$on("print", this.printProfiles);
  },
  beforeDestroy() {
    EventBus.$off("refresh", this.loadProfiles);
    EventBus.$off("save", this.saveProfile);
    EventBus.$off("cancel", this.cancelProfile);
    EventBus.$off("search", this.searchProfile);
    EventBus.$off("print", this.printProfiles);
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
