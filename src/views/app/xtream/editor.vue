<template>
  <erd-row class="m-0 p-0" id="editor">
    <erd-spinner v-if="isLoading" size="lg" overlay absolute></erd-spinner>
    <!--  

      FIND / REPLACE

    -->
    <erd-modal
      v-show="findReplace.modal"
      @close="findAndReplaceModal(false)"
      :title="$t('editor.find-replace')"
      class="select-none"
      small
    >
      <div class="px-2">
        <label class="w-100">{{ $t("editor.search-for") }}</label>
        <erd-input
          class="mt-1 mb-2 w-100"
          v-model="findReplace.from"
        ></erd-input>
        <label class="w-100">{{ $t("editor.replace-with") }}</label>
        <erd-input class="mt-1 mb-2 w-100" v-model="findReplace.to"></erd-input>
        <label class="w-100">{{ $t("editor.options") }}</label>
        <erd-checkbox class="mt-1" v-model="findReplace.replaceAll">{{
          $t("editor.replace-all-occurences")
        }}</erd-checkbox>
        <erd-checkbox class="mb-2" v-model="findReplace.ignoreCase">{{
          $t("editor.ignore-case")
        }}</erd-checkbox>
        <template v-if="findReplace.type === 1">
          <label class="w-100">{{ $t("xtream.group") }}</label>
          <erd-radiobutton
            class="mt-1"
            :value="1"
            v-model="findReplace.selectedOnly"
            >{{ $t("editor.selected-groups-only") }}</erd-radiobutton
          >
          <erd-radiobutton :value="0" v-model="findReplace.selectedOnly">{{
            $t("editor.all-groups")
          }}</erd-radiobutton>
        </template>
        <template v-if="findReplace.type === 2">
          <label class="w-100">{{ $t("xtream.streams") }}</label>
          <erd-radiobutton
            class="mt-1"
            :value="1"
            v-model="findReplace.selectedOnly"
            >{{ $t("editor.selected-streams-only") }}</erd-radiobutton
          >
          <erd-radiobutton :value="0" v-model="findReplace.selectedOnly">{{
            $t("editor.all-streams")
          }}</erd-radiobutton>
        </template>
      </div>
      <template v-slot:footer>
        <erd-button
          @click="findAndReplaceModal(false)"
          icon="la-times"
          class="mr-1"
          variant="danger"
          >{{ $t("general.cancel") }}</erd-button
        >
        <erd-button icon="la-check" variant="success" @click="findAndReplace">{{
          $t("general.ok")
        }}</erd-button>
      </template>
    </erd-modal>
    <!--  

      PREFIX / SUFFIX

    -->
    <erd-modal
      v-show="prefixSuffix.modal"
      @close="prefixSuffixModal(false)"
      :title="$t('editor.add-prefix-suffix')"
      class="select-none"
      small
    >
      <div class="px-2">
        <label class="w-100">{{ $t("editor.prefix") }}</label>
        <erd-input
          class="mt-1 mb-2 w-100"
          v-model="prefixSuffix.prefix"
        ></erd-input>
        <label class="w-100">{{ $t("editor.suffix") }}</label>
        <erd-input
          class="mt-1 mb-2 w-100"
          v-model="prefixSuffix.suffix"
        ></erd-input>
        <template v-if="prefixSuffix.type === 1">
          <label class="w-100">{{ $t("xtream.group") }}</label>
          <erd-radiobutton
            class="mt-1"
            :value="1"
            v-model="prefixSuffix.selectedOnly"
            >{{ $t("editor.selected-groups-only") }}</erd-radiobutton
          >
          <erd-radiobutton :value="0" v-model="prefixSuffix.selectedOnly">{{
            $t("editor.all-groups")
          }}</erd-radiobutton>
        </template>
        <template v-if="prefixSuffix.type === 2">
          <label class="w-100">{{ $t("xtream.streams") }}</label>
          <erd-radiobutton
            class="mt-1"
            :value="1"
            v-model="prefixSuffix.selectedOnly"
            >{{ $t("editor.selected-streams-only") }}</erd-radiobutton
          >
          <erd-radiobutton :value="0" v-model="prefixSuffix.selectedOnly">{{
            $t("editor.all-streams")
          }}</erd-radiobutton>
        </template>
      </div>
      <template v-slot:footer>
        <erd-button
          @click="prefixSuffixModal(false)"
          icon="la-times"
          class="mr-1"
          variant="danger"
          >{{ $t("general.cancel") }}</erd-button
        >
        <erd-button
          icon="la-check"
          variant="success"
          @click="addPrefixSuffix"
          >{{ $t("general.ok") }}</erd-button
        >
      </template>
    </erd-modal>
    <!--  

      CONVERT CASE

    -->
    <erd-modal
      v-show="convertCase.modal"
      @close="convertCaseModal(false)"
      :title="$t('editor.change-case')"
      class="select-none"
      small
    >
      <div class="px-2">
        <label class="d-block mb-2">{{ $t("editor.options") }}</label>
        <erd-radiobutton :value="0" v-model="convertCase.method">{{
          $t("editor.title-case")
        }}</erd-radiobutton>
        <erd-radiobutton :value="1" v-model="convertCase.method">{{
          $t("editor.upper-case")
        }}</erd-radiobutton>
        <erd-radiobutton class="mb-2" :value="2" v-model="convertCase.method">{{
          $t("editor.lower-case")
        }}</erd-radiobutton>
        <template v-if="convertCase.type === 1">
          <label class="w-100">{{ $t("xtream.group") }}</label>
          <erd-radiobutton
            class="mt-1"
            :value="1"
            v-model="convertCase.selectedOnly"
            >{{ $t("editor.selected-groups-only") }}</erd-radiobutton
          >
          <erd-radiobutton :value="0" v-model="convertCase.selectedOnly">{{
            $t("editor.all-groups")
          }}</erd-radiobutton>
        </template>
        <template v-if="convertCase.type === 2">
          <label class="w-100">{{ $t("xtream.streams") }}</label>
          <erd-radiobutton
            class="mt-1"
            :value="1"
            v-model="convertCase.selectedOnly"
            >{{ $t("editor.selected-streams-only") }}</erd-radiobutton
          >
          <erd-radiobutton :value="0" v-model="convertCase.selectedOnly">{{
            $t("editor.all-streams")
          }}</erd-radiobutton>
        </template>
      </div>
      <template v-slot:footer>
        <erd-button
          @click="convertCaseModal(false)"
          icon="la-times"
          class="mr-1"
          variant="danger"
          >{{ $t("general.cancel") }}</erd-button
        >
        <erd-button icon="la-check" variant="success" @click="changeCase">{{
          $t("general.ok")
        }}</erd-button>
      </template>
    </erd-modal>
    <!--  

      EDIT GROUP

    -->
    <erd-modal
      v-show="groupEditor.modal"
      @close="editGroupModal(false)"
      :title="$t('editor.edit-group')"
      class="select-none"
      small
    >
      <div class="px-2">
        <template v-if="canEditGroupType">
          <label class="w-100">{{ $t("editor.group-type") }}</label>
          <erd-select
            class="w-100 mt-1 mb-2"
            :items="groupTypes"
            v-model="groupEditor.group_type"
            v-if="groupEditor.modal"
          ></erd-select>
        </template>
        <label class="w-100">{{ $t("editor.group-name") }}</label>
        <erd-input
          class="mt-1 mb-2 w-100"
          v-model="groupEditor.group_name"
        ></erd-input>
        <!--<label class="w-100">{{ $t("editor.parent-code") }}</label>
        <erd-input
          class="mt-1 mb-2 w-100"
          v-model="groupEditor.group_parent_code"
        ></erd-input>-->
        <erd-checkbox class="mb-2" v-model="groupEditor.group_is_hidden">{{
          $t("editor.hidden")
        }}</erd-checkbox>
      </div>
      <template v-slot:footer>
        <erd-button
          @click="editGroupModal(false)"
          icon="la-times"
          class="mr-1"
          variant="danger"
          >{{ $t("general.cancel") }}</erd-button
        >
        <erd-button icon="la-check" variant="success" @click="editGroup">{{
          $t("general.ok")
        }}</erd-button>
      </template>
    </erd-modal>
    <!--  

      EDIT STREAM

    -->
    <erd-modal
      v-show="streamEditor.modal"
      @close="editStreamModal(false)"
      :title="$t('editor.edit-stream')"
      class="select-none"
      small
    >
      <div class="px-2">
        <template v-if="activeGroupType === 1">
          <label class="w-100">{{ $t("editor.name-placeholder") }}</label>
          <erd-input
            class="mt-1 mb-2 w-100"
            v-model="streamEditor.stream_tvg_name"
          ></erd-input>
          <label class="w-100">{{ $t("editor.epg-channel-id") }}</label>
          <erd-input
            class="mt-1 mb-2 w-100"
            v-model="streamEditor.stream_tvg_id"
          ></erd-input>
          <label class="w-100">{{ $t("editor.stream-icon") }}</label>
          <erd-input
            class="mt-1 mb-2 w-100"
            v-model="streamEditor.stream_tvg_logo"
          ></erd-input>
          <div
            class="form-control text-center mb-2"
            v-if="streamEditor.stream_tvg_logo"
          >
            <a :href="streamEditor.stream_tvg_logo" target="_blank"
              ><img
                class="editor-stream-icon"
                :src="streamEditor.stream_tvg_logo"
            /></a>
          </div>
          <label class="w-100" v-if="streamEditor.stream_is_custom == 1">{{
            $t("editor.stream-url")
          }}</label>
          <erd-input
            v-if="streamEditor.stream_is_custom == 1"
            class="mt-1 mb-2 w-100"
            v-model="streamEditor.source_stream_url"
          ></erd-input>
          <!--<label class="w-100">{{ $t("editor.parent-code") }}</label>
          <erd-input
            class="mt-1 mb-3 w-100"
            v-model="streamEditor.stream_parent_code"
          ></erd-input>-->
          <erd-checkbox
            class="mb-1"
            v-model="streamEditor.stream_radio"
            :true-value="1"
            :false-value="0"
            >{{ $t("editor.radio") }}</erd-checkbox
          >
        </template>
        <template v-if="activeGroupType === 2">
          <label class="w-100">{{ $t("xtream.movie-name") }}</label>
          <erd-input
            class="mt-1 mb-2 w-100"
            v-model="streamEditor.movie_name"
          ></erd-input>
          <label class="w-100">{{ $t("xtream.movie-year") }}</label>
          <erd-input
            class="mt-1 mb-2 w-100"
            v-model="streamEditor.movie_year"
          ></erd-input>
          <label class="w-100">{{ $t("xtream.tmdb-id") }}</label>
          <erd-input
            class="mt-1 mb-2 w-100"
            v-model="streamEditor.tmdb_id"
          ></erd-input>
          <label class="w-100" v-if="streamEditor.stream_is_custom == 1">{{
            $t("editor.stream-url")
          }}</label>
          <erd-input
            v-if="streamEditor.stream_is_custom == 1"
            class="mt-1 mb-2 w-100"
            v-model="streamEditor.source_stream_url"
          ></erd-input>
          <label class="w-100">{{ $t("xtream.movie-poster") }}</label>
          <erd-input
            class="mt-1 mb-2 w-100"
            v-model="streamEditor.stream_tvg_logo"
          ></erd-input>
          <div
            class="form-control text-center mb-2"
            v-if="streamEditor.stream_tvg_logo"
          >
            <a :href="streamEditor.stream_tvg_logo" target="_blank"
              ><img
                class="editor-movie-poster"
                :src="streamEditor.stream_tvg_logo"
            /></a>
          </div>
        </template>
        <template v-if="activeGroupType === 3">
          <label class="w-100">{{ $t("xtream.name") }}</label>
          <erd-input
            class="mt-1 mb-2 w-100"
            v-model="streamEditor.serie_name"
          ></erd-input>
          <label class="w-100">{{ $t("xtream.season") }}</label>
          <erd-input
            class="mt-1 mb-2 w-100"
            v-model="streamEditor.serie_season"
            type="number"
          ></erd-input>
          <label class="w-100">{{ $t("xtream.episode") }}</label>
          <erd-input
            class="mt-1 mb-2 w-100"
            v-model="streamEditor.serie_episode"
            type="number"
          ></erd-input>
          <label class="w-100">{{ $t("xtream.tmdb-id") }}</label>
          <erd-input
            class="mt-1 mb-2 w-100"
            v-model="streamEditor.tmdb_id"
          ></erd-input>
          <label class="w-100" v-if="streamEditor.stream_is_custom == 1">{{
            $t("editor.stream-url")
          }}</label>
          <erd-input
            v-if="streamEditor.stream_is_custom == 1"
            class="mt-1 mb-2 w-100"
            v-model="streamEditor.source_stream_url"
          ></erd-input>
          <label class="w-100">{{ $t("xtream.serie-poster") }}</label>
          <erd-input
            class="mt-1 mb-2 w-100"
            v-model="streamEditor.stream_tvg_logo"
          ></erd-input>
          <div
            class="form-control text-center mb-2"
            v-if="streamEditor.stream_tvg_logo"
          >
            <a :href="streamEditor.stream_tvg_logo" target="_blank"
              ><img
                class="editor-movie-poster"
                :src="streamEditor.stream_tvg_logo"
            /></a>
          </div>
        </template>
        <erd-checkbox class="mb-1" v-model="streamEditor.stream_is_hidden">{{
          $t("editor.hidden")
        }}</erd-checkbox>
      </div>
      <template v-slot:footer>
        <erd-button
          @click="editStreamModal(false)"
          icon="la-times"
          class="mr-1"
          variant="danger"
          >{{ $t("general.cancel") }}</erd-button
        >
        <erd-button icon="la-check" variant="success" @click="editStream">{{
          $t("general.ok")
        }}</erd-button>
      </template>
    </erd-modal>
    <!--  

      SAVE CHANGES

    -->
    <erd-modal
      v-show="saveChanges.modal"
      @close="saveChangesModal(false)"
      :title="$t('editor.save-changes')"
      class="select-none"
      small
    >
      <div class="px-2">
        <p>{{ $t("editor.save-changes-text") }}</p>
      </div>
      <template v-slot:footer>
        <erd-button
          @click="saveChangesModal(false)"
          icon="la-times"
          class="mr-1"
          variant="danger"
          >{{ $t("general.cancel") }}</erd-button
        >
        <erd-button
          icon="la-check"
          variant="success"
          @click="saveChangesModal(false, true)"
          >{{ $t("general.ok") }}</erd-button
        >
      </template>
    </erd-modal>
    <!--  

      RADIOBROWSER

    -->
    <erd-modal
      v-show="radioBrowser.modal"
      @close="radioBrowserModal(false)"
      :title="$t('editor.import-radiobrowser')"
      class="select-none"
    >
      <div class="px-2">
        <label class="w-100" for="radiobrowser-search">{{
          $t("menu.search")
        }}</label>
        <erd-input
          id="radiobrowser-search"
          class="mt-1 mb-2 w-100"
          v-model="radioBrowser.search"
          autocomplete="off"
          :placeholder="$t('menu.search')"
        ></erd-input>
        <div class="radiobrowser-stations">
          <erd-spinner
            v-if="radioBrowser.isLoading"
            size="lg"
            overlay
            absolute
          ></erd-spinner>
          <p class="mb-1 pb-0" v-if="radioBrowser.results.length">
            {{ $t("editor.select-radio-stations") }}
          </p>
          <perfect-scrollbar
            :settings="{ suppressScrollX: true, wheelPropagation: false }"
          >
            <div
              class="form-control radiobrowser-station"
              :class="{ selected: radioBrowser.active.includes(index) }"
              v-for="(station, index) in radioBrowser.results"
              :key="`radiobrowser-station-${index}-${station.name}`"
              @click.ctrl="toggleRadiobrowserSelection(index)"
              @click.shift="selectRadiobrowserRangeSelection(index)"
              @click.exact="selectRadiobrowserSelection(index)"
            >
              <span class="station-name">{{ station.name }}</span>
              <span class="text-muted text-small ml-1">{{
                station.language.replace(/\b\w/g, (l) => l.toUpperCase())
              }}</span>
              <span class="text-muted text-small float-right"
                >{{ station.codec }} - {{ station.bitrate }}</span
              >
            </div>
          </perfect-scrollbar>
        </div>
      </div>
      <template v-slot:footer>
        <erd-button
          @click="radioBrowserModal(false)"
          icon="la-times"
          class="mr-1"
          variant="danger"
          >{{ $t("general.cancel") }}</erd-button
        >
        <erd-button
          icon="la-check"
          variant="success"
          @click="radioBrowserModal(false, true)"
          :disabled="
            radioBrowser.isLoading || radioBrowser.results.length === 0
          "
          >{{ $t("general.ok") }}</erd-button
        >
      </template>
    </erd-modal>
    <!--  

      SOUNDCLOUD

    -->
    <erd-modal
      v-show="soundcloud.modal"
      @close="soundcloudModal(false)"
      :title="$t('editor.import-soundcloud')"
      class="select-none"
    >
      <div class="px-2">
        <erd-spinner
          v-if="soundcloud.isLoading"
          size="lg"
          overlay
          absolute
        ></erd-spinner>
        <label class="w-100" for="soundcloud-url">{{
          $t("radio.soundcloud-url")
        }}</label>
        <erd-input
          id="soundcloud-url"
          class="mt-1 mb-2 w-100"
          v-model="soundcloud.url"
          autocomplete="off"
          :placeholder="$t('radio.soundcloud-url-placeholder')"
        ></erd-input>
        <div
          class="soundcloud-info form-control mb-2 w-100 text-center"
          v-if="soundcloud.track"
        >
          <img
            :src="
              soundcloud.track.artwork_url.replace('large.jpg', 't500x500.jpg')
            "
            class="cover mt-2"
          />
          <div class="info">
            <h5 class="mb-1">{{ soundcloud.track.title }}</h5>
            <p class="p-0 m-0 text-muted">
              {{ formatNumber(soundcloud.track.likes_count) }}
              {{ $t("radio.likes") }} <small>•</small>
              {{ formatDateYoutube(soundcloud.track.display_date) }}
              <small>•</small>
              {{ formatSeconds(soundcloud.track.duration / 1000) }}
            </p>
          </div>
        </div>
      </div>
      <template v-slot:footer>
        <erd-button
          @click="soundcloudModal(false)"
          icon="la-times"
          class="mr-1"
          variant="danger"
          >{{ $t("general.cancel") }}</erd-button
        >
        <erd-button
          icon="la-check"
          variant="success"
          @click="soundcloudModal(false, true)"
          :disabled="soundcloud.isLoading || soundcloud.track === null"
          >{{ $t("general.ok") }}</erd-button
        >
      </template>
    </erd-modal>
    <!--  

      YOUTUBE

    -->
    <erd-modal
      v-show="youtube.modal"
      @close="youtubeModal(false)"
      :title="$t('editor.import-youtube')"
      class="select-none"
    >
      <div class="px-2">
        <erd-spinner
          v-if="youtube.isLoading"
          size="lg"
          overlay
          absolute
        ></erd-spinner>
        <label class="w-100" for="youtube-url">{{
          $t("editor.youtube-url")
        }}</label>
        <erd-input
          id="youtube-url"
          class="mt-1 mb-2 w-100"
          v-model="youtube.url"
          autocomplete="off"
          :placeholder="$t('editor.youtube-url-placeholder')"
        ></erd-input>
        <div
          class="soundcloud-info form-control mb-2 w-100 text-center"
          v-if="youtube.video"
        >
          <img
            :src="`https://i.ytimg.com/vi/${youtube.videoId}/maxresdefault.jpg`"
            class="cover mt-2"
          />
          <div class="info">
            <h5 class="mb-1">{{ youtube.video.videoDetails.title }}</h5>
            <p class="p-0 m-0 text-muted">
              {{ formatNumber(youtube.video.videoDetails.viewCount) }}
              {{ $t("editor.views") }} <small>•</small>
              {{ formatSeconds(youtube.video.videoDetails.lengthSeconds) }}
            </p>
          </div>
        </div>
      </div>
      <template v-slot:footer>
        <erd-button
          @click="youtubeModal(false)"
          icon="la-times"
          class="mr-1"
          variant="danger"
          >{{ $t("general.cancel") }}</erd-button
        >
        <erd-button
          icon="la-check"
          variant="success"
          @click="youtubeModal(false, true)"
          :disabled="youtube.isLoading || youtube.video === null"
          >{{ $t("general.ok") }}</erd-button
        >
      </template>
    </erd-modal>
    <!--  

      VIMEO

    -->
    <erd-modal
      v-show="vimeo.modal"
      @close="vimeoModal(false)"
      :title="$t('editor.import-vimeo')"
      class="select-none"
    >
      <div class="px-2">
        <erd-spinner
          v-if="vimeo.isLoading"
          size="lg"
          overlay
          absolute
        ></erd-spinner>
        <label class="w-100" for="vimeo-url">{{
          $t("editor.vimeo-url")
        }}</label>
        <erd-input
          id="vimeo-url"
          class="mt-1 mb-2 w-100"
          v-model="vimeo.url"
          autocomplete="off"
          :placeholder="$t('editor.vimeo-url-placeholder')"
        ></erd-input>
        <div
          class="soundcloud-info form-control mb-2 w-100 text-center"
          v-if="vimeo.video"
        >
          <img :src="vimeo.video.video.thumbs.base" class="cover mt-2" />
          <div class="info">
            <h5 class="mb-1">{{ vimeo.video.video.title }}</h5>
            <p class="p-0 m-0 text-muted">
              {{ formatSeconds(vimeo.video.video.duration) }}
            </p>
          </div>
        </div>
      </div>
      <template v-slot:footer>
        <erd-button
          @click="vimeoModal(false)"
          icon="la-times"
          class="mr-1"
          variant="danger"
          >{{ $t("general.cancel") }}</erd-button
        >
        <erd-button
          icon="la-check"
          variant="success"
          @click="vimeoModal(false, true)"
          :disabled="vimeo.isLoading || vimeo.video === null"
          >{{ $t("general.ok") }}</erd-button
        >
      </template>
    </erd-modal>
    <!--  

      DAILYMOTION

    -->
    <erd-modal
      v-show="dailymotion.modal"
      @close="dailymotionModal(false)"
      :title="$t('editor.import-dailymotion')"
      class="select-none"
    >
      <div class="px-2">
        <erd-spinner
          v-if="dailymotion.isLoading"
          size="lg"
          overlay
          absolute
        ></erd-spinner>
        <label class="w-100" for="dailymotion-url">{{
          $t("editor.dailymotion-url")
        }}</label>
        <erd-input
          id="dailymotion-url"
          class="mt-1 mb-2 w-100"
          v-model="dailymotion.url"
          autocomplete="off"
          :placeholder="$t('editor.dailymotion-url-placeholder')"
        ></erd-input>
        <div
          class="soundcloud-info form-control mb-2 w-100 text-center"
          v-if="dailymotion.video"
        >
          <img :src="dailymotion.video.thumbnail_1080_url" class="cover mt-2" />
          <div class="info">
            <h5 class="mb-1">{{ dailymotion.video.title }}</h5>
            <p class="p-0 m-0 text-muted">
              {{ formatNumber(dailymotion.video.views_total) }}
              {{ $t("editor.views") }} <small>•</small>
              {{ formatSeconds(dailymotion.video.duration) }}
            </p>
          </div>
        </div>
      </div>
      <template v-slot:footer>
        <erd-button
          @click="dailymotionModal(false)"
          icon="la-times"
          class="mr-1"
          variant="danger"
          >{{ $t("general.cancel") }}</erd-button
        >
        <erd-button
          icon="la-check"
          variant="success"
          @click="dailymotionModal(false, true)"
          :disabled="dailymotion.isLoading || dailymotion.video === null"
          >{{ $t("general.ok") }}</erd-button
        >
      </template>
    </erd-modal>
    <!--  

      TED-TALKS

    -->
    <erd-modal
      v-show="tedTalks.modal"
      @close="tedTalksModal(false)"
      :title="$t('editor.import-ted-talks')"
      class="select-none"
    >
      <div class="px-2">
        <erd-spinner
          v-if="tedTalks.isLoading"
          size="lg"
          overlay
          absolute
        ></erd-spinner>
        <label class="w-100" for="tedTalks-url">{{
          $t("editor.ted-talks-url")
        }}</label>
        <erd-input
          id="tedTalks-url"
          class="mt-1 mb-2 w-100"
          v-model="tedTalks.url"
          autocomplete="off"
          :placeholder="$t('editor.ted-talks-url-placeholder')"
        ></erd-input>
        <div
          class="soundcloud-info form-control mb-2 w-100 text-center"
          v-if="tedTalks.video"
        >
          <img :src="tedTalks.video.hero" class="cover mt-2" />
          <div class="info">
            <h5 class="mb-1">{{ tedTalks.video.title }}</h5>
            <p class="p-0 m-0 text-muted">
              {{ formatNumber(tedTalks.video.viewed_count) }}
              {{ $t("editor.views") }} <small>•</small>
              {{ formatSeconds(tedTalks.video.duration) }}
            </p>
          </div>
        </div>
      </div>
      <template v-slot:footer>
        <erd-button
          @click="tedTalksModal(false)"
          icon="la-times"
          class="mr-1"
          variant="danger"
          >{{ $t("general.cancel") }}</erd-button
        >
        <erd-button
          icon="la-check"
          variant="success"
          @click="tedTalksModal(false, true)"
          :disabled="tedTalks.isLoading || tedTalks.video === null"
          >{{ $t("general.ok") }}</erd-button
        >
      </template>
    </erd-modal>
    <!--  

      XHAMSTER

    -->
    <erd-modal
      v-show="xhamster.modal"
      @close="xhamsterModal(false)"
      :title="$t('editor.import-xhamster')"
      class="select-none"
    >
      <div class="px-2">
        <erd-spinner
          v-if="xhamster.isLoading"
          size="lg"
          overlay
          absolute
        ></erd-spinner>
        <label class="w-100" for="xhamster-url">{{
          $t("editor.xhamster-url")
        }}</label>
        <erd-input
          id="xhamster-url"
          class="mt-1 mb-2 w-100"
          v-model="xhamster.url"
          autocomplete="off"
          :placeholder="$t('editor.xhamster-url-placeholder')"
        ></erd-input>
        <div
          class="soundcloud-info form-control mb-2 w-100 text-center"
          v-if="xhamster.video"
        >
          <img :src="xhamster.video.videoEntity.thumbBig" class="cover mt-2" />
          <div class="info">
            <h5 class="mb-1">{{ xhamster.video.videoEntity.title }}</h5>
            <p class="p-0 m-0 text-muted">
              {{ formatSeconds(xhamster.video.videoEntity.duration) }}
            </p>
          </div>
        </div>
      </div>
      <template v-slot:footer>
        <erd-button
          @click="xhamsterModal(false)"
          icon="la-times"
          class="mr-1"
          variant="danger"
          >{{ $t("general.cancel") }}</erd-button
        >
        <erd-button
          icon="la-check"
          variant="success"
          @click="xhamsterModal(false, true)"
          :disabled="xhamster.isLoading || xhamster.video === null"
          >{{ $t("general.ok") }}</erd-button
        >
      </template>
    </erd-modal>
    <!--  

      FIND LOGO

    -->
    <erd-modal
      v-show="findLogo.modal"
      @close="findLogoModal(false)"
      :title="`${$t('editor.find-logo')}: ${findLogo.title}`"
      class="select-none"
      small
    >
      <div class="px-2">
        <erd-spinner
          v-if="findLogo.isLoading"
          size="lg"
          overlay
          absolute
        ></erd-spinner>
        <label class="w-100" for="logo-country">{{
          $t("editor.logo-country")
        }}</label>
        <erd-select
          key="logo-countries"
          id="logo-country"
          class="w-100 mt-1 mb-2"
          :items="findLogo.countries"
          v-model="findLogo.country"
        ></erd-select>
        <label class="w-100" for="find-logo-search">{{
          $t("editor.find-logo-search")
        }}</label>
        <erd-input
          id="find-logo-search"
          class="mt-1 mb-2 w-100"
          v-model="findLogo.search"
          autocomplete="off"
          :placeholder="$t('menu.search')"
        ></erd-input>
        <label class="w-100" for="logos">{{ $t("editor.logos") }}</label>
        <erd-select
          key="logo-logos"
          id="logos"
          class="w-100 mt-1 mb-2"
          :items="filteredLogos"
          v-model="findLogo.logo"
        ></erd-select>
        <div class="find-logo form-control mb-2 w-100 text-center">
          <a
            :href="`http://static.iptv-tools.com/${findLogo.country}/${findLogo.logo}`"
            target="_blank"
          >
            <img
              v-if="findLogo.logo.length"
              :src="`http://static.iptv-tools.com/${findLogo.country}/${findLogo.logo}`"
              class="stream-logo mt-2"
          /></a>
        </div>
      </div>
      <template v-slot:footer>
        <erd-button
          @click="findLogoModal(false)"
          icon="la-times"
          class="mr-1"
          variant="danger"
          >{{ $t("general.cancel") }}</erd-button
        >
        <erd-button
          icon="la-check"
          variant="success"
          @click="findLogoModal(false, true)"
          :disabled="findLogo.isLoading || findLogo.logos.length === 0"
          >{{ $t("general.ok") }}</erd-button
        >
      </template>
    </erd-modal>
    <!--  

      ASSIGN LOGOS

    -->
    <erd-modal
      v-show="assignLogo.modal"
      @close="assignLogoModal(false)"
      :title="$t('editor.assign-stream-logos')"
      class="select-none"
      small
    >
      <div class="px-2 assign-logo">
        <erd-spinner
          v-if="assignLogo.isLoading"
          size="lg"
          overlay
          absolute
        ></erd-spinner>
        <label class="w-100" for="assign-logo-country">{{
          $t("editor.logo-country")
        }}</label>
        <erd-select
          key="assign-logo-countries"
          id="assign-logo-country"
          class="w-100 mt-1 mb-2"
          :items="assignLogo.countries"
          v-model="assignLogo.country"
        ></erd-select>
        <erd-radiobutton
          class="mt-1"
          :value="1"
          v-model="assignLogo.assignAll"
          >{{ $t("editor.assign-all-streams") }}</erd-radiobutton
        >
        <erd-radiobutton :value="0" v-model="assignLogo.assignAll">{{
          $t("editor.assign-missing-only")
        }}</erd-radiobutton>
      </div>
      <template v-slot:footer>
        <erd-button
          @click="assignLogoModal(false)"
          icon="la-times"
          class="mr-1"
          variant="danger"
          >{{ $t("general.cancel") }}</erd-button
        >
        <erd-button
          icon="la-check"
          variant="success"
          @click="assignLogoModal(false, true)"
          :disabled="assignLogo.isLoading || assignLogo.country.length === 0"
          >{{ $t("general.ok") }}</erd-button
        >
      </template>
    </erd-modal>
    <!--  

      IMPORT M3U

    -->
    <erd-modal
      v-show="importM3U.modal"
      @close="importM3UModal(false)"
      :title="$t('editor.import-m3u')"
      class="select-none"
      small
    >
      <div class="px-2 assign-logo">
        <label class="d-block mb-1" for="title">{{ $t("m3u.file") }}</label>
        <erd-input
          class="w-100"
          type="file"
          accept=".m3u8, .m3u"
          v-model="importM3U.file"
          @change="uploadM3U"
        ></erd-input>
        <div class="radiobrowser-stations">
          <erd-spinner
            v-if="importM3U.isLoading"
            size="lg"
            overlay
            absolute
          ></erd-spinner>
          <p class="mb-1 pb-0" v-if="importM3U.groups.length">
            {{ $t("editor.select-groups") }}
          </p>
          <perfect-scrollbar
            :settings="{ suppressScrollX: true, wheelPropagation: false }"
          >
            <div
              class="form-control radiobrowser-station"
              :class="{ selected: importM3U.importGroups.includes(index) }"
              v-for="(group, index) in importM3U.groups"
              :key="`import-group-${index}-${group.name}`"
              @click.ctrl="toggleImportM3USelection(index)"
              @click.shift="selectImportM3URangeSelection(index)"
              @click.exact="selectImportM3USelection(index)"
            >
              <span class="station-name">{{ group.name }}</span>
              <span class="text-muted text-small ml-2">{{
                $t(`category-type.${group.type}`)
              }}</span>
              <span class="text-muted text-small float-right">{{
                group.streams.length
              }}</span>
            </div>
          </perfect-scrollbar>
        </div>
      </div>
      <template v-slot:footer>
        <erd-button
          @click="importM3UModal(false)"
          icon="la-times"
          class="mr-1"
          variant="danger"
          >{{ $t("general.cancel") }}</erd-button
        >
        <erd-button
          icon="la-check"
          variant="success"
          @click="importM3UModal(false, true)"
          :disabled="
            importM3U.isLoading ||
            importM3U.groups.length === 0 ||
            importM3U.importGroups.length === 0
          "
          >{{ $t("general.ok") }}</erd-button
        >
      </template>
    </erd-modal>
    <!--  

      ASSIGN TVG-ID

    -->
    <erd-modal
      v-show="assignTVGID.modal"
      @close="assignTVGIDModal(false)"
      :title="$t('editor.assign-tv-guide')"
      class="select-none"
      small
    >
      <div class="px-2 assign-logo">
        <erd-spinner
          v-if="assignTVGID.isLoading"
          size="lg"
          overlay
          absolute
        ></erd-spinner>
        <label class="w-100" for="assign-tv-guide-country">{{
          $t("editor.logo-country")
        }}</label>
        <erd-select
          key="assign-tv-guide-countries"
          id="assign-tv-guide-country"
          class="w-100 mt-1 mb-2"
          :items="assignTVGID.countries"
          v-model="assignTVGID.country"
        ></erd-select>
        <erd-radiobutton
          class="mt-1"
          :value="1"
          v-model="assignTVGID.assignAll"
          >{{ $t("editor.assign-all-streams") }}</erd-radiobutton
        >
        <erd-radiobutton :value="0" v-model="assignTVGID.assignAll">{{
          $t("editor.assign-epg-missing-only")
        }}</erd-radiobutton>
      </div>
      <template v-slot:footer>
        <erd-button
          @click="assignTVGIDModal(false)"
          icon="la-times"
          class="mr-1"
          variant="danger"
          >{{ $t("general.cancel") }}</erd-button
        >
        <erd-button
          icon="la-check"
          variant="success"
          @click="assignTVGIDModal(false, true)"
          :disabled="assignTVGID.isLoading || assignTVGID.country.length === 0"
          >{{ $t("general.ok") }}</erd-button
        >
      </template>
    </erd-modal>
    <!--  

      FIND TVG-ID

    -->
    <erd-modal
      v-show="findTVGID.modal"
      @close="findTVGIDModal(false)"
      :title="`${$t('editor.find-tv-guide')}: ${findTVGID.title}`"
      class="select-none"
      small
    >
      <div class="px-2 find-channel-id">
        <erd-spinner
          v-if="findTVGID.isLoading"
          size="lg"
          overlay
          absolute
        ></erd-spinner>
        <label class="w-100" for="logo-country">{{
          $t("editor.logo-country")
        }}</label>
        <erd-select
          key="logo-countries"
          id="logo-country"
          class="w-100 mt-1 mb-2"
          :items="findTVGID.countries"
          v-model="findTVGID.country"
        ></erd-select>
        <label class="w-100" for="find-tvguide-search">{{
          $t("editor.find-logo-search")
        }}</label>
        <erd-input
          id="find-tvguide-search"
          class="mt-1 mb-2 w-100"
          v-model="findTVGID.search"
          autocomplete="off"
          :placeholder="$t('menu.search')"
        ></erd-input>
        <label class="w-100" for="channels">{{ $t("editor.channel") }}</label>
        <erd-select
          key="tvguide-channels"
          id="channels"
          class="w-100 mt-1 mb-2"
          :items="filteredTVGIDS"
          v-model="findTVGID.channel"
        ></erd-select>
      </div>
      <template v-slot:footer>
        <erd-button
          @click="findTVGIDModal(false)"
          icon="la-times"
          class="mr-1"
          variant="danger"
          >{{ $t("general.cancel") }}</erd-button
        >
        <erd-button
          icon="la-check"
          variant="success"
          @click="findTVGIDModal(false, true)"
          :disabled="findTVGID.isLoading || findTVGID.channels.length === 0"
          >{{ $t("general.ok") }}</erd-button
        >
      </template>
    </erd-modal>
    <!--  

      APP MENU

    -->
    <erd-app-menu icon="la-tools">
      <div class="pt-3 select-none" v-if="playlistSelected">
        <erd-collapse :title="$t('editor.import-m3u')" key="import-m3u" small>
          <ul class="list-unstyled mb-0">
            <li class="nav-item">
              <a href="#" @click.prevent="importM3UModal(true)"
                ><i class="las la-file-import mr-1"></i
                >{{ $t("editor.import-file") }}</a
              >
            </li>
          </ul>
        </erd-collapse>
        <erd-collapse :title="$t('editor.sort-groups')" key="sort-groups" small>
          <ul class="list-unstyled mb-0">
            <li class="nav-item">
              <a href="#" @click.prevent="sortGroupAlphaUp"
                ><i class="las la-sort-alpha-up mr-1"></i
                >{{ $t("editor.sort-alpha-up") }}</a
              >
            </li>
            <li class="nav-item">
              <a href="#" @click.prevent="sortGroupAlphaDown"
                ><i class="las la-sort-alpha-down mr-1"></i
                >{{ $t("editor.sort-alpha-down") }}</a
              >
            </li>
            <li class="nav-item">
              <a href="#" @click.prevent="sortGroupTypeUp"
                ><i class="las la-sort-numeric-up mr-1"></i
                >{{ $t("editor.sort-type-up") }}</a
              >
            </li>
            <li class="nav-item">
              <a href="#" @click.prevent="sortGroupTypeDown"
                ><i class="las la-sort-numeric-down mr-1"></i
                >{{ $t("editor.sort-type-down") }}</a
              >
            </li>
          </ul>
        </erd-collapse>
        <erd-collapse
          :title="$t('editor.sort-streams')"
          key="sort-streams"
          small
        >
          <ul class="list-unstyled mb-0">
            <li class="nav-item">
              <a href="#" @click.prevent="sortStreamAlphaUp"
                ><i class="las la-sort-alpha-up mr-1"></i
                >{{ $t("editor.sort-alpha-up") }}</a
              >
            </li>
            <li class="nav-item">
              <a href="#" @click.prevent="sortStreamAlphaDown"
                ><i class="las la-sort-alpha-down mr-1"></i
                >{{ $t("editor.sort-alpha-down") }}</a
              >
            </li>
            <li class="nav-item">
              <a href="#" @click.prevent="sortStreamHiddenUp"
                ><i class="las la-eye-slash mr-1"></i
                >{{ $t("editor.sort-hidden-up") }}</a
              >
            </li>
            <li class="nav-item">
              <a href="#" @click.prevent="sortStreamHiddenDown"
                ><i class="las la-eye-slash mr-1"></i
                >{{ $t("editor.sort-hidden-down") }}</a
              >
            </li>
          </ul>
        </erd-collapse>
        <erd-collapse
          v-if="activeGroupType == 1"
          :title="$t('editor.import-radio')"
          key="import-radio"
          small
        >
          <ul class="list-unstyled mb-0">
            <li class="nav-item">
              <a href="#" @click.prevent="radioBrowserModal(true)"
                ><i class="las la-broadcast-tower mr-1"></i
                >{{ $t("editor.import-radiobrowser") }}</a
              >
            </li>
          </ul>
        </erd-collapse>
        <erd-collapse
          v-if="activeGroupType == 1"
          :title="$t('editor.import-music')"
          key="import-music"
          small
        >
          <ul class="list-unstyled mb-0">
            <li class="nav-item">
              <a href="#" @click.prevent="soundcloudModal(true)"
                ><i class="lab la-soundcloud mr-1"></i
                >{{ $t("editor.import-soundcloud") }}</a
              >
            </li>
          </ul>
        </erd-collapse>
        <erd-collapse
          :title="$t('editor.import-video')"
          key="import-video"
          small
        >
          <ul class="list-unstyled mb-0">
            <li class="nav-item">
              <a href="#" @click.prevent="youtubeModal(true)"
                ><i class="lab la-youtube mr-1"></i
                >{{ $t("editor.import-youtube") }}</a
              >
            </li>
            <li class="nav-item">
              <a href="#" @click.prevent="vimeoModal(true)"
                ><i class="lab la-vimeo mr-1"></i
                >{{ $t("editor.import-vimeo") }}</a
              >
            </li>
            <li class="nav-item">
              <a href="#" @click.prevent="dailymotionModal(true)"
                ><i class="lab la-youtube mr-1"></i
                >{{ $t("editor.import-dailymotion") }}</a
              >
            </li>
            <li class="nav-item">
              <a href="#" @click.prevent="tedTalksModal(true)"
                ><i class="las la-comments mr-1"></i
                >{{ $t("editor.import-ted-talks") }}</a
              >
            </li>
            <li class="nav-item">
              <a href="#" @click.prevent="xhamsterModal(true)"
                ><i class="las la-heart mr-1"></i
                >{{ $t("editor.import-xhamster") }}</a
              >
            </li>
          </ul>
        </erd-collapse>
        <erd-collapse
          :title="$t('editor.assign-logos')"
          key="assign-logos"
          small
          v-if="activeGroupType == 1"
        >
          <ul class="list-unstyled mb-0">
            <li class="nav-item">
              <a href="#" @click.prevent="assignLogoModal(true)"
                ><i class="las la-photo-video mr-1"></i
                >{{ $t("editor.assign-stream-logos") }}</a
              >
            </li>
          </ul>
        </erd-collapse>
        <erd-collapse
          :title="$t('editor.assign-tv-guide')"
          key="assign-tv-guide"
          small
          v-if="activeGroupType == 1"
        >
          <ul class="list-unstyled mb-0">
            <li class="nav-item">
              <a href="#" @click.prevent="assignTVGIDModal(true)"
                ><i class="las la-th-list mr-1"></i
                >{{ $t("editor.assign-tvg-ids") }}</a
              >
            </li>
          </ul>
        </erd-collapse>
      </div>
    </erd-app-menu>
    <erd-row class="m-0 p-0" v-if="playlistSelected">
      <!--  

        GROUPS

      -->
      <erd-col xl="4" lg="4" md="12" class="pr-lg-0">
        <div class="form-control">
          <span class="mr-1">{{ $t("xtream.groups") }}</span>
          <span class="font-weight-bold">{{ filteredGroups.length }}</span>
        </div>
        <erd-context-menu
          :items="groupContextMenu"
          depth="1"
          ref="context-group"
        ></erd-context-menu>
        <div @contextmenu.prevent="openContext('context-group')">
          <draggable
            v-model="playlistEditor.groups"
            @start="dragGroup = true"
            @end="dragGroup = false"
            @change="groupDragChanged"
            animation="200"
            group="groups"
            ghost-class="ghost"
            scroll-sensitivity="200"
            selected-class="selected"
            handle=".handle"
            :force-fallback="true"
            :multi-drag="true"
          >
            <transition-group
              type="transition"
              :name="!dragGroup ? 'flip-list' : null"
            >
              <div
                class="form-control editor-group"
                :class="{
                  selected: activeGroups.includes(group.id),
                  active: activeGroup === group.id,
                  hidden: group.group_is_hidden,
                }"
                v-for="(group, index) in filteredGroups"
                :key="`group-${index}`"
                @click.ctrl="toggleGroupSelection(group.id)"
                @click.shift="selectGroupRangeSelection(group.id)"
                @click.exact="selectGroupSelection(group.id)"
                @dblclick="groupDoubleClick"
              >
                <i class="las la-braille handle mr-2"></i>
                <a href="#" @click.prevent="activeGroup = group.id">{{
                  group.group_name
                }}</a>
                <span class="text-muted text-small ml-2">{{
                  $t(`category-type.${group.group_type}`)
                }}</span>
                <span class="float-right">{{ group.streams }}</span>
              </div>
            </transition-group>
          </draggable>
        </div>
      </erd-col>
      <!--  

        STREAMS

      -->
      <erd-col xl="8" lg="8" md="12">
        <div class="form-control">
          <span class="mr-1">{{ $t("xtream.streams") }}</span>
          <span class="font-weight-bold">{{ filteredStreams.length }}</span>
        </div>
        <erd-context-menu
          :items="streamContextMenu"
          depth="1"
          ref="context-stream"
        ></erd-context-menu>
        <!-- LIVE -->
        <template v-if="activeGroupType === 1 && !isLoading">
          <div @contextmenu.prevent="openContext('context-stream')">
            <draggable
              v-model="playlistEditor.streams"
              @start="dragStream = true"
              @end="dragStream = false"
              @change="streamDragChanged"
              animation="200"
              group="streams"
              ghost-class="ghost"
              scroll-sensitivity="200"
              selected-class="selected"
              handle=".handle"
              :force-fallback="true"
              :multi-drag="true"
            >
              <transition-group
                type="transition"
                :name="!dragStream ? 'flip-list' : null"
              >
                <div
                  class="form-control editor-stream"
                  :class="{
                    selected: activeStreams.includes(stream.id),
                    active: activeStream === stream.id,
                    hidden: stream.stream_is_hidden,
                  }"
                  v-for="(stream, index) in filteredStreams"
                  :key="`stream-${index}-${stream.id}`"
                  @click.ctrl="toggleStreamSelection(stream.id)"
                  @click.shift="selectStreamRangeSelection(stream.id)"
                  @click.exact="selectStreamSelection(stream.id)"
                  @dblclick="streamDoubleClick"
                >
                  <i class="las la-braille handle mr-2"></i>
                  <span class="mr-2">{{ stream.stream_tvg_name }}</span>
                  <span class="text-muted">{{ stream.stream_tvg_id }}</span>
                  <i class="ml-2 las la-music" v-if="stream.stream_radio"></i>
                  <img
                    class="stream-icon"
                    v-if="stream.stream_tvg_logo"
                    :src="stream.stream_tvg_logo"
                  />
                </div>
              </transition-group>
            </draggable>
          </div>
        </template>
        <!-- MOVIES -->
        <template v-if="activeGroupType === 2 && !isLoading">
          <div @contextmenu.prevent="openContext('context-stream')">
            <draggable
              v-model="playlistEditor.streams"
              @start="dragStream = true"
              @end="dragStream = false"
              @change="streamDragChanged"
              animation="200"
              group="streams"
              ghost-class="ghost"
              scroll-sensitivity="200"
              selected-class="selected"
              handle=".handle"
              :force-fallback="true"
              :multi-drag="true"
            >
              <transition-group
                type="transition"
                :name="!dragStream ? 'flip-list' : null"
              >
                <div
                  class="form-control editor-stream"
                  :class="{
                    selected: activeStreams.includes(stream.id),
                    active: activeStream === stream.id,
                    hidden: stream.stream_is_hidden,
                    success: stream.sync_is_new,
                    danger: stream.sync_is_removed,
                  }"
                  v-for="(stream, index) in filteredStreams"
                  :key="`stream-${index}`"
                  @click.ctrl="toggleStreamSelection(stream.id)"
                  @click.shift="selectStreamRangeSelection(stream.id)"
                  @click.exact="selectStreamSelection(stream.id)"
                  @dblclick="streamDoubleClick"
                >
                  <i class="las la-braille handle mr-2"></i>
                  <span class="mr-2">{{
                    stream.movie_name && stream.movie_name.length
                      ? stream.movie_name
                      : stream.stream_tvg_name
                  }}</span>
                  <span class="text-muted">{{ stream.movie_year }}</span>
                </div>
              </transition-group>
            </draggable>
          </div>
        </template>
        <!-- SERIES -->
        <template v-if="activeGroupType === 3 && !isLoading">
          <div @contextmenu.prevent="openContext('context-stream')">
            <draggable
              v-model="playlistEditor.streams"
              @start="dragStream = true"
              @end="dragStream = false"
              @change="streamDragChanged"
              animation="200"
              group="streams"
              ghost-class="ghost"
              scroll-sensitivity="200"
              selected-class="selected"
              handle=".handle"
              :force-fallback="true"
              :multi-drag="true"
            >
              <transition-group
                type="transition"
                :name="!dragStream ? 'flip-list' : null"
              >
                <div
                  class="form-control editor-stream"
                  :class="{
                    selected: activeStreams.includes(stream.id),
                    active: activeStream === stream.id,
                    hidden: stream.stream_is_hidden,
                    success: stream.sync_is_new,
                    danger: stream.sync_is_removed,
                  }"
                  v-for="(stream, index) in filteredStreams"
                  :key="`stream-${index}`"
                  @click.ctrl="toggleStreamSelection(stream.id)"
                  @click.shift="selectStreamRangeSelection(stream.id)"
                  @click.exact="selectStreamSelection(stream.id)"
                  @dblclick="streamDoubleClick"
                >
                  <i class="las la-braille handle mr-2"></i>
                  <span class="mr-2">{{
                    stream.serie_name && stream.serie_name.length
                      ? stream.serie_name
                      : stream.stream_tvg_name
                  }}</span>
                  <span class="text-muted mr-1">{{
                    $t("editor.season").format(stream.serie_season)
                  }}</span>
                  <span class="text-muted">{{
                    $t("editor.episode").format(stream.serie_episode)
                  }}</span>
                </div>
              </transition-group>
            </draggable>
          </div>
        </template>
      </erd-col>
    </erd-row>
  </erd-row>
</template>

<script>
/* eslint-disable vue/no-side-effects-in-computed-properties */
/* eslint-disable no-unused-vars */
/* eslint-disable no-useless-escape */

import { EventBus } from "../../../services/ebus";
import { httpService } from "../../../services/http";
import { mapGetters } from "vuex";
import draggable from "vuedraggable";
import { SubscriptionType } from "../../../constants/config";
import { countries } from "../../../helpers";
import { m3u } from "../../../plugins/m3u";

export default {
  components: {
    draggable,
  },
  data() {
    return {
      countries,
      activeTab: 0,
      activeGroup: -1,
      activeGroups: [],
      activeStream: -1,
      activeStreams: [],
      dragGroup: false,
      dragStream: false,
      editor: false,
      search: null,
      isLoading: false,
      playlistEditor: {
        id: undefined,
        playlist: null,
        groups: [],
        streams: [],
        changed: false,
      },
      findReplace: {
        type: 0,
        modal: false,
        from: "",
        to: "",
        replaceAll: false,
        ignoreCase: false,
        selectedOnly: 0,
      },
      prefixSuffix: {
        type: 0,
        modal: false,
        prefix: "",
        suffix: "",
        selectedOnly: 0,
      },
      convertCase: {
        type: 0,
        modal: false,
        method: 0,
        selectedOnly: 0,
      },
      groupEditor: {
        modal: false,
        id: 0,
        group_name: "",
        group_parent_code: "",
        group_type: 1,
        group_is_hidden: 0,
      },
      streamEditor: {
        modal: false,
        id: -1,
        stream_tvg_name: "",
        stream_tvg_id: "",
        stream_tvg_logo: "",
        stream_parent_code: "",
        stream_radio: 0,
        stream_is_hidden: 0,
        stream_is_custom: 0,
        movie_name: "",
        movie_year: "",
        serie_name: "",
        serie_season: 0,
        serie_episode: 0,
        source_stream_url: "",
      },
      radioBrowser: {
        isLoading: false,
        modal: false,
        bounce: null,
        active: [],
        search: "",
        results: [],
      },
      soundcloud: {
        isLoading: false,
        modal: false,
        bounce: null,
        url: "",
        track: null,
      },
      youtube: {
        isLoading: false,
        modal: false,
        bounce: null,
        url: "",
        videoId: "",
        video: null,
      },
      vimeo: {
        isLoading: false,
        modal: false,
        bounce: null,
        url: "",
        videoId: "",
        video: null,
      },
      dailymotion: {
        isLoading: false,
        modal: false,
        bounce: null,
        url: "",
        videoId: "",
        video: null,
      },
      tedTalks: {
        isLoading: false,
        modal: false,
        bounce: null,
        url: "",
        video: null,
      },
      xhamster: {
        isLoading: false,
        modal: false,
        bounce: null,
        url: "",
        video: null,
      },
      findLogo: {
        isLoading: false,
        modal: false,
        countries: [],
        country: "",
        logos: [],
        logo: "",
        search: "",
        title: "",
      },
      assignLogo: {
        isLoading: false,
        modal: false,
        countries: [],
        country: "",
        logos: [],
        assignAll: 0,
      },
      importM3U: {
        isLoading: false,
        modal: false,
        groups: [],
        importGroups: [],
        m3u: null,
        file: null,
      },
      findTVGID: {
        isLoading: false,
        modal: false,
        countries: [],
        country: "",
        channels: [],
        channel: "",
        search: "",
        title: "",
      },
      assignTVGID: {
        isLoading: false,
        modal: false,
        countries: [],
        country: "",
        channels: [],
        assignAll: 0,
      },
      saveChanges: {
        modal: false,
      },
      groupTypes: [
        { text: this.$t("xtream.live"), value: 1 },
        { text: this.$t("xtream.movies"), value: 2 },
        { text: this.$t("xtream.series"), value: 3 },
      ],
    };
  },
  computed: {
    ...mapGetters([
      "currentUser",
      "settings",
      "soundcloudClientId",
      "movieSeriePlaylist",
    ]),
    searchFiltered() {
      if (this.search === null) {
        return this.accounts;
      } else {
        var re = new RegExp(this.search, "i");
        return this.accounts.filter((account) => {
          return (
            String(account.title).match(re) ||
            String(account.host).match(re) ||
            String(account.port).match(re) ||
            String(account.username).match(re) ||
            String(account.password).match(re) ||
            this.formatDate(account.synced_at).match(re) ||
            this.$t(`sync-interval.${account.sync_interval}`).match(re)
          );
        });
      }
    },
    playlistSelected() {
      return this.playlistEditor.id !== undefined;
    },
    lastSelectedGroup() {
      return this.activeGroups[this.activeGroups.length - 1];
    },
    lastSelectedStream() {
      return this.activeStreams[this.activeStreams.length - 1];
    },
    canEditGroupType() {
      return (
        this.groupEditor.id &&
        this.getGroupWithId(this.groupEditor.id).streams == 0
      );
    },
    subscriptionLimited() {
      return (
        this.currentUser.subscription &&
        this.currentUser.subscription.subscription_type ==
          SubscriptionType.Enthusiast
      );
    },
    filteredGroups() {
      if (this.subscriptionLimited) {
        return this.playlistEditor.groups.filter(
          (group) =>
            group.group_is_removed !== 1 &&
            group.source_group_type == 1 &&
            group.group_type == 1
        );
      }
      return this.playlistEditor.groups.filter(
        (group) => group.group_is_removed !== 1
      );
    },
    filteredStreams() {
      return this.playlistEditor.streams.filter(
        (group) => group.stream_is_removed !== 1
      );
    },
    activeGroupType() {
      let index = this.playlistEditor.groups.findIndex(
        (group) => group.id == this.activeGroup
      );
      return index > -1 ? this.playlistEditor.groups[index].group_type : 0;
    },
    filteredLogos() {
      if (!this.findLogo.search.length) {
        return this.findLogo.logos;
      }
      let selectedStream = this.getStreamWithId(this.activeStreams[0]);
      let re = new RegExp(this.findLogo.search, "i");
      return this.findLogo.logos.filter((logo) => {
        return logo.text.match(re);
      });
    },
    filteredTVGIDS() {
      if (!this.findTVGID.search.length) {
        return this.findTVGID.channels;
      }
      let selectedStream = this.getStreamWithId(this.activeStreams[0]);
      let re = new RegExp(this.findTVGID.search, "i");
      return this.findTVGID.channels.filter((channel) => {
        return channel.text.match(re);
      });
    },
    groupContextMenu() {
      let vm = this;
      return [
        {
          icon: "la-plus",
          text: vm.$t("editor.add-group"),
          onClick: vm.addGroup,
        },
        {
          disabled: vm.activeGroups.length !== 1,
          icon: "la-edit",
          text: vm.$t("editor.edit-group"),
          onClick: function () {
            if (vm.activeGroups.length === 1) {
              vm.editGroupModal(true);
            }
          },
        },
        {
          divider: true,
        },
        {
          text: vm.$t("general.select-all"),
          onClick: function () {
            vm.activeGroups = [...vm.playlistEditor.groups.map((g) => g.id)];
          },
        },
        {
          text: vm.$t("general.select-none"),
          onClick: function () {
            vm.activeGroups = [];
          },
        },
        {
          divider: true,
        },
        {
          icon: "la-search",
          text: vm.$t("editor.find-replace"),
          onClick: function () {
            vm.findAndReplaceModal(true, 1);
          },
        },
        {
          icon: "la-pen",
          text: vm.$t("editor.add-prefix-suffix"),
          onClick: function () {
            vm.prefixSuffixModal(true, 1);
          },
        },
        {
          icon: "la-font",
          text: vm.$t("editor.change-case"),
          onClick: function () {
            vm.convertCaseModal(true, 1);
          },
        },
        {
          divider: true,
        },
        {
          disabled: vm.activeGroups.length === 0,
          icon: "la-eye",
          text: vm.$t("editor.toggle-visibility"),
          onClick: function () {
            if (vm.activeGroups.length) {
              vm.toggleGroupVisibility();
            }
          },
        },
        {
          disabled: vm.activeGroups.length === 0,
          icon: "la-trash",
          text: vm.$t("editor.delete"),
          onClick: function () {
            if (vm.activeGroups.length) {
              vm.deleteSelectedGroups();
            }
          },
        },
      ];
    },
    streamContextMenu() {
      let vm = this;
      return [
        {
          icon: "la-plus",
          text: vm.$t("editor.add-stream"),
          onClick: vm.addStream,
        },
        {
          disabled: vm.activeStreams.length !== 1,
          icon: "la-edit",
          text: vm.$t("editor.edit-stream"),
          onClick: function () {
            if (vm.activeStreams.length === 1) {
              vm.editStreamModal(true);
            }
          },
        },
        {
          divider: true,
        },
        {
          text: vm.$t("general.select-all"),
          onClick: function () {
            vm.activeStreams = [...vm.playlistEditor.streams.map((g) => g.id)];
          },
        },
        {
          text: vm.$t("general.select-none"),
          onClick: function () {
            vm.activeStreams = [];
          },
        },
        {
          divider: true,
        },
        {
          disabled:
            vm.activeGroups.length !== 1 ||
            vm.activeStreams.length === 0 ||
            vm.getGroupWithId(vm.activeGroups[0]).group_type !==
              vm.activeGroupType ||
            vm.activeGroups[0] === vm.activeGroup,
          icon: "la-chevron-left",
          text: vm.$t("editor.move-to-selected-group"),
          onClick: function () {
            vm.moveToSelectedGroup();
          },
        },
        {
          divider: true,
        },
        {
          icon: "la-search",
          text: vm.$t("editor.find-replace"),
          onClick: function () {
            vm.findAndReplaceModal(true, 2);
          },
        },
        {
          icon: "la-pen",
          text: vm.$t("editor.add-prefix-suffix"),
          onClick: function () {
            vm.prefixSuffixModal(true, 2);
          },
        },
        {
          icon: "la-font",
          text: vm.$t("editor.change-case"),
          onClick: function () {
            vm.convertCaseModal(true, 2);
          },
        },
        {
          divider: true,
        },
        {
          disabled: vm.activeStreams.length !== 1 || vm.activeGroupType !== 1,
          icon: "la-photo-video",
          text: vm.$t("editor.find-logo"),
          onClick: function () {
            vm.findLogoModal(true);
          },
        },
        {
          disabled: vm.activeStreams.length !== 1 || vm.activeGroupType !== 1,
          icon: "la-th-list",
          text: vm.$t("editor.find-tv-guide"),
          onClick: function () {
            vm.findTVGIDModal(true);
          },
        },
        {
          divider: true,
        },
        {
          disabled: vm.activeStreams.length === 0 || vm.activeGroupType !== 1,
          icon: "la-music",
          text: vm.$t("editor.toggle-radio"),
          onClick: function () {
            if (vm.activeStreams.length && vm.activeGroupType == 1) {
              vm.toggleStreamRadio();
            }
          },
        },
        {
          disabled: vm.activeStreams.length === 0,
          icon: "la-eye",
          text: vm.$t("editor.toggle-visibility"),
          onClick: function () {
            if (vm.activeStreams.length) {
              vm.toggleStreamVisibility();
            }
          },
        },
        {
          divider: true,
        },
        {
          disabled: vm.activeStreams.length === 0,
          icon: "la-trash",
          text: vm.$t("editor.delete"),
          onClick: function () {
            if (vm.activeStreams.length) {
              vm.deleteSelectedStreams();
            }
          },
        },
      ];
    },
  },
  methods: {
    groupDragChanged(g) {
      for (let i = 0; i < this.playlistEditor.groups.length; i++) {
        if (this.playlistEditor.groups[i].group_order != i + 1) {
          this.playlistEditor.groups[i].group_order = i + 1;
          this.playlistEditor.groups[i].modified = true;
        }
      }
    },
    streamDragChanged(g) {
      for (let i = 0; i < this.playlistEditor.streams.length; i++) {
        if (this.playlistEditor.streams[i].stream_order != i + 1) {
          this.playlistEditor.streams[i].stream_order = i + 1;
          this.playlistEditor.streams[i].modified = true;
        }
      }
    },
    openContext(context) {
      this.$refs[context].open();
    },
    searchEditor(search) {
      if (search.length === 0) {
        this.search = null;
      } else {
        this.search = search;
      }
    },
    printEditor() {
      document.getElementById("editor").print();
    },
    formatNumber(number) {
      return new Intl.NumberFormat(this.$t("date.locale")).format(number);
    },
    formatDate(date) {
      return new Date(date).toLocaleString(
        this.$t("date.locale"),
        this.dateOptions
      );
    },
    formatDateYoutube(date) {
      return new Date(date).toLocaleDateString(this.$t("date.locale"), {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    },
    formatSeconds(sec) {
      var d = Number(sec);
      var h = Math.floor(d / 3600);
      var m = Math.floor((d % 3600) / 60);
      var s = Math.floor((d % 3600) % 60);

      var hour = this.$t("general.hour");
      var hours = this.$t("general.hours");
      var minute = this.$t("general.minute");
      var minutes = this.$t("general.minutes");
      var second = this.$t("general.second");
      var seconds = this.$t("general.seconds");

      var hDisplay = h > 0 ? h + (h == 1 ? ` ${hour} ` : ` ${hours} `) : "";
      var mDisplay = m > 0 ? m + (m == 1 ? ` ${minute} ` : ` ${minutes} `) : "";
      var sDisplay = s > 0 ? s + (s == 1 ? ` ${second} ` : ` ${seconds} `) : "";
      return hDisplay + mDisplay + sDisplay;
    },

    getGroupWithId(id) {
      let index = this.playlistEditor.groups.findIndex(
        (group) => group.id == id
      );
      return this.playlistEditor.groups[index];
    },
    getStreamWithId(id) {
      let index = this.playlistEditor.streams.findIndex(
        (stream) => stream.id == id
      );
      return this.playlistEditor.streams[index];
    },
    doSave() {
      this.isLoading = true;
      this.playlistEditor.changed = false;
      return new Promise((resolve) => {
        let index = this.playlistEditor.groups.findIndex((group) => {
          return group.id == this.activeGroup;
        });
        let updateGroups = this.playlistEditor.groups
          .filter((group) => !group.group_is_removed && group.modified)
          .map((group) => {
            return {
              id: group.id,
              group_name: group.group_name,
              group_order: group.group_order,
              group_type: group.group_type,
              group_parent_code: group.group_parent_code,
              group_is_hidden: group.group_is_hidden,
            };
          });
        let deleteGroups = this.playlistEditor.groups
          .filter((group) => group.group_is_removed && group.modified)
          .map((group) => group.id)
          .join();

        let updateStreams;
        switch (this.activeGroupType) {
          // Live streams
          case 1:
            updateStreams = this.playlistEditor.streams
              .filter(
                (stream) => stream.stream_is_removed !== 1 && stream.modified
              )
              .map((stream) => {
                return {
                  id: stream.id,
                  source_stream_url: stream.source_stream_url,
                  stream_tvg_name: stream.stream_tvg_name,
                  stream_tvg_id: stream.stream_tvg_id,
                  stream_tvg_logo: stream.stream_tvg_logo,
                  stream_parent_code: stream.stream_parent_code,
                  stream_radio: stream.stream_radio,
                  stream_is_hidden: stream.stream_is_hidden,
                  stream_order: stream.stream_order,
                };
              });
            break;
          // Movies
          case 2:
            updateStreams = this.playlistEditor.streams
              .filter(
                (stream) => stream.stream_is_removed !== 1 && stream.modified
              )
              .map((stream) => {
                return {
                  id: stream.id,
                  source_stream_url: stream.source_stream_url,
                  movie_name: stream.movie_name,
                  movie_year: stream.movie_year,
                  tmdb_id: stream.tmdb_id,
                  stream_tvg_logo: stream.stream_tvg_logo,
                  stream_is_hidden: stream.stream_is_hidden,
                  stream_order: stream.stream_order,
                };
              });
            break;
          // Series
          case 3:
            updateStreams = this.playlistEditor.streams
              .filter(
                (stream) => stream.stream_is_removed !== 1 && stream.modified
              )
              .map((stream) => {
                return {
                  id: stream.id,
                  source_stream_url: stream.source_stream_url,
                  serie_name: stream.serie_name,
                  serie_season: stream.serie_season,
                  serie_episode: stream.serie_episode,
                  tmdb_id: stream.tmdb_id,
                  stream_tvg_logo: stream.stream_tvg_logo,
                  stream_is_hidden: stream.stream_is_hidden,
                  stream_order: stream.stream_order,
                };
              });
            break;
        }
        let deleteStreams = this.playlistEditor.streams
          .filter((stream) => stream.stream_is_removed === 1 && stream.modified)
          .map((stream) => stream.id)
          .join();

        let requests = [];
        if (updateGroups.length) {
          requests.push(
            httpService.post("editor/update-groups", {
              playlist_id: this.playlistEditor.id,
              groups: updateGroups,
            })
          );
        }
        if (deleteGroups.length) {
          index = 0;
          requests.push(
            httpService.post("editor/delete-groups", {
              playlist_id: this.playlistEditor.id,
              groups: deleteGroups,
            })
          );
        }
        if (updateStreams.length) {
          requests.push(
            httpService.post(`editor/update-streams/${this.activeGroupType}`, {
              playlist_id: this.playlistEditor.id,
              streams: updateStreams,
            })
          );
        }
        if (deleteStreams.length) {
          requests.push(
            httpService.post(`editor/delete-streams/${this.activeGroupType}`, {
              playlist_id: this.playlistEditor.id,
              streams: deleteStreams,
            })
          );
        }
        Promise.all(requests).then((res) => {
          this.loadPlaylist(this.playlistEditor.id, index);
          resolve(res);
        });
      });
    },
    doCancel() {
      this.isLoading = true;
      Promise.all([this.restoreGroups(), this.restoreStreams()]).then(() => {
        this.playlistEditor.changed = false;
        this.isLoading = false;
      });
    },
    doTabChange(tab) {
      this.activeTab = tab;
    },
    updateGroupOrder(source) {
      return new Promise((resolve) => {
        let groups = [...source];
        for (let i = 0; i < groups.length; i++) {
          groups[i].source_group_order = i + 1;
          groups[i].group_order = i + 1;
        }
        resolve(groups);
      });
    },
    updateStreamOrder(source) {
      return new Promise((resolve) => {
        let streams = [...source];
        for (let i = 0; i < streams.length; i++) {
          streams[i].source_stream_order = i + 1;
          streams[i].stream_order = i + 1;
        }
        resolve(streams);
      });
    },
    restoreGroupOrder() {
      return new Promise((resolve) => {
        this.playlistEditor.groups.sort((a, b) =>
          a.source_group_order > b.source_group_order
            ? 1
            : b.source_group_order > a.source_group_order
            ? -1
            : 0
        );
        resolve();
      });
    },
    restoreStreamOrder() {
      return new Promise((resolve) => {
        this.playlistEditor.streams.sort((a, b) =>
          a.source_stream_order > b.source_stream_order
            ? 1
            : b.source_stream_order > a.source_stream_order
            ? -1
            : 0
        );
        resolve();
      });
    },
    restoreGroups() {
      return new Promise((resolve) => {
        this.restoreGroupOrder().then(() => {
          let group;
          for (let i = 0; i < this.playlistEditor.groups.length; i++) {
            group = this.playlistEditor.groups[i];
            group.modified = false;
            group.group_is_removed = 0;
            group.group_type = group.source_group_type;
            group.group_name = group.source_group_name;
            group.parent_code = group.source_group_parent_code;
            group.group_is_hidden = group.source_group_is_hidden;
          }
          resolve();
        });
      });
    },
    restoreStreams() {
      return new Promise((resolve) => {
        this.restoreStreamOrder().then(() => {
          let stream;
          for (let i = 0; i < this.playlistEditor.streams.length; i++) {
            stream = this.playlistEditor.streams[i];
            stream.modified = false;
            stream.stream_is_removed = 0;
            stream.stream_tvg_name = stream.source_stream_tvg_name;
            stream.stream_tvg_id = stream.source_stream_tvg_id;
            stream.stream_tvg_logo = stream.source_stream_tvg_logo;
            stream.stream_tvg_chno = stream.source_stream_tvg_chno;
            stream.stream_tvg_shift = stream.source_stream_tvg_shift;
            stream.stream_parent_code = stream.source_stream_parent_code;
            stream.stream_audio_track = stream.source_stream_audio_track;
            stream.stream_aspect_ratio = stream.source_stream_aspect_ratio;
            stream.stream_radio = stream.source_stream_radio;
            stream.stream_order = stream.source_stream_order;
            stream.stream_is_hidden = stream.source_stream_is_hidden;
            if (
              stream.movie_name !== undefined &&
              stream.movie_year !== undefined
            ) {
              stream.movie_name = stream.source_movie_name;
              stream.movie_year = stream.source_movie_year;
            }
            if (
              stream.serie_name !== undefined &&
              stream.serie_season !== undefined &&
              stream.serie_episode !== undefined
            ) {
              stream.serie_name = stream.source_serie_name;
              stream.serie_season = stream.source_serie_season;
              stream.serie_episode = stream.source_serie_episode;
            }
          }
          resolve();
        });
      });
    },
    toggleGroupVisibility() {
      for (let i = 0; i < this.playlistEditor.groups.length; i++) {
        if (this.activeGroups.includes(this.playlistEditor.groups[i].id)) {
          this.playlistEditor.groups[i].group_is_hidden =
            !this.playlistEditor.groups[i].group_is_hidden;
          this.playlistEditor.groups[i].modified = true;
        }
      }
      this.playlistEditor.changed = true;
    },
    toggleStreamVisibility() {
      for (let i = 0; i < this.playlistEditor.streams.length; i++) {
        if (this.activeStreams.includes(this.playlistEditor.streams[i].id)) {
          this.playlistEditor.streams[i].stream_is_hidden =
            !this.playlistEditor.streams[i].stream_is_hidden;
          this.playlistEditor.streams[i].modified = true;
        }
      }
      this.playlistEditor.changed = true;
    },
    toggleStreamRadio() {
      for (let i = 0; i < this.playlistEditor.streams.length; i++) {
        if (this.activeStreams.includes(this.playlistEditor.streams[i].id)) {
          if (this.playlistEditor.streams[i].stream_radio == 0) {
            this.playlistEditor.streams[i].stream_radio = 1;
          } else {
            this.playlistEditor.streams[i].stream_radio = 0;
          }
          this.playlistEditor.streams[i].modified = true;
        }
      }
      this.playlistEditor.changed = true;
    },
    deleteSelectedGroups() {
      for (let i = 0; i < this.playlistEditor.groups.length; i++) {
        if (this.activeGroups.includes(this.playlistEditor.groups[i].id)) {
          this.playlistEditor.groups[i].group_is_removed = 1;
          this.playlistEditor.groups[i].modified = true;
        }
      }
      this.playlistEditor.changed = true;
    },
    deleteSelectedStreams() {
      for (let i = 0; i < this.playlistEditor.streams.length; i++) {
        if (this.activeStreams.includes(this.playlistEditor.streams[i].id)) {
          this.playlistEditor.streams[i].stream_is_removed = 1;
          this.playlistEditor.streams[i].modified = true;
        }
      }
      this.playlistEditor.changed = true;
    },
    loadPlaylist(val, group_index = undefined) {
      this.isLoading = true;
      if (this.playlistEditor.changed) {
        this.doSave();
      }
      this.playlistEditor.id = val;
      httpService
        .get(`editor/groups/${val}`)
        .then((res) => {
          if (res.status === true) {
            this.updateGroupOrder(res.data).then((groups) => {
              this.playlistEditor.groups = groups.map((group) => {
                const grp = Object.assign({}, group);
                grp.source_group_parent_code = group.group_parent_code;
                grp.source_group_is_hidden = group.group_is_hidden;
                grp.source_group_name = group.group_name;
                grp.source_group_type = group.group_type;
                grp.group_is_removed = false;
                grp.modified = false;
                return grp;
              });
              if (groups.length) {
                if (group_index === undefined) {
                  this.activeGroup = this.playlistEditor.groups[0].id;
                } else {
                  this.activeGroup = this.playlistEditor.groups[group_index].id;
                  this.loadStreams();
                }
              }
            });
          }
          this.isLoading = false;
        })
        .catch(() => {
          this.isLoading = false;
        });
    },
    toggleGroupSelection(item) {
      let idx = this.activeGroups.indexOf(item);
      if (idx !== -1) {
        this.activeGroups.splice(idx, 1);
      } else {
        this.activeGroups.push(item);
      }
    },
    toggleStreamSelection(item) {
      let idx = this.activeStreams.indexOf(item);
      if (idx !== -1) {
        this.activeStreams.splice(idx, 1);
      } else {
        this.activeStreams.push(item);
      }
    },
    toggleRadiobrowserSelection(item) {
      let idx = this.radioBrowser.active.indexOf(item);
      if (idx !== -1) {
        this.radioBrowser.active.splice(idx, 1);
      } else {
        this.radioBrowser.active.push(item);
      }
    },
    toggleImportM3USelection(item) {
      let idx = this.importM3U.importGroups.indexOf(item);
      if (idx !== -1) {
        this.importM3U.importGroups.splice(idx, 1);
      } else {
        this.importM3U.importGroups.push(item);
      }
    },
    indexOfGroup(group) {
      return this.playlistEditor.groups.map((g) => g.id).indexOf(group);
    },
    selectGroupRangeSelection(item) {
      const lastIndex = this.indexOfGroup(this.lastSelectedGroup);
      const itemIndex = this.indexOfGroup(item);
      const dir = itemIndex > lastIndex ? 1 : -1;
      for (let i = lastIndex; i != itemIndex + dir; i += dir) {
        if (!this.activeGroups.includes(this.playlistEditor.groups[i].id)) {
          this.activeGroups.push(this.playlistEditor.groups[i].id);
        }
      }
    },
    indexOfStream(stream) {
      return this.playlistEditor.streams.map((g) => g.id).indexOf(stream);
    },
    selectStreamRangeSelection(item) {
      const lastIndex = this.indexOfStream(this.lastSelectedStream);
      const itemIndex = this.indexOfStream(item);
      const dir = itemIndex > lastIndex ? 1 : -1;
      for (let i = lastIndex; i != itemIndex + dir; i += dir) {
        if (!this.activeStreams.includes(this.playlistEditor.streams[i].id)) {
          this.activeStreams.push(this.playlistEditor.streams[i].id);
        }
      }
    },
    selectRadiobrowserRangeSelection(index) {
      const lastIndex =
        this.radioBrowser.active[this.radioBrowser.active.length - 1];
      const dir = index > lastIndex ? 1 : -1;
      for (let i = lastIndex; i != index + dir; i += dir) {
        if (!this.radioBrowser.active.includes(i)) {
          this.radioBrowser.active.push(i);
        }
      }
    },
    selectImportM3URangeSelection(index) {
      const lastIndex =
        this.importM3U.importGroups[this.importM3U.importGroups.length - 1];
      const dir = index > lastIndex ? 1 : -1;
      for (let i = lastIndex; i != index + dir; i += dir) {
        if (!this.importM3U.importGroups.includes(i)) {
          this.importM3U.importGroups.push(i);
        }
      }
    },
    selectGroupSelection(item) {
      this.activeGroups.length = 0;
      this.activeGroups.push(item);
    },
    selectStreamSelection(item) {
      this.activeStreams.length = 0;
      this.activeStreams.push(item);
    },
    selectRadiobrowserSelection(item) {
      this.radioBrowser.active.length = 0;
      this.radioBrowser.active.push(item);
    },
    selectImportM3USelection(item) {
      this.importM3U.importGroups.length = 0;
      this.importM3U.importGroups.push(item);
    },
    findAndReplaceModal(show, type = 1) {
      this.findReplace.type = type;
      this.findReplace.modal = show;
    },
    findAndReplace() {
      let options = "";
      if (this.findReplace.replaceAll) {
        options += "g";
      }
      if (this.findReplace.ignoreCase) {
        options += "i";
      }
      let re = new RegExp(this.findReplace.from.replace("|", "\\|"), options);
      switch (parseInt(this.findReplace.type)) {
        // Group
        case 1:
          if (parseInt(this.findReplace.selectedOnly) === 1) {
            for (let i = 0; i < this.playlistEditor.groups.length; i++) {
              if (
                this.activeGroups.includes(this.playlistEditor.groups[i].id)
              ) {
                this.playlistEditor.groups[i].modified = true;
                this.playlistEditor.groups[i].group_name =
                  this.playlistEditor.groups[i].group_name.replace(
                    re,
                    this.findReplace.to
                  );
              }
            }
          } else {
            this.filteredGroups.map((group) => {
              group.modified = true;
              group.group_name = group.group_name.replace(
                re,
                this.findReplace.to
              );
            });
          }
          break;

        // Streams
        case 2:
          if (parseInt(this.findReplace.selectedOnly) === 1) {
            for (let i = 0; i < this.playlistEditor.streams.length; i++) {
              if (
                this.activeStreams.includes(this.playlistEditor.streams[i].id)
              ) {
                if (this.activeGroupType === 1) {
                  this.playlistEditor.streams[i].modified = true;
                  this.playlistEditor.streams[i].stream_tvg_name =
                    this.playlistEditor.streams[i].stream_tvg_name.replace(
                      re,
                      this.findReplace.to
                    );
                }
                if (this.activeGroupType === 2) {
                  this.playlistEditor.streams[i].modified = true;
                  this.playlistEditor.streams[i].movie_name =
                    this.playlistEditor.streams[i].movie_name.replace(
                      re,
                      this.findReplace.to
                    );
                }
                if (this.activeGroupType === 3) {
                  this.playlistEditor.streams[i].modified = true;
                  this.playlistEditor.streams[i].serie_name =
                    this.playlistEditor.streams[i].serie_name.replace(
                      re,
                      this.findReplace.to
                    );
                }
              }
            }
          } else {
            this.filteredStreams.map((stream) => {
              if (this.activeGroupType === 1) {
                stream.modified = true;
                stream.stream_tvg_name = stream.stream_tvg_name.replace(
                  re,
                  this.findReplace.to
                );
              }
              if (this.activeGroupType === 2) {
                stream.modified = true;
                stream.movie_name = stream.movie_name.replace(
                  re,
                  this.findReplace.to
                );
              }
              if (this.activeGroupType === 3) {
                stream.modified = true;
                stream.serie_name = stream.serie_name.replace(
                  re,
                  this.findReplace.to
                );
              }
            });
          }
          break;
      }
      this.playlistEditor.changed = true;
      this.findReplace.modal = false;
    },
    prefixSuffixModal(show, type = 1) {
      this.prefixSuffix.type = type;
      this.prefixSuffix.modal = show;
    },
    addPrefixSuffix() {
      let prefix = this.prefixSuffix.prefix;
      let suffix = this.prefixSuffix.suffix;
      switch (parseInt(this.prefixSuffix.type)) {
        // Group
        case 1:
          if (parseInt(this.prefixSuffix.selectedOnly) === 1) {
            for (let i = 0; i < this.playlistEditor.groups.length; i++) {
              if (
                this.activeGroups.includes(this.playlistEditor.groups[i].id)
              ) {
                this.playlistEditor.groups[i].modified = true;
                this.playlistEditor.groups[i].group_name =
                  prefix + this.playlistEditor.groups[i].group_name + suffix;
              }
            }
          } else {
            this.filteredGroups.map((group) => {
              group.modified = true;
              group.group_name = prefix + group.group_name + suffix;
            });
          }
          break;

        // Stream
        case 2:
          if (parseInt(this.prefixSuffix.selectedOnly) === 1) {
            for (let i = 0; i < this.playlistEditor.streams.length; i++) {
              if (
                this.activeStreams.includes(this.playlistEditor.streams[i].id)
              ) {
                if (this.activeGroupType === 1) {
                  this.playlistEditor.streams[i].modified = true;
                  this.playlistEditor.streams[i].stream_tvg_name =
                    prefix +
                    this.playlistEditor.streams[i].stream_tvg_name +
                    suffix;
                }
                if (this.activeGroupType === 2) {
                  this.playlistEditor.streams[i].modified = true;
                  this.playlistEditor.streams[i].movie_name =
                    prefix + this.playlistEditor.streams[i].movie_name + suffix;
                }
                if (this.activeGroupType === 3) {
                  this.playlistEditor.streams[i].modified = true;
                  this.playlistEditor.streams[i].serie_name =
                    prefix + this.playlistEditor.streams[i].serie_name + suffix;
                }
              }
            }
          } else {
            if (this.activeGroupType === 1) {
              this.filteredStreams.map((stream) => {
                stream.modified = true;
                stream.stream_tvg_name =
                  prefix + stream.stream_tvg_name + suffix;
              });
            }
            if (this.activeGroupType === 2) {
              this.filteredStreams.map((stream) => {
                stream.modified = true;
                stream.movie_name = prefix + stream.movie_name + suffix;
              });
            }
            if (this.activeGroupType === 3) {
              this.filteredStreams.map((stream) => {
                stream.modified = true;
                stream.serie_name = prefix + stream.serie_name + suffix;
              });
            }
          }
          break;
      }
      this.playlistEditor.changed = true;
      this.prefixSuffix.modal = false;
    },
    convertCaseModal(show, type) {
      this.convertCase.type = type;
      this.convertCase.modal = show;
    },
    changeCase() {
      let method = this.convertCase.method;
      let groups;
      let streams;
      if (parseInt(this.convertCase.selectedOnly) === 1) {
        groups = this.filteredGroups.filter((group) => {
          return this.activeGroups.includes(group.id);
        });
        streams = this.filteredStreams.filter((stream) => {
          return this.activeStreams.includes(stream.id);
        });
      } else {
        groups = this.filteredGroups;
        streams = this.filteredStreams;
      }
      switch (parseInt(this.convertCase.type)) {
        // Categories
        case 1:
          groups.map((group) => {
            switch (parseInt(method)) {
              case 0:
                group.modified = true;
                group.group_name = group.group_name.titleCase();
                break;
              case 1:
                group.modified = true;
                group.group_name = group.group_name.toUpperCase();
                break;
              case 2:
                group.modified = true;
                group.group_name = group.group_name.toLowerCase();
                break;
            }
          });
          break;

        // Streams
        case 2:
          streams.map((stream) => {
            switch (parseInt(method)) {
              case 0:
                if (this.activeGroupType === 1) {
                  stream.modified = true;
                  stream.stream_tvg_name = stream.stream_tvg_name.titleCase();
                }
                if (this.activeGroupType === 2) {
                  stream.modified = true;
                  stream.movie_name = stream.movie_name.titleCase();
                }
                if (this.activeGroupType === 3) {
                  stream.modified = true;
                  stream.serie_name = stream.serie_name.titleCase();
                }
                break;
              case 1:
                if (this.activeGroupType === 1) {
                  stream.modified = true;
                  stream.stream_tvg_name = stream.stream_tvg_name.toUpperCase();
                }
                if (this.activeGroupType === 2) {
                  stream.modified = true;
                  stream.movie_name = stream.movie_name.toUpperCase();
                }
                if (this.activeGroupType === 3) {
                  stream.modified = true;
                  stream.serie_name = stream.serie_name.toUpperCase();
                }
                break;
              case 2:
                if (this.activeGroupType === 1) {
                  stream.modified = true;
                  stream.stream_tvg_name = stream.stream_tvg_name.toLowerCase();
                }
                if (this.activeGroupType === 2) {
                  stream.modified = true;
                  stream.movie_name = stream.movie_name.toLowerCase();
                }
                if (this.activeGroupType === 3) {
                  stream.modified = true;
                  stream.serie_name = stream.serie_name.toLowerCase();
                }
                break;
            }
          });
          break;
      }
      this.playlistEditor.changed = true;
      this.convertCase.modal = false;
    },
    editGroupModal(show) {
      let index = this.playlistEditor.groups.findIndex(
        (group) => group.id === this.activeGroups[0]
      );
      let group = this.playlistEditor.groups[index];
      if (group) {
        this.groupEditor.id = this.activeGroups[0];
        this.groupEditor.group_type = group.group_type;
        this.groupEditor.group_name = group.group_name;
        this.groupEditor.group_is_hidden = group.group_is_hidden;
        this.groupEditor.group_parent_code = group.group_parent_code;
        this.groupEditor.modal = show;
      }
    },
    editStreamModal(show) {
      let index = this.playlistEditor.streams.findIndex(
        (stream) => stream.id === this.activeStreams[0]
      );
      let stream = this.playlistEditor.streams[index];
      if (stream) {
        this.streamEditor.id = this.activeStreams[0];
        this.streamEditor.stream_tvg_name = stream.stream_tvg_name;
        this.streamEditor.stream_tvg_id = stream.stream_tvg_id;
        this.streamEditor.stream_tvg_logo = stream.stream_tvg_logo;
        this.streamEditor.stream_parent_code = stream.stream_parent_code;
        this.streamEditor.stream_radio = stream.stream_radio;
        this.streamEditor.stream_is_hidden = stream.stream_is_hidden;
        this.streamEditor.source_stream_url = stream.source_stream_url;
        this.streamEditor.stream_is_custom = stream.stream_is_custom;
        if (
          stream.movie_name !== undefined &&
          stream.movie_year !== undefined &&
          stream.tmdb_id !== undefined
        ) {
          this.streamEditor.movie_name = stream.movie_name;
          this.streamEditor.movie_year = stream.movie_year;
          this.streamEditor.tmdb_id = stream.tmdb_id;
        }
        if (
          stream.serie_name !== undefined &&
          stream.serie_season !== undefined &&
          stream.serie_episode !== undefined
        ) {
          this.streamEditor.serie_name = stream.serie_name;
          this.streamEditor.serie_season = stream.serie_season;
          this.streamEditor.serie_episode = stream.serie_episode;
        }
        this.streamEditor.modal = show;
      }
    },
    editGroup() {
      let index = this.playlistEditor.groups.findIndex(
        (group) => group.id === this.groupEditor.id
      );
      this.playlistEditor.groups[index].group_type =
        this.groupEditor.group_type;
      this.playlistEditor.groups[index].group_name =
        this.groupEditor.group_name;
      this.playlistEditor.groups[index].group_is_hidden =
        this.groupEditor.group_is_hidden;
      this.playlistEditor.groups[index].group_parent_code =
        this.groupEditor.group_parent_code;
      this.playlistEditor.groups[index].modified = true;
      this.playlistEditor.changed = true;
      this.groupEditor.modal = false;
    },
    editStream() {
      let index = this.playlistEditor.streams.findIndex(
        (stream) => stream.id === this.activeStreams[0]
      );
      this.playlistEditor.streams[index].stream_tvg_name =
        this.streamEditor.stream_tvg_name;
      this.playlistEditor.streams[index].stream_tvg_id =
        this.streamEditor.stream_tvg_id;
      this.playlistEditor.streams[index].stream_tvg_logo =
        this.streamEditor.stream_tvg_logo;
      this.playlistEditor.streams[index].stream_parent_code =
        this.streamEditor.stream_parent_code;
      this.playlistEditor.streams[index].stream_is_hidden =
        this.streamEditor.stream_is_hidden;
      this.playlistEditor.streams[index].stream_radio =
        this.streamEditor.stream_radio;
      this.playlistEditor.streams[index].source_stream_url =
        this.streamEditor.source_stream_url;
      if (
        this.playlistEditor.streams[index].movie_name !== undefined &&
        this.playlistEditor.streams[index].movie_year !== undefined &&
        this.playlistEditor.streams[index].tmdb_id !== undefined
      ) {
        this.playlistEditor.streams[index].movie_name =
          this.streamEditor.movie_name;
        this.playlistEditor.streams[index].movie_year =
          this.streamEditor.movie_year;
        this.playlistEditor.streams[index].tmdb_id = this.streamEditor.tmdb_id;
      }
      if (
        this.playlistEditor.streams[index].serie_name !== undefined &&
        this.playlistEditor.streams[index].serie_season !== undefined &&
        this.playlistEditor.streams[index].serie_episode !== undefined
      ) {
        this.playlistEditor.streams[index].serie_name =
          this.streamEditor.serie_name;
        this.playlistEditor.streams[index].serie_season =
          this.streamEditor.serie_season;
        this.playlistEditor.streams[index].serie_episode =
          this.streamEditor.serie_episode;
      }
      this.playlistEditor.streams[index].modified = true;
      this.playlistEditor.changed = true;
      this.streamEditor.modal = false;
    },
    sortGroupAlphaUp() {
      this.playlistEditor.groups = this.playlistEditor.groups.sort((a, b) =>
        b.group_name > a.group_name ? 1 : a.group_name > b.group_name ? -1 : 0
      );
      this.playlistEditor.groups.map((group) => (group.modified = true));
      this.playlistEditor.changed = true;
    },
    sortGroupAlphaDown() {
      this.playlistEditor.groups = this.playlistEditor.groups.sort((a, b) =>
        a.group_name > b.group_name ? 1 : b.group_name > a.group_name ? -1 : 0
      );
      this.playlistEditor.groups.map((group) => (group.modified = true));
      this.playlistEditor.changed = true;
    },
    sortGroupTypeUp() {
      this.playlistEditor.groups = this.playlistEditor.groups.sort((a, b) =>
        b.group_type > a.group_type ? 1 : a.group_type > b.group_type ? -1 : 0
      );
      this.playlistEditor.groups.map((group) => (group.modified = true));
      this.playlistEditor.changed = true;
    },
    sortGroupTypeDown() {
      this.playlistEditor.groups = this.playlistEditor.groups.sort((a, b) =>
        a.group_type > b.group_type ? 1 : b.group_type > a.group_type ? -1 : 0
      );
      this.playlistEditor.groups.map((group) => (group.modified = true));
      this.playlistEditor.changed = true;
    },
    sortStreamAlphaUp() {
      //ERNST HIER
      this.playlistEditor.streams = this.playlistEditor.streams.sort((a, b) => {
        switch (this.activeGroupType) {
          case 1:
            return b.stream_tvg_name > a.stream_tvg_name
              ? 1
              : a.stream_tvg_name > b.stream_tvg_name
              ? -1
              : 0;
          case 2:
            return b.movie_name > a.movie_name
              ? 1
              : a.movie_name > b.movie_name
              ? -1
              : 0;
          case 3:
            return b.serie_name > a.serie_name
              ? 1
              : a.serie_name > b.serie_name
              ? -1
              : 0;
        }
      });
      this.playlistEditor.streams.map((stream) => (stream.modified = true));
      this.playlistEditor.changed = true;
    },
    sortStreamAlphaDown() {
      this.playlistEditor.streams = this.playlistEditor.streams.sort((a, b) => {
        switch (this.activeGroupType) {
          case 1:
            return a.stream_tvg_name > b.stream_tvg_name
              ? 1
              : b.stream_tvg_name > a.stream_tvg_name
              ? -1
              : 0;
          case 2:
            return a.movie_name > b.movie_name
              ? 1
              : b.movie_name > a.movie_name
              ? -1
              : 0;
          case 3:
            return a.serie_name > b.serie_name
              ? 1
              : b.serie_name > a.serie_name
              ? -1
              : 0;
        }
      });
      this.playlistEditor.streams.map((stream) => (stream.modified = true));
      this.playlistEditor.changed = true;
    },
    sortStreamHiddenUp() {
      this.playlistEditor.streams = this.playlistEditor.streams.sort((a, b) =>
        b.stream_is_hidden > a.stream_is_hidden
          ? 1
          : a.stream_is_hidden > b.stream_is_hidden
          ? -1
          : 0
      );
      this.playlistEditor.streams.map((group) => (group.modified = true));
      this.playlistEditor.changed = true;
    },
    sortStreamHiddenDown() {
      this.playlistEditor.streams = this.playlistEditor.streams.sort((a, b) =>
        a.stream_is_hidden > b.stream_is_hidden
          ? 1
          : b.stream_is_hidden > a.stream_is_hidden
          ? -1
          : 0
      );
      this.playlistEditor.streams.map((group) => (group.modified = true));
      this.playlistEditor.changed = true;
    },
    addGroup() {
      this.isLoading = true;
      httpService
        .post("editor/add-group", { playlist_id: this.playlistEditor.id })
        .then((res) => {
          this.isLoading = false;
          if (res.status === true && res.data) {
            return new Promise((resolve) => {
              this.playlistEditor.groups.push(res.data);
              this.activeGroup =
                this.playlistEditor.groups[
                  this.playlistEditor.groups.length - 1
                ].id;
              this.activeGroups = [
                this.playlistEditor.groups[
                  this.playlistEditor.groups.length - 1
                ].id,
              ];
              resolve();
            }).then(() => {
              this.editGroupModal(true);
            });
          }
        })
        .catch(() => {
          this.isLoading = false;
          this.$notify(
            "error",
            this.$t("profile.failed"),
            this.$t("editor.add-group-error"),
            "la-user-shield",
            { duration: 5000, permanent: false }
          );
        });
    },
    addStream() {
      this.isLoading = true;
      httpService
        .post("editor/add-stream", {
          playlist_id: this.playlistEditor.id,
          group_id: this.getGroupWithId(this.activeGroup).id,
          stream_type: this.getGroupWithId(this.activeGroup).group_type,
        })
        .then((res) => {
          this.isLoading = false;
          if (res.status === true && res.data) {
            return new Promise((resolve) => {
              this.playlistEditor.streams.unshift(res.data);
              this.activeStream =
                this.playlistEditor.streams[
                  this.playlistEditor.streams.length - 1
                ].id;
              this.activeStreams = [
                this.playlistEditor.streams[
                  this.playlistEditor.streams.length - 1
                ].id,
              ];
              resolve();
            }).then(() => {
              this.editStreamModal(true);
            });
          }
        })
        .catch(() => {
          this.isLoading = false;
          this.$notify(
            "error",
            this.$t("profile.failed"),
            this.$t("editor.add-stream-error"),
            "la-user-shield",
            { duration: 5000, permanent: false }
          );
        });
    },
    loadStreams() {
      this.activeStream = -1;
      this.activeStreams = [];
      this.playlistEditor.streams = [];
      let index = this.playlistEditor.groups.findIndex(
        (group) => group.id === this.activeGroup
      );
      let group = this.playlistEditor.groups[index];
      this.isLoading = true;
      httpService
        .get(
          `editor/streams/${this.playlistEditor.id}/${group.id}/${group.group_type}`
        )
        .then((res) => {
          document.body.scrollTop = 0;
          document.documentElement.scrollTop = 0;
          if (res.status === true) {
            let streams = res.data.map((stream) => {
              const str = Object.assign({}, stream);
              str.source_stream_tvg_name = stream.stream_tvg_name;
              str.source_stream_tvg_id = stream.stream_tvg_id;
              str.source_stream_tvg_logo = stream.stream_tvg_logo;
              str.source_stream_tvg_chno = stream.stream_tvg_chno;
              str.source_stream_tvg_shift = stream.stream_tvg_shift;
              str.source_stream_parent_code = stream.stream_parent_code;
              str.source_stream_audio_track = stream.stream_audio_track;
              str.source_stream_aspect_ratio = stream.stream_aspect_ratio;
              str.source_stream_radio = stream.stream_radio;
              str.source_stream_order = stream.stream_order;
              str.source_stream_is_hidden = stream.stream_is_hidden;
              str.modified = false;
              str.stream_is_removed = 0;
              if (group.group_type == 2) {
                if (str.movie_name == "") {
                  str.movie_name = str.stream_tvg_name;
                  str.source_movie_name = str.stream_tvg_name;
                } else {
                  str.source_movie_name = stream.movie_name;
                }
                str.source_movie_year = stream.movie_year;
                str.source_tmdb_id = stream.tmdb_id;
              }
              if (group.group_type == 3) {
                if (str.serie_name == "") {
                  str.serie_name = str.stream_tvg_name;
                  str.source_serie_name = str.stream_tvg_name;
                } else {
                  str.source_serie_name = stream.serie_name;
                }
                str.source_serie_season = stream.serie_season;
                str.source_serie_episode = stream.serie_episode;
                str.source_tmdb_id = stream.tmdb_id;
              }
              return str;
            });
            streams.sort((a, b) =>
              a.source_stream_order > b.source_stream_order
                ? 1
                : b.source_stream_order > a.source_stream_order
                ? -1
                : 0
            );
            this.playlistEditor.streams = streams;
            this.isLoading = false;
          } else {
            this.isLoading = false;
          }
        })
        .catch(() => {
          this.isLoading = false;
        });
    },
    moveToSelectedGroup() {
      this.isLoading = true;
      let streams = this.activeStreams.join();
      let index = this.playlistEditor.groups.findIndex((group) => {
        return group.id == this.activeGroup;
      });
      httpService
        .post(`editor/move-to-group/${this.activeGroupType}`, {
          playlist_id: this.playlistEditor.id,
          streams: streams,
          group_id: this.activeGroups[0],
        })
        .then((res) => {
          this.isLoading = false;
          if (res.status && res.data) {
            this.loadPlaylist(this.playlistEditor.id, index);
          }
        })
        .catch(() => {
          this.isLoading = false;
        });
    },
    saveChangesModal(show, save = false) {
      this.saveChanges.modal = show;
      if (save) {
        this.doSave();
      } else {
        this.loadStreams();
      }
    },
    radioBrowserModal(show, save = false) {
      if (show) {
        this.radioBrowser.search = "";
        this.radioBrowser.results = [];
        this.radioBrowser.active = [];
      }
      if (save) {
        this.isLoading = true;
        let groupIndex = this.playlistEditor.groups.findIndex((group) => {
          return group.id == this.activeGroup;
        });
        let order = this.playlistEditor.streams.length;
        const streams = this.radioBrowser.active.map((index) => {
          let radio = this.radioBrowser.results[index];
          return {
            source_stream_url: radio.url,
            stream_tvg_name: radio.name,
            stream_tvg_id: "",
            stream_tvg_logo: radio.favicon,
            stream_radio: true,
            stream_order: order++,
          };
        });
        httpService
          .post(`editor/add-streams/${this.activeGroupType}`, {
            playlist_id: this.playlistEditor.id,
            group_id: this.getGroupWithId(this.activeGroup).id,
            streams: streams,
          })
          .then((res) => {
            this.isLoading = false;
            if (res.status) {
              this.loadPlaylist(this.playlistEditor.id, groupIndex);
            }
          })
          .catch(() => {
            this.isLoading = false;
          });
      }
      this.radioBrowser.modal = show;
    },
    findRadiobrowser(search) {
      if (search.length === 0) {
        this.radioBrowser.results = [];
        this.radioBrowser.active = [];
      } else {
        this.radioBrowser.isLoading = true;
        httpService
          .post("editor/find-radiobrowser", {
            search: search,
          })
          .then((res) => {
            this.radioBrowser.active = [];
            if (res.status) {
              this.radioBrowser.results = res.data;
            } else {
              this.radioBrowser.results = [];
            }
            this.radioBrowser.isLoading = false;
          })
          .catch(() => {
            this.radioBrowser.active = [];
            this.radioBrowser.results = [];
            this.radioBrowser.isLoading = false;
          });
      }
    },
    soundcloudModal(show, save = false) {
      if (show) {
        this.soundcloud.url = "";
        this.soundcloud.track = null;
      }
      if (save) {
        if (this.soundcloud.track) {
          this.isLoading = true;
          let groupIndex = this.playlistEditor.groups.findIndex((group) => {
            return group.id == this.activeGroup;
          });
          let order = this.playlistEditor.streams.length;
          const streams = [
            {
              source_stream_url: this.soundcloud.url,
              stream_tvg_name: this.soundcloud.track.title,
              stream_tvg_id: "",
              stream_tvg_logo: this.soundcloud.track.artwork_url.replace(
                "large.jpg",
                "t500x500.jpg"
              ),
              stream_radio: true,
              stream_order: order++,
            },
          ];
          httpService
            .post(`editor/add-streams/${this.activeGroupType}`, {
              playlist_id: this.playlistEditor.id,
              group_id: this.getGroupWithId(this.activeGroup).id,
              streams: streams,
            })
            .then((res) => {
              this.isLoading = false;
              if (res.status) {
                this.loadPlaylist(this.playlistEditor.id, groupIndex);
              }
            })
            .catch(() => {
              this.isLoading = false;
            });
        }
      }
      this.soundcloud.modal = show;
    },
    getSoundcloudTrack(url, client_id) {
      if (url.length === 0 || !/soundcloud\.com/.test(url)) {
        this.soundcloud.url = "";
        this.soundcloud.track = null;
      } else {
        this.soundcloud.isLoading = true;
        httpService
          .post("editor/soundcloud-track", {
            url: url,
            client_id: client_id,
          })
          .then((res) => {
            if (res.status && Object.keys(res.data).length) {
              this.soundcloud.track = res.data;
            } else {
              this.soundcloud.track = null;
            }
            this.soundcloud.isLoading = false;
          })
          .catch(() => {
            this.soundcloud.track = null;
            this.soundcloud.isLoading = false;
          });
      }
    },
    youtubeModal(show, save = false) {
      if (show) {
        this.youtube.url = "";
        this.youtube.video = null;
        this.youtube.isLoading = false;
      }
      if (save) {
        if (this.youtube.video) {
          this.youtube.isLoading = true;
          let groupIndex = this.playlistEditor.groups.findIndex((group) => {
            return group.id == this.activeGroup;
          });
          let order = this.playlistEditor.streams.length;
          const streams = [
            {
              source_stream_url: this.youtube.url,
              stream_tvg_name: this.youtube.video.videoDetails.title,
              stream_tvg_id: "",
              stream_tvg_logo: `http://i.ytimg.com/vi/${this.youtube.videoId}/maxresdefault.jpg`,
              stream_order: order++,
            },
          ];
          httpService
            .post(`editor/add-streams/${this.activeGroupType}`, {
              playlist_id: this.playlistEditor.id,
              group_id: this.getGroupWithId(this.activeGroup).id,
              streams: streams,
            })
            .then((res) => {
              this.youtube.isLoading = false;
              if (res.status) {
                this.loadPlaylist(this.playlistEditor.id, groupIndex);
              }
            })
            .catch(() => {
              this.youtube.isLoading = false;
            });
        }
      }
      this.youtube.modal = show;
    },
    getYoutubePage(videoId) {
      this.youtube.isLoading = true;
      httpService
        .post("editor/youtube-video", { video_id: videoId })
        .then((res) => {
          if (res.status && Object.keys(res.data).length) {
            this.youtube.video = res.data;
          } else {
            this.youtube.video = null;
          }
          this.youtube.isLoading = false;
        })
        .catch(() => {
          this.youtube.video = null;
          this.youtube.isLoading = false;
        });
    },
    vimeoModal(show, save = false) {
      if (show) {
        this.vimeo.url = "";
        this.vimeo.video = null;
        this.vimeo.isLoading = false;
      }
      if (save) {
        if (this.vimeo.video) {
          this.vimeo.isLoading = true;
          let groupIndex = this.playlistEditor.groups.findIndex((group) => {
            return group.id == this.activeGroup;
          });
          let order = this.playlistEditor.streams.length;
          const streams = [
            {
              source_stream_url: this.vimeo.url,
              stream_tvg_name: this.vimeo.video.video.title,
              stream_tvg_id: "",
              stream_tvg_logo: this.vimeo.video.video.thumbs.base,
              stream_order: order++,
            },
          ];
          httpService
            .post(`editor/add-streams/${this.activeGroupType}`, {
              playlist_id: this.playlistEditor.id,
              group_id: this.getGroupWithId(this.activeGroup).id,
              streams: streams,
            })
            .then((res) => {
              this.vimeo.isLoading = false;
              if (res.status) {
                this.loadPlaylist(this.playlistEditor.id, groupIndex);
              }
            })
            .catch(() => {
              this.vimeo.isLoading = false;
            });
        }
      }
      this.vimeo.modal = show;
    },
    getVimeoConfig(videoId) {
      this.vimeo.isLoading = true;
      httpService
        .post("editor/vimeo-video", { video_id: videoId })
        .then((res) => {
          this.vimeo.video = res.data;
          this.vimeo.isLoading = false;
        });
    },
    dailymotionModal(show, save = false) {
      if (show) {
        this.dailymotion.url = "";
        this.dailymotion.video = null;
        this.dailymotion.isLoading = false;
      }
      if (save) {
        if (this.dailymotion.video) {
          this.dailymotion.isLoading = true;
          let groupIndex = this.playlistEditor.groups.findIndex((group) => {
            return group.id == this.activeGroup;
          });
          let order = this.playlistEditor.streams.length;
          const streams = [
            {
              source_stream_url: this.dailymotion.url,
              stream_tvg_name: this.dailymotion.video.title,
              stream_tvg_id: "",
              stream_tvg_logo: this.dailymotion.video.thumbnail_1080_url,
              stream_order: order++,
            },
          ];
          httpService
            .post(`editor/add-streams/${this.activeGroupType}`, {
              playlist_id: this.playlistEditor.id,
              group_id: this.getGroupWithId(this.activeGroup).id,
              streams: streams,
            })
            .then((res) => {
              this.dailymotion.isLoading = false;
              if (res.status) {
                this.loadPlaylist(this.playlistEditor.id, groupIndex);
              }
            })
            .catch(() => {
              this.dailymotion.isLoading = false;
            });
        }
      }
      this.dailymotion.modal = show;
    },
    getDailymotionConfig(videoId) {
      this.dailymotion.isLoading = true;
      httpService
        .post("editor/dailymotion-video", { video_id: videoId })
        .then((res) => {
          this.dailymotion.video = res.data;
          this.dailymotion.isLoading = false;
        });
    },
    tedTalksModal(show, save = false) {
      if (show) {
        this.tedTalks.url = "";
        this.tedTalks.video = null;
        this.tedTalks.isLoading = false;
      }
      if (save) {
        if (this.tedTalks.video) {
          this.tedTalks.isLoading = true;
          let groupIndex = this.playlistEditor.groups.findIndex((group) => {
            return group.id == this.activeGroup;
          });
          let order = this.playlistEditor.streams.length;
          const streams = [
            {
              source_stream_url: this.tedTalks.url,
              stream_tvg_name: this.tedTalks.video.title,
              stream_tvg_id: "",
              stream_tvg_logo: this.tedTalks.video.hero,
              stream_order: order++,
            },
          ];
          httpService
            .post(`editor/add-streams/${this.activeGroupType}`, {
              playlist_id: this.playlistEditor.id,
              group_id: this.getGroupWithId(this.activeGroup).id,
              streams: streams,
            })
            .then((res) => {
              this.tedTalks.isLoading = false;
              if (res.status) {
                this.loadPlaylist(this.playlistEditor.id, groupIndex);
              }
            })
            .catch(() => {
              this.tedTalks.isLoading = false;
            });
        }
      }
      this.tedTalks.modal = show;
    },
    getTedTalksConfig(url) {
      this.tedTalks.isLoading = true;
      httpService.post("editor/ted-talks-video", { url: url }).then((res) => {
        this.tedTalks.video = res.data.talks.length ? res.data.talks[0] : null;
        this.tedTalks.isLoading = false;
      });
    },
    xhamsterModal(show, save = false) {
      if (show) {
        this.xhamster.url = "";
        this.xhamster.video = null;
        this.xhamster.isLoading = false;
      }
      if (save) {
        if (this.xhamster.video) {
          this.xhamster.isLoading = true;
          let groupIndex = this.playlistEditor.groups.findIndex((group) => {
            return group.id == this.activeGroup;
          });
          let order = this.playlistEditor.streams.length;
          const streams = [
            {
              source_stream_url: this.xhamster.url,
              stream_tvg_name: this.xhamster.video.videoEntity.title,
              stream_tvg_id: "",
              stream_tvg_logo: this.xhamster.video.videoEntity.thumbBig,
              stream_order: order++,
            },
          ];
          httpService
            .post(`editor/add-streams/${this.activeGroupType}`, {
              playlist_id: this.playlistEditor.id,
              group_id: this.getGroupWithId(this.activeGroup).id,
              streams: streams,
            })
            .then((res) => {
              this.xhamster.isLoading = false;
              if (res.status) {
                this.loadPlaylist(this.playlistEditor.id, groupIndex);
              }
            })
            .catch(() => {
              this.xhamster.isLoading = false;
            });
        }
      }
      this.xhamster.modal = show;
    },
    getXhamsterConfig(url) {
      this.xhamster.isLoading = true;
      httpService.post("editor/xhamster-video", { url: url }).then((res) => {
        this.xhamster.video = res.data;
        this.xhamster.isLoading = false;
      });
    },
    groupDoubleClick() {
      if (this.activeGroups.length === 1) {
        this.editGroupModal(true);
      }
    },
    streamDoubleClick() {
      if (this.activeStreams.length === 1) {
        this.editStreamModal(true);
      }
    },
    loadLogoCountries() {
      this.findLogo.isLoading = true;
      httpService
        .get("editor/logo-countries")
        .then((res) => {
          this.findLogo.isLoading = false;
          this.findLogo.countries = res.data
            .map((country) => {
              let cn = this.countries.find(
                (cnt) => cnt.code.toLowerCase() == country.toLowerCase()
              );
              return {
                text: cn ? cn.name : country,
                value: country,
              };
            })
            .sort((a, b) => {
              return a.text.toUpperCase() < b.text.toUpperCase()
                ? -1
                : a.text.toUpperCase() > b.text.toUpperCase()
                ? 1
                : 0;
            });
          this.assignLogo.countries = [...this.findLogo.countries];
        })
        .catch(() => {
          this.findLogo.isLoading = false;
        });
    },
    loadTVGIDCountries() {
      this.assignTVGID.isLoading = true;
      httpService
        .get("editor/tv-guide-countries")
        .then((res) => {
          this.assignTVGID.isLoading = false;
          this.assignTVGID.countries = res.data
            .map((country) => {
              let cn = this.countries.find(
                (cnt) => cnt.code.toLowerCase() == country.toLowerCase()
              );
              return {
                text: cn ? cn.name : country,
                value: country,
              };
            })
            .sort((a, b) => {
              return a.text.toUpperCase() < b.text.toUpperCase()
                ? -1
                : a.text.toUpperCase() > b.text.toUpperCase()
                ? 1
                : 0;
            });
          this.assignTVGID.countries.unshift({
            text: this.$t("general.all"),
            value: "all",
          });
          this.findTVGID.countries = [...this.assignTVGID.countries];
        })
        .catch(() => {
          this.assignTVGID.isLoading = false;
        });
    },
    loadLogosFind(country) {
      this.findLogo.isLoading = true;
      httpService
        .get(`editor/logos/${country}`)
        .then((res) => {
          this.findLogo.logo = "";
          this.findLogo.isLoading = false;
          this.findLogo.logos = res.data.map((logo) => {
            return {
              text: logo.label,
              value: logo.filename,
            };
          });
        })
        .catch(() => {
          this.findLogo.isLoading = false;
        });
    },
    findLogoModal(show, save = false) {
      let selected = this.getStreamWithId(this.activeStreams[0]);
      if (show) {
        this.findLogo.logo = "";
        this.findLogo.title = selected.stream_tvg_name;
      }
      this.findLogo.search = "";
      if (save) {
        if (selected) {
          selected.stream_tvg_logo = `http://static.iptv-tools.com/${this.findLogo.country}/${this.findLogo.logo}`;
          selected.modified = true;
          this.playlistEditor.changed = true;
        }
      }
      this.findLogo.modal = show;
    },
    loadLogosAssign(country) {
      this.assignLogo.isLoading = true;
      httpService
        .get(`editor/logos/${country}`)
        .then((res) => {
          this.assignLogo.logo = "";
          this.assignLogo.isLoading = false;
          this.assignLogo.logos = res.data.map((logo) => logo.filename);
        })
        .catch(() => {
          this.assignLogo.isLoading = false;
        });
    },
    assignLogoModal(show, save = false) {
      if (show) {
        this.assignLogo.logo = "";
      }
      if (save) {
        var changed = false;
        var stringSimilarity = require("string-similarity");
        let streams = [];
        if (this.assignLogo.assignAll == 1) {
          streams = this.playlistEditor.streams;
        } else {
          streams = this.playlistEditor.streams.filter(
            (stream) => !stream.stream_tvg_logo.length
          );
        }
        streams.map((stream) => {
          let match1 = stringSimilarity.findBestMatch(
            String(stream.stream_tvg_name).replace(/ hd$/i, ""),
            this.assignLogo.logos
          ).bestMatch;
          let match2 = stringSimilarity.findBestMatch(
            String(stream.stream_tvg_id),
            this.assignLogo.logos
          ).bestMatch;
          if (match1.rating >= 0.3) {
            changed = true;
            stream.stream_tvg_logo = `http://static.iptv-tools.com/${this.assignLogo.country}/${match1.target}`;
            stream.modified = true;
          } else if (match2.rating >= 0.5) {
            changed = true;
            stream.stream_tvg_logo = `http://static.iptv-tools.com/${this.assignLogo.country}/${match2.target}`;
            stream.modified = true;
          }
        });
        this.playlistEditor.changed = changed;
      }
      this.assignLogo.modal = show;
    },
    loadTVGIDAssign(country) {
      this.assignTVGID.isLoading = true;
      httpService
        .get(`editor/tv-guide/${country}`)
        .then((res) => {
          this.assignTVGID.isLoading = false;
          this.assignTVGID.channels = res.data;
        })
        .catch(() => {
          this.assignTVGID.isLoading = false;
        });
    },
    assignTVGIDModal(show, save = false) {
      if (save) {
        var changed = false;
        var stringSimilarity = require("string-similarity");
        let streams = [];
        if (this.assignTVGID.assignAll == 1) {
          streams = this.playlistEditor.streams;
        } else {
          streams = this.playlistEditor.streams.filter(
            (stream) =>
              !stream.stream_tvg_id.length || stream.stream_tvg_id.length == 0
          );
        }
        let channelNames = this.assignTVGID.channels.map(
          (channel) => channel.tvg_name
        );
        let channelIds = this.assignTVGID.channels.map(
          (channel) => channel.tvg_id
        );
        streams.map((stream) => {
          let match1 = stringSimilarity.findBestMatch(
            String(stream.stream_tvg_name),
            channelNames
          ).bestMatch;
          let match2 = stringSimilarity.findBestMatch(
            String(stream.stream_tvg_id),
            channelIds
          ).bestMatch;
          let match3 = stringSimilarity.findBestMatch(
            String(stream.stream_tvg_name).replace(
              / hd$| fhd$| hevc$| h265$|/i,
              ""
            ),
            channelNames
          ).bestMatch;
          if (match2.rating >= 0.75) {
            changed = true;
            stream.stream_tvg_id = match2.target;
            stream.modified = true;
          } else if (match1.rating >= 0.75) {
            changed = true;
            stream.stream_tvg_id = this.assignTVGID.channels.find(
              (channel) => channel.tvg_name === match1.target
            ).tvg_id;
            stream.modified = true;
          } else if (match3.rating >= 0.75) {
            changed = true;
            stream.stream_tvg_id = this.assignTVGID.channels.find(
              (channel) => channel.tvg_name === match1.target
            ).tvg_id;
            stream.modified = true;
          } else {
            changed = true;
            stream.stream_tvg_id = "";
            stream.modified = true;
          }
        });
        this.playlistEditor.changed = changed;
      }
      this.assignTVGID.modal = show;
    },
    loadTVGIDFind(country) {
      this.findTVGID.isLoading = true;
      httpService
        .get(`editor/tv-guide/${country}`)
        .then((res) => {
          this.findTVGID.channel = "";
          this.findTVGID.isLoading = false;
          this.findTVGID.channels = res.data.map((channel) => {
            return {
              text: channel.tvg_name,
              value: channel.tvg_id,
            };
          });
        })
        .catch(() => {
          this.findTVGID.isLoading = false;
        });
    },
    findTVGIDModal(show, save = false) {
      let selected = this.getStreamWithId(this.activeStreams[0]);
      if (show) {
        this.findTVGID.channel = "";
        this.findTVGID.title = selected.stream_tvg_name;
      }
      this.findTVGID.search = "";
      if (save) {
        if (selected) {
          selected.stream_tvg_id = this.findTVGID.channel;
          selected.modified = true;
          this.playlistEditor.changed = true;
        }
      }
      this.findTVGID.modal = show;
    },
    importM3UModal(show, save = false) {
      if (show) {
        this.importM3U.file = null;
        this.importM3U.m3u = null;
        this.importM3U.groups = [];
        this.importM3U.importGroups = [];
      }
      if (save) {
        this.isLoading = true;
        let groupIndex = this.playlistEditor.groups.findIndex((group) => {
          return group.id == this.activeGroup;
        });
        httpService
          .post("editor/import", {
            playlist_id: this.playlistEditor.id,
            import: this.importM3U.groups.filter((group, index) =>
              this.importM3U.importGroups.includes(index)
            ),
          })
          .then((res) => {
            this.isLoading = false;
            if (res.status) {
              this.loadPlaylist(this.playlistEditor.id, groupIndex);
            }
          })
          .catch(() => {
            this.isLoading = false;
          });
      }
      this.importM3U.modal = show;
    },
    uploadM3U(event) {
      const input = event.target;
      if ("files" in input && input.files.length > 0) {
        this.importM3U.isLoading = true;
        this.readFileContent(input.files[0])
          .then((content) => {
            this.importM3U.isLoading = false;
            this.parseM3U(content);
          })
          .catch((error) => {
            this.$notify(
              "error",
              this.$t("profile.failed"),
              error,
              "la-user-shield",
              { duration: 5000, permanent: false }
            );
          });
      }
    },
    parseM3U(content) {
      let vm = this;
      vm.importM3U.isLoading = true;
      m3u
        .parse(
          content,
          { tag: "name", type: ["Movie", "Series", "VOD", "Live"] },
          true
        )
        .then((playlist) => {
          this.importM3U.m3u = playlist;
          this.importM3U.isLoading = false;
          this.importM3U.groups = playlist.groups;
          this.importM3U.importGroups = [];
        })
        .catch((error) => {
          vm.isLoading = false;
          vm.$notify(
            "error",
            vm.$t("profile.failed"),
            error,
            "la-user-shield",
            { duration: 5000, permanent: false }
          );
        });
    },
    readFileContent(file) {
      const reader = new FileReader();
      return new Promise((resolve, reject) => {
        reader.onload = (event) => resolve(event.target.result);
        reader.onerror = (error) => reject(error);
        reader.readAsText(file);
      });
    },
  },
  beforeMount() {
    document.body.classList.add("right-menu");
    EventBus.$on("search", this.searchEditor);
    EventBus.$on("print", this.printEditor);
    EventBus.$on("tab-change", this.doTabChange);
    EventBus.$on("save", this.doSave);
    EventBus.$on("cancel", this.doCancel);
    if (this.movieSeriePlaylist) {
      this.loadPlaylist(this.movieSeriePlaylist);
    }
    this.loadLogoCountries();
    this.loadTVGIDCountries();
  },
  beforeDestroy() {
    document.body.classList.remove("right-menu");
    EventBus.$off("search", this.searchEditor);
    EventBus.$off("print", this.printEditor);
    EventBus.$off("tab-change", this.doTabChange);
    EventBus.$off("save", this.doSave);
    EventBus.$off("cancel", this.doCancel);
  },
  watch: {
    dragStream: function (val) {
      if (!val) {
        this.playlistEditor.changed = true;
      }
    },
    dragGroup: function (val) {
      if (!val) {
        this.playlistEditor.changed = true;
      }
    },
    activeGroup: function (val) {
      if (this.playlistEditor.changed) {
        this.saveChangesModal(true);
      } else {
        this.loadStreams();
      }
    },
    "playlistEditor.changed": function (val) {
      EventBus.$emit("editor-changes", val);
    },
    "radioBrowser.search": function (val) {
      let vm = this;
      clearTimeout(this.radioBrowser.bounce);
      this.radioBrowser.bounce = setTimeout(function () {
        vm.findRadiobrowser(val);
      }, 500);
    },
    "soundcloud.url": function (val) {
      let vm = this;
      clearTimeout(this.radioBrowser.bounce);
      this.radioBrowser.bounce = setTimeout(function () {
        vm.getSoundcloudTrack(val, vm.soundcloudClientId);
      }, 500);
    },
    "youtube.url": function (val) {
      if (!val.length) {
        return;
      }
      if (/youtu\.?be/i.test(val)) {
        var i;
        var patterns = [
          /youtu\.be\/([^#&?]{11})/, // youtu.be/<id>
          /\?v=([^#&?]{11})/, // ?v=<id>
          /&v=([^#&?]{11})/, // &v=<id>
          /embed\/([^#&?]{11})/, // embed/<id>
          /\/v\/([^#&?]{11})/, // /v/<id>
        ];

        for (i = 0; i < patterns.length; ++i) {
          if (patterns[i].test(val)) {
            this.youtube.videoId = patterns[i].exec(val)[1];
            return;
          }
        }

        var tokens = val.split(/[/&?=#.\s]/g);
        for (i = 0; i < tokens.length; ++i) {
          if (/^[^#&?]{11}$/.test(tokens[i])) {
            this.youtube.videoId = tokens[i];
            return;
          }
        }

        this.youtube.videoId = "";
      } else {
        try {
          var urlp = new URL(val);
          this.youtube.videoId = urlp.searchParams.get("v");
        } catch (error) {
          this.youtube.videoId = "";
          console.log(error);
        }
      }
    },
    "youtube.videoId": function (val) {
      let vm = this;
      clearTimeout(this.youtube.bounce);
      this.youtube.bounce = setTimeout(function () {
        if (val.length) {
          vm.getYoutubePage(val);
        } else {
          vm.youtube.video = null;
        }
      }, 500);
    },
    "vimeo.url": function (val) {
      if (/vimeo\.com/i.test(val)) {
        let match = val.match(
          /(?:www\.|player\.)?vimeo.com\/(?:channels\/(?:\w+\/)?|groups\/(?:[^/]*)\/videos\/|album\/(?:\d+)\/video\/|video\/|)(\d+)(?:[a-zA-Z0-9_-]+)?/i
        );
        if (match.length >= 2) {
          this.vimeo.videoId = match[1];
        } else {
          this.vimeo.videoId = "";
        }
      } else {
        this.vimeo.videoId = "";
      }
    },
    "vimeo.videoId": function (val) {
      let vm = this;
      clearTimeout(this.vimeo.bounce);
      this.vimeo.bounce = setTimeout(function () {
        if (val.length) {
          vm.getVimeoConfig(val);
        } else {
          vm.vimeo.video = null;
        }
      }, 500);
    },
    "dailymotion.url": function (val) {
      if (/dailymotion\.com/i.test(val)) {
        let match = val.match(
          /^.+dailymotion.com\/(video|hub)\/([^_]+)[^#]*(#video=([^_&]+))?/i
        );
        if (match.length >= 4 && match[4]) {
          this.dailymotion.videoId = match[4];
        } else if (match.length >= 2) {
          this.dailymotion.videoId = match[2];
        } else {
          this.dailymotion.videoId = "";
        }
      } else {
        this.dailymotion.videoId = "";
      }
    },
    "dailymotion.videoId": function (val) {
      let vm = this;
      clearTimeout(this.dailymotion.bounce);
      this.dailymotion.bounce = setTimeout(function () {
        if (val.length) {
          vm.getDailymotionConfig(val);
        } else {
          vm.dailymotion.video = null;
        }
      }, 500);
    },
    "tedTalks.url": function (val) {
      if (/ted\.com\/talks/i.test(val)) {
        let vm = this;
        clearTimeout(this.tedTalks.bounce);
        this.tedTalks.bounce = setTimeout(function () {
          if (val.length) {
            vm.getTedTalksConfig(val);
          } else {
            vm.tedTalks.video = null;
          }
        }, 500);
      }
    },
    "xhamster.url": function (val) {
      let vm = this;
      if (/xhamster\.com\/videos/i.test(val)) {
        clearTimeout(this.xhamsterBounce);
        this.xhamsterBounce = setTimeout(function () {
          if (val.length) {
            vm.getXhamsterConfig(val);
          } else {
            vm.xhamster.video = null;
          }
        }, 500);
      }
    },
    "findLogo.country": function (val) {
      if (val.length) {
        this.loadLogosFind(val);
      } else {
        this.findLogo.logo = "";
      }
    },
    "assignLogo.country": function (val) {
      if (val.length) {
        this.loadLogosAssign(val);
      } else {
        this.assignLogo.logo = "";
      }
    },
    "findTVGID.country": function (val) {
      if (val.length) {
        this.loadTVGIDFind(val);
      } else {
        this.findTVGID.channel = "";
      }
    },
    "assignTVGID.country": function (val) {
      if (val.length) {
        this.loadTVGIDAssign(val);
      } else {
        this.assignTVGID.channels = [];
      }
    },
    movieSeriePlaylist: function (val) {
      this.loadPlaylist(val);
    },
  },
};
</script>

<style lang="scss">
.editor-stream,
.editor-group {
  margin-top: 0.1rem;
  -webkit-user-select: none;
  -webkit-touch-callout: none;
  -khtml-user-select: none;
  -ms-user-select: none;
  -moz-user-select: none;
  user-select: none;

  &:focus,
  &:focus-within {
    &.selected {
      background-color: $theme-color-1 !important;

      a,
      i,
      span {
        color: $button-text-color !important;
      }
    }

    &.active {
      border-color: rgba($theme-color-1, 0.6) !important;

      a,
      span {
        font-weight: bold;
      }
      a,
      i,
      span {
        color: $theme-color-1;
      }
    }
  }

  &.selected {
    background-color: $theme-color-1 !important;
    &.success {
      background-color: $success-color !important;
    }
    &.danger {
      background-color: $error-color !important;
    }
    &.info {
      background-color: $info-color !important;
    }

    a,
    i,
    span {
      color: $button-text-color !important;
    }
  }

  &.active {
    border-color: rgba($theme-color-1, 0.6) !important;

    a,
    span {
      font-weight: bold;
    }
    a,
    i,
    span {
      color: $theme-color-1;
    }
  }

  &.hidden {
    opacity: 0.5;
  }
}

.editor-stream {
  .stream-icon {
    float: right;
    max-height: 16px;
  }
}

.editor-stream-icon {
  max-width: 100%;
  max-height: 250px;
  height: auto !important;
}

.editor-movie-poster {
  max-height: 250px;
  width: auto !important;
}

.flip-list-move {
  transition: transform 0.5s;
}
.no-move {
  transition: transform 0s;
}
.ghost {
  opacity: 0.5;
}

.handle {
  cursor: move;
  vertical-align: middle;

  &.disabled {
    cursor: not-allowed;
  }
}

.radiobrowser-stations {
  overflow: hidden;

  .ps {
    max-height: 300px;
    padding-top: 0.25rem;
    padding-bottom: 0.5rem;
  }

  .radiobrowser-station {
    margin-top: 0.1rem;
    -webkit-user-select: none;
    -webkit-touch-callout: none;
    -khtml-user-select: none;
    -ms-user-select: none;
    -moz-user-select: none;
    user-select: none;

    &:focus,
    &:focus-within {
      &.selected {
        background-color: $theme-color-1 !important;

        a,
        i,
        span {
          color: $button-text-color !important;
        }
      }

      &.active {
        border-color: rgba($theme-color-1, 0.6) !important;

        a,
        span {
          font-weight: bold;
        }
        a,
        i,
        span {
          color: $theme-color-1;
        }
      }
    }

    &.selected {
      background-color: $theme-color-1 !important;
      &.success {
        background-color: $success-color !important;
      }
      &.danger {
        background-color: $error-color !important;
      }
      &.info {
        background-color: $info-color !important;
      }

      a,
      i,
      span {
        color: $button-text-color !important;
      }
    }

    &.active {
      border-color: rgba($theme-color-1, 0.6) !important;

      a,
      span {
        font-weight: bold;
      }
      a,
      i,
      span {
        color: $theme-color-1;
      }
    }
  }
}

.soundcloud-info {
  width: max-content;

  .cover {
    max-height: 300px;
  }
}

.find-logo {
  min-height: 250px;

  .stream-logo {
    max-width: 250px;
    height: auto;
  }
}

.assign-logo {
  min-height: 300px;
}

.find-channel-id {
  min-height: 410px;
}
</style>
