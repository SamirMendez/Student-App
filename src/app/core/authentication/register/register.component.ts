import { RegisterData, AuthResponse } from '@models/authModels';
import { Component, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { AuthenticationService } from '@services/authentication/authentication.service';
import { ModalData } from '@models/UIModels';
import { MetricService } from '@services/metrics/metric.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit, OnDestroy {

  // Variable para el formulario de registro
  registerForm: FormGroup;
  // Variable para el formulario de registro
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
  @ViewChild('registerModal', { static: false }) registerModal: TemplateRef<any>;
  // Declaracion del modal
  // Variable para la validacion del registro
  registerSuccess = false;
  // Variable para la validacion del registro

  constructor(private router: Router,
              private formBuilder: FormBuilder,
              private modalService: BsModalService,
              private authService: AuthenticationService,
              private metricService: MetricService) { }

  ngOnInit(): void {
    // Registrando eventos
    this.metricService.registerEvent('registerLoaded');
    this.metricService.performingTrace('registerScreen');
    // Registrando evento eventos
    // Inicializando formulario
    this.registerForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(35)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.pattern('^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9]+)$')]],
    });
    // Inicializando formulario
  }
  // Funciones para navegar
  goToLogin(): void {
    this.router.navigate(['/login']);
  }
  // Funciones para navegar
  // Funcion para crear un usuario
  createUser(): void {
    // Eviando data al servicio
    const registerData: RegisterData = {
      name: this.registerForm.value.name,
      email: this.registerForm.value.email,
      password: this.registerForm.value.password,
    };
    this.authService.createUser(registerData).then((registerResponse: AuthResponse) => {
      if (registerResponse.status === true) {
        this.registerSuccess = true;
        const modalInfo: ModalData = {
          icon: '../../../../assets/img/undraw_done_a34v.svg',
          title: '??Registro exitoso!',
          message: `Gracias por registrarte ${registerData.name}, accede a tu cuenta y disfruta de nuestros servicios`
        };
        this.showModal(this.registerModal, modalInfo);
      } else {
        const errorCodes = registerResponse.code;
        switch (errorCodes) {
          case 'auth/invalid-email':
            const invalidEmail: ModalData = {
              icon: '../../../../assets/img/undraw_cancel_u1it.svg',
              title: 'Error de autenticaci??n',
              message: 'Direcci??n de correo invalida',
            };
            this.showModal(this.registerModal, invalidEmail);
            break;
          case 'auth/email-already-in-use':
            const emailInUse: ModalData = {
              icon: '../../../../assets/img/undraw_cancel_u1it.svg',
              title: 'Error de autenticaci??n',
              message: 'La direccion de correo especificada esta vinculada a otra cuenta',
            };
            this.showModal(this.registerModal, emailInUse);
            break;
          case 'auth/operation-not-allowed':
            const operationNotAllowed: ModalData = {
              icon: '../../../../assets/img/undraw_cancel_u1it.svg',
              title: 'Error de autenticaci??n',
              message: 'La operacion de registro ha sido deshabilitada',
            };
            this.showModal(this.registerModal, operationNotAllowed);
            break;
          case 'auth/weak-password':
            const weakPassword: ModalData = {
              icon: '../../../../assets/img/undraw_cancel_u1it.svg',
              title: 'Error de autenticaci??n',
              message: 'Contrase??a d??bil',
            };
            this.showModal(this.registerModal, weakPassword);
            break;
        }
      }
    });
    // Eviando data al servicio
  }
  // Funcion para crear un usuario
  // Funcion para desplegar el modal
  showModal(modalToShow, modalData: ModalData): void {
    this.modalData.modalIcon = modalData.icon;
    this.modalData.modalTitle = modalData.title;
    this.modalData.modalDescription = modalData.message;
    this.modalReference = this.modalService.show(modalToShow);
  }
  // Funcion para desplegar el modal
  // Funcion para continuar al panel
  goToPanel(): void {
    if (this.registerSuccess ===  true) {
      this.modalReference.hide();
      this.router.navigate(['/dashboard'], {replaceUrl: true});
    } else {
      this.modalReference.hide();
    }
  }
  // Funcion para continuar al panel
  ngOnDestroy(): void {
    // Registrando eventos
    this.metricService.closeTrace();
    // Registrando evento eventos
  }
}
