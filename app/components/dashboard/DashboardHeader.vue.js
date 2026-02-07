"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
var auth_1 = require("~/stores/auth");
var ui_1 = require("~/stores/ui");
var userInfo = (0, auth_1.useAuthStore)().userInfo;
var themeStore = (0, ui_1.useUIStore)();
var imgLoaded = ref(false);
// SECTION Computed
var isDark = computed(function () { return themeStore.isDark; });
function onImgLoad() {
    imgLoaded.value = true;
}
var toggleMode = function () {
    themeStore.toggleTheme();
};
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
var __VLS_ctx = __assign(__assign({}, {}), {});
var __VLS_components;
var __VLS_directives;
__VLS_asFunctionalElement(__VLS_intrinsics.header, __VLS_intrinsics.header)(__assign({ class: "dashboard-header" }));
__VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "profile-wrapper flex items-center gap-5" }));
var __VLS_0 = {}.ClientOnly;
/** @type {[typeof __VLS_components.ClientOnly, typeof __VLS_components.ClientOnly, ]} */ ;
// @ts-ignore
ClientOnly;
// @ts-ignore
var __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({}));
var __VLS_2 = __VLS_1.apply(void 0, __spreadArray([{}], __VLS_functionalComponentArgsRest(__VLS_1), false));
var __VLS_4 = __VLS_3.slots.default;
__VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "img-wrapper relative w-14 h-14" }));
var __VLS_5 = {}.NuxtImg;
/** @type {[typeof __VLS_components.NuxtImg, ]} */ ;
// @ts-ignore
NuxtImg;
// @ts-ignore
var __VLS_6 = __VLS_asFunctionalComponent(__VLS_5, new __VLS_5(__assign(__assign({ 'onLoad': {} }, { src: "/icons/user.png", alt: "user_avatar", width: "50", height: "50" }), { class: (__VLS_ctx.imgLoaded ? 'opacity-100' : 'opacity-0') })));
var __VLS_7 = __VLS_6.apply(void 0, __spreadArray([__assign(__assign({ 'onLoad': {} }, { src: "/icons/user.png", alt: "user_avatar", width: "50", height: "50" }), { class: (__VLS_ctx.imgLoaded ? 'opacity-100' : 'opacity-0') })], __VLS_functionalComponentArgsRest(__VLS_6), false));
var __VLS_9;
var __VLS_10;
var __VLS_11 = ({ load: {} },
    { onLoad: (__VLS_ctx.onImgLoad) });
// @ts-ignore
[imgLoaded, onImgLoad,];
var __VLS_8;
var __VLS_3;
__VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "flex flex-col gap-0 justify-center" }));
__VLS_asFunctionalElement(__VLS_intrinsics.span, __VLS_intrinsics.span)(__assign({ class: "day text-slate-900" }, { class: ([{ 'font-light': __VLS_ctx.isDark }]) }));
// @ts-ignore
[isDark,];
__VLS_asFunctionalElement(__VLS_intrinsics.span, __VLS_intrinsics.span)(__assign({ class: "username text-slate-900" }, { class: ([{ 'font-light': __VLS_ctx.isDark }]) }));
// @ts-ignore
[isDark,];
((_a = __VLS_ctx.userInfo) === null || _a === void 0 ? void 0 : _a.name);
// @ts-ignore
[userInfo,];
__VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "toggle-btn-wrapper" }));
__VLS_asFunctionalElement(__VLS_intrinsics.button, __VLS_intrinsics.button)(__assign(__assign({ onClick: (__VLS_ctx.toggleMode) }, { class: ([{ 'btn-is-dark': __VLS_ctx.isDark, 'btn-is-light': !__VLS_ctx.isDark }]) }), { class: "relative w-10 h-10 flex items-center justify-center rounded-xl backdrop-blur-md border overflow-hidden transition-all duration-300 active:scale-90" }));
// @ts-ignore
[isDark, isDark, toggleMode,];
var __VLS_13 = {}.transition;
/** @type {[typeof __VLS_components.Transition, typeof __VLS_components.transition, typeof __VLS_components.Transition, typeof __VLS_components.transition, ]} */ ;
// @ts-ignore
Transition;
// @ts-ignore
var __VLS_14 = __VLS_asFunctionalComponent(__VLS_13, new __VLS_13({
    name: "sun-moon",
}));
var __VLS_15 = __VLS_14.apply(void 0, __spreadArray([{
        name: "sun-moon",
    }], __VLS_functionalComponentArgsRest(__VLS_14), false));
var __VLS_17 = __VLS_16.slots.default;
if (__VLS_ctx.isDark) {
    // @ts-ignore
    [isDark,];
    __VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ key: "moon" }, { class: "absolute" }));
    __VLS_asFunctionalElement(__VLS_intrinsics.svg, __VLS_intrinsics.svg)(__assign({ xmlns: "http://www.w3.org/2000/svg", width: "20", height: "20", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", 'stroke-width': "2", 'stroke-linecap': "round", 'stroke-linejoin': "round" }, { class: "text-yellow-400" }));
    __VLS_asFunctionalElement(__VLS_intrinsics.path)({
        d: "M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z",
    });
}
else {
    __VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ key: "sun" }, { class: "absolute" }));
    __VLS_asFunctionalElement(__VLS_intrinsics.svg, __VLS_intrinsics.svg)(__assign({ xmlns: "http://www.w3.org/2000/svg", width: "20", height: "20", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", 'stroke-width': "2", 'stroke-linecap': "round", 'stroke-linejoin': "round" }, { class: "text-orange-300" }));
    __VLS_asFunctionalElement(__VLS_intrinsics.circle)({
        cx: "12",
        cy: "12",
        r: "4",
    });
    __VLS_asFunctionalElement(__VLS_intrinsics.path)({
        d: "M12 2v2",
    });
    __VLS_asFunctionalElement(__VLS_intrinsics.path)({
        d: "M12 20v2",
    });
    __VLS_asFunctionalElement(__VLS_intrinsics.path)({
        d: "m4.93 4.93 1.41 1.41",
    });
    __VLS_asFunctionalElement(__VLS_intrinsics.path)({
        d: "m17.66 17.66 1.41 1.41",
    });
    __VLS_asFunctionalElement(__VLS_intrinsics.path)({
        d: "M2 12h2",
    });
    __VLS_asFunctionalElement(__VLS_intrinsics.path)({
        d: "M20 12h2",
    });
    __VLS_asFunctionalElement(__VLS_intrinsics.path)({
        d: "m6.34 17.66-1.41 1.41",
    });
    __VLS_asFunctionalElement(__VLS_intrinsics.path)({
        d: "m19.07 4.93-1.41 1.41",
    });
}
var __VLS_16;
/** @type {__VLS_StyleScopedClasses['dashboard-header']} */ ;
/** @type {__VLS_StyleScopedClasses['profile-wrapper']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-5']} */ ;
/** @type {__VLS_StyleScopedClasses['img-wrapper']} */ ;
/** @type {__VLS_StyleScopedClasses['relative']} */ ;
/** @type {__VLS_StyleScopedClasses['w-14']} */ ;
/** @type {__VLS_StyleScopedClasses['h-14']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-col']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-0']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
/** @type {__VLS_StyleScopedClasses['day']} */ ;
/** @type {__VLS_StyleScopedClasses['text-slate-900']} */ ;
/** @type {__VLS_StyleScopedClasses['font-light']} */ ;
/** @type {__VLS_StyleScopedClasses['username']} */ ;
/** @type {__VLS_StyleScopedClasses['text-slate-900']} */ ;
/** @type {__VLS_StyleScopedClasses['font-light']} */ ;
/** @type {__VLS_StyleScopedClasses['toggle-btn-wrapper']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-is-dark']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-is-light']} */ ;
/** @type {__VLS_StyleScopedClasses['relative']} */ ;
/** @type {__VLS_StyleScopedClasses['w-10']} */ ;
/** @type {__VLS_StyleScopedClasses['h-10']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-xl']} */ ;
/** @type {__VLS_StyleScopedClasses['backdrop-blur-md']} */ ;
/** @type {__VLS_StyleScopedClasses['border']} */ ;
/** @type {__VLS_StyleScopedClasses['overflow-hidden']} */ ;
/** @type {__VLS_StyleScopedClasses['transition-all']} */ ;
/** @type {__VLS_StyleScopedClasses['duration-300']} */ ;
/** @type {__VLS_StyleScopedClasses['active:scale-90']} */ ;
/** @type {__VLS_StyleScopedClasses['absolute']} */ ;
/** @type {__VLS_StyleScopedClasses['text-yellow-400']} */ ;
/** @type {__VLS_StyleScopedClasses['absolute']} */ ;
/** @type {__VLS_StyleScopedClasses['text-orange-300']} */ ;
var __VLS_export = (await Promise.resolve().then(function () { return require('vue'); })).defineComponent({});
exports.default = {};
