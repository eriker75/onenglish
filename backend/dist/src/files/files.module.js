"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FilesModule = void 0;
const common_1 = require("@nestjs/common");
const nestjs_form_data_1 = require("nestjs-form-data");
const auth_module_1 = require("../auth/auth.module");
const file_service_1 = require("./services/file.service");
const path_1 = require("path");
const local_storage_service_1 = require("./services/local-storage.service");
const s3_storage_service_1 = require("./services/s3-storage.service");
const media_file_service_1 = require("./services/media-file.service");
const files_controller_1 = require("./controllers/files.controller");
let FilesModule = class FilesModule {
};
exports.FilesModule = FilesModule;
exports.FilesModule = FilesModule = __decorate([
    (0, common_1.Global)(),
    (0, common_1.Module)({
        imports: [
            auth_module_1.AuthModule,
            nestjs_form_data_1.NestjsFormDataModule.configAsync({
                useFactory: () => ({
                    storage: nestjs_form_data_1.FileSystemStoredFile,
                    fileSystemStoragePath: (0, path_1.join)(process.cwd(), 'uploads'),
                }),
            }),
        ],
        controllers: [files_controller_1.FilesController],
        providers: [
            media_file_service_1.MediaFileService,
            file_service_1.FileService,
            local_storage_service_1.LocalStorageService,
            s3_storage_service_1.S3StorageService,
        ],
        exports: [nestjs_form_data_1.NestjsFormDataModule, file_service_1.FileService, media_file_service_1.MediaFileService],
    })
], FilesModule);
//# sourceMappingURL=files.module.js.map