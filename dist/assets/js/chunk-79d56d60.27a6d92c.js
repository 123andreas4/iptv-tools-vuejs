(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-79d56d60"],{"67db":function(t,e,i){"use strict";i.r(e);var n=function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("div",{ref:"contextMenu",staticClass:"context-menu-container",style:t.contextStyle,attrs:{id:t.id},on:{click:function(t){t.stopPropagation()},contextmenu:function(t){t.stopPropagation()}}},[i("div",{staticClass:"context"},[i("ul",{staticClass:"menu",class:[{"menu-align-right":t.right},t.depthClass],attrs:{role:"menu"}},[t._l(t.items,(function(e,n){return i("li",{key:"context-menu-"+n,on:{click:function(i){return i.preventDefault(),t.menuItemClick(e)}}},[e.divider?i("div",{staticClass:"hr px-4"}):i("a",{staticClass:"context-menu-item",class:{disabled:e.disabled},attrs:{href:"#"},on:{click:function(t){t.preventDefault()}}},[i("i",{staticClass:"las",class:e.icon}),t._v(t._s(e.text))])])})),t._t("default")],2)])])},s=[],o=(i("a9e3"),i("ac1f"),i("5319"),i("d3b7"),i("ce96")),c={props:{id:{type:String,default:"context-menu"},right:{type:Boolean,default:!1},items:{type:Array,default:function(){return[]}},depth:{type:[String,Number],default:1}},data:function(){var t=this;return{locals:{},align:"left",top:0,left:0,visible:!1,bodyClickListener:Object(o["d"])((function(e){var i=!!t.visible,n=i&&!t.$el.contains(e.target);if(n){if(1!==e.which)return e.preventDefault(),e.stopPropagation(),!1;t.visible=!1,t.$emit("cancel",t.locals),e.stopPropagation()}else t.visible=!1,t.$emit("close",t.locals)}))}},methods:{setPositionFromEvent:function(t){var e=this;t=t||window.event;var i=document.scrollingElement||document.documentElement;return t.pageX||t.pageY?(this.left=t.pageX,this.top=t.pageY-i.scrollTop):(t.clientX||t.clientY)&&(this.left=t.clientX+i.scrollLeft,this.top=t.clientY+i.scrollTop),this.$nextTick((function(){var t=e.$el,i=(t.style.minHeight||t.style.height).replace("px","")||32,n=(t.style.minWidth||t.style.width).replace("px","")||32,s=t.scrollHeight||i,o=t.scrollWidth||n,c=window.innerHeight-s-25,l=window.innerWidth-o-25;e.top>c&&(e.top=c),e.left>l&&(e.left=l)})),t},open:function(t,e){return this.visible&&(this.visible=!1),this.visible=!0,this.$emit("open",this.locals=e||{}),this.setPositionFromEvent(t),this.$el.setAttribute("tab-index",-1),this.bodyClickListener.start(),this},menuItemClick:function(t){this.$emit("menu-click",t,this.locals),t.onClick&&"[object Function]"==={}.toString.call(t.onClick)&&t.onClick(t,this.locals)}},watch:{visible:function(t,e){!0===e&&!1===t&&this.bodyClickListener.stop((function(t){}))}},computed:{depthClass:function(){return"depth-".concat(this.depth)},contextStyle:function(){return{display:this.visible?"block":"none",top:(this.top||0)+"px",left:(this.left||0)+"px"}}}},l=c,r=i("2877"),a=Object(r["a"])(l,n,s,!1,null,null,null);e["default"]=a.exports},7156:function(t,e,i){var n=i("861d"),s=i("d2bb");t.exports=function(t,e,i){var o,c;return s&&"function"==typeof(o=e.constructor)&&o!==i&&n(c=o.prototype)&&c!==i.prototype&&s(t,c),t}},a9e3:function(t,e,i){"use strict";var n=i("83ab"),s=i("da84"),o=i("94ca"),c=i("6eeb"),l=i("5135"),r=i("c6b6"),a=i("7156"),u=i("c04e"),f=i("d039"),p=i("7c73"),h=i("241c").f,d=i("06cf").f,m=i("9bf2").f,b=i("58a8").trim,v="Number",g=s[v],y=g.prototype,I=r(p(y))==v,k=function(t){var e,i,n,s,o,c,l,r,a=u(t,!1);if("string"==typeof a&&a.length>2)if(a=b(a),e=a.charCodeAt(0),43===e||45===e){if(i=a.charCodeAt(2),88===i||120===i)return NaN}else if(48===e){switch(a.charCodeAt(1)){case 66:case 98:n=2,s=49;break;case 79:case 111:n=8,s=55;break;default:return+a}for(o=a.slice(2),c=o.length,l=0;l<c;l++)if(r=o.charCodeAt(l),r<48||r>s)return NaN;return parseInt(o,n)}return+a};if(o(v,!g(" 0o1")||!g("0b1")||g("+0x1"))){for(var x,C=function(t){var e=arguments.length<1?0:t,i=this;return i instanceof C&&(I?f((function(){y.valueOf.call(i)})):r(i)!=v)?a(new g(k(e)),i,C):k(e)},N=n?h(g):"MAX_VALUE,MIN_VALUE,NaN,NEGATIVE_INFINITY,POSITIVE_INFINITY,EPSILON,isFinite,isInteger,isNaN,isSafeInteger,MAX_SAFE_INTEGER,MIN_SAFE_INTEGER,parseFloat,parseInt,isInteger,fromString,range".split(","),w=0;N.length>w;w++)l(g,x=N[w])&&!l(C,x)&&m(C,x,d(g,x));C.prototype=y,y.constructor=C,c(s,v,C)}}}]);
//# sourceMappingURL=chunk-79d56d60.27a6d92c.js.map