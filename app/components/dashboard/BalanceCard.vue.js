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
var useTransactionStore_1 = require("~/stores/useTransactionStore");
var ui = (0, ui_1.useUIStore)();
var transactionStore = (0, useTransactionStore_1.useTransactionStore)();
var isOpen = ref(false);
var manualAmount = ref(null);
var displayAmount = computed({
    get: function () {
        if (!manualAmount.value || manualAmount.value === 0)
            return "";
        return manualAmount.value.toLocaleString("id-ID");
    },
    set: function (newValue) {
        var numberValue = parseInt(newValue.replace(/\D/g, ""));
        manualAmount.value = isNaN(numberValue) ? 0 : numberValue;
    },
});
var handleUpdateBalance = function () {
    if (manualAmount.value && manualAmount.value > 0) {
        transactionStore.addManualIncome(Number(manualAmount.value));
        manualAmount.value = null;
        isOpen.value = false;
    }
};
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
var __VLS_ctx = __assign(__assign({}, {}), {});
var __VLS_components;
var __VLS_directives;
__VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "card-wrapper" }));
__VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "card-container relative w-full rounded-3xl p-6 pt-10 border transition-colors duration-700 ease-in-out" }, { class: ([
        __VLS_ctx.ui.isDark
            ? 'bg-slate-900 border-slate-800 shadow-[0_20px_50px_rgba(0,0,0,0.5)]'
            : 'bg-white border-gray-100 shadow-sm',
    ]) }));
// @ts-ignore
[ui,];
__VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full flex items-center justify-center border-4 transition-all duration-700" }, { class: ([
        __VLS_ctx.ui.isDark
            ? 'bg-amber-500 border-slate-950 shadow-[0_0_15px_rgba(245,158,11,0.4)]'
            : 'bg-black border-[#fafafa]',
    ]) }));
// @ts-ignore
[ui,];
var __VLS_0 = {}.UIcon;
/** @type {[typeof __VLS_components.UIcon, ]} */ ;
// @ts-ignore
UIcon;
// @ts-ignore
var __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0(__assign(__assign({ name: "i-heroicons-banknotes" }, { class: "text-xl transition-colors duration-700" }), { class: (__VLS_ctx.ui.isDark ? 'text-slate-950' : 'text-white') })));
var __VLS_2 = __VLS_1.apply(void 0, __spreadArray([__assign(__assign({ name: "i-heroicons-banknotes" }, { class: "text-xl transition-colors duration-700" }), { class: (__VLS_ctx.ui.isDark ? 'text-slate-950' : 'text-white') })], __VLS_functionalComponentArgsRest(__VLS_1), false));
// @ts-ignore
[ui,];
__VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "flex justify-between items-center divide-x divide-gray-300 transition-colors duration-700" }, { class: (__VLS_ctx.ui.isDark ? 'divide-slate-600' : 'divide-gray-200') }));
// @ts-ignore
[ui,];
__VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "flex-1 text-center group cursor-pointer" }));
var __VLS_5 = {}.UModal;
/** @type {[typeof __VLS_components.UModal, typeof __VLS_components.UModal, ]} */ ;
// @ts-ignore
UModal;
// @ts-ignore
var __VLS_6 = __VLS_asFunctionalComponent(__VLS_5, new __VLS_5({
    open: (__VLS_ctx.isOpen),
}));
var __VLS_7 = __VLS_6.apply(void 0, __spreadArray([{
        open: (__VLS_ctx.isOpen),
    }], __VLS_functionalComponentArgsRest(__VLS_6), false));
var __VLS_9 = __VLS_8.slots.default;
// @ts-ignore
[isOpen,];
__VLS_asFunctionalElement(__VLS_intrinsics.p, __VLS_intrinsics.p)(__assign({ class: "text-xs mb-1 transition-colors duration-700 flex items-center justify-center gap-1" }, { class: (__VLS_ctx.ui.isDark ? 'text-slate-400' : 'text-gray-500') }));
// @ts-ignore
[ui,];
var __VLS_10 = {}.UIcon;
/** @type {[typeof __VLS_components.UIcon, ]} */ ;
// @ts-ignore
UIcon;
// @ts-ignore
var __VLS_11 = __VLS_asFunctionalComponent(__VLS_10, new __VLS_10(__assign({ name: "i-heroicons-pencil-square" }, { class: "text-[10px]" })));
var __VLS_12 = __VLS_11.apply(void 0, __spreadArray([__assign({ name: "i-heroicons-pencil-square" }, { class: "text-[10px]" })], __VLS_functionalComponentArgsRest(__VLS_11), false));
__VLS_asFunctionalElement(__VLS_intrinsics.p, __VLS_intrinsics.p)(__assign({ class: "text-xl font-bold transition-colors duration-700" }, { class: (__VLS_ctx.ui.isDark ? 'text-white' : 'text-slate-900') }));
// @ts-ignore
[ui,];
(__VLS_ctx.transactionStore.formatIDR(__VLS_ctx.transactionStore.remainingBalance));
// @ts-ignore
[transactionStore, transactionStore,];
{
    var __VLS_15 = __VLS_8.slots.content;
    var __VLS_16 = {}.UCard;
    /** @type {[typeof __VLS_components.UCard, typeof __VLS_components.UCard, ]} */ ;
    // @ts-ignore
    UCard;
    // @ts-ignore
    var __VLS_17 = __VLS_asFunctionalComponent(__VLS_16, new __VLS_16({
        ui: ({
            root: 'shadow-xl bg-white dark:bg-white overflow-hidden border-none',
            header: 'bg-gray-50/50 dark:bg-white border-b border-gray-100 dark:border-slate-800 p-4',
            body: 'p-6 bg-white',
            footer: 'p-4 bg-gray-50/30 dark:bg-white',
        }),
    }));
    var __VLS_18 = __VLS_17.apply(void 0, __spreadArray([{
            ui: ({
                root: 'shadow-xl bg-white dark:bg-white overflow-hidden border-none',
                header: 'bg-gray-50/50 dark:bg-white border-b border-gray-100 dark:border-slate-800 p-4',
                body: 'p-6 bg-white',
                footer: 'p-4 bg-gray-50/30 dark:bg-white',
            }),
        }], __VLS_functionalComponentArgsRest(__VLS_17), false));
    var __VLS_20 = __VLS_19.slots.default;
    {
        var __VLS_21 = __VLS_19.slots.header;
        __VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "flex items-center justify-between" }));
        __VLS_asFunctionalElement(__VLS_intrinsics.h3, __VLS_intrinsics.h3)(__assign({ class: "text-base font-bold text-slate-900 dark:text-white" }));
    }
    __VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "space-y-4" }));
    __VLS_asFunctionalElement(__VLS_intrinsics.p, __VLS_intrinsics.p)(__assign({ class: "text-sm text-slate-500 dark:text-slate-400 leading-relaxed" }));
    var __VLS_22 = {}.UFieldGroup;
    /** @type {[typeof __VLS_components.UFieldGroup, typeof __VLS_components.UFieldGroup, ]} */ ;
    // @ts-ignore
    UFieldGroup;
    // @ts-ignore
    var __VLS_23 = __VLS_asFunctionalComponent(__VLS_22, new __VLS_22(__assign({ label: "Nominal Pemasukan (Rp)" }, { class: "font-medium text-slate-700 dark:text-slate-200" })));
    var __VLS_24 = __VLS_23.apply(void 0, __spreadArray([__assign({ label: "Nominal Pemasukan (Rp)" }, { class: "font-medium text-slate-700 dark:text-slate-200" })], __VLS_functionalComponentArgsRest(__VLS_23), false));
    var __VLS_26 = __VLS_25.slots.default;
    var __VLS_27 = {}.UInput;
    /** @type {[typeof __VLS_components.UInput, ]} */ ;
    // @ts-ignore
    UInput;
    // @ts-ignore
    var __VLS_28 = __VLS_asFunctionalComponent(__VLS_27, new __VLS_27(__assign(__assign({ modelValue: (__VLS_ctx.displayAmount), type: "text", inputmode: "numeric", placeholder: "Masukan nominal mu", icon: "i-heroicons-banknotes" }, { class: "w-full" }), { ui: ({
            base: 'bg-white dark:bg-gray-200/50 border text-sm font-black text-slate-900 ring-0 focus:ring-0 focus-visible:ring-0 font-medium',
        }), autofocus: true })));
    var __VLS_29 = __VLS_28.apply(void 0, __spreadArray([__assign(__assign({ modelValue: (__VLS_ctx.displayAmount), type: "text", inputmode: "numeric", placeholder: "Masukan nominal mu", icon: "i-heroicons-banknotes" }, { class: "w-full" }), { ui: ({
                base: 'bg-white dark:bg-gray-200/50 border text-sm font-black text-slate-900 ring-0 focus:ring-0 focus-visible:ring-0 font-medium',
            }), autofocus: true })], __VLS_functionalComponentArgsRest(__VLS_28), false));
    // @ts-ignore
    [displayAmount,];
    var __VLS_25;
    {
        var __VLS_32 = __VLS_19.slots.footer;
        __VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "flex justify-end gap-3" }));
        var __VLS_33 = {}.UButton;
        /** @type {[typeof __VLS_components.UButton, ]} */ ;
        // @ts-ignore
        UButton;
        // @ts-ignore
        var __VLS_34 = __VLS_asFunctionalComponent(__VLS_33, new __VLS_33(__assign(__assign({ 'onClick': {} }, { color: "neutral", variant: "ghost", label: "Batal" }), { class: "hover:bg-gray-100 text-black" })));
        var __VLS_35 = __VLS_34.apply(void 0, __spreadArray([__assign(__assign({ 'onClick': {} }, { color: "neutral", variant: "ghost", label: "Batal" }), { class: "hover:bg-gray-100 text-black" })], __VLS_functionalComponentArgsRest(__VLS_34), false));
        var __VLS_37 = void 0;
        var __VLS_38 = void 0;
        var __VLS_39 = ({ click: {} },
            { onClick: function () {
                    var _a = [];
                    for (var _i = 0; _i < arguments.length; _i++) {
                        _a[_i] = arguments[_i];
                    }
                    var $event = _a[0];
                    __VLS_ctx.isOpen = false;
                    // @ts-ignore
                    [isOpen,];
                } });
        var __VLS_36;
        var __VLS_41 = {}.UButton;
        /** @type {[typeof __VLS_components.UButton, ]} */ ;
        // @ts-ignore
        UButton;
        // @ts-ignore
        var __VLS_42 = __VLS_asFunctionalComponent(__VLS_41, new __VLS_41(__assign(__assign({ 'onClick': {} }, { ui: ({
                base: 'bg-amber-200',
            }), label: "Update Saldo" }), { class: "px-6 shadow-md" })));
        var __VLS_43 = __VLS_42.apply(void 0, __spreadArray([__assign(__assign({ 'onClick': {} }, { ui: ({
                    base: 'bg-amber-200',
                }), label: "Update Saldo" }), { class: "px-6 shadow-md" })], __VLS_functionalComponentArgsRest(__VLS_42), false));
        var __VLS_45 = void 0;
        var __VLS_46 = void 0;
        var __VLS_47 = ({ click: {} },
            { onClick: (__VLS_ctx.handleUpdateBalance) });
        // @ts-ignore
        [handleUpdateBalance,];
        var __VLS_44;
    }
    var __VLS_19;
}
var __VLS_8;
__VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "flex-1 text-center" }));
__VLS_asFunctionalElement(__VLS_intrinsics.p, __VLS_intrinsics.p)(__assign({ class: "text-xs mb-1 transition-colors duration-700" }, { class: (__VLS_ctx.ui.isDark ? 'text-slate-400' : 'text-gray-500') }));
// @ts-ignore
[ui,];
__VLS_asFunctionalElement(__VLS_intrinsics.p, __VLS_intrinsics.p)(__assign({ class: "text-xl font-bold transition-colors duration-700" }, { class: (__VLS_ctx.ui.isDark ? 'text-amber-500' : 'text-slate-900') }));
// @ts-ignore
[ui,];
(__VLS_ctx.transactionStore.formatIDR(__VLS_ctx.transactionStore.totalExpenses));
// @ts-ignore
[transactionStore, transactionStore,];
/** @type {__VLS_StyleScopedClasses['card-wrapper']} */ ;
/** @type {__VLS_StyleScopedClasses['card-container']} */ ;
/** @type {__VLS_StyleScopedClasses['relative']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-3xl']} */ ;
/** @type {__VLS_StyleScopedClasses['p-6']} */ ;
/** @type {__VLS_StyleScopedClasses['pt-10']} */ ;
/** @type {__VLS_StyleScopedClasses['border']} */ ;
/** @type {__VLS_StyleScopedClasses['transition-colors']} */ ;
/** @type {__VLS_StyleScopedClasses['duration-700']} */ ;
/** @type {__VLS_StyleScopedClasses['ease-in-out']} */ ;
/** @type {__VLS_StyleScopedClasses['absolute']} */ ;
/** @type {__VLS_StyleScopedClasses['top-0']} */ ;
/** @type {__VLS_StyleScopedClasses['left-1/2']} */ ;
/** @type {__VLS_StyleScopedClasses['-translate-x-1/2']} */ ;
/** @type {__VLS_StyleScopedClasses['-translate-y-1/2']} */ ;
/** @type {__VLS_StyleScopedClasses['w-12']} */ ;
/** @type {__VLS_StyleScopedClasses['h-12']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-full']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
/** @type {__VLS_StyleScopedClasses['border-4']} */ ;
/** @type {__VLS_StyleScopedClasses['transition-all']} */ ;
/** @type {__VLS_StyleScopedClasses['duration-700']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xl']} */ ;
/** @type {__VLS_StyleScopedClasses['transition-colors']} */ ;
/** @type {__VLS_StyleScopedClasses['duration-700']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-between']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['divide-x']} */ ;
/** @type {__VLS_StyleScopedClasses['divide-gray-300']} */ ;
/** @type {__VLS_StyleScopedClasses['transition-colors']} */ ;
/** @type {__VLS_StyleScopedClasses['duration-700']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-1']} */ ;
/** @type {__VLS_StyleScopedClasses['text-center']} */ ;
/** @type {__VLS_StyleScopedClasses['group']} */ ;
/** @type {__VLS_StyleScopedClasses['cursor-pointer']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-1']} */ ;
/** @type {__VLS_StyleScopedClasses['transition-colors']} */ ;
/** @type {__VLS_StyleScopedClasses['duration-700']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-1']} */ ;
/** @type {__VLS_StyleScopedClasses['text-[10px]']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xl']} */ ;
/** @type {__VLS_StyleScopedClasses['font-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['transition-colors']} */ ;
/** @type {__VLS_StyleScopedClasses['duration-700']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-between']} */ ;
/** @type {__VLS_StyleScopedClasses['text-base']} */ ;
/** @type {__VLS_StyleScopedClasses['font-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['text-slate-900']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:text-white']} */ ;
/** @type {__VLS_StyleScopedClasses['space-y-4']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['text-slate-500']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:text-slate-400']} */ ;
/** @type {__VLS_StyleScopedClasses['leading-relaxed']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['text-slate-700']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:text-slate-200']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-end']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-3']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:bg-gray-100']} */ ;
/** @type {__VLS_StyleScopedClasses['text-black']} */ ;
/** @type {__VLS_StyleScopedClasses['px-6']} */ ;
/** @type {__VLS_StyleScopedClasses['shadow-md']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-1']} */ ;
/** @type {__VLS_StyleScopedClasses['text-center']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-1']} */ ;
/** @type {__VLS_StyleScopedClasses['transition-colors']} */ ;
/** @type {__VLS_StyleScopedClasses['duration-700']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xl']} */ ;
/** @type {__VLS_StyleScopedClasses['font-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['transition-colors']} */ ;
/** @type {__VLS_StyleScopedClasses['duration-700']} */ ;
var __VLS_export = (await Promise.resolve().then(function () { return require('vue'); })).defineComponent({});
exports.default = {};
