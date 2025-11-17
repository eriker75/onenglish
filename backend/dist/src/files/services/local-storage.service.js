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
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
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
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LocalStorageService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const fs_1 = require("fs");
const path = __importStar(require("path"));
const common_2 = require("@nestjs/common");
let LocalStorageService = class LocalStorageService {
    configService;
    uploadRoot;
    logger = new common_2.Logger('LocalStorageService');
    constructor(configService) {
        this.configService = configService;
        this.uploadRoot =
            this.configService.get('UPLOAD_ROOT') ||
                path.join(process.cwd(), 'uploads');
        this.logger.log(`Upload root directory: ${this.uploadRoot}`);
    }
    async ensureDirectoryExists(directory) {
        try {
            await fs_1.promises.access(directory);
        }
        catch {
            await fs_1.promises.mkdir(directory, { recursive: true });
        }
    }
    async uploadFile(file, type, randomName) {
        const uploadDir = path.join(this.uploadRoot, type);
        const filePath = path.join(uploadDir, randomName);
        try {
            await this.ensureDirectoryExists(uploadDir);
            await fs_1.promises.copyFile(file.path, filePath);
            await fs_1.promises.unlink(file.path);
            return `/uploads/${type}/${randomName}`;
        }
        catch (error) {
            throw new common_1.InternalServerErrorException(`Error guardando archivo local: ${error.message}`);
        }
    }
    async updateFile(oldFilename, newFile, type, newRandomName) {
        const uploadDir = path.join(this.uploadRoot, type);
        const oldFilePath = path.join(uploadDir, oldFilename);
        const newFilePath = path.join(uploadDir, newRandomName);
        try {
            try {
                await fs_1.promises.unlink(oldFilePath);
            }
            catch {
                this.logger.warn(`Archivo ${oldFilename} no existe, no se puede eliminar`);
            }
            await this.ensureDirectoryExists(uploadDir);
            await fs_1.promises.copyFile(newFile.path, newFilePath);
            await fs_1.promises.unlink(newFile.path);
            return `/uploads/${type}/${newRandomName}`;
        }
        catch (error) {
            throw new common_1.InternalServerErrorException(`Error actualizando archivo local: ${error.message}`);
        }
    }
    async deleteFile(type, filename) {
        const filePath = path.join(this.uploadRoot, type, filename);
        try {
            try {
                await fs_1.promises.access(filePath);
                await fs_1.promises.unlink(filePath);
            }
            catch {
                this.logger.warn(`Archivo ${filename} no existe, no se puede eliminar`);
            }
        }
        catch (error) {
            throw new common_1.InternalServerErrorException(`Error eliminando archivo local: ${error.message}`);
        }
    }
    getFileUrl(type, filename) {
        return `/uploads/${type}/${filename}`;
    }
};
exports.LocalStorageService = LocalStorageService;
exports.LocalStorageService = LocalStorageService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], LocalStorageService);
//# sourceMappingURL=local-storage.service.js.map