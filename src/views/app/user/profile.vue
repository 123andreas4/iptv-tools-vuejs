<template>
  <erd-row class="m-0 p-0" id="profile">
    <erd-modal
      v-show="confirmModal"
      @close="closeConfirmModal"
      :title="$t('profile.confirm')"
      class="select-none"
    >
      <p class="text-one mx-2">{{ $t("profile.confirm-body") }}</p>
      <template v-slot:footer>
        <erd-button
          variant="danger"
          class="mr-1"
          icon="la-user-shield"
          @click="cancelAccount"
          >{{ $t("general.yes") }}</erd-button
        >
        <erd-button
          variant="success"
          icon="la-user"
          @click="closeConfirmModal"
          >{{ $t("general.no") }}</erd-button
        >
      </template>
    </erd-modal>
    <erd-spinner v-if="isLoading" size="lg" overlay absolute></erd-spinner>
    <erd-col xl="3" v-if="!isLoading">
      <erd-card>
        <erd-card-body style="position: relative">
          <erd-button
            class="save-profile-image d-print-none"
            icon="la-save"
            rounded
            dense
            outline
            @click="saveProfile"
          ></erd-button>
          <div class="avatar-box">
            <img
              :src="profile.image"
              class="profile-picture"
              @click="changeImage"
            />
          </div>
          <input
            class="image-select"
            type="file"
            accept="image/*"
            @change="handleImage"
            id="image-select"
          />
          <h3 class="text-center mb-0 pb-0 text-capitalize">
            {{ currentUser.user.username }}
          </h3>
          <p class="text-center text-muted py-0 my-0 text-capitalize">
            {{ currentUser.profile ? currentUser.profile.name_first : "" }}
            {{ currentUser.profile ? currentUser.profile.name_last : "" }}
          </p>
        </erd-card-body>
        <div class="seperator m-0 p-0 mx-2"></div>
        <erd-card-body class="px-0 pt-1">
          <erd-row>
            <erd-col xl="6" sm="6" class="text-center">
              <p class="text-muted mb-1 mt-0">
                {{ $t("profile.member-since") }}
              </p>
              <h4 class="my-0">{{ memberSince }}</h4>
            </erd-col>
            <erd-col xl="6" sm="6" class="text-center">
              <p class="text-muted mb-1 mt-0">
                {{ $t("profile.member-status") }}
              </p>
              <h4 class="my-0">{{ userRole }}</h4>
            </erd-col>
          </erd-row>
        </erd-card-body>
        <div class="seperator m-0 p-0 mx-2"></div>
        <erd-card-body class="px-0 pt-1">
          <erd-row>
            <erd-col xl="6" sm="6" class="text-center">
              <p class="text-muted mb-1 mt-0">
                {{ $t("profile.subscription") }}
              </p>
              <h4 class="my-0">
                <router-link to="/app/user/subscription">{{
                  memberStatus
                }}</router-link>
              </h4>
            </erd-col>
            <erd-col xl="6" sm="6" class="text-center">
              <p class="text-muted mb-1 mt-0">
                {{ $t("profile.next-invoice") }}
              </p>
              <h4 class="my-0" :class="{ 'text-danger': nextInvoiceExpired }">
                {{ nextInvoiceDate }}
              </h4>
            </erd-col>
          </erd-row>
        </erd-card-body>
        <div class="seperator m-0 p-0 mx-2"></div>
        <erd-card-body class="text-center">
          <erd-button
            outline
            variant="danger"
            class="d-print-none"
            @click="deleteAccount"
            >{{ $t("profile.cancel-account") }}</erd-button
          >
        </erd-card-body>
      </erd-card>
    </erd-col>
    <erd-col xl="9" v-if="!isLoading" class="px-0 mx-0">
      <erd-row class="m-0 p-0">
        <erd-col xl="12" class="mt-0 pt-0">
          <erd-card>
            <erd-card-body>
              <erd-card-header
                :title="$t('profile.profile')"
                :subtitle="$t('profile.personal')"
                :picture="profile.image"
              >
                <div class="w-100">
                  <erd-button
                    class="float-right d-print-none"
                    icon="la-save"
                    rounded
                    dense
                    outline
                    @click="saveProfile"
                  ></erd-button>
                </div>
              </erd-card-header>
              <erd-row class="m-0 p-0 pt-1">
                <erd-col md="6" sm="12" class="mt-0">
                  <label for="first-name">{{ $t("profile.first-name") }}</label>
                  <erd-input
                    id="first-name"
                    class="w-100 mt-1 mb-2"
                    v-model="profile.name_first"
                  ></erd-input>
                </erd-col>
                <erd-col md="6" sm="12" class="mt-0">
                  <label for="last-name">{{ $t("profile.last-name") }}</label>
                  <erd-input
                    id="last-name"
                    class="w-100 mt-1 mb-2"
                    v-model="profile.name_last"
                  ></erd-input>
                </erd-col>
                <erd-col md="6" sm="12" class="mt-0">
                  <label for="gender">{{ $t("profile.gender") }}</label>
                  <erd-select
                    id="gender"
                    :items="genders"
                    class="w-100 mt-1 mb-2"
                    v-model="profile.gender"
                  ></erd-select>
                </erd-col>
                <erd-col md="6" sm="12" class="mt-0">
                  <label for="language">{{ $t("user.language") }}</label>
                  <erd-select
                    id="language"
                    class="w-100 mt-1 mb-2"
                    :items="languages"
                    v-model="$i18n.locale"
                  ></erd-select>
                </erd-col>
              </erd-row>
            </erd-card-body>
          </erd-card>
        </erd-col>
        <erd-col xl="12">
          <erd-card>
            <erd-card-body>
              <erd-card-header
                :title="$t('profile.profile')"
                :subtitle="$t('profile.address')"
                :picture="profile.image"
              >
                <div class="w-100">
                  <erd-button
                    class="float-right d-print-none"
                    icon="la-save"
                    rounded
                    dense
                    outline
                    @click="saveProfile"
                  ></erd-button>
                </div>
              </erd-card-header>
              <erd-row class="m-0 p-0 pt-1">
                <erd-col xl="12" class="mt-0">
                  <label for="address">{{ $t("profile.address") }}</label>
                  <erd-input
                    id="address"
                    class="w-100 mt-1 mb-2"
                    v-model="profile.address"
                  ></erd-input>
                </erd-col>
                <erd-col xl="4" class="mt-0">
                  <label for="zipcode">{{ $t("profile.zipcode") }}</label>
                  <erd-input
                    id="zipcode"
                    class="w-100 mt-1 mb-2"
                    v-model="profile.zipcode"
                  ></erd-input>
                </erd-col>
                <erd-col xl="4" class="mt-0">
                  <label for="city">{{ $t("profile.city") }}</label>
                  <erd-input
                    id="city"
                    class="w-100 mt-1 mb-2"
                    v-model="profile.city"
                  ></erd-input>
                </erd-col>
                <erd-col xl="4" class="mt-0">
                  <label for="country">{{ $t("profile.country") }}</label>
                  <erd-select
                    id="country"
                    :items="countries"
                    class="w-100 mt-1 mb-2"
                    v-model="profile.country"
                  ></erd-select>
                </erd-col>
              </erd-row>
            </erd-card-body>
          </erd-card>
        </erd-col>
        <erd-col xl="12">
          <erd-card>
            <erd-card-body>
              <erd-card-header
                :title="$t('profile.profile')"
                :subtitle="$t('profile.contact')"
                :picture="profile.image"
              >
                <div class="w-100">
                  <erd-button
                    class="float-right d-print-none"
                    icon="la-save"
                    rounded
                    dense
                    outline
                    @click="saveProfile"
                  ></erd-button>
                </div>
              </erd-card-header>
              <erd-row class="m-0 p-0 pt-1">
                <erd-col xl="12" class="mt-0">
                  <label for="email">{{ $t("profile.email") }}</label>
                  <erd-input
                    id="email"
                    class="w-100 mt-1 mb-2"
                    v-model="profile.email"
                  ></erd-input>
                </erd-col>
                <erd-col xl="12" class="mt-0">
                  <label for="phone">{{ $t("profile.phone") }}</label>
                  <erd-input
                    id="phone"
                    class="w-100 mt-1 mb-2"
                    v-model="profile.phone"
                  ></erd-input>
                </erd-col>
              </erd-row>
            </erd-card-body>
          </erd-card>
        </erd-col>
        <erd-col xl="12">
          <erd-card>
            <erd-card-body>
              <erd-card-header
                :title="$t('profile.profile')"
                :subtitle="$t('profile.password')"
                :picture="profile.image"
              >
                <div class="w-100">
                  <erd-button
                    class="float-right d-print-none"
                    icon="la-user-shield"
                    variant="danger"
                    rounded
                    dense
                    outline
                    :disabled="!canUpdatePassword"
                    >{{ $t("profile.update-password") }}</erd-button
                  >
                </div>
              </erd-card-header>
              <erd-row class="m-0 p-0 pt-1">
                <erd-col xl="12" class="mt-0">
                  <label for="password">{{ $t("profile.password") }}</label>
                  <erd-input
                    id="password"
                    class="w-100 mt-1 mb-2 danger"
                    type="password"
                    v-model="password.current"
                  ></erd-input>
                </erd-col>
                <erd-col xl="12" class="mt-0">
                  <label for="new-password">{{
                    $t("profile.new-password")
                  }}</label>
                  <erd-input
                    id="new-password"
                    class="w-100 mt-1 mb-2 danger"
                    type="password"
                    v-model="password.new"
                  ></erd-input>
                </erd-col>
                <erd-col xl="12" class="mt-0">
                  <label for="confirm-password">{{
                    $t("profile.confirm-password")
                  }}</label>
                  <erd-input
                    id="confirm-password"
                    class="w-100 mt-1 mb-2 danger"
                    type="password"
                    v-model="password.confirm"
                  ></erd-input>
                </erd-col>
              </erd-row>
            </erd-card-body>
          </erd-card>
        </erd-col>
      </erd-row>
    </erd-col>
  </erd-row>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
// eslint-disable-next-line no-unused-vars
import { activeAPI, setCurrentLanguage } from "../../../helpers";
import { httpService } from "../../../services/http";
import { localeOptions } from "../../../constants/config";
import { EventBus } from "../../../services/ebus";

export default {
  data() {
    return {
      localeOptions,
      isLoading: false,
      confirmModal: false,
      password: {
        current: "",
        new: "",
        confirm: "",
      },
      profile: {
        user_id: "",
        name_first: "",
        name_last: "",
        gender: "",
        address: "",
        zipcode: "",
        city: "",
        country: "",
        email: "",
        phone: "",
        image: "",
      },
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
      noProfileImage:
        "data:image/png;base64,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",
    };
  },
  methods: {
    ...mapActions(["updateProfile", "logout"]),
    showConfirmModal() {
      this.confirmModal = true;
    },
    closeConfirmModal() {
      this.confirmModal = false;
    },
    handleImage(e) {
      if (e && e.target.files.length > 0) {
        const selectedImage = e.target.files[0];
        this.createBase64Image(selectedImage).then((data) => {
          this.profile.image = data;
        });
      }
    },
    createBase64Image(fileObject) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(fileObject);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
      });
    },
    changeImage() {
      document.getElementById("image-select").click();
    },
    loadProfile() {
      return new Promise((resolve, reject) => {
        httpService
          .get("users/profile")
          .then((res) => {
            this.updateProfile(res.data);
            resolve(res.data);
          })
          .catch((error) => {
            reject(error);
          });
      });
    },
    saveProfile() {
      httpService
        .post("users/profile", this.profile)
        .then(() => {
          this.$notify(
            "primary",
            this.$t("profile.success"),
            this.$t("profile.profile-success"),
            "la-user-shield",
            { duration: 5000, permanent: false }
          );
          this.updateProfile(this.profile);
        })
        .catch(() => {
          this.$notify(
            "error",
            this.$t("profile.failed"),
            this.$t("profile.profile-failed"),
            "la-user-shield",
            { duration: 5000, permanent: false }
          );
        });
    },
    deleteAccount() {
      this.showConfirmModal();
    },
    cancelAccount() {
      httpService
        .post("users/cancel", {
          user_id: this.currentUser.user.id,
          password: this.currentUser.user.password,
        })
        .then(() => {
          this.logout();
          this.$notify(
            "primary",
            this.$t("profile.success"),
            this.$t("profile.profile-delete-success"),
            "la-user-shield",
            { duration: 5000, permanent: false }
          );
        })
        .catch(() => {
          this.$notify(
            "error",
            this.$t("profile.failed"),
            this.$t("profile.profile-delete-failed"),
            "la-user-shield",
            { duration: 5000, permanent: false }
          );
        });
    },
    pagePrint() {
      document.getElementById("profile").print();
    },
  },
  computed: {
    languages() {
      return this.localeOptions.map((locale) => {
        return {
          text: locale.name,
          value: locale.id,
        };
      });
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
    passwordsMatch() {
      return this.password.new == this.password.confirm;
    },
    canUpdatePassword() {
      return (
        this.password.current.length >= 6 &&
        this.password.new.length >= 6 &&
        this.passwordsMatch
      );
    },
    memberSince() {
      return new Date(this.currentUser.user.created).toLocaleDateString(
        this.$t("date.locale")
      );
    },
    memberStatus() {
      return this.currentUser.subscription
        ? this.$t(`status.${this.currentUser.subscription.subscription_type}`)
        : this.$t("status.none");
    },
    userRole() {
      return this.currentUser.user
        ? this.$t(`roles.${this.currentUser.user.role}`)
        : this.$t("roles.none");
    },
    nextInvoiceExpired() {
      return this.currentUser.subscription &&
        this.currentUser.subscription.end_date
        ? new Date(this.currentUser.subscription.end_date).getTime() <
            new Date().getTime()
        : false;
    },
    nextInvoiceDate() {
      return this.currentUser.subscription &&
        this.currentUser.subscription.end_date
        ? new Date(this.currentUser.subscription.end_date).toLocaleDateString(
            this.$t("date.locale")
          )
        : this.$t("general.not-available");
    },
    ...mapGetters(["currentUser"]),
  },
  mounted() {
    this.isLoading = true;
    this.loadProfile()
      .then((res) => {
        Object.assign(this.profile, res);
        this.isLoading = false;
      })
      .catch(() => {
        this.isLoading = false;
        if (this.currentUser.profile) {
          Object.assign(this.profile, this.currentUser.profile);
        }
      });
    if (this.profile.image.length === 0) {
      this.profile.image = this.noProfileImage;
    }
    if (this.profile.user_id.length === 0) {
      this.profile.user_id = this.currentUser.user.id;
    }
  },
  beforeMount() {
    EventBus.$on("print", this.pagePrint);
  },
  beforeDestroy() {
    EventBus.$off("print", this.pagePrint);
  },
  watch: {
    "$i18n.locale": function (to, from) {
      setCurrentLanguage(to);
      if (from !== to) {
        this.$router.go(this.$route.path);
      }
    },
  },
};
</script>

<style scoped lang="scss">
.avatar-box {
  position: relative;
  width: 100%;
  box-sizing: border-box;
  /*overflow: hidden;*/
  max-height: 130px;
  border-radius: 10px;
}
.profile-picture {
  display: block;
  margin-left: auto;
  margin-right: auto;
  max-width: 122px;
  max-height: 122px;
  width: auto;
  height: auto;
  border-radius: 50%;
  cursor: pointer;
  border: 2px solid rgba($theme-color-1, 0.5);
  padding: 2px;

  -webkit-transition: border 0.3s;
  transition: border 0.3s;

  &:hover {
    border: 2px solid $theme-color-1;
  }
}
.image-select {
  display: none;
}
.tag {
  color: $theme-color-1;
}
.save-profile-image {
  position: absolute;
  right: 2rem;
  z-index: 2;
}

@media print {
  .card {
    @include depth(0);
    min-height: 1130px;
  }
}
</style>
