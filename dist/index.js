"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const express_1 = __importDefault(require("express"));
const express_session_1 = __importDefault(require("express-session"));
const nocache_1 = __importDefault(require("nocache"));
const path_1 = __importDefault(require("path"));
const dotenv_1 = __importDefault(require("dotenv"));
const config_1 = __importDefault(require("./config/config"));
const routes_1 = __importDefault(require("./routes/routes"));
;
;
dotenv_1.default.config();
mongoose_1.default.connect("mongodb://127.0.0.1:27017/user_managment_system")
    .then(() => {
    console.log("Connected to MongoDb");
})
    .catch((err) => {
    console.log("MongoDb connection Error: ", err);
});
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, nocache_1.default)());
app.use(express_1.default.static(path_1.default.join(__dirname, 'public')));
app.use((0, express_session_1.default)({
    secret: config_1.default.sessionSecret,
    resave: false,
    saveUninitialized: false
}));
app.set("view engine", "ejs");
app.set("views", [
    path_1.default.join(__dirname, 'views/admin'),
    path_1.default.join(__dirname, 'views')
]);
app.use('/', routes_1.default);
const port = process.env.PORT || 2900;
app.listen(port, () => console.log(`runnig on port ${port}`));
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send("Something Broke!");
});
exports.default = app;
