import { ValidRole } from '../../common/definitions/enums';
export declare function SchoolAuth(...roles: ValidRole[]): <TFunction extends Function, Y>(target: TFunction | object, propertyKey?: string | symbol, descriptor?: TypedPropertyDescriptor<Y>) => void;
