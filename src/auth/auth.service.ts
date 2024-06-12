import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/user/user.model';

@Injectable()
export class AuthService {
    constructor(@InjectModel(User.name) private readonly userModel: Model<User>) {}

    async authentication(authorization: string): Promise<any> {
        if (!authorization || !authorization.startsWith('Bearer ')) {
            throw new HttpException('Unauthorized: Missing authorization header', HttpStatus.UNAUTHORIZED);
        }

        const token = authorization.split(' ')[1];
        const decoded = await this.verifyToken(token);

        if (!decoded) {
            throw new HttpException('Unauthorized: Invalid token', HttpStatus.UNAUTHORIZED);
        }
        return decoded;
    }

    private async verifyToken(token: string): Promise<any> {
        const user = await this.userModel.findOne({ token: token });
        if (!user) {
          return null;
        }
    
        return user;
    }
}
