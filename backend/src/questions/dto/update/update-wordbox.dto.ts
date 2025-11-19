import { PartialType } from '@nestjs/swagger';
import { CreateWordboxDto } from '../cretate/create-wordbox.dto';

/**
 * DTO para actualizar un wordbox.
 * Todas las propiedades son opcionales.
 * El validador GridDimensionsMatch se ejecuta pero permite updates parciales
 * cuando gridWidth o gridHeight no están presentes.
 */
export class UpdateWordboxDto extends PartialType(CreateWordboxDto) {}
