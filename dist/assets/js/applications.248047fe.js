(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["applications"],{"1b28":function(t,a,e){"use strict";e("d146")},4242:function(t,a,e){"use strict";e.r(a);var s=function(){var t=this,a=t.$createElement,e=t._self._c||a;return e("erd-row",{class:{"app-row":t.isXDPro}},[e("erd-breadcrumb",{attrs:{items:t.breadcrumb,heading:t.heading}},[e("erd-button",{staticClass:"mr-2 py-1 px-2",attrs:{icon:"las la-sync"},on:{click:t.doRefresh}},[t._v(t._s(t.$t("general.refresh")))]),t.isXDPro&&1===t.activeTab?e("span",{staticClass:"text-muted"},[t._v(t._s(t.$t("general.from-to-total").format(this.total>0?this.from+1:this.from,this.to,this.total)))]):t._e()],1),t.isXDPro?e("erd-tab",{attrs:{tabs:t.tabsXDPro},model:{value:t.activeTab,callback:function(a){t.activeTab=a},expression:"activeTab"}}):t._e(),t.isXDPro?t._e():e("div",{staticClass:"seperator page"}),e("router-view",{staticClass:"px-0 mt-0"})],1)},o=[],n=e("5530"),l=(e("d81d"),e("b0c0"),e("2ebf")),i=(e("0dcc"),e("2f62")),r={data:function(){return{tabsXDPro:[this.$t("tabs.xd-pro"),this.$t("tabs.downloads")],activeTab:0,from:0,to:0,total:0}},computed:Object(n["a"])(Object(n["a"])({},Object(i["c"])(["currentUser"])),{},{breadcrumb:function(){var t=this,a=[];return this.$route.matched.map((function(e){a.push({text:t.$t("menu.".concat(e.name.toLowerCase())),to:""!==e.path?e.path:"/"})})),a},heading:function(){var t=this.breadcrumb;return t[t.length-1].text},isXDPro:function(){return/\/applications\/xd-pro/.test(this.$route.path)}}),methods:Object(n["a"])(Object(n["a"])({},Object(i["b"])(["updateSoundcloudId"])),{},{doRefresh:function(){l["a"].$emit("refresh")},updateFrom:function(t){this.from=t},updateTo:function(t){this.to=t},updateTotal:function(t){this.total=t}}),watch:{$route:function(){this.to=0,this.from=0,this.total=0,this.activeTab=0,this.editorPlaylist=void 0,!0!==this.$route.params.editor&&(this.editor=!1)},activeTab:function(t){l["a"].$emit("tab-change",t)}},beforeMount:function(){l["a"].$on("update-from",this.updateFrom),l["a"].$on("update-to",this.updateTo),l["a"].$on("update-total",this.updateTotal)},beforeDestroy:function(){l["a"].$off("update-from",this.updateFrom),l["a"].$off("update-to",this.updateTo),l["a"].$off("update-total",this.updateTotal)}},d=r,c=(e("b7eb"),e("2877")),u=Object(c["a"])(d,s,o,!1,null,"550e8cd2",null);a["default"]=u.exports},b7eb:function(t,a,e){"use strict";e("dd1d")},d146:function(t,a,e){},dd1d:function(t,a,e){},fa6f:function(t,a,e){"use strict";e.r(a);var s=function(){var t=this,a=t.$createElement,e=t._self._c||a;return e("erd-row",{staticClass:"m-0 p-0"},[t.isLoading?e("erd-spinner",{attrs:{size:"lg",overlay:"",absolute:""}}):t._e(),e("erd-modal",{directives:[{name:"show",rawName:"v-show",value:t.xdPro.modal,expression:"xdPro.modal"}],staticClass:"select-none",attrs:{title:t.$t("xd-pro.xd-pro"),small:""},on:{close:function(a){return t.xdProModal(!1)}},scopedSlots:t._u([{key:"footer",fn:function(){return[e("erd-button",{staticClass:"mr-1",attrs:{icon:"la-times",variant:"danger"},on:{click:function(a){return t.xdProModal(!1)}}},[t._v(t._s(t.$t("general.cancel")))]),e("erd-button",{attrs:{icon:"la-check",variant:"success"},on:{click:function(a){return t.xdProModal(!1,!0)}}},[t._v(t._s(t.$t("general.ok")))])]},proxy:!0}])},[t.xdPro.instance?e("div",{staticClass:"px-2"},[e("label",{staticClass:"w-100"},[t._v(t._s(t.$t("xd-pro.name")))]),e("erd-input",{staticClass:"mt-1 mb-2 w-100",model:{value:t.xdPro.instance.name,callback:function(a){t.$set(t.xdPro.instance,"name",a)},expression:"xdPro.instance.name"}}),e("label",{staticClass:"w-100"},[t._v(t._s(t.$t("xd-pro.speed-limit")))]),e("erd-select",{key:"speed-limit",staticClass:"w-100 mt-1 mb-2",attrs:{items:t.speedLimits},model:{value:t.xdPro.instance.speed_limit,callback:function(a){t.$set(t.xdPro.instance,"speed_limit",a)},expression:"xdPro.instance.speed_limit"}}),e("label",{staticClass:"w-100"},[t._v(t._s(t.$t("xd-pro.useragent")))]),e("erd-select",{key:"useragent",staticClass:"w-100 mt-1 mb-2",attrs:{items:t.useragents},model:{value:t.xdPro.instance.useragent,callback:function(a){t.$set(t.xdPro.instance,"useragent",a)},expression:"xdPro.instance.useragent"}}),e("label",{staticClass:"w-100"},[t._v(t._s(t.$t("xd-pro.download-folder")))]),e("erd-input",{staticClass:"mt-1 mb-2 w-100",model:{value:t.xdPro.instance.download_folder,callback:function(a){t.$set(t.xdPro.instance,"download_folder",a)},expression:"xdPro.instance.download_folder"}}),e("erd-checkbox",{staticClass:"mb-3",attrs:{"true-value":1,"false-value":0},model:{value:t.xdPro.instance.check_connections,callback:function(a){t.$set(t.xdPro.instance,"check_connections",a)},expression:"xdPro.instance.check_connections"}},[t._v(t._s(t.$t("xd-pro.check-connections")))]),e("div",{staticClass:"mb-5"})],1):t._e()]),e("erd-modal",{directives:[{name:"show",rawName:"v-show",value:t.downloads.modal,expression:"downloads.modal"}],staticClass:"select-none",attrs:{title:t.$t("xd-pro.downloads"),small:""},on:{close:function(a){return t.downloadModal(!1)}},scopedSlots:t._u([{key:"footer",fn:function(){return[e("erd-button",{staticClass:"mr-1",attrs:{icon:"la-times",variant:"danger"},on:{click:function(a){return t.downloadModal(!1)}}},[t._v(t._s(t.$t("general.cancel")))]),e("erd-button",{attrs:{icon:"la-check",variant:"success"},on:{click:function(a){return t.downloadModal(!1,!0)}}},[t._v(t._s(t.$t("general.ok")))])]},proxy:!0}])},[t.downloads.download?e("div",{staticClass:"px-2"},[e("label",{staticClass:"w-100"},[t._v(t._s(t.$t("xd-pro.xd-pro-instance")))]),e("erd-select",{key:"instance",staticClass:"w-100 mt-1 mb-2",attrs:{items:t.downloadInstances},model:{value:t.downloads.download.xdpro_id,callback:function(a){t.$set(t.downloads.download,"xdpro_id",a)},expression:"downloads.download.xdpro_id"}}),e("label",{staticClass:"w-100"},[t._v(t._s(t.$t("xd-pro.download-url")))]),e("erd-input",{staticClass:"mt-1 mb-2 w-100",model:{value:t.downloads.download.download_url,callback:function(a){t.$set(t.downloads.download,"download_url",a)},expression:"downloads.download.download_url"}}),e("label",{staticClass:"w-100"},[t._v(t._s(t.$t("xd-pro.filename")))]),e("erd-input",{staticClass:"mt-1 mb-2 w-100",model:{value:t.downloads.download.filename,callback:function(a){t.$set(t.downloads.download,"filename",a)},expression:"downloads.download.filename"}}),e("label",{staticClass:"w-100"},[t._v(t._s(t.$t("xd-pro.file-extension")))]),e("erd-input",{staticClass:"mt-1 mb-2 w-100",model:{value:t.downloads.download.file_extension,callback:function(a){t.$set(t.downloads.download,"file_extension",a)},expression:"downloads.download.file_extension"}}),e("label",{staticClass:"w-100"},[t._v(t._s(t.$t("xd-pro.download-folder")))]),e("erd-input",{staticClass:"mt-1 mb-2 w-100",model:{value:t.downloads.download.download_folder,callback:function(a){t.$set(t.downloads.download,"download_folder",a)},expression:"downloads.download.download_folder"}})],1):t._e()]),e("erd-col",{directives:[{name:"show",rawName:"v-show",value:0==t.activeTab,expression:"activeTab == 0"}],attrs:{xl:"12",sm:"12"}},[e("b-table",{attrs:{items:t.pagedInstances,fields:t.xdPro.fields,striped:"",small:""},scopedSlots:t._u([{key:"cell(speed_limit)",fn:function(a){return[t._v(" "+t._s(t.speedLimits.find((function(t){return t.value===a.item.speed_limit})).text)+" ")]}},{key:"cell(check_connections)",fn:function(a){return[a.item.check_connections?e("erd-badge",{attrs:{variant:"success"}},[t._v(t._s(t.$t("general.yes")))]):e("erd-badge",{attrs:{variant:"danger"}},[t._v(t._s(t.$t("general.no")))])]}},{key:"cell(actions)",fn:function(a){return[e("erd-tooltip",{attrs:{tooltip:t.$t("xd-pro.tooltip-edit-instance"),enabled:t.showTooltips}},[e("erd-button",{staticClass:"btn-table",attrs:{variant:"info"},on:{click:function(e){return t.editInstance(a.item)}}},[e("i",{staticClass:"las la-pen"})])],1),e("erd-tooltip",{attrs:{tooltip:t.$t("xd-pro.tooltip-delete-instance"),enabled:t.showTooltips}},[e("erd-button",{staticClass:"btn-table",attrs:{variant:"danger"},on:{click:function(e){return t.deleteInstance(a.item.id)}}},[e("i",{staticClass:"las la-trash"})])],1)]}}])}),e("b-pagination",{key:"xdpro-instances",staticClass:"w-100 my-3",attrs:{size:"sm",align:"center","total-rows":t.xdPro.total,"per-page":t.perPage},scopedSlots:t._u([{key:"next-text",fn:function(){return[e("i",{staticClass:"las la-angle-right"})]},proxy:!0},{key:"prev-text",fn:function(){return[e("i",{staticClass:"las la-angle-left"})]},proxy:!0},{key:"first-text",fn:function(){return[e("i",{staticClass:"las la-angle-double-left"})]},proxy:!0},{key:"last-text",fn:function(){return[e("i",{staticClass:"las la-angle-double-right"})]},proxy:!0}]),model:{value:t.xdPro.currentPage,callback:function(a){t.$set(t.xdPro,"currentPage",a)},expression:"xdPro.currentPage"}})],1),e("erd-col",{directives:[{name:"show",rawName:"v-show",value:1==t.activeTab,expression:"activeTab == 1"}],attrs:{xl:"12",sm:"12"}},[e("b-table",{attrs:{items:t.pagedDownloads,fields:t.downloads.fields,striped:"",small:""},scopedSlots:t._u([{key:"cell(type)",fn:function(a){return[1==a.item.type?e("erd-badge",{attrs:{variant:"info"}},[e("i",{staticClass:"las la-film mr-1"}),t._v(t._s(t.$t("xd-pro.movie")))]):t._e(),2==a.item.type?e("erd-badge",{attrs:{variant:"primary"}},[e("i",{staticClass:"las la-video mr-1"}),t._v(t._s(t.$t("xd-pro.series")))]):t._e(),3==a.item.type?e("erd-badge",{attrs:{variant:"success"}},[e("i",{staticClass:"las la-tv mr-1"}),t._v(t._s(t.$t("xd-pro.catch-up")))]):t._e()]}},{key:"cell(active)",fn:function(a){return[1==a.item.active?e("erd-badge",{attrs:{variant:"success"}},[t._v(t._s(t.$t("general.yes")))]):e("erd-badge",{attrs:{variant:"danger"}},[t._v(t._s(t.$t("general.no")))])]}},{key:"cell(enabled)",fn:function(a){return[1==a.item.enabled?e("erd-badge",{attrs:{variant:"success"}},[t._v(t._s(t.$t("general.yes")))]):e("erd-badge",{attrs:{variant:"danger"}},[t._v(t._s(t.$t("general.no")))])]}},{key:"cell(progress)",fn:function(t){return[e("erd-progress-bar",{staticClass:"download-progress",attrs:{variant:t.item.has_error?"danger":"info",value:t.item.progress}})]}},{key:"cell(actions)",fn:function(a){return[e("erd-tooltip",{attrs:{tooltip:t.$t("xd-pro.tooltip-edit-download"),enabled:t.showTooltips}},[e("erd-button",{staticClass:"btn-table",attrs:{variant:"info",disabled:1==a.item.active},on:{click:function(e){return t.editDownload(a.item)}}},[e("i",{staticClass:"las la-pen"})])],1),e("erd-tooltip",{attrs:{tooltip:t.$t("xd-pro.tooltip-pause-download"),enabled:t.showTooltips}},[e("erd-button",{staticClass:"btn-table",attrs:{variant:"primary",disabled:1==a.item.active||0==a.item.enabled},on:{click:function(e){return t.pauseDownload(a.item)}}},[e("i",{staticClass:"las la-pause"})])],1),e("erd-tooltip",{attrs:{tooltip:t.$t("xd-pro.tooltip-resume-download"),enabled:t.showTooltips}},[e("erd-button",{staticClass:"btn-table",attrs:{variant:"primary",disabled:1==a.item.active||1==a.item.enabled},on:{click:function(e){return t.resumeDownload(a.item)}}},[e("i",{staticClass:"las la-play"})])],1),e("erd-tooltip",{attrs:{tooltip:t.$t("xd-pro.tooltip-delete-download"),enabled:t.showTooltips}},[e("erd-button",{staticClass:"btn-table",attrs:{variant:"danger",disabled:1==a.item.active},on:{click:function(e){return t.deleteDownload(a.item.id)}}},[e("i",{staticClass:"las la-trash"})])],1)]}}])}),e("b-pagination",{key:"xdpro-downloads",staticClass:"w-100 my-3",attrs:{size:"sm",align:"center","total-rows":t.downloads.total,"per-page":t.perPage},scopedSlots:t._u([{key:"next-text",fn:function(){return[e("i",{staticClass:"las la-angle-right"})]},proxy:!0},{key:"prev-text",fn:function(){return[e("i",{staticClass:"las la-angle-left"})]},proxy:!0},{key:"first-text",fn:function(){return[e("i",{staticClass:"las la-angle-double-left"})]},proxy:!0},{key:"last-text",fn:function(){return[e("i",{staticClass:"las la-angle-double-right"})]},proxy:!0}]),model:{value:t.downloads.currentPage,callback:function(a){t.$set(t.downloads,"currentPage",a)},expression:"downloads.currentPage"}})],1),e("erd-app-menu",{attrs:{icon:"la-tools"}},[e("div",{staticClass:"pt-3 select-none xd-pro-menu"},[0==t.activeTab?e("erd-collapse",{key:"xd-pro-instance",attrs:{title:t.$t("xd-pro.xd-pro"),small:""}},[e("ul",{staticClass:"list-unstyled mb-0"},[e("li",{staticClass:"nav-item"},[e("a",{attrs:{href:"#"},on:{click:function(a){return a.preventDefault(),t.addInstance.apply(null,arguments)}}},[e("i",{staticClass:"las la-plus mr-1"}),t._v(t._s(t.$t("xd-pro.add-instance")))])])])]):t._e(),0==t.activeTab?e("erd-collapse",{key:"xd-pro-download",attrs:{title:t.$t("xd-pro.download-xd-pro"),small:""}},[e("ul",{staticClass:"list-unstyled mb-0"},[e("li",{staticClass:"nav-item"},[e("a",{attrs:{href:"#"},on:{click:function(t){t.preventDefault()}}},[e("i",{staticClass:"las la-download mr-1"}),t._v(t._s(t.$t("xd-pro.download-windows")))])]),e("li",{staticClass:"nav-item"},[e("a",{attrs:{href:"#"},on:{click:function(t){t.preventDefault()}}},[e("i",{staticClass:"las la-download mr-1"}),t._v(t._s(t.$t("xd-pro.download-linux")))])]),e("li",{staticClass:"nav-item"},[e("a",{attrs:{href:"#"},on:{click:function(t){t.preventDefault()}}},[e("i",{staticClass:"las la-download mr-1"}),t._v(t._s(t.$t("xd-pro.download-macos")))])]),e("li",{staticClass:"nav-item"},[e("a",{attrs:{href:"#"},on:{click:function(t){t.preventDefault()}}},[e("i",{staticClass:"las la-download mr-1"}),t._v(t._s(t.$t("xd-pro.download-php")))])])])]):t._e(),1==t.activeTab?e("erd-collapse",{key:"xd-pro-downloads",attrs:{title:t.$t("xd-pro.downloads"),small:""}},[e("ul",{staticClass:"list-unstyled mb-0"},[e("li",{staticClass:"nav-item"},[e("a",{attrs:{href:"#"},on:{click:function(a){return a.preventDefault(),t.resumeDownloads.apply(null,arguments)}}},[e("i",{staticClass:"las la-play mr-1"}),t._v(t._s(t.$t("xd-pro.resume-downloads")))])]),e("li",{staticClass:"nav-item"},[e("a",{attrs:{href:"#"},on:{click:function(a){return a.preventDefault(),t.pauseDownloads.apply(null,arguments)}}},[e("i",{staticClass:"las la-pause mr-1"}),t._v(t._s(t.$t("xd-pro.pause-downloads")))])])])]):t._e(),1==t.activeTab?e("erd-collapse",{key:"xd-pro-delete",attrs:{title:t.$t("xd-pro.delete"),small:""}},[e("ul",{staticClass:"list-unstyled mb-0"},[e("li",{staticClass:"nav-item"},[e("a",{attrs:{href:"#"},on:{click:function(a){return a.preventDefault(),t.deleteDownloads(!0)}}},[e("i",{staticClass:"las la-trash mr-1"}),t._v(t._s(t.$t("xd-pro.delete-disabled")))])]),e("li",{staticClass:"nav-item"},[e("a",{attrs:{href:"#"},on:{click:function(a){return a.preventDefault(),t.deleteDownloads(!1)}}},[e("i",{staticClass:"las la-trash mr-1"}),t._v(t._s(t.$t("xd-pro.delete-all")))])])])]):t._e(),e("div",{staticClass:"px-2 xd-pro-description"},[e("p",{staticClass:"text-muted"},[t._v(t._s(t.$t("xd-pro.description")))])])],1)])],1)},o=[],n=e("5530"),l=(e("ac1f"),e("841c"),e("4d63"),e("25f0"),e("4de4"),e("466d"),e("b0c0"),e("fb6a"),e("d81d"),e("2ebf")),i=e("0dcc"),r=e("2f62"),d={data:function(){return{useragents:[{text:this.$t("xd-pro.iptv-tools"),value:"IPTV-Tools/1.0"},{text:this.$t("xd-pro.browser-default"),value:navigator.userAgent}],speedLimits:[{text:this.$t("xd-pro.no-limit"),value:0},{text:this.$t("xd-pro.20-mbs"),value:1},{text:this.$t("xd-pro.15-mbs"),value:2},{text:this.$t("xd-pro.10-mbs"),value:3},{text:this.$t("xd-pro.5-mbs"),value:4}],xdPro:{modal:!1,instance:null,instances:[],from:0,to:0,total:0,currentPage:0,fields:[{key:"name",label:this.$t("xd-pro.name"),sortable:!0},{key:"download_folder",label:this.$t("xd-pro.download-folder"),sortable:!0},{key:"speed_limit",label:this.$t("xd-pro.speed-limit"),sortable:!0},{key:"check_connections",label:this.$t("xd-pro.check-connections"),sortable:!0},{key:"downloads",label:this.$t("xd-pro.downloads"),sortable:!0},{key:"actions",label:this.$t("users.actions"),sortable:!1,thClass:"text-right",tdClass:"text-right"}]},downloads:{handle:null,modal:!1,download:null,downloads:[],from:0,to:0,total:0,currentPage:0,fields:[{key:"filename",label:this.$t("xd-pro.filename"),sortable:!0},{key:"file_extension",label:this.$t("xd-pro.file-extension"),sortable:!0},{key:"type",label:this.$t("xd-pro.type"),sortable:!0},{key:"active",label:this.$t("xd-pro.active"),sortable:!0},{key:"enabled",label:this.$t("xd-pro.enabled"),sortable:!0},{key:"progress",label:this.$t("xd-pro.progress"),sortable:!0},{key:"actions",label:this.$t("users.actions"),sortable:!1,thClass:"text-right",tdClass:"text-right"}]},activeTab:0,search:null,isLoading:!1}},computed:Object(n["a"])(Object(n["a"])({},Object(r["c"])(["currentUser","settings"])),{},{showTooltips:function(){return this.settings.showTooltips},searchFilteredInstances:function(){if(null===this.search)return this.xdPro.instances;var t=new RegExp(this.search,"i");return this.xdPro.instances.filter((function(a){return String(a.name).match(t)||String(a.useragent).match(t)||String(a.download_folder).match(t)}))},searchFilteredDownloads:function(){if(null===this.search)return this.downloads.downloads;var t=new RegExp(this.search,"i");return this.downloads.downloads.filter((function(a){return String(a.download_url).match(t)||String(a.download_host).match(t)||String(a.download_username).match(t)||String(a.download_password).match(t)||String(a.filename).match(t)||String(a.file_extension).match(t)||String(a.download_sub_folder).match(t)}))},perPage:function(){return this.settings.perPage},pagedInstances:function(){return this.xdPro.total=this.searchFilteredInstances.length,this.xdPro.from=(this.xdPro.currentPage-1)*this.perPage||0,this.xdPro.to=this.xdPro.from+this.perPage>this.xdPro.total?this.xdPro.total:this.xdPro.from+this.perPage,this.searchFilteredInstances.slice(this.xdPro.from,this.xdPro.to)},pagedDownloads:function(){return this.downloads.total=this.searchFilteredDownloads.length,this.downloads.from=(this.downloads.currentPage-1)*this.perPage||0,this.downloads.to=this.downloads.from+this.perPage>this.downloads.total?this.downloads.total:this.downloads.from+this.perPage,this.searchFilteredDownloads.slice(this.downloads.from,this.downloads.to)},downloadInstances:function(){return this.xdPro.instances.map((function(t){return{text:t.name,value:t.id}}))}}),methods:{searchStream:function(t){0===t.length?this.search=null:this.search=t},printStreams:function(){document.getElementById("streams").print()},formatDate:function(t){return new Date(t).toLocaleString(this.$t("date.locale"),this.dateOptions)},doTabChange:function(t){0==t&&this.loadInstances(),this.activeTab=t},doRefresh:function(){0===this.activeTab?this.loadInstances():this.loadDownloads()},xdProModal:function(t){var a=arguments.length>1&&void 0!==arguments[1]&&arguments[1];a&&this.saveInstance(),this.xdPro.modal=t},downloadModal:function(t){var a=arguments.length>1&&void 0!==arguments[1]&&arguments[1];a&&this.saveDownload(),this.downloads.modal=t},addInstance:function(){var t=this;this.isLoading=!0,i["a"].post("xd-pro/instance").then((function(a){t.isLoading=!1,!0===a.status&&(t.xdPro.instance={id:a.data,name:"",download_folder:"",useragent:"IPTV-Tools/1.0",speed_limit:0,check_connections:1},t.xdPro.modal=!0)}))},editInstance:function(t){this.xdPro.instance=Object.assign({},t),this.xdPro.modal=!0},saveInstance:function(){var t=this;this.isLoading=!0;var a=Object.assign({},this.xdPro.instance);delete a.downloads,i["a"].put("xd-pro/instance/".concat(this.xdPro.instance.id),a).then((function(a){t.isLoading=!1,t.loadInstances(),!0===a.status&&(t.xdPro.instance=null,t.$notify("primary",t.$t("profile.success"),t.$t("xd-pro.save-success"),"la-user-shield",{duration:5e3,permanent:!1}))})).catch((function(){t.isLoading=!1,t.loadInstances(),t.$notify("error",t.$t("profile.failed"),t.$t("xd-pro.save-error"),"la-user-shield",{duration:5e3,permanent:!1})}))},deleteInstance:function(t){var a=this;this.isLoading=!0,i["a"].delete("xd-pro/instance/".concat(t)).then((function(t){a.isLoading=!1,a.loadInstances(),!0===t.status&&a.$notify("primary",a.$t("profile.success"),a.$t("xd-pro.delete-success"),"la-user-shield",{duration:5e3,permanent:!1})})).catch((function(){a.isLoading=!1,a.loadInstances(),a.$notify("error",a.$t("profile.failed"),a.$t("xd-pro.delete-error"),"la-user-shield",{duration:5e3,permanent:!1})}))},editDownload:function(t){var a=this;i["a"].put("xd-pro/download/".concat(t.id),{enabled:0}).then((function(e){!0===e.status&&!0===e.data&&(a.downloads.download=Object.assign({},t),a.downloads.modal=!0)})).catch((function(){}))},pauseDownload:function(t){var a=this;i["a"].put("xd-pro/download/".concat(t.id),{enabled:0}).then((function(t){!0===t.status&&!0===t.data&&a.loadDownloads()})).catch((function(){a.$notify("error",a.$t("profile.failed"),a.$t("xd-pro.download-save-error"),"la-user-shield",{duration:5e3,permanent:!1})}))},resumeDownload:function(t){var a=this;i["a"].put("xd-pro/download/".concat(t.id),{enabled:1}).then((function(t){!0===t.status&&!0===t.data&&a.loadDownloads()})).catch((function(){a.$notify("error",a.$t("profile.failed"),a.$t("xd-pro.download-save-error"),"la-user-shield",{duration:5e3,permanent:!1})}))},saveDownload:function(){var t=this;this.isLoading=!0;var a=Object.assign({},this.downloads.download);i["a"].put("xd-pro/download/".concat(this.downloads.download.id),a).then((function(a){t.isLoading=!1,t.loadDownloads(),!0===a.status&&(t.downloads.download=null,t.$notify("primary",t.$t("profile.success"),t.$t("xd-pro.download-save-success"),"la-user-shield",{duration:5e3,permanent:!1}))})).catch((function(){t.isLoading=!1,t.loadDownloads(),t.$notify("error",t.$t("profile.failed"),t.$t("xd-pro.download-save-error"),"la-user-shield",{duration:5e3,permanent:!1})}))},deleteDownload:function(t){var a=this;this.isLoading=!0,i["a"].delete("xd-pro/download/".concat(t)).then((function(t){a.isLoading=!1,a.loadDownloads(),!0===t.status&&a.$notify("primary",a.$t("profile.success"),a.$t("xd-pro.download-delete-success"),"la-user-shield",{duration:5e3,permanent:!1})})).catch((function(){a.isLoading=!1,a.loadDownloads(),a.$notify("error",a.$t("profile.failed"),a.$t("xd-pro.download-delete-error"),"la-user-shield",{duration:5e3,permanent:!1})}))},loadInstances:function(){var t=this;this.isLoading=!0,i["a"].get("xd-pro/instances").then((function(a){t.isLoading=!1,!0===a.status&&(t.xdPro.instances=a.data)})).catch((function(){t.isLoading=!1}))},loadDownloads:function(){var t=this;i["a"].get("xd-pro/download").then((function(a){!0===a.status&&(t.downloads.downloads=a.data)})).catch((function(){}))},pauseDownloads:function(){var t=this;i["a"].put("xd-pro/pause").then((function(a){!0===a.status&&!0===a.data&&t.loadDownloads()})).catch((function(){t.loadDownloads()}))},resumeDownloads:function(){var t=this;i["a"].put("xd-pro/resume").then((function(a){!0===a.status&&!0===a.data&&t.loadDownloads()})).catch((function(){t.loadDownloads()}))},deleteDownloads:function(t){var a=this;i["a"].put("xd-pro/delete/".concat(t?"1":"0")).then((function(t){!0===t.status&&!0===t.data&&(a.$notify("primary",a.$t("profile.success"),a.$t("xd-pro.download-delete-success"),"la-user-shield",{duration:5e3,permanent:!1}),a.loadDownloads())})).catch((function(){a.$notify("error",a.$t("profile.failed"),a.$t("xd-pro.download-delete-error"),"la-user-shield",{duration:5e3,permanent:!1}),a.loadDownloads()}))}},beforeMount:function(){this.loadInstances(),this.loadDownloads(),this.downloads.handle=setInterval(this.loadDownloads,1e4),document.body.classList.add("right-menu"),l["a"].$on("search",this.searchStream),l["a"].$on("print",this.printStreams),l["a"].$on("tab-change",this.doTabChange),l["a"].$on("refresh",this.doRefresh)},beforeDestroy:function(){clearInterval(this.downloads.handle),document.body.classList.remove("right-menu"),l["a"].$off("search",this.searchStream),l["a"].$off("print",this.printStreams),l["a"].$off("tab-change",this.doTabChange),l["a"].$off("refresh",this.doRefresh)},watch:{}},c=d,u=(e("1b28"),e("2877")),p=Object(u["a"])(c,s,o,!1,null,null,null);a["default"]=p.exports}}]);