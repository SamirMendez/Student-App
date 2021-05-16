import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'student'
})
export class StudentPipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): unknown {
    return null;
  }

}
