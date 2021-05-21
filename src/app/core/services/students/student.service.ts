import { StudentDelete, StudentEnrollement, StudentResponse } from './../../models/studentModels';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { StudentData } from '@models/studentModels';
import { Observable } from 'rxjs';
import { AngularFireStorage } from '@angular/fire/storage';

@Injectable({
  providedIn: 'root'
})
export class StudentService {

  constructor(private realtimeDatabase: AngularFireDatabase,
              private httpClient: HttpClient,
              private fireStorage: AngularFireStorage) { }

  // Metodo publico para crear estudiantes
  public async createStudent(studentData: StudentData): Promise<StudentResponse> {
    const studentCode: number = Date.now();
    return await this.realtimeDatabase.database.ref(`studentsPlatform/students/${studentCode}/`).set({
      name: studentData.name,
      lastname: studentData.surname,
      age: studentData.age,
      file: studentData.file,
      id: studentCode,
      createdBy: 'form'
    }).then((createdData: string) => {
      return {status: true, data: createdData};
    });
  }
  // Metodo publico para crear estudiantes
  // Metodo publico para retornar los estudiantes
  public getStudents(): Observable<StudentData[]> {
    return this.realtimeDatabase.list<StudentData>(`studentsPlatform/students/`).valueChanges();
  }
  // Metodo publico para retornar los estudiantes
  // Metodo publico para actualizar estudiantes
  public async updateStudent(studentData: StudentData): Promise<StudentResponse> {
    const studentCode: number = studentData.id;
    return await this.realtimeDatabase.database.ref(`studentsPlatform/students/${studentCode}/`).update({
      name: studentData.name,
      lastname: studentData.surname,
      age: studentData.age,
    }).then((createdData: string) => {
      console.log('Corrio');
      
      return {status: true, data: createdData};
    });
  }
  // Metodo publico para actualizar estudiantes
  // Metodo publico para eliminar un estudiante
  public async deleteStudent(studentData: StudentDelete): Promise<StudentResponse> {
    const studentCode = studentData.code;
    return await this.fireStorage.storage.refFromURL(studentData.file).delete().then(async () => {
      return await this.realtimeDatabase.database.ref(`studentsPlatform/students/${studentCode}/`).remove().then((deletedData: string) => {
        return {status: true, data: deletedData};
      });
    });
  }
  // Metodo publico para eliminar un estudiante
  // Funcion para enviar un archivo al servidor
  public async sendFile(file: FormData): Promise<any> {
    const endpointURL = `https://us-central1-students-platform-e5021.cloudfunctions.net/readFile`;
    return await this.httpClient.post(endpointURL, file).toPromise().then((returnedStudents) => {
      return returnedStudents;
    });
  }
  // Funcion para enviar un archivo al servidor
  // Funcion para realizar una inscripcion masiva
  public async listEnrollement(enrollementData: StudentEnrollement): Promise<any> {
    const listToEnroll: any[] = enrollementData.data;
    for (let index = 0; index < listToEnroll.length; index++) {
      const element = listToEnroll[index];
      await this.studentEnroller(element);
    }
  }
  studentEnroller = (currentStudent: StudentData) => {
    return new Promise(async (resolve, reject) => {
      const studentCode: number = Date.now();
      currentStudent.id = studentCode;
      currentStudent.createdBy = 'file';
      return await this.realtimeDatabase.database.ref(`studentsPlatform/students/${studentCode}/`).set(currentStudent).then(() => {
        resolve({status: true});
      });
    });
  }
  // Funcion para realizar una inscripcion masiva
}
