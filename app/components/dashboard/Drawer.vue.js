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
var transactionStore = (0, useTransactionStore_1.useTransactionStore)();
var ui = (0, ui_1.useUIStore)();
var currentTop = ref(500);
var isDragging = ref(false);
var isMounted = ref(false);
var isSpendingLocked = false;
var startY = ref(0);
var startTop = ref(0);
var limits = reactive({ min: 80, max: 500 });
var categoryOptions = {
    INCOME_AUTO: [
        {
            label: "Gaji",
            icon: "i-heroicons-banknotes",
            value: "Gaji/Income",
            type: "income",
            color: function (isDark) {
                return isDark
                    ? "bg-emerald-500/20 text-emerald-400"
                    : "bg-emerald-500/10 text-emerald-600";
            },
        },
        {
            label: "Nabung",
            icon: "i-heroicons-building-library",
            value: "Tabungan",
            type: "income",
            color: function (isDark) {
                return isDark ? "bg-blue-500/20 text-blue-400" : "bg-blue-500/10 text-blue-600";
            },
        },
        {
            label: "Lainnya",
            icon: "i-heroicons-ellipsis-horizontal-circle",
            value: "Lainnya",
            type: "income",
            color: function (isDark) {
                return isDark ? "bg-slate-500/20 text-slate-400" : "bg-slate-500/10 text-slate-600";
            },
        },
    ],
    QRIS_AUTO: [
        {
            label: "Makan",
            icon: "i-heroicons-cake",
            value: "Makan/Minum",
            type: "expense",
            color: function (isDark) {
                return isDark ? "bg-amber-200 text-black" : "bg-amber-200/40 text-amber-600";
            },
        },
        {
            label: "Jajan",
            icon: "i-heroicons-ticket",
            value: "Jajan",
            type: "expense",
            color: function (isDark) {
                return isDark ? "bg-amber-500 text-black" : "bg-amber-500/30 text-amber-600";
            },
        },
        {
            label: "Belanja",
            icon: "i-heroicons-shopping-bag",
            value: "Belanja",
            type: "expense",
            color: function (isDark) {
                return isDark ? "bg-teal-500 text-black" : "bg-teal-500/10 text-teal-600";
            },
        },
        {
            label: "Lainnya",
            icon: "i-heroicons-ellipsis-horizontal-circle",
            value: "Lainnya",
            type: "expense",
            color: function (isDark) {
                return isDark ? "bg-slate-500/20 text-slate-400" : "bg-slate-500/10 text-slate-600";
            },
        },
    ],
    TRANSFER_MANUAL: [
        {
            label: "Transfer",
            icon: "i-heroicons-paper-airplane",
            value: "Transfer",
            type: "expense",
            color: function (isDark) {
                return isDark ? "bg-emerald-500 text-black" : "bg-emerald-300/30 text-emerald-600";
            },
        },
        {
            label: "Tagihan",
            icon: "i-heroicons-credit-card",
            value: "Cicilan/Tagihan",
            type: "expense",
            color: function (isDark) {
                return isDark ? "bg-red-400 text-black" : "bg-red-400/20 text-red-600";
            },
        },
        {
            label: "Invest",
            icon: "i-heroicons-chart-bar-square",
            value: "Investasi",
            type: "expense",
            color: function (isDark) {
                return isDark ? "bg-indigo-500 text-black" : "bg-indigo-500/20 text-indigo-600";
            },
        },
        {
            label: "Lainnya",
            icon: "i-heroicons-ellipsis-horizontal-circle",
            value: "Lainnya",
            type: "expense",
            color: function (isDark) {
                return isDark ? "bg-slate-500/20 text-slate-400" : "bg-slate-500/10 text-slate-600";
            },
        },
    ],
    DEFAULT: [
        {
            label: "Lainnya",
            icon: "i-heroicons-ellipsis-horizontal-circle",
            value: "Lainnya",
            type: "expense",
            color: function (isDark) {
                return isDark ? "bg-slate-700 text-slate-300" : "bg-slate-500/10 text-slate-600";
            },
        },
    ],
};
var getOptions = function (metadata) {
    return (categoryOptions[metadata] || categoryOptions.DEFAULT);
};
onMounted(function () {
    var updatePositions = function () {
        var _a;
        var h = window.innerHeight;
        var headerEl = document.getElementById("main-header");
        var spendingEl = document.getElementById("spending-card");
        var navWrapper = document.getElementById("navigation-wrapper");
        var spendingContainer = document.getElementById("spending-container");
        var cursorGrab = document.getElementById("cursor-grab");
        if (headerEl) {
            limits.min = headerEl.getBoundingClientRect().bottom + 10;
        }
        var safeZone = h - 100;
        if (navWrapper) {
            var bottomInset = 16;
            var drawerHandleHeight = (_a = cursorGrab === null || cursorGrab === void 0 ? void 0 : cursorGrab.getBoundingClientRect().height) !== null && _a !== void 0 ? _a : 0;
            safeZone = window.innerHeight - drawerHandleHeight - bottomInset;
        }
        if (spendingEl) {
            var spendingBottom = Math.floor(spendingEl.getBoundingClientRect().bottom + 20);
            limits.max = spendingBottom > safeZone ? safeZone : spendingBottom;
            if (spendingBottom && navWrapper && cursorGrab && spendingContainer) {
                var navHeight = navWrapper.getBoundingClientRect().height;
                var cursorGrabH = cursorGrab.getBoundingClientRect().height;
                var stopTop = h - (navHeight + cursorGrabH);
                if (spendingBottom >= stopTop) {
                    limits.max = stopTop;
                    if (!isSpendingLocked) {
                        var maxHeight = stopTop - spendingContainer.getBoundingClientRect().top - 20;
                        spendingContainer.style.maxHeight = "".concat(maxHeight, "px");
                        spendingContainer.style.overflow = "scroll";
                        isSpendingLocked = true;
                    }
                }
                else {
                    if (isSpendingLocked) {
                        spendingEl.style.maxHeight = "";
                        spendingEl.style.overflow = "";
                        isSpendingLocked = false;
                    }
                }
            }
        }
        currentTop.value = limits.max;
    };
    var resizeObserver = new ResizeObserver(function () {
        updatePositions();
    });
    var spendingEl = document.getElementById("spending-card");
    if (spendingEl) {
        resizeObserver.observe(spendingEl);
    }
    setTimeout(function () {
        updatePositions();
        isMounted.value = true;
    }, 500);
    onUnmounted(function () {
        resizeObserver.disconnect();
        window.removeEventListener("resize", updatePositions);
    });
});
var onTouchStart = function (e) {
    var touch = e.touches[0];
    if (!touch)
        return;
    isDragging.value = true;
    startY.value = touch.clientY;
    startTop.value = currentTop.value;
};
var onTouchMove = function (e) {
    if (!isDragging.value)
        return;
    var touch = e.touches[0];
    if (!touch)
        return;
    var deltaY = touch.clientY - startY.value;
    var newTop = startTop.value + deltaY;
    if (newTop >= limits.min && newTop <= limits.max) {
        currentTop.value = newTop;
    }
};
var onTouchEnd = function () {
    isDragging.value = false;
    var mid = (limits.min + limits.max) / 2;
    currentTop.value = currentTop.value < mid ? limits.min : limits.max;
};
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
var __VLS_ctx = __assign(__assign({}, {}), {});
var __VLS_components;
var __VLS_directives;
__VLS_asFunctionalElement(__VLS_intrinsics.section, __VLS_intrinsics.section)(__assign(__assign({ class: "fixed inset-x-0 bottom-0 rounded-t-[40px] shadow-[0_-20px_50px_rgba(0,0,0,0.2)] flex flex-col overflow-hidden transition-all" }, { style: ({
        top: __VLS_ctx.isMounted ? "".concat(__VLS_ctx.currentTop, "px") : '100vh',
        zIndex: 100,
        transform: "translateZ(0)",
        transition: __VLS_ctx.isDragging
            ? 'none'
            : 'top 0.8s cubic-bezier(0.16, 1, 0.3, 1), background-color 0.7s ease, border-color 0.7s ease',
    }) }), { class: ([
        __VLS_ctx.ui.isDark ? 'bg-slate-900 text-white' : 'bg-white text-slate-900',
        __VLS_ctx.isMounted ? 'opacity-100' : 'opacity-0',
    ]) }));
// @ts-ignore
[isMounted, isMounted, currentTop, isDragging, ui,];
__VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign(__assign(__assign(__assign({ onTouchstart: (__VLS_ctx.onTouchStart) }, { onTouchmove: (__VLS_ctx.onTouchMove) }), { onTouchend: (__VLS_ctx.onTouchEnd) }), { id: "cursor-grab" }), { class: "pt-6 pb-3 cursor-grab active:cursor-grabbing touch-none select-none" }));
// @ts-ignore
[onTouchStart, onTouchMove, onTouchEnd,];
__VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "w-16 h-1.5 bg-gray-200 rounded-full mx-auto" }));
__VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "title-path px-10 pt-4 text-xl" }));
__VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "flex-1 overflow-y-auto px-6 pb-20 no-scrollbar" }));
var __VLS_0 = {}.DashboardNav;
/** @type {[typeof __VLS_components.DashboardNav, ]} */ ;
// @ts-ignore
DashboardNav;
// @ts-ignore
var __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({}));
var __VLS_2 = __VLS_1.apply(void 0, __spreadArray([{}], __VLS_functionalComponentArgsRest(__VLS_1), false));
var __VLS_5 = {};
__VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "flex items-center justify-between mt-8 mb-4" }));
__VLS_asFunctionalElement(__VLS_intrinsics.h2, __VLS_intrinsics.h2)(__assign({ class: "text-lg font-bold transition-colors duration-700" }, { class: (__VLS_ctx.ui.isDark ? 'text-white' : 'text-slate-900') }));
// @ts-ignore
[ui,];
__VLS_asFunctionalElement(__VLS_intrinsics.button, __VLS_intrinsics.button)(__assign({ class: "text-xs font-semibold text-amber-500 hover:text-amber-600 transition-colors" }));
__VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "space-y-4 mt-4" }));
var _loop_1 = function (item) {
    // @ts-ignore
    [transactionStore,];
    __VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign(__assign({ key: (item.id) }, { class: "flex flex-col p-4 rounded-2xl transition-colors gap-3 mb-4" }), { class: (__VLS_ctx.ui.isDark
            ? 'bg-slate-800/50 hover:bg-slate-800'
            : 'bg-[#fafafa] border-gray-200 border') }));
    // @ts-ignore
    [ui,];
    __VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "flex items-center justify-between gap-3" }));
    __VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "flex items-center gap-3 min-w-0 flex-1" }));
    __VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center shrink-0" }));
    var __VLS_7 = {}.UIcon;
    /** @type {[typeof __VLS_components.UIcon, ]} */ ;
    // @ts-ignore
    UIcon;
    // @ts-ignore
    var __VLS_8 = __VLS_asFunctionalComponent(__VLS_7, new __VLS_7(__assign({ name: (item.icon) }, { class: "text-amber-500 text-lg" })));
    var __VLS_9 = __VLS_8.apply(void 0, __spreadArray([__assign({ name: (item.icon) }, { class: "text-amber-500 text-lg" })], __VLS_functionalComponentArgsRest(__VLS_8), false));
    __VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "min-w-0 flex-1" }));
    __VLS_asFunctionalElement(__VLS_intrinsics.p, __VLS_intrinsics.p)(__assign({ class: "font-bold text-sm truncate" }, { class: (__VLS_ctx.ui.isDark ? 'text-white' : 'text-slate-900') }));
    // @ts-ignore
    [ui,];
    (item.title);
    __VLS_asFunctionalElement(__VLS_intrinsics.p, __VLS_intrinsics.p)(__assign({ class: "text-[10px] text-gray-500 truncate" }));
    (item.date);
    (item.time);
    __VLS_asFunctionalElement(__VLS_intrinsics.p, __VLS_intrinsics.p)(__assign({ class: "font-bold text-sm shrink-0" }, { class: (item.type === 'income' ? 'text-emerald-500' : 'text-red-500') }));
    (item.type === "income" ? "+" : "-");
    (item.amount.toLocaleString("id-ID"));
    __VLS_asFunctionalElement(__VLS_intrinsics.p, __VLS_intrinsics.p)(__assign({ class: "text-[11px] text-gray-500 line-clamp-2 px-1" }));
    (item.text);
    __VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "flex items-center gap-2 pt-2 border-t border-gray-100 dark:border-slate-700" }));
    var _loop_2 = function (opt) {
        // @ts-ignore
        [getOptions,];
        __VLS_asFunctionalElement(__VLS_intrinsics.button, __VLS_intrinsics.button)(__assign(__assign(__assign({ onClick: function () {
                var _a = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    _a[_i] = arguments[_i];
                }
                var $event = _a[0];
                __VLS_ctx.transactionStore.confirmTransaction(item.id, opt.value, opt.type);
                // @ts-ignore
                [transactionStore,];
            } }, { key: (opt.value) }), { class: (opt.color(__VLS_ctx.ui.isDark)) }), { class: "flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg font-bold text-[10px] active:scale-95 transition-all shadow-sm" }));
        // @ts-ignore
        [ui,];
        if (opt.icon) {
            var __VLS_12 = {}.UIcon;
            /** @type {[typeof __VLS_components.UIcon, ]} */ ;
            // @ts-ignore
            UIcon;
            // @ts-ignore
            var __VLS_13 = __VLS_asFunctionalComponent(__VLS_12, new __VLS_12(__assign({ name: (opt.icon) }, { class: "text-xs shrink-0" })));
            var __VLS_14 = __VLS_13.apply(void 0, __spreadArray([__assign({ name: (opt.icon) }, { class: "text-xs shrink-0" })], __VLS_functionalComponentArgsRest(__VLS_13), false));
        }
        __VLS_asFunctionalElement(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
        (opt.label);
    };
    for (var _b = 0, _c = __VLS_getVForSourceType((__VLS_ctx.getOptions(item.metadata || 'DEFAULT'))); _b < _c.length; _b++) {
        var opt = _c[_b][0];
        _loop_2(opt);
    }
    __VLS_asFunctionalElement(__VLS_intrinsics.button, __VLS_intrinsics.button)(__assign(__assign({ onClick: function () {
            var _a = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                _a[_i] = arguments[_i];
            }
            var $event = _a[0];
            __VLS_ctx.transactionStore.removePending(item.id);
            // @ts-ignore
            [transactionStore,];
        } }, { class: "w-9 py-2 flex items-center justify-center rounded-lg active:scale-95" }), { class: (__VLS_ctx.ui.isDark
            ? 'bg-gray-300 text-slate-900'
            : 'dark:bg-slate-700 text-gray-400') }));
    // @ts-ignore
    [ui,];
    var __VLS_17 = {}.UIcon;
    /** @type {[typeof __VLS_components.UIcon, ]} */ ;
    // @ts-ignore
    UIcon;
    // @ts-ignore
    var __VLS_18 = __VLS_asFunctionalComponent(__VLS_17, new __VLS_17({
        name: "i-heroicons-trash",
    }));
    var __VLS_19 = __VLS_18.apply(void 0, __spreadArray([{
            name: "i-heroicons-trash",
        }], __VLS_functionalComponentArgsRest(__VLS_18), false));
};
for (var _i = 0, _a = __VLS_getVForSourceType((__VLS_ctx.transactionStore.pendingTransactions)); _i < _a.length; _i++) {
    var item = _a[_i][0];
    _loop_1(item);
}
if (__VLS_ctx.transactionStore.pendingTransactions.length === 0) {
    // @ts-ignore
    [transactionStore,];
    __VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "flex flex-col items-center justify-center py-16 px-10 text-center" }));
    __VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "w-20 h-20 rounded-full flex items-center justify-center mb-4 transition-colors duration-700" }, { class: (__VLS_ctx.ui.isDark ? 'bg-slate-800' : 'bg-gray-50') }));
    // @ts-ignore
    [ui,];
    var __VLS_22 = {}.UIcon;
    /** @type {[typeof __VLS_components.UIcon, ]} */ ;
    // @ts-ignore
    UIcon;
    // @ts-ignore
    var __VLS_23 = __VLS_asFunctionalComponent(__VLS_22, new __VLS_22(__assign(__assign({ name: "i-heroicons-clock" }, { class: "text-5xl transition-colors duration-700" }), { class: (__VLS_ctx.ui.isDark ? 'text-slate-600' : 'text-gray-300') })));
    var __VLS_24 = __VLS_23.apply(void 0, __spreadArray([__assign(__assign({ name: "i-heroicons-clock" }, { class: "text-5xl transition-colors duration-700" }), { class: (__VLS_ctx.ui.isDark ? 'text-slate-600' : 'text-gray-300') })], __VLS_functionalComponentArgsRest(__VLS_23), false));
    // @ts-ignore
    [ui,];
    __VLS_asFunctionalElement(__VLS_intrinsics.h3, __VLS_intrinsics.h3)(__assign({ class: "font-bold text-sm mb-1 transition-colors duration-700" }, { class: (__VLS_ctx.ui.isDark ? 'text-slate-400' : 'text-gray-600') }));
    // @ts-ignore
    [ui,];
    __VLS_asFunctionalElement(__VLS_intrinsics.p, __VLS_intrinsics.p)(__assign({ class: "text-[10px] text-gray-400 max-w-[200px] leading-relaxed" }));
}
/** @type {__VLS_StyleScopedClasses['fixed']} */ ;
/** @type {__VLS_StyleScopedClasses['inset-x-0']} */ ;
/** @type {__VLS_StyleScopedClasses['bottom-0']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-t-[40px]']} */ ;
/** @type {__VLS_StyleScopedClasses['shadow-[0_-20px_50px_rgba(0,0,0,0.2)]']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-col']} */ ;
/** @type {__VLS_StyleScopedClasses['overflow-hidden']} */ ;
/** @type {__VLS_StyleScopedClasses['transition-all']} */ ;
/** @type {__VLS_StyleScopedClasses['pt-6']} */ ;
/** @type {__VLS_StyleScopedClasses['pb-3']} */ ;
/** @type {__VLS_StyleScopedClasses['cursor-grab']} */ ;
/** @type {__VLS_StyleScopedClasses['active:cursor-grabbing']} */ ;
/** @type {__VLS_StyleScopedClasses['touch-none']} */ ;
/** @type {__VLS_StyleScopedClasses['select-none']} */ ;
/** @type {__VLS_StyleScopedClasses['w-16']} */ ;
/** @type {__VLS_StyleScopedClasses['h-1.5']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-gray-200']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-full']} */ ;
/** @type {__VLS_StyleScopedClasses['mx-auto']} */ ;
/** @type {__VLS_StyleScopedClasses['title-path']} */ ;
/** @type {__VLS_StyleScopedClasses['px-10']} */ ;
/** @type {__VLS_StyleScopedClasses['pt-4']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xl']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-1']} */ ;
/** @type {__VLS_StyleScopedClasses['overflow-y-auto']} */ ;
/** @type {__VLS_StyleScopedClasses['px-6']} */ ;
/** @type {__VLS_StyleScopedClasses['pb-20']} */ ;
/** @type {__VLS_StyleScopedClasses['no-scrollbar']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-between']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-8']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-4']} */ ;
/** @type {__VLS_StyleScopedClasses['text-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['font-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['transition-colors']} */ ;
/** @type {__VLS_StyleScopedClasses['duration-700']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
/** @type {__VLS_StyleScopedClasses['font-semibold']} */ ;
/** @type {__VLS_StyleScopedClasses['text-amber-500']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:text-amber-600']} */ ;
/** @type {__VLS_StyleScopedClasses['transition-colors']} */ ;
/** @type {__VLS_StyleScopedClasses['space-y-4']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-4']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-col']} */ ;
/** @type {__VLS_StyleScopedClasses['p-4']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-2xl']} */ ;
/** @type {__VLS_StyleScopedClasses['transition-colors']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-3']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-4']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-between']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-3']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-3']} */ ;
/** @type {__VLS_StyleScopedClasses['min-w-0']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-1']} */ ;
/** @type {__VLS_StyleScopedClasses['w-10']} */ ;
/** @type {__VLS_StyleScopedClasses['h-10']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-xl']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-amber-500/10']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
/** @type {__VLS_StyleScopedClasses['shrink-0']} */ ;
/** @type {__VLS_StyleScopedClasses['text-amber-500']} */ ;
/** @type {__VLS_StyleScopedClasses['text-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['min-w-0']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-1']} */ ;
/** @type {__VLS_StyleScopedClasses['font-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['truncate']} */ ;
/** @type {__VLS_StyleScopedClasses['text-[10px]']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-500']} */ ;
/** @type {__VLS_StyleScopedClasses['truncate']} */ ;
/** @type {__VLS_StyleScopedClasses['font-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['shrink-0']} */ ;
/** @type {__VLS_StyleScopedClasses['text-[11px]']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-500']} */ ;
/** @type {__VLS_StyleScopedClasses['line-clamp-2']} */ ;
/** @type {__VLS_StyleScopedClasses['px-1']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-2']} */ ;
/** @type {__VLS_StyleScopedClasses['pt-2']} */ ;
/** @type {__VLS_StyleScopedClasses['border-t']} */ ;
/** @type {__VLS_StyleScopedClasses['border-gray-100']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:border-slate-700']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-1']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-1.5']} */ ;
/** @type {__VLS_StyleScopedClasses['py-2']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['font-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['text-[10px]']} */ ;
/** @type {__VLS_StyleScopedClasses['active:scale-95']} */ ;
/** @type {__VLS_StyleScopedClasses['transition-all']} */ ;
/** @type {__VLS_StyleScopedClasses['shadow-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
/** @type {__VLS_StyleScopedClasses['shrink-0']} */ ;
/** @type {__VLS_StyleScopedClasses['w-9']} */ ;
/** @type {__VLS_StyleScopedClasses['py-2']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['active:scale-95']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-col']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
/** @type {__VLS_StyleScopedClasses['py-16']} */ ;
/** @type {__VLS_StyleScopedClasses['px-10']} */ ;
/** @type {__VLS_StyleScopedClasses['text-center']} */ ;
/** @type {__VLS_StyleScopedClasses['w-20']} */ ;
/** @type {__VLS_StyleScopedClasses['h-20']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-full']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-4']} */ ;
/** @type {__VLS_StyleScopedClasses['transition-colors']} */ ;
/** @type {__VLS_StyleScopedClasses['duration-700']} */ ;
/** @type {__VLS_StyleScopedClasses['text-5xl']} */ ;
/** @type {__VLS_StyleScopedClasses['transition-colors']} */ ;
/** @type {__VLS_StyleScopedClasses['duration-700']} */ ;
/** @type {__VLS_StyleScopedClasses['font-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-1']} */ ;
/** @type {__VLS_StyleScopedClasses['transition-colors']} */ ;
/** @type {__VLS_StyleScopedClasses['duration-700']} */ ;
/** @type {__VLS_StyleScopedClasses['text-[10px]']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-400']} */ ;
/** @type {__VLS_StyleScopedClasses['max-w-[200px]']} */ ;
/** @type {__VLS_StyleScopedClasses['leading-relaxed']} */ ;
// @ts-ignore
var __VLS_6 = __VLS_5;
var __VLS_base = (await Promise.resolve().then(function () { return require('vue'); })).defineComponent({});
var __VLS_export = {};
exports.default = {};
