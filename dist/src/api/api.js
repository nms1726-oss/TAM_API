"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExpressApi = void 0;
const express_1 = __importStar(require("express"));
const http = __importStar(require("http"));
const product_1 = __importDefault(require("./routes/product"));
const role_1 = __importDefault(require("./routes/role"));
const user_1 = __importDefault(require("./routes/user"));
const order_1 = __importDefault(require("./routes/order"));
const orderDetail_1 = __importDefault(require("./routes/orderDetail"));
const category_1 = __importDefault(require("./routes/category"));
const subcategory_1 = __importDefault(require("./routes/subcategory"));
const comparisonHistory_1 = __importDefault(require("./routes/comparisonHistory"));
const userAddress_1 = __importDefault(require("./routes/userAddress"));
const userPaymentMethod_1 = __importDefault(require("./routes/userPaymentMethod"));
const phoneUser_1 = __importDefault(require("./routes/phoneUser"));
const support_1 = __importDefault(require("./routes/support"));
const calification_1 = __importDefault(require("./routes/calification"));
const cart_1 = __importDefault(require("./routes/cart"));
const cartDetail_1 = __importDefault(require("./routes/cartDetail"));
const supplier_1 = __importDefault(require("./routes/supplier"));
const supplierCategory_1 = __importDefault(require("./routes/supplierCategory"));
const supplierPhone_1 = __importDefault(require("./routes/supplierPhone"));
const actionControl_1 = __importDefault(require("./routes/actionControl"));
const auth_1 = __importDefault(require("./routes/auth"));
class ExpressApi {
    constructor(baseUrl) {
        this.createServer = () => {
            const expressApp = (0, express_1.default)();
            expressApp.use(express_1.default.json());
            expressApp.use(express_1.default.urlencoded({ extended: true }));
            expressApp.use('/', this.router);
            return http.createServer(expressApp);
        };
        this.baseUrl = baseUrl;
        this.router = (0, express_1.Router)();
        this.router.use("/products", product_1.default);
        this.router.use("/roles", role_1.default);
        this.router.use("/users", user_1.default);
        this.router.use("/orders", order_1.default);
        this.router.use("/orderDetails", orderDetail_1.default);
        this.router.use("/categories", category_1.default);
        this.router.use("/subcategories", subcategory_1.default);
        this.router.use("/comparisonHistories", comparisonHistory_1.default);
        this.router.use("/userAddresses", userAddress_1.default);
        this.router.use("/userPaymentMethods", userPaymentMethod_1.default);
        this.router.use("/phoneUsers", phoneUser_1.default);
        this.router.use("/support", support_1.default);
        this.router.use("/califications", calification_1.default);
        this.router.use("/cart", cart_1.default);
        this.router.use("/cartDetails", cartDetail_1.default);
        this.router.use("/suppliers", supplier_1.default);
        this.router.use("/supplierCategories", supplierCategory_1.default);
        this.router.use("/supplierPhones", supplierPhone_1.default);
        this.router.use("/actionControls", actionControl_1.default);
        this.router.use("/auth", auth_1.default);
        // this.router.get("/health", healthCheck);
        // aqui puedes agregar más rutas
    }
}
exports.ExpressApi = ExpressApi;
