import { AuthResponse, LoginData } from './../../models/authModels';
import { Component, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ModalData } from '@models/UIModels';
import { AuthenticationService } from '@services/authentication/authentication.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { MetricService } from '@services/metrics/metric.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {
  // Variable para el formulario de inicio de sesión
  loginForm: FormGroup;
  passwordForm: FormGroup;
  // Variable para el formulario de inicio de sesión
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
  @ViewChild('loginModal', { static: false }) registerModal: TemplateRef<any>;
  @ViewChild('passwordModal', { static: false }) passwordModal: TemplateRef<any>;
  // Declaracion del modal
  // Variable para la validacion del inicio de sesión
  loginSuccess = false;
  // Variable para la validacion del inicio de sesión

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private modalService: BsModalService,
    private authService: AuthenticationService,
    private metricService: MetricService) { }

  ngOnInit(): void {
    // Registrando eventos
    this.metricService.registerEvent('loginLoaded');
    this.metricService.performingTrace('loginScreen');
    // Registrando evento eventos
    // Inicializando formulario
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.pattern('^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9]+)$')]],
    });
    // Inicializando formulario
  }
  // Funciones para navegar
  goToRegister(): void {
    this.router.navigate(['/register']);
  }
  // Funciones para navegar
  // Funcion para iniciar la sesión de un usuario
  createUser(): void {
    // Eviando data al servicio
    const loginData: LoginData = {
      email: this.loginForm.value.email,
      password: this.loginForm.value.password,
    };
    this.authService.loginUser(loginData).then((loginResponse: AuthResponse) => {
      if (loginResponse.status === true) {
        this.loginSuccess = true;
        const modalInfo: ModalData = {
          icon: '../../../../assets/img/undraw_done_a34v.svg',
          title: '¡Bienvenido!',
          message: `Bienvenido ${loginResponse.data.displayName}, puedes acceder y disfrutar de nuestras herrmientas.`
        };
        this.showModal(this.registerModal, modalInfo);
      } else {
        const errorCodes = loginResponse.code;
        switch (errorCodes) {
          case 'auth/invalid-email':
            const invalidEmail: ModalData = {
              icon: '../../../../assets/img/undraw_cancel_u1it.svg',
              title: 'Error de autenticación',
              message: 'Dirección de correo invalida',
            };
            this.showModal(this.registerModal, invalidEmail);
            break;
          case 'auth/user-disabled':
            const emailInUse: ModalData = {
              icon: '../../../../assets/img/undraw_cancel_u1it.svg',
              title: 'Error de autenticación',
              message: 'Estimado usuario, la cuenta vinculada a la dirección de correo introducida ha sido inhabilitada',
            };
            this.showModal(this.registerModal, emailInUse);
            break;
          case 'auth/user-not-found':
            const operationNotAllowed: ModalData = {
              icon: '../../../../assets/img/undraw_cancel_u1it.svg',
              title: 'Error de autenticación',
              message: 'No existe cuenta alguna vinculada a la dirección de correo introducida',
            };
            this.showModal(this.registerModal, operationNotAllowed);
            break;
          case 'auth/wrong-password':
            const weakPassword: ModalData = {
              icon: '../../../../assets/img/undraw_cancel_u1it.svg',
              title: 'Error de autenticación',
              message: 'Contraseña incorrecta',
            };
            this.showModal(this.registerModal, weakPassword);
            break;
        }
      }
    });
    // Eviando data al servicio
  }
  // Funcion para iniciar la sesión de un usuario
  // Funcion para desplegar el modal
  showModal(modalToShow, modalData: ModalData): void {
    this.modalData.modalIcon = modalData.icon;
    this.modalData.modalTitle = modalData.title;
    this.modalData.modalDescription = modalData.message;
    if (modalData.isPassword !== null || modalData.isPassword !== undefined) {
      //  Inicializando formulario
      this.passwordForm = this.formBuilder.group({
        email: ['', [Validators.required, Validators.email]],
      });
      //  Inicializando formulario
      this.modalReference = this.modalService.show(modalToShow);
    } else {
      this.modalReference = this.modalService.show(modalToShow);
    }
  }
  // Funcion para desplegar el modal
  // Funcion para mostrar el modal del password
  openPasswordModal(): void {
    const modalInfo: ModalData = {
      isPassword: true,
      icon: '../../../../assets/img/undraw_done_a34v.svg',
      title: 'Recuperación de cuentas',
      message: 'Agregue la direccón de correo vinculada a la cuenta que desea recuperar, luego enviaremos un enlace de recuperación a dicha cuenta.'
    };
    this.showModal(this.passwordModal, modalInfo);
  }
  // Funcion para mostrar el modal del password
  // Funcion para recuperar la contraseña
  recoverPassword(): void {
    // Extrayendo datos del formulario
    const email = this.passwordForm.value.email;
    // Extrayendo datos del formulario
    this.authService.recoverUser(email).then(() => {
      this.passwordForm.reset();
      this.modalReference.hide();
    });
  }
  // Funcion para recuperar la contraseña
  // Funcion para continuar al panel
  goToPanel(): void {
    if (this.loginSuccess ===  true) {
      this.loginForm.reset();
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
