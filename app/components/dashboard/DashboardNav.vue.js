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
Object.defineProperty(exports, "__esModule", { value: true });
var ui_1 = require("~/stores/ui");
var ui = (0, ui_1.useUIStore)();
var route = useRoute();
var menus = [
    { name: "Home", icon: "i-heroicons-home", path: "/dashboard" }, // Tambah path
    { name: "Bills", icon: "i-heroicons-document-text", path: "/dashboard/bills" },
    { name: "Send", icon: "i-heroicons-paper-airplane", path: "/dashboard/send" },
    { name: "History", icon: "i-heroicons-clock", path: "/dashboard/history" },
    { name: "Logout", icon: "i-heroicons-arrow-right-on-rectangle", path: "" },
];
var activeMenu = computed(function () {
    var currentMenu = menus.find(function (m) { return m.path === route.path; });
    return currentMenu ? currentMenu.name : "Home";
});
var isDark = computed(function () { return ui.isDark; });
var setActive = function (name) {
    var _a;
    if (name === "Logout") {
        ui.openLogoutModal(true);
    }
    else {
        navigateTo((_a = menus.find(function (m) { return m.name === name; })) === null || _a === void 0 ? void 0 : _a.path);
    }
};
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
var __VLS_ctx = __assign(__assign({}, {}), {});
var __VLS_components;
var __VLS_directives;
__VLS_asFunctionalElement(__VLS_intrinsics.section, __VLS_intrinsics.section)(__assign({ id: "navigation-wrapper" }, { class: "navigation-wrapper" }));
__VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ id: "nav-container" }, { class: "nav-container flex justify-center overflow-x-auto pb-4 no-scrollbar" }));
var _loop_1 = function (menu) {
    // @ts-ignore
    [menus,];
    __VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign(__assign({ onClick: function () {
            var _a = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                _a[_i] = arguments[_i];
            }
            var $event = _a[0];
            __VLS_ctx.setActive(menu.name);
            // @ts-ignore
            [setActive,];
        } }, { key: (menu.name) }), { class: "nav-item flex flex-col items-center gap-2 min-w-[70px]" }));
    __VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "icon-box flex items-center border justify-center w-14 h-14 rounded-2xl transition-all duration-300 active:scale-90" }, { class: ([
            {
                'border-gray-500/50 glasses-nav': !__VLS_ctx.isDark && __VLS_ctx.activeMenu !== menu.name,
                'border-white/30 glasses-nav': __VLS_ctx.isDark && __VLS_ctx.activeMenu !== menu.name,
            },
            __VLS_ctx.activeMenu === menu.name
                ? __VLS_ctx.isDark
                    ? 'border-amber-500 btn-is-dark'
                    : 'border-amber-500 btn-is-light'
                : '',
        ]) }));
    // @ts-ignore
    [isDark, isDark, isDark, activeMenu, activeMenu, activeMenu,];
    var __VLS_0 = {}.UIcon;
    /** @type {[typeof __VLS_components.UIcon, ]} */ ;
    // @ts-ignore
    UIcon;
    // @ts-ignore
    var __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0(__assign(__assign({ name: (menu.icon) }, { class: "text-2xl transition-all duration-300" }), { class: ([
            {
                'font-light': __VLS_ctx.isDark,
                'text-amber-500': __VLS_ctx.activeMenu === menu.name,
            },
        ]) })));
    var __VLS_2 = __VLS_1.apply(void 0, __spreadArray([__assign(__assign({ name: (menu.icon) }, { class: "text-2xl transition-all duration-300" }), { class: ([
                {
                    'font-light': __VLS_ctx.isDark,
                    'text-amber-500': __VLS_ctx.activeMenu === menu.name,
                },
            ]) })], __VLS_functionalComponentArgsRest(__VLS_1), false));
    // @ts-ignore
    [isDark, activeMenu,];
    __VLS_asFunctionalElement(__VLS_intrinsics.span, __VLS_intrinsics.span)(__assign({ class: "text-xs font-medium transition-all duration-300" }, { class: ([
            { 'text-slate-300': __VLS_ctx.isDark, 'text-amber-500': __VLS_ctx.activeMenu === menu.name },
        ]) }));
    // @ts-ignore
    [isDark, activeMenu,];
    (menu.name);
};
for (var _i = 0, _a = __VLS_getVForSourceType((__VLS_ctx.menus)); _i < _a.length; _i++) {
    var menu = _a[_i][0];
    _loop_1(menu);
}
/** @type {__VLS_StyleScopedClasses['navigation-wrapper']} */ ;
/** @type {__VLS_StyleScopedClasses['nav-container']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
/** @type {__VLS_StyleScopedClasses['overflow-x-auto']} */ ;
/** @type {__VLS_StyleScopedClasses['pb-4']} */ ;
/** @type {__VLS_StyleScopedClasses['no-scrollbar']} */ ;
/** @type {__VLS_StyleScopedClasses['nav-item']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-col']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-2']} */ ;
/** @type {__VLS_StyleScopedClasses['min-w-[70px]']} */ ;
/** @type {__VLS_StyleScopedClasses['icon-box']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['border']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
/** @type {__VLS_StyleScopedClasses['w-14']} */ ;
/** @type {__VLS_StyleScopedClasses['h-14']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-2xl']} */ ;
/** @type {__VLS_StyleScopedClasses['transition-all']} */ ;
/** @type {__VLS_StyleScopedClasses['duration-300']} */ ;
/** @type {__VLS_StyleScopedClasses['active:scale-90']} */ ;
/** @type {__VLS_StyleScopedClasses['border-gray-500/50']} */ ;
/** @type {__VLS_StyleScopedClasses['glasses-nav']} */ ;
/** @type {__VLS_StyleScopedClasses['border-white/30']} */ ;
/** @type {__VLS_StyleScopedClasses['glasses-nav']} */ ;
/** @type {__VLS_StyleScopedClasses['text-2xl']} */ ;
/** @type {__VLS_StyleScopedClasses['transition-all']} */ ;
/** @type {__VLS_StyleScopedClasses['duration-300']} */ ;
/** @type {__VLS_StyleScopedClasses['font-light']} */ ;
/** @type {__VLS_StyleScopedClasses['text-amber-500']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['transition-all']} */ ;
/** @type {__VLS_StyleScopedClasses['duration-300']} */ ;
/** @type {__VLS_StyleScopedClasses['text-slate-300']} */ ;
/** @type {__VLS_StyleScopedClasses['text-amber-500']} */ ;
var __VLS_export = (await Promise.resolve().then(function () { return require('vue'); })).defineComponent({});
exports.default = {};
