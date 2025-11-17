import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
export declare class EmployeesService {
    create(createEmployeeDto: CreateEmployeeDto): string;
    findAll(): string;
    findOne(id: number): string;
    update(id: number, updateEmployeeDto: UpdateEmployeeDto): string;
    remove(id: number): string;
}
