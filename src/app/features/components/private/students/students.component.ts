import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { StudentData, StudentDelete, StudentResponse } from '@models/studentModels';
import { StudentService } from '@services/students/student.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-students',
  templateUrl: './students.component.html',
  styleUrls: ['./students.component.css']
})
export class StudentsComponent implements OnInit {
  // Variables para el monitoreo de los archivos
  uploadStandPercent: Observable<number>;
  downloadStandURL: Observable<string>;
  // Variables para el monitoreo de los archivos
  // Variables para los formularios
  studentsForm: FormGroup;
  filesForm: FormGroup;
  editionForm: FormGroup;
  searchForm: FormGroup;
  // Variables para los formularios
  // Variable para referenciar los modals
  modalReference: BsModalRef;
  // Variable para referenciar los modals
  // Objeto para mostrar la informacion del modal
  modalData = {
    modalTitle: null,
    modalIcon: null,
    modalDescription: null,
  };
  // Objeto para mostrar la informacion del modal
  // Declaracion del modal
  @ViewChild('studentModal', { static: false })  studentModal: TemplateRef<any>;
  @ViewChild('fileModal', { static: false })  fileModal: TemplateRef<any>;
  // Declaracion del modal
  // Arreglo para el listado de estudiantes
  students = [];
  studentsBackUp = [];
  fileStudents = [];
  // Arreglo para el listado de estudiantes
  // Variable para el enlace de descarga
  bioLink = '';
  // Variable para el enlace de descarga

  constructor(private router: Router,
              private modalService: BsModalService,
              private studentService: StudentService,
              private formBuilder: FormBuilder,
              private fireStorage: AngularFireStorage) { }

  ngOnInit(): void {
    this.getServiceData();
    // Inicializando formulario
    this.searchForm = this.formBuilder.group({
      name: ['', [Validators.required]],
      field: ['', [Validators.required]],
    });
    this.searchService();
    // Inicializando formulario
  }
  // Funcion para consumir los datos del servicio
  getServiceData(): void {
    this.studentService.getStudents().subscribe((returnedStudents) => {
      this.students = returnedStudents;
      this.studentsBackUp = returnedStudents;
    });
  }
  // Funcion para consumir los datos del servicio
  // Funcion para realizar busqueda
  searchService(): void {
    this.searchForm.controls.name.valueChanges.subscribe((returnedData: string) => {
      const field: string = this.searchForm.value.field;
      switch (field) {
        case 'name':
          // Limpio array para rellenarlo con la data filtrada
          this.students = [];
          // Limpio array para rellenarlo con la data filtrada
          // Bucle para buscar en cada string palabra por palabra
          this.studentsBackUp.map((e, i) => {
            if (e.name.toLowerCase().indexOf(returnedData) !== -1) {
              this.students.push(this.studentsBackUp[i]);
            }
          });
          break;
        case 'lastname':
          // Limpio array para rellenarlo con la data filtrada
          this.students = [];
          // Limpio array para rellenarlo con la data filtrada
          // Bucle para buscar en cada string palabra por palabra
          this.studentsBackUp.map((e, i) => {
            if (e.lastname.toLowerCase().indexOf(returnedData) !== -1) {
              this.students.push(this.studentsBackUp[i]);
            }
          });
          break;
      }
    });
  }
  // Funcion para realizar busqueda
  // Funcion para limpiar el cuadro de busqueda
  clearSearch(): void {
    this.searchForm.reset();
    this.getServiceData();
  }
  // Funcion para limpiar el cuadro de busqueda
  // Funcion para cargar el formulario de los estudiantes
  showStudentForm(): void {
    this.studentsForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(22)]],
      surname: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(22)]],
      age: ['', [Validators.required]],
      file: ['', [Validators.required]],
    });
    this.showModal(this.studentModal);
  }
  // Funcion para cargar el formulario de los estudiantes
  // Funcion para cargar el formulario de edicion
  showEditionForm(editionModal: TemplateRef<any>, student): void {
    this.editionForm = this.formBuilder.group({
      name: [student.name, [Validators.required, Validators.minLength(2), Validators.maxLength(22)]],
      surname: [student.lastname, [Validators.required, Validators.minLength(2), Validators.maxLength(22)]],
      age: [student.age, [Validators.required]],
    });
    this.showModal(editionModal);
    // this.showModal(this.editionModal);
  }
  // Funcion para cargar el formulario de edicion
  // Funcion para crear un estudiante
  createStudent(): void {
    // Enviando datos al servicio
    const studentData: StudentData = {
      name: this.studentsForm.value.name,
      surname: this.studentsForm.value.surname,
      age: this.studentsForm.value.age,
      file: this.studentsForm.value.file,
    };
    this.studentService.createStudent(studentData).then((studenResponse: StudentResponse) => {
      this.modalReference.hide();
      this.studentsForm.reset();
    });
    // Enviando datos al servicio
  }
  // Funcion para crear un estudiante
  // Funcion para actualizar un estudiante
  updateStudent(student): void {
    // Enviando datos al servicio
    const studentData: StudentData = {
      name: this.editionForm.value.name,
      surname: this.editionForm.value.surname,
      age: this.editionForm.value.age,
      id: student.id
    };
    console.log(studentData);
    
    this.studentService.updateStudent(studentData).then((studenResponse: StudentResponse) => {
      this.modalReference.hide();
      this.editionForm.reset();
    });
    // Enviando datos al servicio
  }
  // Funcion para actualizar un estudiante
  // Funcion para mostrar los modals
  showModal(modalToShow): void {
    this.modalReference = this.modalService.show(modalToShow);
  }
  // Funcion para mostrar los modals
  // Funcion para la subida de archivos de biografia
  uploadBioFile(event): void {
    const file = event.target.files[0];
    const nameToProccess: string = event.target.files[0].name;
    const dividedName: any[] = nameToProccess.split('.');
    const extension: string = dividedName[1];
    const fileName = Date.now();
    const filePath = `studentsApp/multimediaContent/biography/${fileName}/${fileName}.${extension}`;
    const task = this.fireStorage.upload(filePath, file);
    const ref = this.fireStorage.ref(filePath);
    this.uploadStandPercent = task.percentageChanges();
    task.snapshotChanges().pipe(finalize(() => {
      this.downloadStandURL = ref.getDownloadURL();
      this.downloadStandURL.subscribe((url) => {
        this.studentsForm.controls.file.setValue(url);
      });
    })).subscribe();
  }
  // Funcion para la subida de archivos de biografia
  // Funcion para mostrar el modal de eliminacion
  showDeleteModal(deleteModal: TemplateRef<any>): void {
    this.showModal(deleteModal);
  }
  // Funcion para mostrar el modal de eliminacion
  // Funcion para eliminar un estudiante
  deleteStudent(student): void {
    const deleteData: StudentDelete = {
      file: student.file,
      code: student.id,
    };
    this.studentService.deleteStudent(deleteData).then(() => {
      this.modalReference.hide();
    });
  }
  // Funcion para eliminar un estudiante
  // Funcion para mostrar el modal del formulario
  showFileForm(): void {
    this.filesForm = this.formBuilder.group({
      file: ['', [Validators.required]],
    });
    this.modalReference = this.modalService.show(this.fileModal, {class: 'modal-xl'});
  }
  // Funcion para mostrar el modal del formulario
  // Funcion para enviar el archivo XML
  uploadXMLFile(XML): void {
    const fileToSend: FormData = new FormData();
    fileToSend.append('studentsList', XML.target.files[0]);
    this.studentService.sendFile(fileToSend).then((data) => {
      this.fileStudents = data.data;
      this.filesForm.controls.file.setValue('fileReady');
    });
  }
  // Funcion para enviar el archivo XML
  // Funcion para enrolar estudiantes de manera masiva
  createByFile(): void {
    const dataToSend = {
      data: this.fileStudents
    };
    this.studentService.listEnrollement(dataToSend).then(() => {
      this.fileStudents = [];
      this.filesForm.reset();
      this.modalReference.hide();
    });
  }
  // Funcion para enrolar estudiantes de manera masiva
  // Funcion para descargar la biografia de los archivos
  downloadBio(student): void {
    this.fireStorage.storage.refFromURL(student).getMetadata().then((fileData) => {
      const fileType = fileData.contentType;
      switch (fileType) {
        case 'application/pdf':
          window.open(student, '_blank');
          break;
        case 'text/plain':
          window.open(student, '_blank');
          break;
        case 'application/octet-stream':
          location.href = student;
          break;
      }
    });

  }
  // Funcion para descargar la biografia de los archivos
}
