import {
  ApiURL,
  ApiStatus,
  FallbackAPIURL,
  localeOptions,
  defaultLocale,
} from "../constants/config";

export function authHeader() {
  // return authorization header with jwt token
  let user = JSON.parse(localStorage.getItem("user"));

  if (user && user.token) {
    return {
      "Authorization": "Bearer " + user.token,
    };
  } else {
    return {};
  }
}

export function formatHeader(header) {
  return {
    ...{
      Accept: "application/json",
      "Content-Type": "application/json;charset=UTF-8",
    },
    ...header,
  };
}

export function activeAPI() {
  // TODO: ask the backend if there is preference for a api with another priority
  return (
    ApiURL.filter((url) => {
      return url.status === ApiStatus.enabled;
    })[0]["url"] || FallbackAPIURL
  );
}

export const getCurrentUser = () => {
  let user = null;
  try {
    user =
      localStorage.getItem("user") != null
        ? JSON.parse(localStorage.getItem("user"))
        : null;
  } catch (error) {
    console.log("GetCurrentUser -> Error", error);
    user = null;
  }
  return user;
};

export const setCurrentUser = (user) => {
  try {
    if (user !== null) {
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      localStorage.removeItem("user");
    }
  } catch (error) {
    console.log("SetCurrentUser -> Error", error);
  }
};

export const getUserSettings = () => {
  let user = {
    perPage: 10,
    expandMenu: true,
  };
  try {
    user =
      localStorage.getItem("user-settings") != null
        ? JSON.parse(localStorage.getItem("user-settings"))
        : user;
  } catch (error) {
    console.log("User-settings -> Error", error);
  }
  return user;
};

export const setUserSettings = (settings) => {
  console.log(settings);
  try {
    if (settings !== null) {
      localStorage.setItem("user-settings", JSON.stringify(settings));
    } else {
      localStorage.removeItem("user-settings");
    }
  } catch (error) {
    console.log("User-settings -> Error", error);
  }
};

export const getCurrentLanguage = () => {
  let locale = defaultLocale;
  try {
    if (
      localStorage.getItem("currentLanguage") &&
      localeOptions.filter(
        (x) => x.id === localStorage.getItem("currentLanguage")
      ).length > 0
    ) {
      locale = localStorage.getItem("currentLanguage");
    }
  } catch (error) {
    console.log("getCurrentLanguage -> error", error);
    locale = defaultLocale;
  }
  return locale;
};

export const setCurrentLanguage = (lang) => {
  try {
    localStorage.setItem("currentLanguage", lang);
  } catch (error) {
    console.log("setCurrentLanguage -> error", error);
  }
};

export function createBodyClickListener(fn) {
  let isListening = false;

  return {
    get isListening() {
      return isListening;
    },

    start(cb) {
      window.addEventListener("click", _onclick, true);
      window.addEventListener("keyup", _onescape, true);
      isListening = true;
      if (typeof cb === "function") cb();
    },

    stop(cb) {
      window.removeEventListener("click", _onclick, true);
      window.removeEventListener("keyup", _onescape, true);
      isListening = false;
      if (typeof cb === "function") cb();
    },
  };

  function _onclick(e) {
    e.preventDefault();
    if (typeof fn === "function") fn(e);
  }

  function _onescape(e) {
    if (e.keyCode === 27) _onclick(e);
  }
}

export function printElement() {
  let f = document.createElement("IFRAME");
  f.domain = document.domain;
  f.style.display = "none";
  document.body.appendChild(f);
  f.contentDocument.write(this.innerHTML);
  let s = document.head.getElementsByTagName("style");
  for (var i = 0; i < s.length; i++) {
    f.contentDocument.head.appendChild(s[i].cloneNode(true));
  }
  f.focus();
  f.contentWindow.print();
  f.parentNode.removeChild(f);
  window.focus();
}

export const isInViewport = (
  e,
  { top: t, height: h } = e.getBoundingClientRect()
) => t <= innerHeight && t + h >= 0;

export const ThemeColors = () => {
  let rootStyle = getComputedStyle(document.body);
  return {
    themeColor1: rootStyle.getPropertyValue("--theme-color-1").trim(),
    themeColor2: rootStyle.getPropertyValue("--theme-color-2").trim(),
    themeColor3: rootStyle.getPropertyValue("--theme-color-3").trim(),
    themeColor4: rootStyle.getPropertyValue("--theme-color-4").trim(),
    themeColor5: rootStyle.getPropertyValue("--theme-color-5").trim(),
    themeColor6: rootStyle.getPropertyValue("--theme-color-6").trim(),
    themeColor1_10: rootStyle.getPropertyValue("--theme-color-1-10").trim(),
    themeColor2_10: rootStyle.getPropertyValue("--theme-color-2-10").trim(),
    themeColor3_10: rootStyle.getPropertyValue("--theme-color-3-10").trim(),
    themeColor4_10: rootStyle.getPropertyValue("--theme-color-3-10").trim(),
    themeColor5_10: rootStyle.getPropertyValue("--theme-color-3-10").trim(),
    themeColor6_10: rootStyle.getPropertyValue("--theme-color-3-10").trim(),
    primaryColor: rootStyle.getPropertyValue("--primary-color").trim(),
    foregroundColor: rootStyle.getPropertyValue("--foreground-color").trim(),
    separatorColor: rootStyle.getPropertyValue("--separator-color").trim(),
    infoColor: rootStyle.getPropertyValue("--info-color").trim(),
    infoColor1_10: rootStyle.getPropertyValue("--info-color-1").trim(),
    infoColor2_10: rootStyle.getPropertyValue("--info-color-2").trim(),
    infoColor3_10: rootStyle.getPropertyValue("--info-color-3").trim(),
    infoColor4_10: rootStyle.getPropertyValue("--info-color-4").trim(),
    infoColor5_10: rootStyle.getPropertyValue("--info-color-5").trim(),
    infoColor6_10: rootStyle.getPropertyValue("--info-color-6").trim(),
    successColor: rootStyle.getPropertyValue("--success-color").trim(),
    warningColor: rootStyle.getPropertyValue("--warning-color").trim(),
    dangerColor: rootStyle.getPropertyValue("--danger-color").trim(),
  };
};

export const getDaysInMonth = (month, year) => {
  return new Date(year, month, 0).getDate();
};

export const monthName = (month, locale) => {
  var objDate = new Date();

  objDate.setDate(1);
  objDate.setMonth(month - 1);

  return objDate.toLocaleString(locale, { month: "long" });
};

export const downloadFromURL = (url) => {
  const a = document.createElement('a')
  a.href = url;
  a.download = url.split('/').pop();
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

export const languages = {
  ab: {
    name: "Abkhaz",
    nativeName: "аҧсуа",
  },
  aa: {
    name: "Afar",
    nativeName: "Afaraf",
  },
  af: {
    name: "Afrikaans",
    nativeName: "Afrikaans",
  },
  ak: {
    name: "Akan",
    nativeName: "Akan",
  },
  sq: {
    name: "Albanian",
    nativeName: "Shqip",
  },
  am: {
    name: "Amharic",
    nativeName: "አማርኛ",
  },
  ar: {
    name: "Arabic",
    nativeName: "العربية",
  },
  an: {
    name: "Aragonese",
    nativeName: "Aragonés",
  },
  hy: {
    name: "Armenian",
    nativeName: "Հայերեն",
  },
  as: {
    name: "Assamese",
    nativeName: "অসমীয়া",
  },
  av: {
    name: "Avaric",
    nativeName: "авар мацӀ, магӀарул мацӀ",
  },
  ae: {
    name: "Avestan",
    nativeName: "avesta",
  },
  ay: {
    name: "Aymara",
    nativeName: "aymar aru",
  },
  az: {
    name: "Azerbaijani",
    nativeName: "azərbaycan dili",
  },
  bm: {
    name: "Bambara",
    nativeName: "bamanankan",
  },
  ba: {
    name: "Bashkir",
    nativeName: "башҡорт теле",
  },
  eu: {
    name: "Basque",
    nativeName: "euskara, euskera",
  },
  be: {
    name: "Belarusian",
    nativeName: "Беларуская",
  },
  bn: {
    name: "Bengali",
    nativeName: "বাংলা",
  },
  bh: {
    name: "Bihari",
    nativeName: "भोजपुरी",
  },
  bi: {
    name: "Bislama",
    nativeName: "Bislama",
  },
  bs: {
    name: "Bosnian",
    nativeName: "bosanski jezik",
  },
  br: {
    name: "Breton",
    nativeName: "brezhoneg",
  },
  bg: {
    name: "Bulgarian",
    nativeName: "български език",
  },
  my: {
    name: "Burmese",
    nativeName: "ဗမာစာ",
  },
  ca: {
    name: "Catalan; Valencian",
    nativeName: "Català",
  },
  ch: {
    name: "Chamorro",
    nativeName: "Chamoru",
  },
  ce: {
    name: "Chechen",
    nativeName: "нохчийн мотт",
  },
  ny: {
    name: "Chichewa; Chewa; Nyanja",
    nativeName: "chiCheŵa, chinyanja",
  },
  zh: {
    name: "Chinese",
    nativeName: "中文 (Zhōngwén), 汉语, 漢語",
  },
  cv: {
    name: "Chuvash",
    nativeName: "чӑваш чӗлхи",
  },
  kw: {
    name: "Cornish",
    nativeName: "Kernewek",
  },
  co: {
    name: "Corsican",
    nativeName: "corsu, lingua corsa",
  },
  cr: {
    name: "Cree",
    nativeName: "ᓀᐦᐃᔭᐍᐏᐣ",
  },
  hr: {
    name: "Croatian",
    nativeName: "hrvatski",
  },
  cs: {
    name: "Czech",
    nativeName: "česky, čeština",
  },
  da: {
    name: "Danish",
    nativeName: "dansk",
  },
  dv: {
    name: "Divehi; Dhivehi; Maldivian;",
    nativeName: "ދިވެހި",
  },
  nl: {
    name: "Dutch",
    nativeName: "Nederlands, Vlaams",
  },
  en: {
    name: "English",
    nativeName: "English",
  },
  eo: {
    name: "Esperanto",
    nativeName: "Esperanto",
  },
  et: {
    name: "Estonian",
    nativeName: "eesti, eesti keel",
  },
  ee: {
    name: "Ewe",
    nativeName: "Eʋegbe",
  },
  fo: {
    name: "Faroese",
    nativeName: "føroyskt",
  },
  fj: {
    name: "Fijian",
    nativeName: "vosa Vakaviti",
  },
  fi: {
    name: "Finnish",
    nativeName: "suomi, suomen kieli",
  },
  fr: {
    name: "French",
    nativeName: "français, langue française",
  },
  ff: {
    name: "Fula; Fulah; Pulaar; Pular",
    nativeName: "Fulfulde, Pulaar, Pular",
  },
  gl: {
    name: "Galician",
    nativeName: "Galego",
  },
  ka: {
    name: "Georgian",
    nativeName: "ქართული",
  },
  de: {
    name: "German",
    nativeName: "Deutsch",
  },
  el: {
    name: "Greek, Modern",
    nativeName: "Ελληνικά",
  },
  gn: {
    name: "Guaraní",
    nativeName: "Avañeẽ",
  },
  gu: {
    name: "Gujarati",
    nativeName: "ગુજરાતી",
  },
  ht: {
    name: "Haitian; Haitian Creole",
    nativeName: "Kreyòl ayisyen",
  },
  ha: {
    name: "Hausa",
    nativeName: "Hausa, هَوُسَ",
  },
  he: {
    name: "Hebrew",
    nativeName: "עברית",
  },
  iw: {
    name: "Hebrew",
    nativeName: "עברית",
  },
  hz: {
    name: "Herero",
    nativeName: "Otjiherero",
  },
  hi: {
    name: "Hindi",
    nativeName: "हिन्दी, हिंदी",
  },
  ho: {
    name: "Hiri Motu",
    nativeName: "Hiri Motu",
  },
  hu: {
    name: "Hungarian",
    nativeName: "Magyar",
  },
  ia: {
    name: "Interlingua",
    nativeName: "Interlingua",
  },
  id: {
    name: "Indonesian",
    nativeName: "Bahasa Indonesia",
  },
  ga: {
    name: "Irish",
    nativeName: "Gaeilge",
  },
  ig: {
    name: "Igbo",
    nativeName: "Asụsụ Igbo",
  },
  ik: {
    name: "Inupiaq",
    nativeName: "Iñupiaq, Iñupiatun",
  },
  io: {
    name: "Ido",
    nativeName: "Ido",
  },
  is: {
    name: "Icelandic",
    nativeName: "Íslenska",
  },
  it: {
    name: "Italian",
    nativeName: "Italiano",
  },
  iu: {
    name: "Inuktitut",
    nativeName: "ᐃᓄᒃᑎᑐᑦ",
  },
  ja: {
    name: "Japanese",
    nativeName: "日本語 (にほんご／にっぽんご)",
  },
  jv: {
    name: "Javanese",
    nativeName: "basa Jawa",
  },
  kl: {
    name: "Kalaallisut, Greenlandic",
    nativeName: "kalaallisut, kalaallit oqaasii",
  },
  kn: {
    name: "Kannada",
    nativeName: "ಕನ್ನಡ",
  },
  kr: {
    name: "Kanuri",
    nativeName: "Kanuri",
  },
  ks: {
    name: "Kashmiri",
    nativeName: "कश्मीरी, كشميري‎",
  },
  kk: {
    name: "Kazakh",
    nativeName: "Қазақ тілі",
  },
  km: {
    name: "Khmer",
    nativeName: "ភាសាខ្មែរ",
  },
  ki: {
    name: "Kikuyu, Gikuyu",
    nativeName: "Gĩkũyũ",
  },
  rw: {
    name: "Kinyarwanda",
    nativeName: "Ikinyarwanda",
  },
  ky: {
    name: "Kirghiz, Kyrgyz",
    nativeName: "кыргыз тили",
  },
  kv: {
    name: "Komi",
    nativeName: "коми кыв",
  },
  kg: {
    name: "Kongo",
    nativeName: "KiKongo",
  },
  ko: {
    name: "Korean",
    nativeName: "한국어 (韓國語), 조선말 (朝鮮語)",
  },
  ku: {
    name: "Kurdish",
    nativeName: "Kurdî, كوردی‎",
  },
  kj: {
    name: "Kwanyama, Kuanyama",
    nativeName: "Kuanyama",
  },
  la: {
    name: "Latin",
    nativeName: "latine, lingua latina",
  },
  lb: {
    name: "Luxembourgish, Letzeburgesch",
    nativeName: "Lëtzebuergesch",
  },
  lg: {
    name: "Luganda",
    nativeName: "Luganda",
  },
  li: {
    name: "Limburgish, Limburgan, Limburger",
    nativeName: "Limburgs",
  },
  ln: {
    name: "Lingala",
    nativeName: "Lingála",
  },
  lo: {
    name: "Lao",
    nativeName: "ພາສາລາວ",
  },
  lt: {
    name: "Lithuanian",
    nativeName: "lietuvių kalba",
  },
  lu: {
    name: "Luba-Katanga",
    nativeName: "",
  },
  lv: {
    name: "Latvian",
    nativeName: "latviešu valoda",
  },
  gv: {
    name: "Manx",
    nativeName: "Gaelg, Gailck",
  },
  mk: {
    name: "Macedonian",
    nativeName: "македонски јазик",
  },
  mg: {
    name: "Malagasy",
    nativeName: "Malagasy fiteny",
  },
  ms: {
    name: "Malay",
    nativeName: "bahasa Melayu, بهاس ملايو‎",
  },
  ml: {
    name: "Malayalam",
    nativeName: "മലയാളം",
  },
  mt: {
    name: "Maltese",
    nativeName: "Malti",
  },
  mi: {
    name: "Māori",
    nativeName: "te reo Māori",
  },
  mr: {
    name: "Marathi (Marāṭhī)",
    nativeName: "मराठी",
  },
  mh: {
    name: "Marshallese",
    nativeName: "Kajin M̧ajeļ",
  },
  mn: {
    name: "Mongolian",
    nativeName: "монгол",
  },
  na: {
    name: "Nauru",
    nativeName: "Ekakairũ Naoero",
  },
  nv: {
    name: "Navajo, Navaho",
    nativeName: "Diné bizaad, Dinékʼehǰí",
  },
  nb: {
    name: "Norwegian Bokmål",
    nativeName: "Norsk bokmål",
  },
  nd: {
    name: "North Ndebele",
    nativeName: "isiNdebele",
  },
  ne: {
    name: "Nepali",
    nativeName: "नेपाली",
  },
  ng: {
    name: "Ndonga",
    nativeName: "Owambo",
  },
  nn: {
    name: "Norwegian Nynorsk",
    nativeName: "Norsk nynorsk",
  },
  no: {
    name: "Norwegian",
    nativeName: "Norsk",
  },
  ii: {
    name: "Nuosu",
    nativeName: "ꆈꌠ꒿ Nuosuhxop",
  },
  nr: {
    name: "South Ndebele",
    nativeName: "isiNdebele",
  },
  oc: {
    name: "Occitan",
    nativeName: "Occitan",
  },
  oj: {
    name: "Ojibwe, Ojibwa",
    nativeName: "ᐊᓂᔑᓈᐯᒧᐎᓐ",
  },
  cu: {
    name: "Old Church Slavonic, Church Slavic, Church Slavonic, Old Bulgarian, Old Slavonic",
    nativeName: "ѩзыкъ словѣньскъ",
  },
  om: {
    name: "Oromo",
    nativeName: "Afaan Oromoo",
  },
  or: {
    name: "Oriya",
    nativeName: "ଓଡ଼ିଆ",
  },
  os: {
    name: "Ossetian, Ossetic",
    nativeName: "ирон æвзаг",
  },
  pa: {
    name: "Panjabi, Punjabi",
    nativeName: "ਪੰਜਾਬੀ, پنجابی‎",
  },
  pi: {
    name: "Pāli",
    nativeName: "पाऴि",
  },
  fa: {
    name: "Persian",
    nativeName: "فارسی",
  },
  pl: {
    name: "Polish",
    nativeName: "polski",
  },
  ps: {
    name: "Pashto, Pushto",
    nativeName: "پښتو",
  },
  pt: {
    name: "Portuguese",
    nativeName: "Português",
  },
  qu: {
    name: "Quechua",
    nativeName: "Runa Simi, Kichwa",
  },
  rm: {
    name: "Romansh",
    nativeName: "rumantsch grischun",
  },
  rn: {
    name: "Kirundi",
    nativeName: "kiRundi",
  },
  ro: {
    name: "Romanian, Moldavian, Moldovan",
    nativeName: "română",
  },
  ru: {
    name: "Russian",
    nativeName: "русский язык",
  },
  sa: {
    name: "Sanskrit (Saṁskṛta)",
    nativeName: "संस्कृतम्",
  },
  sc: {
    name: "Sardinian",
    nativeName: "sardu",
  },
  sd: {
    name: "Sindhi",
    nativeName: "सिन्धी, سنڌي، سندھی‎",
  },
  se: {
    name: "Northern Sami",
    nativeName: "Davvisámegiella",
  },
  sm: {
    name: "Samoan",
    nativeName: "gagana faa Samoa",
  },
  sg: {
    name: "Sango",
    nativeName: "yângâ tî sängö",
  },
  sr: {
    name: "Serbian",
    nativeName: "српски језик",
  },
  gd: {
    name: "Scottish Gaelic; Gaelic",
    nativeName: "Gàidhlig",
  },
  sn: {
    name: "Shona",
    nativeName: "chiShona",
  },
  si: {
    name: "Sinhala, Sinhalese",
    nativeName: "සිංහල",
  },
  sk: {
    name: "Slovak",
    nativeName: "slovenčina",
  },
  sl: {
    name: "Slovene",
    nativeName: "slovenščina",
  },
  so: {
    name: "Somali",
    nativeName: "Soomaaliga, af Soomaali",
  },
  st: {
    name: "Southern Sotho",
    nativeName: "Sesotho",
  },
  es: {
    name: "Spanish; Castilian",
    nativeName: "español, castellano",
  },
  su: {
    name: "Sundanese",
    nativeName: "Basa Sunda",
  },
  sw: {
    name: "Swahili",
    nativeName: "Kiswahili",
  },
  ss: {
    name: "Swati",
    nativeName: "SiSwati",
  },
  sv: {
    name: "Swedish",
    nativeName: "svenska",
  },
  ta: {
    name: "Tamil",
    nativeName: "தமிழ்",
  },
  te: {
    name: "Telugu",
    nativeName: "తెలుగు",
  },
  tg: {
    name: "Tajik",
    nativeName: "тоҷикӣ, toğikī, تاجیکی‎",
  },
  th: {
    name: "Thai",
    nativeName: "ไทย",
  },
  ti: {
    name: "Tigrinya",
    nativeName: "ትግርኛ",
  },
  bo: {
    name: "Tibetan Standard, Tibetan, Central",
    nativeName: "བོད་ཡིག",
  },
  tk: {
    name: "Turkmen",
    nativeName: "Türkmen, Түркмен",
  },
  tl: {
    name: "Tagalog",
    nativeName: "Wikang Tagalog, ᜏᜒᜃᜅ᜔ ᜆᜄᜎᜓᜄ᜔",
  },
  tn: {
    name: "Tswana",
    nativeName: "Setswana",
  },
  to: {
    name: "Tonga (Tonga Islands)",
    nativeName: "faka Tonga",
  },
  tr: {
    name: "Turkish",
    nativeName: "Türkçe",
  },
  ts: {
    name: "Tsonga",
    nativeName: "Xitsonga",
  },
  tt: {
    name: "Tatar",
    nativeName: "татарча, tatarça, تاتارچا‎",
  },
  tw: {
    name: "Twi",
    nativeName: "Twi",
  },
  ty: {
    name: "Tahitian",
    nativeName: "Reo Tahiti",
  },
  ug: {
    name: "Uighur, Uyghur",
    nativeName: "Uyƣurqə, ئۇيغۇرچە‎",
  },
  uk: {
    name: "Ukrainian",
    nativeName: "українська",
  },
  ur: {
    name: "Urdu",
    nativeName: "اردو",
  },
  uz: {
    name: "Uzbek",
    nativeName: "zbek, Ўзбек, أۇزبېك‎",
  },
  ve: {
    name: "Venda",
    nativeName: "Tshivenḓa",
  },
  vi: {
    name: "Vietnamese",
    nativeName: "Tiếng Việt",
  },
  vo: {
    name: "Volapük",
    nativeName: "Volapük",
  },
  wa: {
    name: "Walloon",
    nativeName: "Walon",
  },
  cy: {
    name: "Welsh",
    nativeName: "Cymraeg",
  },
  wo: {
    name: "Wolof",
    nativeName: "Wollof",
  },
  fy: {
    name: "Western Frisian",
    nativeName: "Frysk",
  },
  xh: {
    name: "Xhosa",
    nativeName: "isiXhosa",
  },
  yi: {
    name: "Yiddish",
    nativeName: "ייִדיש",
  },
  yo: {
    name: "Yoruba",
    nativeName: "Yorùbá",
  },
  za: {
    name: "Zhuang, Chuang",
    nativeName: "Saɯ cueŋƅ, Saw cuengh",
  },
};

export const countries = [
  { code: "AF", name: "Afghanistan" },
  { code: "AX", name: "\u00c5land Islands" },
  { code: "AL", name: "Albania" },
  { code: "DZ", name: "Algeria" },
  { code: "AS", name: "American Samoa" },
  { code: "AD", name: "Andorra" },
  { code: "AO", name: "Angola" },
  { code: "AI", name: "Anguilla" },
  { code: "AQ", name: "Antarctica" },
  { code: "AG", name: "Antigua and Barbuda" },
  { code: "AR", name: "Argentina" },
  { code: "AM", name: "Armenia" },
  { code: "AW", name: "Aruba" },
  { code: "AU", name: "Australia" },
  { code: "AT", name: "Austria" },
  { code: "AZ", name: "Azerbaijan" },
  { code: "BS", name: "Bahamas" },
  { code: "BH", name: "Bahrain" },
  { code: "BD", name: "Bangladesh" },
  { code: "BB", name: "Barbados" },
  { code: "BY", name: "Belarus" },
  { code: "BE", name: "Belgium" },
  { code: "BZ", name: "Belize" },
  { code: "BJ", name: "Benin" },
  { code: "BM", name: "Bermuda" },
  { code: "BT", name: "Bhutan" },
  { code: "BO", name: "Bolivia" },
  { code: "BQ", name: "Bonaire" },
  { code: "BA", name: "Bosnia and Herzegovina" },
  { code: "BW", name: "Botswana" },
  { code: "BV", name: "Bouvet Island" },
  { code: "BR", name: "Brazil" },
  { code: "IO", name: "British Indian Ocean" },
  { code: "BN", name: "Brunei Darussalam" },
  { code: "BG", name: "Bulgaria" },
  { code: "BF", name: "Burkina Faso" },
  { code: "BI", name: "Burundi" },
  { code: "KH", name: "Cambodia" },
  { code: "CM", name: "Cameroon" },
  { code: "CA", name: "Canada" },
  { code: "CV", name: "Cape Verde" },
  { code: "KY", name: "Cayman Islands" },
  { code: "CF", name: "Central African Republic" },
  { code: "TD", name: "Chad" },
  { code: "CL", name: "Chile" },
  { code: "CN", name: "China" },
  { code: "CX", name: "Christmas Island" },
  { code: "CC", name: "Cocos (Keeling) Islands" },
  { code: "CO", name: "Colombia" },
  { code: "KM", name: "Comoros" },
  { code: "CG", name: "Congo" },
  { code: "CD", name: "Congo" },
  { code: "CK", name: "Cook Islands" },
  { code: "CR", name: "Costa Rica" },
  { code: "CI", name: "C\u00f4te d'Ivoire" },
  { code: "HR", name: "Croatia" },
  { code: "CU", name: "Cuba" },
  { code: "CW", name: "Cura\u00e7ao" },
  { code: "CY", name: "Cyprus" },
  { code: "CZ", name: "Czech Republic" },
  { code: "DK", name: "Denmark" },
  { code: "DJ", name: "Djibouti" },
  { code: "DM", name: "Dominica" },
  { code: "DO", name: "Dominican Republic" },
  { code: "EC", name: "Ecuador" },
  { code: "EG", name: "Egypt" },
  { code: "SV", name: "El Salvador" },
  { code: "GQ", name: "Equatorial Guinea" },
  { code: "ER", name: "Eritrea" },
  { code: "EE", name: "Estonia" },
  { code: "ET", name: "Ethiopia" },
  { code: "FK", name: "Falkland Islands (Malvinas)" },
  { code: "FO", name: "Faroe Islands" },
  { code: "FJ", name: "Fiji" },
  { code: "FI", name: "Finland" },
  { code: "FR", name: "France" },
  { code: "GF", name: "French Guiana" },
  { code: "PF", name: "French Polynesia" },
  { code: "TF", name: "French Southern Territories" },
  { code: "GA", name: "Gabon" },
  { code: "GM", name: "Gambia" },
  { code: "GE", name: "Georgia" },
  { code: "DE", name: "Germany" },
  { code: "GH", name: "Ghana" },
  { code: "GI", name: "Gibraltar" },
  { code: "GR", name: "Greece" },
  { code: "GL", name: "Greenland" },
  { code: "GD", name: "Grenada" },
  { code: "GP", name: "Guadeloupe" },
  { code: "GU", name: "Guam" },
  { code: "GT", name: "Guatemala" },
  { code: "GG", name: "Guernsey" },
  { code: "GN", name: "Guinea" },
  { code: "GW", name: "Guinea-Bissau" },
  { code: "GY", name: "Guyana" },
  { code: "HT", name: "Haiti" },
  { code: "HM", name: "Heard Island and McDonald Islands" },
  { code: "VA", name: "Holy See (Vatican City State)" },
  { code: "HN", name: "Honduras" },
  { code: "HK", name: "Hong Kong" },
  { code: "HU", name: "Hungary" },
  { code: "IS", name: "Iceland" },
  { code: "IN", name: "India" },
  { code: "ID", name: "Indonesia" },
  { code: "IR", name: "Iran" },
  { code: "IQ", name: "Iraq" },
  { code: "IE", name: "Ireland" },
  { code: "IM", name: "Isle of Man" },
  { code: "IL", name: "Israel" },
  { code: "IT", name: "Italy" },
  { code: "JM", name: "Jamaica" },
  { code: "JP", name: "Japan" },
  { code: "JE", name: "Jersey" },
  { code: "JO", name: "Jordan" },
  { code: "KZ", name: "Kazakhstan" },
  { code: "KE", name: "Kenya" },
  { code: "KI", name: "Kiribati" },
  { code: "KP", name: "Korea" },
  { code: "KR", name: "Korea" },
  { code: "KW", name: "Kuwait" },
  { code: "KG", name: "Kyrgyzstan" },
  { code: "LA", name: "Lao People's Democratic Republic" },
  { code: "LV", name: "Latvia" },
  { code: "LB", name: "Lebanon" },
  { code: "LS", name: "Lesotho" },
  { code: "LR", name: "Liberia" },
  { code: "LY", name: "Libya" },
  { code: "LI", name: "Liechtenstein" },
  { code: "LT", name: "Lithuania" },
  { code: "LU", name: "Luxembourg" },
  { code: "MO", name: "Macao" },
  { code: "MK", name: "Macedonia" },
  { code: "MG", name: "Madagascar" },
  { code: "MW", name: "Malawi" },
  { code: "MY", name: "Malaysia" },
  { code: "MV", name: "Maldives" },
  { code: "ML", name: "Mali" },
  { code: "MT", name: "Malta" },
  { code: "MH", name: "Marshall Islands" },
  { code: "MQ", name: "Martinique" },
  { code: "MR", name: "Mauritania" },
  { code: "MU", name: "Mauritius" },
  { code: "YT", name: "Mayotte" },
  { code: "MX", name: "Mexico" },
  { code: "FM", name: "Micronesia" },
  { code: "MD", name: "Moldova" },
  { code: "MC", name: "Monaco" },
  { code: "MN", name: "Mongolia" },
  { code: "ME", name: "Montenegro" },
  { code: "MS", name: "Montserrat" },
  { code: "MA", name: "Morocco" },
  { code: "MZ", name: "Mozambique" },
  { code: "MM", name: "Myanmar" },
  { code: "NA", name: "Namibia" },
  { code: "NR", name: "Nauru" },
  { code: "NP", name: "Nepal" },
  { code: "NL", name: "Netherlands" },
  { code: "NC", name: "New Caledonia" },
  { code: "NZ", name: "New Zealand" },
  { code: "NI", name: "Nicaragua" },
  { code: "NE", name: "Niger" },
  { code: "NG", name: "Nigeria" },
  { code: "NU", name: "Niue" },
  { code: "NF", name: "Norfolk Island" },
  { code: "MP", name: "Northern Mariana Islands" },
  { code: "NO", name: "Norway" },
  { code: "OM", name: "Oman" },
  { code: "PK", name: "Pakistan" },
  { code: "PW", name: "Palau" },
  { code: "PS", name: "Palestine, State of" },
  { code: "PA", name: "Panama" },
  { code: "PG", name: "Papua New Guinea" },
  { code: "PY", name: "Paraguay" },
  { code: "PE", name: "Peru" },
  { code: "PH", name: "Philippines" },
  { code: "PN", name: "Pitcairn" },
  { code: "PL", name: "Poland" },
  { code: "PT", name: "Portugal" },
  { code: "PR", name: "Puerto Rico" },
  { code: "QA", name: "Qatar" },
  { code: "RE", name: "R\u00e9union" },
  { code: "RO", name: "Romania" },
  { code: "RU", name: "Russian Federation" },
  { code: "RW", name: "Rwanda" },
  { code: "BL", name: "Saint Barth\u00e9lemy" },
  { code: "SH", name: "Saint Helena" },
  { code: "KN", name: "Saint Kitts and Nevis" },
  { code: "LC", name: "Saint Lucia" },
  { code: "MF", name: "Saint Martin (French part)" },
  { code: "PM", name: "Saint Pierre and Miquelon" },
  { code: "VC", name: "Saint Vincent and the Grenadines" },
  { code: "WS", name: "Samoa" },
  { code: "SM", name: "San Marino" },
  { code: "ST", name: "Sao Tome and Principe" },
  { code: "SA", name: "Saudi Arabia" },
  { code: "SN", name: "Senegal" },
  { code: "RS", name: "Serbia" },
  { code: "SC", name: "Seychelles" },
  { code: "SL", name: "Sierra Leone" },
  { code: "SG", name: "Singapore" },
  { code: "SX", name: "Sint Maarten" },
  { code: "SK", name: "Slovakia" },
  { code: "SI", name: "Slovenia" },
  { code: "SB", name: "Solomon Islands" },
  { code: "SO", name: "Somalia" },
  { code: "ZA", name: "South Africa" },
  { code: "GS", name: "South Georgia and the South Sandwich Islands" },
  { code: "SS", name: "South Sudan" },
  { code: "ES", name: "Spain" },
  { code: "LK", name: "Sri Lanka" },
  { code: "SD", name: "Sudan" },
  { code: "SR", name: "Suriname" },
  { code: "SJ", name: "Svalbard and Jan Mayen" },
  { code: "SZ", name: "Swaziland" },
  { code: "SE", name: "Sweden" },
  { code: "CH", name: "Switzerland" },
  { code: "SY", name: "Syrian Arab Republic" },
  { code: "TW", name: "Taiwan" },
  { code: "TJ", name: "Tajikistan" },
  { code: "TZ", name: "Tanzania" },
  { code: "TH", name: "Thailand" },
  { code: "TL", name: "Timor-Leste" },
  { code: "TG", name: "Togo" },
  { code: "TK", name: "Tokelau" },
  { code: "TO", name: "Tonga" },
  { code: "TT", name: "Trinidad and Tobago" },
  { code: "TN", name: "Tunisia" },
  { code: "TR", name: "Turkey" },
  { code: "TM", name: "Turkmenistan" },
  { code: "TC", name: "Turks and Caicos Islands" },
  { code: "TV", name: "Tuvalu" },
  { code: "UG", name: "Uganda" },
  { code: "UA", name: "Ukraine" },
  { code: "AE", name: "United Arab Emirates" },
  { code: "GB", name: "United Kingdom" },
  { code: "US", name: "United States" },
  { code: "UM", name: "United States Minor Outlying Islands" },
  { code: "UY", name: "Uruguay" },
  { code: "UZ", name: "Uzbekistan" },
  { code: "VU", name: "Vanuatu" },
  { code: "VE", name: "Venezuela" },
  { code: "VN", name: "Viet Nam" },
  { code: "VG", name: "Virgin Islands, British" },
  { code: "VI", name: "Virgin Islands, U.S." },
  { code: "WF", name: "Wallis and Futuna" },
  { code: "EH", name: "Western Sahara" },
  { code: "YE", name: "Yemen" },
  { code: "ZM", name: "Zambia" },
  { code: "ZW", name: "Zimbabwe" },
];
