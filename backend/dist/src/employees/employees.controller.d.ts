import { EmployeesService } from './employees.service';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
export declare class EmployeesController {
    private readonly employeesService;
    constructor(employeesService: EmployeesService);
    create(createEmployeeDto: CreateEmployeeDto): string;
    findAll(): string;
    findOne(id: string): string;
    update(id: string, updateEmployeeDto: UpdateEmployeeDto): string;
    remove(id: string): string;
}
