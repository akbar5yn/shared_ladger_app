"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useNotifier = void 0;
var notification_1 = require("~/stores/notification");
var useNotifier = function () {
    var notifierStore = (0, notification_1.useNotificationStore)();
    var notifySuccess = function (message, type) {
        notifierStore.show(message, 5000, type);
    };
    var notifyError = function (message, type) {
        notifierStore.show("Error: ".concat(message), 5000, type);
    };
    return {
        notifySuccess: notifySuccess,
        notifyError: notifyError,
        isVisible: computed(function () { return notifierStore.isVisible; }),
        message: computed(function () { return notifierStore.message; }),
    };
};
exports.useNotifier = useNotifier;
