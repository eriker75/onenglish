"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CoordinatorsModule = void 0;
const common_1 = require("@nestjs/common");
const nestjs_form_data_1 = require("nestjs-form-data");
const auth_module_1 = require("../auth/auth.module");
const database_module_1 = require("../database/database.module");
const coordinators_service_1 = require("./coordinators.service");
const coordinators_controller_1 = require("./coordinators.controller");
let CoordinatorsModule = class CoordinatorsModule {
};
exports.CoordinatorsModule = CoordinatorsModule;
exports.CoordinatorsModule = CoordinatorsModule = __decorate([
    (0, common_1.Module)({
        imports: [auth_module_1.AuthModule, database_module_1.DatabaseModule, nestjs_form_data_1.NestjsFormDataModule],
        controllers: [coordinators_controller_1.CoordinatorsController],
        providers: [coordinators_service_1.CoordinatorsService],
        exports: [coordinators_service_1.CoordinatorsService],
    })
], CoordinatorsModule);
//# sourceMappingURL=coordinators.module.js.map