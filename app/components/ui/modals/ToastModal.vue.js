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
var notification_1 = require("~/stores/notification");
var vue_1 = require("vue");
var store = (0, notification_1.useNotificationStore)();
var isVisible = (0, vue_1.computed)(function () { return store.isVisible; });
var message = (0, vue_1.computed)(function () { return store.message; });
var type = (0, vue_1.computed)(function () { return store.type; });
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
var __VLS_ctx = __assign(__assign({}, {}), {});
var __VLS_components;
var __VLS_directives;
__VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "fixed top-0 left-1/2 -translate-x-1/2 w-[calc(100%-2.5rem)] max-w-[500px] z-50 pointer-events-none fixed-safe-top" }));
var __VLS_0 = {}.transition;
/** @type {[typeof __VLS_components.Transition, typeof __VLS_components.transition, typeof __VLS_components.Transition, typeof __VLS_components.transition, ]} */ ;
// @ts-ignore
Transition;
// @ts-ignore
var __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({
    enterActiveClass: "transition-all duration-300 ease-out",
    enterFromClass: "-translate-x-10 opacity-0",
    enterToClass: "translate-x-0 opacity-100",
    leaveActiveClass: "transition-all duration-300 ease-in",
    leaveFromClass: "translate-x-0 opacity-100",
    leaveToClass: "-translate-x-10 opacity-0",
}));
var __VLS_2 = __VLS_1.apply(void 0, __spreadArray([{
        enterActiveClass: "transition-all duration-300 ease-out",
        enterFromClass: "-translate-x-10 opacity-0",
        enterToClass: "translate-x-0 opacity-100",
        leaveActiveClass: "transition-all duration-300 ease-in",
        leaveFromClass: "translate-x-0 opacity-100",
        leaveToClass: "-translate-x-10 opacity-0",
    }], __VLS_functionalComponentArgsRest(__VLS_1), false));
var __VLS_4 = __VLS_3.slots.default;
if (__VLS_ctx.isVisible) {
    // @ts-ignore
    [isVisible,];
    __VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "px-4 py-3 rounded-lg shadow-lg text-white font-medium pointer-events-auto" }, { class: ([{
                'bg-error': __VLS_ctx.type === 'error',
                'bg-success': __VLS_ctx.type === 'success',
                'bg-sky-500': __VLS_ctx.type === 'info'
            }]) }));
    // @ts-ignore
    [type, type, type,];
    (__VLS_ctx.message);
    // @ts-ignore
    [message,];
}
var __VLS_3;
/** @type {__VLS_StyleScopedClasses['fixed']} */ ;
/** @type {__VLS_StyleScopedClasses['top-0']} */ ;
/** @type {__VLS_StyleScopedClasses['left-1/2']} */ ;
/** @type {__VLS_StyleScopedClasses['-translate-x-1/2']} */ ;
/** @type {__VLS_StyleScopedClasses['w-[calc(100%-2.5rem)]']} */ ;
/** @type {__VLS_StyleScopedClasses['max-w-[500px]']} */ ;
/** @type {__VLS_StyleScopedClasses['z-50']} */ ;
/** @type {__VLS_StyleScopedClasses['pointer-events-none']} */ ;
/** @type {__VLS_StyleScopedClasses['fixed-safe-top']} */ ;
/** @type {__VLS_StyleScopedClasses['px-4']} */ ;
/** @type {__VLS_StyleScopedClasses['py-3']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['shadow-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['text-white']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['pointer-events-auto']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-error']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-success']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-sky-500']} */ ;
var __VLS_export = (await Promise.resolve().then(function () { return require('vue'); })).defineComponent({});
exports.default = {};
