import { CreateUserDto } from '../services/user/dto/create-user.dto';
import { UserService } from '../services/user/user.service';
export declare class UserController {
    private readonly userService;
    constructor(userService: UserService);
    createUser(createUserDto: CreateUserDto): Promise<any>;
}
