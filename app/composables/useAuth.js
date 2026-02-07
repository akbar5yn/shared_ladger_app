"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.useAuth = void 0;
// ... impor lainnya ...
var auth_1 = require("~/stores/auth");
var auth_service_1 = require("~/services/auth.service");
function handleLoginSuccess(data) {
    return {
        data: data,
        success: true
    };
}
function handleLoginFailed(data) {
    return {
        success: false,
        message: data.message,
        errors: {
            email: data.errors.email,
            password: data.errors.password,
            status: data.errors.status
        },
    };
}
var useAuth = function () {
    var authStore = (0, auth_1.useAuthStore)();
    var _a = useNotifier(), notifyError = _a.notifyError, notifySuccess = _a.notifySuccess;
    var router = useRouter();
    var isLoading = ref(false);
    var useLogin = function (credentials) { return __awaiter(void 0, void 0, void 0, function () {
        var _a, data, error, result;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    isLoading.value = true;
                    return [4 /*yield*/, (0, auth_service_1.loginService)(credentials)];
                case 1:
                    _a = _b.sent(), data = _a.data, error = _a.error;
                    if (error) {
                        isLoading.value = false;
                        return [2 /*return*/, handleLoginFailed(error)];
                    }
                    result = handleLoginSuccess(data);
                    isLoading.value = false;
                    return [2 /*return*/, result];
            }
        });
    }); };
    var handleUserLogin = function (credentials) { return __awaiter(void 0, void 0, void 0, function () {
        var res;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, useLogin(credentials)];
                case 1:
                    res = _a.sent();
                    if (!res.success) {
                        notifyError(res.message, 'error');
                    }
                    if (!res.success) return [3 /*break*/, 5];
                    return [4 /*yield*/, authStore.setLoginAction(res.data)];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, router.push('/dashboard')];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, nextTick()];
                case 4:
                    _a.sent();
                    setTimeout(function () {
                        notifySuccess('Selamat datang di Shared Lager App', 'success');
                    }, 300);
                    _a.label = 5;
                case 5: return [2 /*return*/];
            }
        });
    }); };
    var handleLogout = function () {
        authStore.logout();
        router.push('/login');
    };
    return {
        token: computed(function () { return authStore.token; }),
        isLoggedIn: computed(function () { return authStore.isLoggedIn; }),
        useLogin: useLogin,
        handleUserLogin: handleUserLogin,
        logout: handleLogout,
        isLoading: isLoading
    };
};
exports.useAuth = useAuth;
