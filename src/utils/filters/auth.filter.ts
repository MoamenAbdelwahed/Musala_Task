import { Catch, ExceptionFilter } from '@nestjs/common';
import { InvalidCredentialsException } from '../exceptions/auth.exception';

@Catch(InvalidCredentialsException)
export class InvalidCredentialsFilter implements ExceptionFilter {
  catch(exception: InvalidCredentialsException) {
    return {
      message: exception.message
    };
  }
}
