<template>
  <home-layout>
    <nav class="navbar d-print-none">
      <div class="navbar-side navbar-nav-homepage">
        <erd-select
          key="language"
          class="language-select d-none d-sm-inline-block"
          :items="languages"
          v-model="$i18n.locale"
        ></erd-select>
      </div>
      <a href="/" class="navbar-logo active">
        <span class="logo d-none d-xs-block"></span>
        <span class="logo-mobile d-block d-xs-none"></span>
      </a>
      <div class="navbar-side right navbar-side-homepage">
        <erd-button
          icon="la-user-plus"
          variant="info"
          class="mr-1 d-none d-sm-inline-block"
          @click="register"
          >{{ $t("landing.register") }}</erd-button
        >
        <erd-button icon="la-sign-in-alt" variant="primary" @click="login">{{
          $t("landing.login")
        }}</erd-button>
      </div>
    </nav>
    <erd-row class="m-0 p-0">
      <erd-col xxl="12" sm="12" class="p-0 mx-0 mt-4">
        <div class="hero-sass hero-swiper-btn pb-3 px-4" id="home">
          <div class="container_f1">
            <div class="swiper-wrapper">
              <swiper :options="swiperOption">
                <div class="swiper-slide">
                  <div class="hero-item text-center">
                    <div class="hero-content mt-2">
                      <h2 class="h1 hero-content-title font-weight-light">
                        {{ $t("hero.title-2") }}
                      </h2>
                      <p class="mb-2">{{ $t("hero.subtitle-2") }}</p>
                    </div>
                    <div class="hero-thumb">
                      <img
                        src="@/assets/hero/hero-1.png"
                        class="img-fluid"
                        alt="hero thumb"
                      />
                    </div>
                  </div>
                </div>
                <div class="swiper-slide">
                  <div class="hero-item text-center">
                    <div class="hero-thumb">
                      <img
                        src="@/assets/hero/hero-2.png"
                        class="img-fluid"
                        alt="hero thumb"
                      />
                    </div>
                    <div class="hero-content mt-2">
                      <p>{{ $t("hero.subtitle-1") }}</p>
                      <h2 class="h1 hero-content-title font-weight-light">
                        {{ $t("hero.title-1") }}
                      </h2>
                    </div>
                  </div>
                </div>
                <div class="swiper-slide">
                  <div class="hero-item text-center">
                    <div class="hero-content mt-2">
                      <h2 class="h1 hero-content-title font-weight-light">
                        {{ $t("hero.title-3") }}
                      </h2>
                      <p>{{ $t("hero.subtitle-3") }}</p>
                    </div>
                    <div class="hero-thumb">
                      <img
                        src="@/assets/hero/hero-3.png"
                        class="img-fluid"
                        alt="hero thumb"
                      />
                    </div>
                  </div>
                </div>
                <!-- Optional controls -->
                <div
                  class="swiper-button-prev swiper-button-white"
                  slot="button-prev"
                ></div>
                <div
                  class="swiper-button-next swiper-button-white"
                  slot="button-next"
                ></div>
              </swiper>
            </div>
          </div>
        </div>
        <div class="icon-process-wrapper mt-5 mb-2">
          <div class="icon-process-single wow move-up">
            <div class="icon-process-single__line">
              <div class="dot dot-1"></div>
              <div class="dot dot-2"></div>
              <div class="dot dot-3"></div>
              <div class="dot dot-4"></div>
              <div class="dot dot-5"></div>
              <div class="dot dot-4"></div>
              <div class="dot dot-3"></div>
              <div class="dot dot-2"></div>
              <div class="dot dot-1"></div>
            </div>
            <div class="icon-process-single__content-wrap">
              <div class="icon-process-single__media">
                <i class="las la-sync"></i>
              </div>
              <h5 class="icon-process-single__title">
                {{ $t("hero.gradation-title-1") }}
              </h5>
              <div class="icon-process-single__text">
                {{ $t("hero.gradation-subtitle-1") }}
              </div>
            </div>
          </div>
          <div class="icon-process-single wow move-up">
            <div class="icon-process-single__line">
              <div class="dot dot-1"></div>
              <div class="dot dot-2"></div>
              <div class="dot dot-3"></div>
              <div class="dot dot-4"></div>
              <div class="dot dot-5"></div>
              <div class="dot dot-4"></div>
              <div class="dot dot-3"></div>
              <div class="dot dot-2"></div>
              <div class="dot dot-1"></div>
            </div>
            <div class="icon-process-single__content-wrap">
              <div class="icon-process-single__media">
                <i class="las la-tv"></i>
              </div>
              <h5 class="icon-process-single__title">
                {{ $t("hero.gradation-title-2") }}
              </h5>
              <div class="icon-process-single__text">
                {{ $t("hero.gradation-subtitle-2") }}
              </div>
            </div>
          </div>
          <div class="icon-process-single wow move-up">
            <div class="icon-process-single__line">
              <div class="dot dot-1"></div>
              <div class="dot dot-2"></div>
              <div class="dot dot-3"></div>
              <div class="dot dot-4"></div>
              <div class="dot dot-5"></div>
              <div class="dot dot-4"></div>
              <div class="dot dot-3"></div>
              <div class="dot dot-2"></div>
              <div class="dot dot-1"></div>
            </div>
            <div class="icon-process-single__content-wrap">
              <div class="icon-process-single__media">
                <i class="lab la-xing"></i>
              </div>
              <h5 class="icon-process-single__title">
                {{ $t("hero.gradation-title-3") }}
              </h5>
              <div class="icon-process-single__text">
                {{ $t("hero.gradation-subtitle-3") }}
              </div>
            </div>
          </div>
        </div>
        <curve-shape class="curve-bottom mt-5">
          <template v-slot:bgcolor>
            <path
              style="fill: #fff; stroke-miterlimit: 10"
              d="M3360.5,97.739c-242,0-480-48.375-480-48.375
                        S2647.5,0.5,2400.5,0.5s-480,48.375-480,48.375s-238,48.864-480,48.864s-480-48.375-480-48.375S727.5,0.5,480.5,0.5
                        S0.5,48.875,0.5,48.875V108h1920h1920V48.875C3840.5,48.875,3602.5,97.739,3360.5,97.739z"
            />
          </template>
        </curve-shape>
        <div class="background-white-gradient position-relative p-5">
          <div
            class="
              faq-banner-area
              gray-gradient
              section-space--pb_90
              position-relative
            "
          >
            <div class="container_fl">
              <div class="row align-items-center">
                <div class="col-lg-6">
                  <div class="col-06__left">
                    <div
                      class="
                        section-title-wrapper
                        section-space--mb_60
                        wow
                        move-up
                      "
                    >
                      <h2
                        class="section-title font-weight--light accordion-title"
                      >
                        {{ $t("hero.accordion-title") }}
                      </h2>
                    </div>
                    <div class="faq-wrapper wow move-up">
                      <div class="accordion-faq wow move-up">
                        <b-card no-body>
                          <b-card-header header-tag="header">
                            <b-button
                              block
                              v-b-toggle.accordion-1
                              class="faq-title"
                              >{{ $t("hero.accordion-title-1") }}</b-button
                            >
                          </b-card-header>
                          <b-collapse
                            id="accordion-1"
                            visible
                            accordion="my-accordion"
                          >
                            <b-card-body>
                              <b-card-text>{{
                                $t("hero.accordion-text-1")
                              }}</b-card-text>
                            </b-card-body>
                          </b-collapse>
                        </b-card>

                        <b-card no-body>
                          <b-card-header header-tag="header">
                            <b-button
                              block
                              v-b-toggle.accordion-2
                              class="faq-title"
                              >{{ $t("hero.accordion-title-2") }}</b-button
                            >
                          </b-card-header>
                          <b-collapse id="accordion-2" accordion="my-accordion">
                            <b-card-body>
                              <b-card-text>{{
                                $t("hero.accordion-text-2")
                              }}</b-card-text>
                            </b-card-body>
                          </b-collapse>
                        </b-card>

                        <b-card no-body>
                          <b-card-header header-tag="header">
                            <b-button
                              block
                              v-b-toggle.accordion-3
                              class="faq-title"
                              >{{ $t("hero.accordion-title-3") }}</b-button
                            >
                          </b-card-header>
                          <b-collapse id="accordion-3" accordion="my-accordion">
                            <b-card-body>
                              <b-card-text>{{
                                $t("hero.accordion-text-3")
                              }}</b-card-text>
                            </b-card-body>
                          </b-collapse>
                        </b-card>

                        <b-card no-body>
                          <b-card-header header-tag="header">
                            <b-button
                              block
                              v-b-toggle.accordion-4
                              class="faq-title"
                              >{{ $t("hero.accordion-title-4") }}</b-button
                            >
                          </b-card-header>
                          <b-collapse id="accordion-4" accordion="my-accordion">
                            <b-card-body>
                              <b-card-text>{{
                                $t("hero.accordion-text-4")
                              }}</b-card-text>
                            </b-card-body>
                          </b-collapse>
                        </b-card>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="col-lg-6 wow move-up">
                  <div class="faq-banner__media">
                    <img
                      src="@/assets/hero/hero-4.png"
                      class="img-fluid"
                      alt=""
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="mt-5 px-4">
          <h2 class="text-center hero-content-title">
            {{ $t("hero.features-title") }}
          </h2>
          <p class="text-center">{{ $t("hero.features-subtitle") }}</p>
        </div>
        <erd-row class="mt-2">
          <erd-col
            xxl="4"
            md="6"
            sm="12"
            v-for="(feature, index) in features"
            :key="`feature-${index}`"
          >
            <erd-card>
              <erd-card-body>
                <erd-card-title class="text-center">{{
                  feature.heading
                }}</erd-card-title>
                <viewer>
                  <img class="img-fluid screenshot" :src="feature.image" />
                </viewer>
                <p class="text-center">{{ feature.text }}</p>
              </erd-card-body>
            </erd-card>
          </erd-col>
        </erd-row>
        <erd-row>
          <erd-col xl="12" class="iptv-tools-trailer">
            <vue-plyr>
              <div
                data-plyr-provider="youtube"
                data-plyr-embed-id="NAi-3gvNics"
                data-poster="../assets/hero/hero-1.png"
              ></div>
            </vue-plyr>
          </erd-col>
        </erd-row>
        <div class="mt-5 px-4">
          <h2 class="text-center hero-content-title">
            {{ $t("hero.pricing-title") }}
          </h2>
          <p class="text-center">{{ $t("hero.pricing-subtitle") }}</p>
        </div>
        <erd-row>
          <erd-col
            lg="4"
            md="6"
            v-for="(item, index) in pricing"
            :key="`personal-${item.id}-${index}`"
          >
            <erd-card>
              <erd-card-body class="text-center price-card">
                <i class="las la-6x color-theme-1 mt-3" :class="item.icon"></i>
                <h3 class="item-title color-theme-1 my-3">{{ item.title }}</h3>
                <p class="text-large mb-2 text-default">
                  &euro;{{ item.price }}
                </p>
                <p class="mt-0 text-muted text-small">
                  {{ $t("subscriptions.user-month") }}
                </p>
                <ul class="list-unstyled mt-4">
                  <li
                    v-for="(listing, index) in item.list"
                    :key="`listing-${item.id}-${index}`"
                  >
                    <p class="my-1">{{ listing }}</p>
                  </li>
                </ul>
              </erd-card-body>
            </erd-card>
          </erd-col>
          <erd-col xl="12">
            <p class="text-center">
              {{ $t("subscriptions.custom-plan") }}
              <a class="color-theme-1" :href="contactLink" target="_blank">{{
                $t("subscriptions.contact-us")
              }}</a>
            </p>
          </erd-col>
        </erd-row>
      </erd-col>
    </erd-row>
  </home-layout>
</template>

<script>
import HomeLayout from "../../layouts/HomeLayout";
import CurveShape from "./CurveShape";
import { setCurrentLanguage } from "../../helpers";
import { localeOptions } from "../../constants/config";

export default {
  components: {
    "home-layout": HomeLayout,
    "curve-shape": CurveShape,
  },
  data() {
    return {
      mailto: "contact@erdesigns.eu",
      localeOptions,
      scrolled: false,
      iptvtoolsLogo:
        "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+CjxzdmcKICAgeG1sbnM6ZGM9Imh0dHA6Ly9wdXJsLm9yZy9kYy9lbGVtZW50cy8xLjEvIgogICB4bWxuczpjYz0iaHR0cDovL2NyZWF0aXZlY29tbW9ucy5vcmcvbnMjIgogICB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiCiAgIHhtbG5zOnN2Zz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciCiAgIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIKICAgeG1sbnM6c29kaXBvZGk9Imh0dHA6Ly9zb2RpcG9kaS5zb3VyY2Vmb3JnZS5uZXQvRFREL3NvZGlwb2RpLTAuZHRkIgogICB4bWxuczppbmtzY2FwZT0iaHR0cDovL3d3dy5pbmtzY2FwZS5vcmcvbmFtZXNwYWNlcy9pbmtzY2FwZSIKICAgdmVyc2lvbj0iMS4xIgogICB3aWR0aD0iMTI4MCIKICAgaGVpZ2h0PSIxMDI0IgogICB2aWV3Qm94PSIwIDAgMTI4MCAxMDI0IgogICB4bWw6c3BhY2U9InByZXNlcnZlIgogICBpZD0ic3ZnNDUiCiAgIHNvZGlwb2RpOmRvY25hbWU9IkZ1bGxDb2xvcl8xMjgweDEwMjQuc3ZnIgogICBpbmtzY2FwZTp2ZXJzaW9uPSIxLjAuMSAoM2JjMmU4MTNmNSwgMjAyMC0wOS0wNykiPjxtZXRhZGF0YQogICBpZD0ibWV0YWRhdGE0OSI+PHJkZjpSREY+PGNjOldvcmsKICAgICAgIHJkZjphYm91dD0iIj48ZGM6Zm9ybWF0PmltYWdlL3N2Zyt4bWw8L2RjOmZvcm1hdD48ZGM6dHlwZQogICAgICAgICByZGY6cmVzb3VyY2U9Imh0dHA6Ly9wdXJsLm9yZy9kYy9kY21pdHlwZS9TdGlsbEltYWdlIiAvPjwvY2M6V29yaz48L3JkZjpSREY+PC9tZXRhZGF0YT48c29kaXBvZGk6bmFtZWR2aWV3CiAgIHBhZ2Vjb2xvcj0iI2ZmZmZmZiIKICAgYm9yZGVyY29sb3I9IiM2NjY2NjYiCiAgIGJvcmRlcm9wYWNpdHk9IjEiCiAgIG9iamVjdHRvbGVyYW5jZT0iMTAiCiAgIGdyaWR0b2xlcmFuY2U9IjEwIgogICBndWlkZXRvbGVyYW5jZT0iMTAiCiAgIGlua3NjYXBlOnBhZ2VvcGFjaXR5PSIwIgogICBpbmtzY2FwZTpwYWdlc2hhZG93PSIyIgogICBpbmtzY2FwZTp3aW5kb3ctd2lkdGg9IjE5MTgiCiAgIGlua3NjYXBlOndpbmRvdy1oZWlnaHQ9Ijk5MyIKICAgaWQ9Im5hbWVkdmlldzQ3IgogICBzaG93Z3JpZD0iZmFsc2UiCiAgIGlua3NjYXBlOnpvb209IjAuMzcyMDcwMzEiCiAgIGlua3NjYXBlOmN4PSIzNDcuMzAxOTQiCiAgIGlua3NjYXBlOmN5PSI3MTEuOTI5NzIiCiAgIGlua3NjYXBlOndpbmRvdy14PSIxOTIwIgogICBpbmtzY2FwZTp3aW5kb3cteT0iMjYiCiAgIGlua3NjYXBlOndpbmRvdy1tYXhpbWl6ZWQ9IjEiCiAgIGlua3NjYXBlOmN1cnJlbnQtbGF5ZXI9InN2ZzQ1IgogICBpbmtzY2FwZTpkb2N1bWVudC1yb3RhdGlvbj0iMCIgLz4KPGRlc2MKICAgaWQ9ImRlc2MyIj5DcmVhdGVkIHdpdGggRmFicmljLmpzIDMuNi4zPC9kZXNjPgo8ZGVmcwogICBpZD0iZGVmczQiPgo8L2RlZnM+CjxnCiAgIHRyYW5zZm9ybT0ibWF0cml4KDEuOTY5Mjc4MDMzNzk0MTYyOSAwIDAgMS45NjkyNzgwMzM3OTQxNjI5IDY0MC4wMTUzODQ2MTUzODQ2IDUxMi4wMTIzMTI0MTg3NjQpIgogICBpZD0iYmFja2dyb3VuZC1sb2dvIj4KCjwvZz4KPGcKICAgdHJhbnNmb3JtPSJtYXRyaXgoMy41ODE2Mzc1LDAsMCwzLjc2NDUxMzksNjQ1Ljc3Mzc0LDUxMi41MDEzMykiCiAgIGlkPSJsb2dvLWxvZ28iCiAgIHN0eWxlPSJzdHJva2Utd2lkdGg6MS4wMDAxO3N0cm9rZS1taXRlcmxpbWl0OjQ7c3Ryb2tlLWRhc2hhcnJheTpub25lIj4KPGcKICAgcGFpbnQtb3JkZXI9InN0cm9rZSIKICAgaWQ9ImczOSIKICAgc3R5bGU9InN0cm9rZS13aWR0aDoxLjAwMDE7c3Ryb2tlLW1pdGVybGltaXQ6NDtzdHJva2UtZGFzaGFycmF5Om5vbmUiPgoJCTxnCiAgIHRyYW5zZm9ybT0ibWF0cml4KDAuMTk1MjM3NDEsMCwwLC0wLjE5NTIzNzQxLDAsLTAuNDcwNTc5ODEpIgogICBpZD0iZzIwIgogICBzdHlsZT0ic3Ryb2tlLXdpZHRoOjUuMTIyNDY7c3Ryb2tlLW1pdGVybGltaXQ6NDtzdHJva2UtZGFzaGFycmF5Om5vbmUiPgo8bGluZWFyR3JhZGllbnQKICAgaWQ9IlNWR0lEXzFfNTkwNDA3IgogICBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSIKICAgZ3JhZGllbnRUcmFuc2Zvcm09Im1hdHJpeCgwLC0yMDMxLjc3LC0yMDMxLjc3LDAsMjk4My44Miw5MTA1LjQyKSIKICAgeDE9IjAiCiAgIHkxPSIwIgogICB4Mj0iMSIKICAgeTI9IjAiPgo8c3RvcAogICBvZmZzZXQ9IjAlIgogICBzdHlsZT0ic3RvcC1jb2xvcjpyZ2IoMjQ3LDE1MCwxNSk7c3RvcC1vcGFjaXR5OiAxIgogICBpZD0ic3RvcDkiIC8+CjxzdG9wCiAgIG9mZnNldD0iNTMuMDMxMyUiCiAgIHN0eWxlPSJzdG9wLWNvbG9yOnJnYigyNDEsNzEsMjkpO3N0b3Atb3BhY2l0eTogMSIKICAgaWQ9InN0b3AxMSIgLz4KPHN0b3AKICAgb2Zmc2V0PSI1OC4yNjA0MzMlIgogICBzdHlsZT0ic3RvcC1jb2xvcjpyZ2IoMjQxLDcxLDI5KTtzdG9wLW9wYWNpdHk6IDEiCiAgIGlkPSJzdG9wMTMiIC8+CjxzdG9wCiAgIG9mZnNldD0iMTAwJSIKICAgc3R5bGU9InN0b3AtY29sb3I6cmdiKDIxMyw0MCw0MCk7c3RvcC1vcGFjaXR5OiAxIgogICBpZD0ic3RvcDE1IiAvPgo8L2xpbmVhckdyYWRpZW50Pgo8cGF0aAogICBzdHlsZT0ib3BhY2l0eToxO2ZpbGw6I2VkNzExNztmaWxsLW9wYWNpdHk6MTtmaWxsLXJ1bGU6ZXZlbm9kZDtzdHJva2U6bm9uZTtzdHJva2Utd2lkdGg6NS4xMjI0NjtzdHJva2UtbGluZWNhcDpidXR0O3N0cm9rZS1saW5lam9pbjptaXRlcjtzdHJva2UtbWl0ZXJsaW1pdDo0O3N0cm9rZS1kYXNoYXJyYXk6bm9uZTtzdHJva2UtZGFzaG9mZnNldDowIgogICBwYWludC1vcmRlcj0ic3Ryb2tlIgogICB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtMjk4My44MiwtODE0OC45MDUpIgogICBkPSJtIDM0OTAuMzgsODUwMS4xMiBjIC0xODguNjIsLTUyLjQyIC0zODQuNzMsLTcuNTggLTQ3Ni4yOSwxMDIuNzMgLTE1Ljg4LDE5LjEyIC00NC42NiwxOS4xMiAtNjAuNTQsMCAtOTEuNTcsLTExMC4zMSAtMjg3LjY2LC0xNTUuMTUgLTQ3Ni4yOSwtMTAyLjczIC0yNi4yNyw3LjMgLTUyLjA5LC0xMi41IC01MC40OCwtMzkuNzEgMTMuNDQsLTIyNi42MiA3NC41MywtNzg4Ljc2IDQ1NC4yOSwtOTk4LjUyIC0yNDMuNDcsODIuNzMgLTUzNS41OCw1MDcuODYgLTY1NC41NSw5ODQuNzMgLTI1Ljg4LDEwMy43NCAyNS44NSwyMTIuMjEgMTIyLjU1LDI1Ny44NCAxODIuOSw4Ni4zMSA0MDguODMsMTI5LjQ2IDYzNC43NSwxMjkuNDYgMjI1LjkzLDAgNDUxLjg0LC00My4xNSA2MzQuNzUsLTEyOS40NiA5Ni43LC00NS42NCAxNDguNDMsLTE1NC4xIDEyMi41NSwtMjU3Ljg0IC0xMTguOTcsLTQ3Ni44NyAtNDExLjA3LC05MDIgLTY1NC41NywtOTg0LjczIDM3OS43NywyMDkuNzYgNDQwLjg3LDc3MS45IDQ1NC4zMSw5OTguNTIgMS42MSwyNy4yMSAtMjQuMjEsNDcuMDEgLTUwLjQ4LDM5LjcxIgogICBzdHJva2UtbGluZWNhcD0icm91bmQiCiAgIGlkPSJwYXRoMTgiIC8+CjwvZz4KCQk8ZwogICB0cmFuc2Zvcm09Im1hdHJpeCgwLjE5NjYwODM0LDAsMCwtMC4xOTY2MDgzNCwtOS44MzA0MTY4ZS00LDIwLjMwMjkzNCkiCiAgIGlkPSJnMzciCiAgIHN0eWxlPSJzdHJva2Utd2lkdGg6NS4wODY3NDtzdHJva2UtbWl0ZXJsaW1pdDo0O3N0cm9rZS1kYXNoYXJyYXk6bm9uZSI+CjxsaW5lYXJHcmFkaWVudAogICBpZD0iU1ZHSURfMl81OTA0MDgiCiAgIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIgogICBncmFkaWVudFRyYW5zZm9ybT0ibWF0cml4KDAsMTg5NC43NywxODk0Ljc3LDAsMjk4My44Miw2Njk3Ljc0KSIKICAgeDE9IjAiCiAgIHkxPSIwIgogICB4Mj0iMSIKICAgeTI9IjAiPgo8c3RvcAogICBvZmZzZXQ9IjAlIgogICBzdHlsZT0ic3RvcC1jb2xvcjpyZ2IoMjM3LDUyLDY2KTtzdG9wLW9wYWNpdHk6IDEiCiAgIGlkPSJzdG9wMjIiIC8+CjxzdG9wCiAgIG9mZnNldD0iNC4yNjg1OTElIgogICBzdHlsZT0ic3RvcC1jb2xvcjpyZ2IoMjM3LDUyLDY2KTtzdG9wLW9wYWNpdHk6IDEiCiAgIGlkPSJzdG9wMjQiIC8+CjxzdG9wCiAgIG9mZnNldD0iMzguMzQwOTk5OTk5OTk5OTk0JSIKICAgc3R5bGU9InN0b3AtY29sb3I6cmdiKDE5NCwyMSw0NCk7c3RvcC1vcGFjaXR5OiAxIgogICBpZD0ic3RvcDI2IiAvPgo8c3RvcAogICBvZmZzZXQ9Ijg2LjI0NzcwNjk5OTk5OTk5JSIKICAgc3R5bGU9InN0b3AtY29sb3I6cmdiKDEwMSw5LDE4KTtzdG9wLW9wYWNpdHk6IDEiCiAgIGlkPSJzdG9wMjgiIC8+CjxzdG9wCiAgIG9mZnNldD0iOTguNzUwNCUiCiAgIHN0eWxlPSJzdG9wLWNvbG9yOnJnYigxMDEsOSwxOCk7c3RvcC1vcGFjaXR5OiAxIgogICBpZD0ic3RvcDMwIiAvPgo8c3RvcAogICBvZmZzZXQ9IjEwMCUiCiAgIHN0eWxlPSJzdG9wLWNvbG9yOnJnYigxMDEsOSwxOCk7c3RvcC1vcGFjaXR5OiAxIgogICBpZD0ic3RvcDMyIiAvPgo8L2xpbmVhckdyYWRpZW50Pgo8cGF0aAogICBzdHlsZT0ib3BhY2l0eToxO2ZpbGw6dXJsKCNTVkdJRF8yXzU5MDQwOCk7ZmlsbC1ydWxlOmV2ZW5vZGQ7c3Ryb2tlOm5vbmU7c3Ryb2tlLXdpZHRoOjUuMDg2NzQ7c3Ryb2tlLWxpbmVjYXA6YnV0dDtzdHJva2UtbGluZWpvaW46bWl0ZXI7c3Ryb2tlLW1pdGVybGltaXQ6NDtzdHJva2UtZGFzaGFycmF5Om5vbmU7c3Ryb2tlLWRhc2hvZmZzZXQ6MCIKICAgcGFpbnQtb3JkZXI9InN0cm9rZSIKICAgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTI5ODMuODE1LC04MDQzLjI0NTYpIgogICBkPSJtIDI5NjAuMDQsODYxMiBjIC05MC4zLC0xMTguNTUgLTI5Ny42MywtMTY2LjQ4IC00OTQuMzMsLTEwNy41NSAtMjAuNDgsNi4xNCAtNDAuNzYsLTkuNyAtMzkuNjEsLTMxLjA0IDEyLjAzLC0yMjIuOTYgNjguNCwtNzk2Ljk5IDQ1NC45NywtMTAxMC41MiB2IDM1Mi4yMiBjIDAsMjMuNjggLTEzLjMxLDQ0LjgyIC0zMy43Niw1Ni43NSAtODAuNjQsNDcuMDIgLTEzNC44MywxMzQuNDQgLTEzNC44MywyMzQuNTUgMCwxMDIuMzEgNTYuNjQsMTkxLjM5IDE0MC4yNiwyMzcuNjEgMTMuMzEsNy4zNSAyOS43MiwtMi42MyAyOS43MiwtMTcuODQgdiAtMjA0LjM3IGMgMCwtMjcuODYgMTQuODcsLTUzLjYxIDM5LC02Ny41NCBsIDIzLjM4LC0xMy40OSBjIDI0LjEyLC0xMy45MyA1My44NCwtMTMuOTMgNzcuOTYsMCBsIDIzLjM3LDEzLjQ5IGMgMjQuMTMsMTMuOTMgMzksMzkuNjggMzksNjcuNTQgdiAyMDQuMzcgYyAwLDE1LjIxIDE2LjQxLDI1LjE5IDI5LjcxLDE3Ljg0IDgzLjYzLC00Ni4yMiAxNDAuMjcsLTEzNS4yOSAxNDAuMjcsLTIzNy42MSAwLC0xMDAuMTEgLTU0LjE4LC0xODcuNTMgLTEzNC44MiwtMjM0LjU1IC0yMC40NiwtMTEuOTMgLTMzLjc3LC0zMy4wNyAtMzMuNzcsLTU2Ljc1IGwgLTAuMDEsLTM1Mi4yMiBjIDM4Ni41OCwyMTMuNTMgNDQyLjk2LDc4Ny41NiA0NTQuOTgsMTAxMC41MiAxLjE1LDIxLjM0IC0xOS4xMywzNy4xOCAtMzkuNjEsMzEuMDQgLTE5Ni42OSwtNTguOTMgLTQwNC4wMywtMTEgLTQ5NC4zMSwxMDcuNTQgLTExLjc5LDE1LjQ4IC0zNS43OSwxNS40OCAtNDcuNTcsMC4wMSIKICAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogICBpZD0icGF0aDM1IiAvPgo8L2c+CjwvZz4KPC9nPgo8ZwogICB0cmFuc2Zvcm09Im1hdHJpeCgyLjkxMTkyNjYsMCwwLDIuODkxNTU2Nyw2NDcuNzk2NTEsOTI1LjQ3NTA3KSIKICAgaWQ9InRleHQtbG9nby1wYXRoIj4KCjwvZz4KPC9zdmc+Cg==",
      swiperOption: {
        speed: 1500,
        loop: true,
        effect: "fade",
        autoplay: false,
        spaceBetween: 30,
        navigation: {
          nextEl: ".swiper-button-next",
          prevEl: ".swiper-button-prev",
        },
      },
      screenshots: [
        require("@/assets/screens/Synchronize.png"),
        require("@/assets/screens/Security.png"),
        require("@/assets/screens/XtreamAPI.png"),
        require("@/assets/screens/Editor.png"),
        require("@/assets/screens/Editor-1.png"),
        require("@/assets/screens/Editor-2.png"),
      ],
      features: [
        {
          image: require("@/assets/screens/XtreamAPI.png"),
          heading: this.$t("screenshots.title-1"),
          text: this.$t("screenshots.text-1"),
        },
        {
          image: require("@/assets/screens/Synchronize.png"),
          heading: this.$t("screenshots.title-2"),
          text: this.$t("screenshots.text-2"),
        },
        {
          image: require("@/assets/screens/Security.png"),
          heading: this.$t("screenshots.title-3"),
          text: this.$t("screenshots.text-3"),
        },
        {
          image: require("@/assets/screens/Editor.png"),
          heading: this.$t("screenshots.title-4"),
          text: this.$t("screenshots.text-4"),
        },
        {
          image: require("@/assets/screens/Editor-1.png"),
          heading: this.$t("screenshots.title-5"),
          text: this.$t("screenshots.text-5"),
        },
        {
          image: require("@/assets/screens/Editor-2.png"),
          heading: this.$t("screenshots.title-6"),
          text: this.$t("screenshots.text-6"),
        },
        {
          image: require("@/assets/screens/Movies-1.png"),
          heading: this.$t("screenshots.title-7"),
          text: this.$t("screenshots.text-7"),
        },
        {
          image: require("@/assets/screens/Movies-2.png"),
          heading: this.$t("screenshots.title-8"),
          text: this.$t("screenshots.text-8"),
        },
        {
          image: require("@/assets/screens/Movies-3.png"),
          heading: this.$t("screenshots.title-9"),
          text: this.$t("screenshots.text-9"),
        },
        {
          image: require("@/assets/screens/Series-2.png"),
          heading: this.$t("screenshots.title-10"),
          text: this.$t("screenshots.text-10"),
        },
        {
          image: require("@/assets/screens/Series-1.png"),
          heading: this.$t("screenshots.title-11"),
          text: this.$t("screenshots.text-11"),
        },
        {
          image: require("@/assets/screens/Series-3.png"),
          heading: this.$t("screenshots.title-12"),
          text: this.$t("screenshots.text-12"),
        },
        {
          image: require("@/assets/screens/Invoices.png"),
          heading: this.$t("screenshots.title-13"),
          text: this.$t("screenshots.text-13"),
        },
        {
          image: require("@/assets/screens/Tickets-1.png"),
          heading: this.$t("screenshots.title-14"),
          text: this.$t("screenshots.text-14"),
        },
        {
          image: require("@/assets/screens/Tickets-2.png"),
          heading: this.$t("screenshots.title-15"),
          text: this.$t("screenshots.text-15"),
        },
        {
          image: require("@/assets/screens/XDPro-1.png"),
          heading: this.$t("screenshots.title-16"),
          text: this.$t("screenshots.text-16"),
        },
        {
          image: require("@/assets/screens/XDPro-2.png"),
          heading: this.$t("screenshots.title-17"),
          text: this.$t("screenshots.text-17"),
        },
        {
          image: require("@/assets/screens/Radio.png"),
          heading: this.$t("screenshots.title-18"),
          text: this.$t("screenshots.text-18"),
        },
        {
          image: require("@/assets/screens/Youtube.png"),
          heading: this.$t("screenshots.title-19"),
          text: this.$t("screenshots.text-19"),
        },
        {
          image: require("@/assets/screens/TVGuide.png"),
          heading: this.$t("screenshots.title-20"),
          text: this.$t("screenshots.text-20"),
        },
        {
          image: require("@/assets/screens/Smarters.png"),
          heading: this.$t("screenshots.title-21"),
          text: this.$t("screenshots.text-21"),
        },
      ],
      pricing: [
        {
          title: this.$t("subscriptions.enthusiast"),
          icon: "la-compass",
          price: "2,50",
          list: [
            this.$t("subscriptions.2-playlists"),
            this.$t("subscriptions.unlimited-channels"),
            this.$t("subscriptions.live-only"),
            this.$t("subscriptions.daily-sync"),
            this.$t("subscriptions.epg-support"),
            "-",
            "-",
          ],
          id: 0,
        },
        {
          title: this.$t("subscriptions.professional"),
          icon: "la-user-tie",
          price: "5,00",
          list: [
            this.$t("subscriptions.2-playlists"),
            this.$t("subscriptions.unlimited-channels"),
            this.$t("subscriptions.live-movies-series"),
            this.$t("subscriptions.daily-sync"),
            this.$t("subscriptions.epg-support"),
            this.$t("subscriptions.free-tools"),
            "-",
          ],
          id: 1,
        },
        {
          title: this.$t("subscriptions.pro-plus"),
          icon: "la-users",
          price: "10,00",
          list: [
            this.$t("subscriptions.5-playlists"),
            this.$t("subscriptions.unlimited-channels"),
            this.$t("subscriptions.live-movies-series"),
            this.$t("subscriptions.daily-sync"),
            this.$t("subscriptions.epg-support"),
            this.$t("subscriptions.free-tools"),
            this.$t("subscriptions.5-7-contact"),
          ],
          id: 2,
        },
      ],
    };
  },
  methods: {
    login () {
      this.$router.push({ path: '/user/login' });
    },
    register () {
      this.$router.push({ path: '/user/register' });
    }
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
    contactLink() {
      return `mailto:${this.mailto}?subject=${encodeURIComponent(
        this.$t("subscriptions.contact-subject")
      )}&body=${encodeURIComponent(this.$t("subscriptions.contact-body"))}`;
    },
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

<style lang="scss">
.iptv-tools-logo {
  max-height: 40px;
}

.navbar-nav-homepage {
  padding-left: 2rem;
}

.navbar-side-homepage {
  margin-top: 0 !important;
}

.accordion-title {
  font-size: 40px;
  color: $theme-color-1;
}
.screenshot {
  cursor: pointer;
}

#accordion-1,
#accordion-2,
#accordion-3,
#accordion-4 {
  @include depth(1);
}

$xlmax-device: "only screen and (min-width: 1200px) and (max-width: 1599.98px)";
$laptop-device: "only screen and (min-width: 1200px) and (max-width: 1499px)";
$desktop-device: "only screen and (min-width: 992px) and (max-width: 1199px)";
$tablet-device: "only screen and (min-width: 768px) and (max-width: 991px)";
$large-mobile: "only screen and (max-width: 767px)";
$small-mobile: "only screen and (max-width: 575px)";
$extra-small-mobile: "only screen and (max-width: 479px)";
$transition--default: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);

$gradient--default: linear-gradient(
  218deg,
  #5e61e7 0,
  #9c7af2 50%,
  #5e61e7 100%
);
$gradient--default-two: linear-gradient(-259deg, #5e60e7 0, #9c7af2 65%);
$gradient--secondary: linear-gradient(-180deg, #fff 0, #eceefa 100%);
$gray-gradient: -webkit-linear-gradient(top, #fff 0, #f6f5f9 74%, #f6f5f9 100%);

.img-fluid {
  max-width: 100%;
  height: auto;
}

.hero {
  &-item {
    align-items: center;
    justify-content: center;
    flex-direction: column;
    // responsive
    @media #{$large-mobile} {
      height: 900px;
    }
    @media #{$extra-small-mobile} {
      height: 700px;
    }
  }
  &-thumb {
    padding: 15px 15px 0;
    // responsive
    @media #{$large-mobile} {
      padding: 50px 15px 0;
    }
  }
  &-content-title {
    color: $default-color;
    font-size: 40px;
    line-height: 1.3;
    margin: 0;
  }
}

// slider text animation
.swiper-slide {
  background-color: $background-color;
  background-repeat: no-repeat;
  &-active {
    .hero-thumb {
      img {
        animation-fill-mode: both;
        animation-duration: 1s;
        animation-name: fadeInRight;
        animation-delay: 0.5s;
      }
    }

    .hero-content {
      animation-fill-mode: both;
      animation-duration: 1s;
      animation-name: fadeInLeft;
      animation-delay: 0.5s;
    }
  }
}

.swiper-button-prev.swiper-button-white,
.swiper-button-next.swiper-button-white {
  --swiper-navigation-color: #{$theme-color-1};
}
.swiper-button-prev,
.swiper-container-rtl .swiper-button-next {
  left: 50px;
  right: auto;
}
.swiper-button-next,
.swiper-container-rtl .swiper-button-prev {
  right: 50px;
  left: auto;
}

.saas-gradation {
  padding-top: 0;
  // responsive
  @media #{$large-mobile} {
    padding-top: 70px;
  }
}

.icon-process-wrapper {
  display: flex;
  text-align: center;
  margin-bottom: -60px;

  @media #{$tablet-device, $large-mobile} {
    flex-direction: column;
  }
}

.icon-process-single {
  padding: 0 10px;
  position: relative;
  flex-grow: 1;
  margin-bottom: 60px;

  &__line {
    position: absolute;
    top: 60px;
    left: 100%;
    transform: translate(-50%, -5px);
    height: 10px;
    width: 100%;
    line-height: 0;

    @media #{$tablet-device, $large-mobile} {
      left: 50%;
      bottom: -30px;
      top: auto;
      transform: translate(-50%, 0);
    }

    .dot {
      display: inline-block;
      vertical-align: middle;
      background: #{rgba($theme-color-1, 0.25)};
      border-radius: 50%;
      margin: 0 8px;
      &-1 {
        width: 2px;
        height: 2px;
      }
      &-2 {
        width: 4px;
        height: 4px;
      }
      &-3 {
        width: 6px;
        height: 6px;
      }
      &-4 {
        width: 8px;
        height: 8px;
      }
      &-5 {
        width: 10px;
        height: 10px;
      }
    }
  }

  &:last-child {
    .icon-process-single__line {
      display: none;
    }
  }

  &__content-wrap {
    position: relative;
    text-align: center;
    margin: 0 auto;
    max-width: 320px;
  }

  &__media {
    position: relative;
    width: 120px;
    height: 120px;
    line-height: 120px;
    border-radius: 40px;
    font-size: 34px;
    background: white;
    box-shadow: 0 15px 50px #{rgba($theme-color-1, 0.1)};
    margin: 0 auto 52px;
    color: $theme-color-1;
    transition: $transition--default;

    @media #{$tablet-device, $large-mobile} {
      margin-bottom: 30px;
    }
    i {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }
  }

  &__title {
    color: $theme-color-1;
    margin-bottom: 14px;
  }

  &:hover {
    .icon-process-single__media {
      background-color: $theme-color-1;
      color: white;
    }
  }
}

.background-white-gradient {
  background-color: white;
  background: linear-gradient(
    180deg,
    #fff 0%,
    #fff 35%,
    #{rgba($background-color, 1)} 100%
  );
}

.faq-wrapper {
  .panel.panel-default {
    border: 1px solid #ebebeb;
    margin-bottom: 20px;
  }

  .card,
  .card-header {
    border-radius: 0;
  }

  .card {
    border-bottom: none;
    margin-bottom: 20px;
    border: none;
    box-shadow: 0 15px 50px #{rgba($theme-color-1, 0.1)};
    &:last-child {
      margin-bottom: 0;
    }
  }

  .card-header {
    padding: 0;
    border-bottom: 0;
    background-color: white;

    .faq-title {
      border: none;
      width: 100%;
      text-align: left;
      color: $theme-color-1;
      padding: 20px 30px;
      position: relative;
      overflow-wrap: break-word;
      white-space: normal;
      font-size: 18px;
      line-height: 1.2;
      font-weight: 500;
      border-radius: 5px;
      background: white;

      @media #{$extra-small-mobile} {
        padding-left: 15px;
        padding-right: 20px;
      }
      &:active {
        background-color: white;
        color: $theme-color-1;
        transform: translateY(0);
      }
      &:hover,
      &:focus {
        text-decoration: none;
        color: $theme-color-1;
        transform: translateY(0);
      }

      &[aria-expanded="true"] {
        color: white;
        background-color: $theme-color-1;
        opacity: 0.9;
        border-bottom-left-radius: 0;
        border-bottom-right-radius: 0;
      }
    }
  }
  .btn {
    &:active {
      transform: translateY(0);
    }
  }
  .card-body {
    padding: 23px 30px 29px;
  }
}

[aria-expanded="false"] {
  background-color: white;
}
.accordion-faq,
.toggle-faq {
  .card-header {
    [aria-expanded="false"],
    [aria-expanded="true"] {
      &:before {
        color: white;
        top: 50%;
        right: 20px;
        content: "\f055";
        position: absolute;
        font-family: "Line Awesome Free";
        transform: translateY(-50%);
      }
    }
    [aria-expanded="true"] {
      &:before {
        content: "\f056";
        color: #fff;
      }
    }
  }
}

.soft-accordion-two {
  @media #{$tablet-device, $large-mobile} {
    margin-top: 70px;
  }
}

.language-select {
  min-width: 200px;
}

.iptv-tools-trailer {
  .plyr--video,
  .plyr__video-wrapper,
  .plyr__poster {
    background: $background-color;
  }

  .plyr__poster {
    background-position: 50% 50%;
    background-repeat: no-repeat;
    background-size: auto auto;
  }

  .plyr__controls {
    background: linear-gradient(#{rgba($background-color, 1)}, #{rgba($theme-color-1, .25)});
  }
}
</style>
