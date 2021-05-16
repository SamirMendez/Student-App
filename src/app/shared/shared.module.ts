import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StudentPipe } from '../core/pipes/students/student.pipe';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    StudentPipe
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  exports: [
    FormsModule,
    ReactiveFormsModule,
    StudentPipe
  ]
})
export class SharedModule { }
