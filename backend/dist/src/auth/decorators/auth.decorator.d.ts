import { ValidRole } from 'src/common/definitions/enums';
export declare function Auth(...roles: ValidRole[]): <TFunction extends Function, Y>(target: TFunction | object, propertyKey?: string | symbol, descriptor?: TypedPropertyDescriptor<Y>) => void;
