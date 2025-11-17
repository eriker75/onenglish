import { ValidRole } from '../../common/definitions/enums';
export declare const SKIP_SCHOOL_READ_CHECK = "skipSchoolReadCheck";
export declare function SchoolRead(...roles: ValidRole[]): <TFunction extends Function, Y>(target: TFunction | object, propertyKey?: string | symbol, descriptor?: TypedPropertyDescriptor<Y>) => void;
export declare function SkipSchoolReadCheck(): import("@nestjs/common").CustomDecorator<string>;
