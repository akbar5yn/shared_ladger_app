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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
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
var transactionStore = (0, useTransactionStore_1.useTransactionStore)();
var ui = (0, ui_1.useUIStore)();
var isIncomeMode = ref(false);
var isEditingBudget = ref(false);
var isGuidanceVisible = ref(false);
var displayBudget = ref("");
var tempBudget = ref(transactionStore.monthlyBudget);
var currentTotal = computed(function () {
    return isIncomeMode.value ? transactionStore.totalIncomes : transactionStore.totalExpenses;
});
var activeCategories = computed(function () {
    return isIncomeMode.value
        ? transactionStore.activeIncomeCategories
        : transactionStore.activeCategories;
});
var getPercentage = function (cat) {
    return isIncomeMode.value
        ? transactionStore.getIncomeCategoryPercentage(cat)
        : transactionStore.getCategoryPercentage(cat);
};
var startEdit = function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        displayBudget.value = transactionStore.monthlyBudget.toLocaleString("id-ID");
        isEditingBudget.value = true;
        isGuidanceVisible.value = false;
        return [2 /*return*/];
    });
}); };
var onInputBudget = function (e) {
    var target = e.target;
    var val = target.value.replace(/\D/g, "");
    if (val) {
        displayBudget.value = Number(val).toLocaleString("id-ID");
    }
    else {
        displayBudget.value = "";
    }
};
var finishEdit = function () {
    var cleanValue = parseInt(displayBudget.value.replace(/\./g, "")) || 0;
    if (cleanValue !== transactionStore.monthlyBudget) {
        transactionStore.setBudget(cleanValue);
    }
    isEditingBudget.value = false;
};
var getCategoryColor = function (category) {
    var colors = {
        "Makan/Minum": "bg-amber-200",
        Belanja: "bg-teal-500",
        Jajan: "bg-amber-500",
        "Cicilan/Tagihan": "bg-red-400",
        Tabungan: "bg-blue-500",
        Transfer: "bg-emerald-300",
        "Gaji/Income": "bg-green-500",
        Investasi: "bg-indigo-500",
    };
    return colors[category] || "bg-slate-400";
};
var vFocus = {
    mounted: function (el) {
        setTimeout(function () {
            el.focus();
            var len = el.value.length;
            el.setSelectionRange(len, len);
        }, 150);
    },
};
onMounted(function () {
    setTimeout(function () {
        if (transactionStore.monthlyBudget <= 0) {
            isGuidanceVisible.value = true;
        }
    }, 1000);
});
watch(function () { return transactionStore.monthlyBudget; }, function (newVal) {
    tempBudget.value = newVal;
});
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
var __VLS_ctx = __assign(__assign({}, {}), {});
var __VLS_components;
var __VLS_directives;
/** @type {__VLS_StyleScopedClasses['card-wrapper']} */ ;
__VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "card-wrapper" }));
__VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign(__assign({ id: "spending-container" }, { class: "card-container relative w-full rounded-3xl px-6 py-5 border transition-all duration-700" }), { class: (__VLS_ctx.ui.isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-gray-100 shadow-sm') }));
// @ts-ignore
[ui,];
__VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "flex justify-between items-center mb-1" }));
__VLS_asFunctionalElement(__VLS_intrinsics.span, __VLS_intrinsics.span)(__assign({ class: (__VLS_ctx.ui.isDark ? 'text-slate-400' : 'text-gray-500') }, { class: "text-xs font-medium tracking-wider" }));
// @ts-ignore
[ui,];
(__VLS_ctx.isIncomeMode ? "Income" : "Spending");
// @ts-ignore
[isIncomeMode,];
__VLS_asFunctionalElement(__VLS_intrinsics.button, __VLS_intrinsics.button)(__assign(__assign(__assign({ onClick: function () {
        var _a = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            _a[_i] = arguments[_i];
        }
        var $event = _a[0];
        __VLS_ctx.isIncomeMode = !__VLS_ctx.isIncomeMode;
        // @ts-ignore
        [isIncomeMode, isIncomeMode,];
    } }, { class: "flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold transition-all active:scale-95 justify-center" }), { style: {} }), { class: (__VLS_ctx.isIncomeMode
        ? 'bg-emerald-500/10 text-emerald-500'
        : 'bg-amber-500/10 text-amber-500') }));
// @ts-ignore
[isIncomeMode,];
var __VLS_0 = {}.UIcon;
/** @type {[typeof __VLS_components.UIcon, ]} */ ;
// @ts-ignore
UIcon;
// @ts-ignore
var __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({
    name: (__VLS_ctx.isIncomeMode
        ? 'i-heroicons-arrow-trending-up'
        : 'i-heroicons-arrow-trending-down'),
}));
var __VLS_2 = __VLS_1.apply(void 0, __spreadArray([{
        name: (__VLS_ctx.isIncomeMode
            ? 'i-heroicons-arrow-trending-up'
            : 'i-heroicons-arrow-trending-down'),
    }], __VLS_functionalComponentArgsRest(__VLS_1), false));
// @ts-ignore
[isIncomeMode,];
__VLS_asFunctionalElement(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
(__VLS_ctx.isIncomeMode ? "Spending" : "Income");
// @ts-ignore
[isIncomeMode,];
__VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "mt-1 flex flex-col gap-4" }));
__VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "flex items-baseline gap-2" }));
__VLS_asFunctionalElement(__VLS_intrinsics.h1, __VLS_intrinsics.h1)(__assign({ class: "text-2xl font-bold tracking-tight transition-colors duration-500" }, { class: ([
        __VLS_ctx.isIncomeMode
            ? 'text-emerald-500'
            : __VLS_ctx.ui.isDark
                ? 'text-white'
                : 'text-slate-900',
    ]) }));
// @ts-ignore
[ui, isIncomeMode,];
(__VLS_ctx.transactionStore.formatIDR(__VLS_ctx.currentTotal));
// @ts-ignore
[transactionStore, currentTotal,];
if (!__VLS_ctx.isIncomeMode) {
    // @ts-ignore
    [isIncomeMode,];
    __VLS_asFunctionalElement(__VLS_intrinsics.span, __VLS_intrinsics.span)(__assign({ class: (__VLS_ctx.ui.isDark ? 'text-slate-500' : 'text-gray-400') }, { class: "text-xs flex items-center gap-1" }));
    // @ts-ignore
    [ui,];
    __VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "relative flex items-center h-6" }));
    var __VLS_5 = {}.Transition;
    /** @type {[typeof __VLS_components.Transition, typeof __VLS_components.Transition, ]} */ ;
    // @ts-ignore
    Transition;
    // @ts-ignore
    var __VLS_6 = __VLS_asFunctionalComponent(__VLS_5, new __VLS_5({
        name: "fade-fast",
        mode: "out-in",
    }));
    var __VLS_7 = __VLS_6.apply(void 0, __spreadArray([{
            name: "fade-fast",
            mode: "out-in",
        }], __VLS_functionalComponentArgsRest(__VLS_6), false));
    var __VLS_9 = __VLS_8.slots.default;
    if (__VLS_ctx.isEditingBudget) {
        // @ts-ignore
        [isEditingBudget,];
        __VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ key: ('edit') }, { class: "flex items-center gap-1" }));
        __VLS_asFunctionalElement(__VLS_intrinsics.span, __VLS_intrinsics.span)(__assign({ class: "text-amber-500 font-bold text-[10px]" }));
        __VLS_asFunctionalElement(__VLS_intrinsics.input)(__assign(__assign(__assign(__assign(__assign({ onInput: (__VLS_ctx.onInputBudget) }, { onBlur: (__VLS_ctx.finishEdit) }), { onKeyup: (__VLS_ctx.finishEdit) }), { value: (__VLS_ctx.displayBudget), type: "text", inputmode: "numeric" }), { class: "w-24 bg-transparent border-b-2 border-amber-500 font-bold text-amber-500 outline-none p-0 h-6 transition-all" }), { placeholder: "0" }));
        __VLS_asFunctionalDirective(__VLS_directives.vFocus)(null, __assign({}, __VLS_directiveBindingRestFields), null, null);
        // @ts-ignore
        [onInputBudget, finishEdit, finishEdit, displayBudget, vFocus,];
    }
    else {
        __VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign(__assign({ onClick: (__VLS_ctx.startEdit) }, { key: ('display') }), { class: "flex items-center gap-1.5 cursor-pointer group relative" }));
        // @ts-ignore
        [startEdit,];
        __VLS_asFunctionalElement(__VLS_intrinsics.span, __VLS_intrinsics.span)(__assign({ class: "font-bold hover:text-amber-500 transition-colors" }));
        (__VLS_ctx.transactionStore.formatIDR(__VLS_ctx.transactionStore.monthlyBudget));
        // @ts-ignore
        [transactionStore, transactionStore,];
        __VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "relative" }));
        var __VLS_10 = {}.UIcon;
        /** @type {[typeof __VLS_components.UIcon, ]} */ ;
        // @ts-ignore
        UIcon;
        // @ts-ignore
        var __VLS_11 = __VLS_asFunctionalComponent(__VLS_10, new __VLS_10(__assign({ name: "i-heroicons-pencil-square" }, { class: "w-3.5 h-3.5 text-amber-500 transition-all" })));
        var __VLS_12 = __VLS_11.apply(void 0, __spreadArray([__assign({ name: "i-heroicons-pencil-square" }, { class: "w-3.5 h-3.5 text-amber-500 transition-all" })], __VLS_functionalComponentArgsRest(__VLS_11), false));
        if (__VLS_ctx.isGuidanceVisible) {
            // @ts-ignore
            [isGuidanceVisible,];
            __VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 bg-slate-800 text-white text-[10px] font-bold rounded-lg whitespace-nowrap shadow-xl" }));
            __VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-slate-800" }));
        }
    }
    var __VLS_8;
}
else {
    __VLS_asFunctionalElement(__VLS_intrinsics.span, __VLS_intrinsics.span)(__assign({ class: "text-emerald-500/50 text-[10px] font-medium italic" }));
}
if (__VLS_ctx.currentTotal > 0) {
    // @ts-ignore
    [currentTotal,];
    __VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "flex h-3 w-full gap-1.5 overflow-hidden" }));
    for (var _i = 0, _a = __VLS_getVForSourceType((__VLS_ctx.activeCategories)); _i < _a.length; _i++) {
        var _b = _a[_i], cat = _b[0], index = _b[1];
        // @ts-ignore
        [activeCategories,];
        __VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign(__assign(__assign({ key: ("".concat(__VLS_ctx.isIncomeMode ? 'in' : 'ex', "-").concat(index)) }, { class: "h-full rounded-full transition-all duration-1000 shadow-sm" }), { style: ({ width: "".concat(__VLS_ctx.getPercentage(cat), "%") }) }), { class: (__VLS_ctx.getCategoryColor(cat)) }));
        // @ts-ignore
        [isIncomeMode, getPercentage, getCategoryColor,];
    }
    if (!__VLS_ctx.isIncomeMode && __VLS_ctx.transactionStore.spendingPercentage < 100) {
        // @ts-ignore
        [isIncomeMode, transactionStore,];
        __VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "h-full flex-1 rounded-full bg-slate-200 dark:bg-slate-700" }));
    }
}
if (__VLS_ctx.activeCategories.length > 0) {
    // @ts-ignore
    [activeCategories,];
    __VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "flex flex-col gap-3 mt-2" }));
    for (var _c = 0, _d = __VLS_getVForSourceType((__VLS_ctx.activeCategories)); _c < _d.length; _c++) {
        var cat = _d[_c][0];
        // @ts-ignore
        [activeCategories,];
        __VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ key: (cat) }, { class: "flex justify-between items-center text-sm animate-fade-in" }));
        __VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "flex items-center gap-3" }));
        __VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "w-2 h-2 rounded-full" }, { class: (__VLS_ctx.getCategoryColor(cat)) }));
        // @ts-ignore
        [getCategoryColor,];
        __VLS_asFunctionalElement(__VLS_intrinsics.span, __VLS_intrinsics.span)(__assign({ class: (__VLS_ctx.ui.isDark ? 'text-slate-300' : 'text-gray-600') }));
        // @ts-ignore
        [ui,];
        (cat);
        __VLS_asFunctionalElement(__VLS_intrinsics.span, __VLS_intrinsics.span)(__assign({ class: "font-bold" }, { class: (__VLS_ctx.isIncomeMode
                ? 'text-emerald-500'
                : __VLS_ctx.ui.isDark
                    ? 'text-white'
                    : 'text-slate-900') }));
        // @ts-ignore
        [ui, isIncomeMode,];
        (__VLS_ctx.transactionStore.formatIDR(__VLS_ctx.transactionStore.getCategoryTotal(cat, __VLS_ctx.isIncomeMode ? "income" : "expense")));
        // @ts-ignore
        [isIncomeMode, transactionStore, transactionStore,];
    }
}
else {
    __VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "py-4 text-center text-xs italic text-slate-500" }));
    (__VLS_ctx.isIncomeMode ? "income" : "spending");
    // @ts-ignore
    [isIncomeMode,];
}
/** @type {__VLS_StyleScopedClasses['card-wrapper']} */ ;
/** @type {__VLS_StyleScopedClasses['card-container']} */ ;
/** @type {__VLS_StyleScopedClasses['relative']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-3xl']} */ ;
/** @type {__VLS_StyleScopedClasses['px-6']} */ ;
/** @type {__VLS_StyleScopedClasses['py-5']} */ ;
/** @type {__VLS_StyleScopedClasses['border']} */ ;
/** @type {__VLS_StyleScopedClasses['transition-all']} */ ;
/** @type {__VLS_StyleScopedClasses['duration-700']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-between']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-1']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['tracking-wider']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-1.5']} */ ;
/** @type {__VLS_StyleScopedClasses['px-2.5']} */ ;
/** @type {__VLS_StyleScopedClasses['py-1']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-full']} */ ;
/** @type {__VLS_StyleScopedClasses['text-[10px]']} */ ;
/** @type {__VLS_StyleScopedClasses['font-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['transition-all']} */ ;
/** @type {__VLS_StyleScopedClasses['active:scale-95']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-1']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-col']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-4']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-baseline']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-2']} */ ;
/** @type {__VLS_StyleScopedClasses['text-2xl']} */ ;
/** @type {__VLS_StyleScopedClasses['font-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['tracking-tight']} */ ;
/** @type {__VLS_StyleScopedClasses['transition-colors']} */ ;
/** @type {__VLS_StyleScopedClasses['duration-500']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-1']} */ ;
/** @type {__VLS_StyleScopedClasses['relative']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['h-6']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-1']} */ ;
/** @type {__VLS_StyleScopedClasses['text-amber-500']} */ ;
/** @type {__VLS_StyleScopedClasses['font-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['text-[10px]']} */ ;
/** @type {__VLS_StyleScopedClasses['w-24']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-transparent']} */ ;
/** @type {__VLS_StyleScopedClasses['border-b-2']} */ ;
/** @type {__VLS_StyleScopedClasses['border-amber-500']} */ ;
/** @type {__VLS_StyleScopedClasses['font-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['text-amber-500']} */ ;
/** @type {__VLS_StyleScopedClasses['outline-none']} */ ;
/** @type {__VLS_StyleScopedClasses['p-0']} */ ;
/** @type {__VLS_StyleScopedClasses['h-6']} */ ;
/** @type {__VLS_StyleScopedClasses['transition-all']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-1.5']} */ ;
/** @type {__VLS_StyleScopedClasses['cursor-pointer']} */ ;
/** @type {__VLS_StyleScopedClasses['group']} */ ;
/** @type {__VLS_StyleScopedClasses['relative']} */ ;
/** @type {__VLS_StyleScopedClasses['font-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:text-amber-500']} */ ;
/** @type {__VLS_StyleScopedClasses['transition-colors']} */ ;
/** @type {__VLS_StyleScopedClasses['relative']} */ ;
/** @type {__VLS_StyleScopedClasses['w-3.5']} */ ;
/** @type {__VLS_StyleScopedClasses['h-3.5']} */ ;
/** @type {__VLS_StyleScopedClasses['text-amber-500']} */ ;
/** @type {__VLS_StyleScopedClasses['transition-all']} */ ;
/** @type {__VLS_StyleScopedClasses['absolute']} */ ;
/** @type {__VLS_StyleScopedClasses['bottom-full']} */ ;
/** @type {__VLS_StyleScopedClasses['left-1/2']} */ ;
/** @type {__VLS_StyleScopedClasses['-translate-x-1/2']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-2']} */ ;
/** @type {__VLS_StyleScopedClasses['px-3']} */ ;
/** @type {__VLS_StyleScopedClasses['py-1.5']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-slate-800']} */ ;
/** @type {__VLS_StyleScopedClasses['text-white']} */ ;
/** @type {__VLS_StyleScopedClasses['text-[10px]']} */ ;
/** @type {__VLS_StyleScopedClasses['font-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['whitespace-nowrap']} */ ;
/** @type {__VLS_StyleScopedClasses['shadow-xl']} */ ;
/** @type {__VLS_StyleScopedClasses['absolute']} */ ;
/** @type {__VLS_StyleScopedClasses['top-full']} */ ;
/** @type {__VLS_StyleScopedClasses['left-1/2']} */ ;
/** @type {__VLS_StyleScopedClasses['-translate-x-1/2']} */ ;
/** @type {__VLS_StyleScopedClasses['border-8']} */ ;
/** @type {__VLS_StyleScopedClasses['border-transparent']} */ ;
/** @type {__VLS_StyleScopedClasses['border-t-slate-800']} */ ;
/** @type {__VLS_StyleScopedClasses['text-emerald-500/50']} */ ;
/** @type {__VLS_StyleScopedClasses['text-[10px]']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['italic']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['h-3']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-1.5']} */ ;
/** @type {__VLS_StyleScopedClasses['overflow-hidden']} */ ;
/** @type {__VLS_StyleScopedClasses['h-full']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-full']} */ ;
/** @type {__VLS_StyleScopedClasses['transition-all']} */ ;
/** @type {__VLS_StyleScopedClasses['duration-1000']} */ ;
/** @type {__VLS_StyleScopedClasses['shadow-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['h-full']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-1']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-full']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-slate-200']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:bg-slate-700']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-col']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-3']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-2']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-between']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['animate-fade-in']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-3']} */ ;
/** @type {__VLS_StyleScopedClasses['w-2']} */ ;
/** @type {__VLS_StyleScopedClasses['h-2']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-full']} */ ;
/** @type {__VLS_StyleScopedClasses['font-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['py-4']} */ ;
/** @type {__VLS_StyleScopedClasses['text-center']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
/** @type {__VLS_StyleScopedClasses['italic']} */ ;
/** @type {__VLS_StyleScopedClasses['text-slate-500']} */ ;
var __VLS_export = (await Promise.resolve().then(function () { return require('vue'); })).defineComponent({});
exports.default = {};
