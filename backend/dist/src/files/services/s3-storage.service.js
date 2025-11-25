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
exports.S3StorageService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const client_s3_1 = require("@aws-sdk/client-s3");
const fs = __importStar(require("fs"));
let S3StorageService = class S3StorageService {
    configService;
    s3Client;
    bucketName;
    region;
    endpoint;
    forcePathStyle;
    constructor(configService) {
        this.configService = configService;
        this.region = this.configService.get('AWS_REGION') || 'us-east-1';
        this.bucketName = this.configService.get('AWS_S3_BUCKET_NAME');
        if (!this.bucketName) {
            throw new Error('AWS_S3_BUCKET_NAME o AWS_S3_BUCKET debe estar configurado');
        }
        this.endpoint = this.configService.get('AWS_S3_ENDPOINT');
        this.forcePathStyle =
            this.configService.get('AWS_S3_FORCE_PATH_STYLE') === 'true';
        const s3Config = {
            region: this.region,
            credentials: {
                accessKeyId: this.configService.get('AWS_ACCESS_KEY_ID'),
                secretAccessKey: this.configService.get('AWS_SECRET_ACCESS_KEY'),
            },
        };
        if (this.endpoint) {
            s3Config.endpoint = this.endpoint;
            s3Config.forcePathStyle = this.forcePathStyle ?? true;
        }
        else {
            if (this.region === 'us-east-1') {
                s3Config.endpoint = 'https://s3.amazonaws.com';
            }
            else {
                s3Config.endpoint = `https://s3.${this.region}.amazonaws.com`;
            }
            s3Config.forcePathStyle = false;
        }
        this.s3Client = new client_s3_1.S3Client(s3Config);
    }
    async uploadFile(file, type, randomName) {
        const s3Key = `${type}/${randomName}`;
        try {
            const mimeType = file.mimeType || 'application/octet-stream';
            await this.s3Client.send(new client_s3_1.PutObjectCommand({
                Bucket: this.bucketName,
                Key: s3Key,
                Body: fs.readFileSync(file.path),
                ContentType: mimeType,
            }));
            return this.getFileUrl(type, randomName);
        }
        catch (error) {
            if (error.message?.includes('endpoint')) {
                const errorDetails = error.message;
                throw new common_1.InternalServerErrorException(`Error subiendo archivo a S3: ${errorDetails}. ` +
                    `La región configurada es '${this.region}'. ` +
                    `Verifica la región real de tu bucket S3 en la consola de AWS o ejecuta: ` +
                    `aws s3api get-bucket-location --bucket ${this.bucketName}. ` +
                    `Asegúrate de que AWS_REGION coincida exactamente con la región del bucket.`);
            }
            throw new common_1.InternalServerErrorException(`Error subiendo archivo a S3: ${error.message}`);
        }
    }
    async updateFile(oldFilename, newFile, type, newRandomName) {
        const oldS3Key = `${type}/${oldFilename}`;
        const newS3Key = `${type}/${newRandomName}`;
        try {
            await this.s3Client.send(new client_s3_1.DeleteObjectCommand({
                Bucket: this.bucketName,
                Key: oldS3Key,
            }));
            await this.s3Client.send(new client_s3_1.PutObjectCommand({
                Bucket: this.bucketName,
                Key: newS3Key,
                Body: fs.readFileSync(newFile.path),
                ContentType: newFile.mimeType,
            }));
            return this.getFileUrl(type, newRandomName);
        }
        catch (error) {
            if (error.message?.includes('endpoint')) {
                throw new common_1.InternalServerErrorException(`Error actualizando archivo en S3: ${error.message}. Verifica que AWS_REGION coincida con la región de tu bucket S3.`);
            }
            throw new common_1.InternalServerErrorException(`Error actualizando archivo en S3: ${error.message}`);
        }
    }
    async deleteFile(type, filename) {
        const s3Key = `${type}/${filename}`;
        try {
            await this.s3Client.send(new client_s3_1.DeleteObjectCommand({
                Bucket: this.bucketName,
                Key: s3Key,
            }));
        }
        catch (error) {
            if (error.message?.includes('endpoint')) {
                throw new common_1.InternalServerErrorException(`Error eliminando archivo de S3: ${error.message}. Verifica que AWS_REGION coincida con la región de tu bucket S3.`);
            }
            throw new common_1.InternalServerErrorException(`Error eliminando archivo de S3: ${error.message}`);
        }
    }
    getFileUrl(type, filename) {
        const s3Key = `${type}/${filename}`;
        if (this.endpoint) {
            if (this.forcePathStyle) {
                const endpointUrl = this.endpoint.replace(/\/$/, '');
                return `${endpointUrl}/${this.bucketName}/${s3Key}`;
            }
            else {
                const endpointUrl = this.endpoint
                    .replace(/^https?:\/\//, '')
                    .replace(/\/$/, '');
                return `https://${this.bucketName}.${endpointUrl}/${s3Key}`;
            }
        }
        if (this.region === 'us-east-1') {
            return `https://${this.bucketName}.s3.amazonaws.com/${s3Key}`;
        }
        else {
            return `https://${this.bucketName}.s3.${this.region}.amazonaws.com/${s3Key}`;
        }
    }
};
exports.S3StorageService = S3StorageService;
exports.S3StorageService = S3StorageService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], S3StorageService);
//# sourceMappingURL=s3-storage.service.js.map