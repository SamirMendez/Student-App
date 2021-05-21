import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ModalData } from '@models/UIModels';
import { AuthenticationService } from '@services/authentication/authentication.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
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
  @ViewChild('logOutModal', { static: false })  logOutModal: TemplateRef<any>;
  // Declaracion del modal

  constructor(private router: Router,
              private modalService: BsModalService,
              private authService: AuthenticationService) { }

  ngOnInit(): void {
  }
  // Funcion para navegar al login
  goToLogin(): void {
    this.modalReference.hide();
    this.router.navigate(['/login'], {replaceUrl: true});
  }
  // Funcion para navegar al login
  // Funcion para cerrar la sesion del usuario
  logOut(): void {
    this.authService.logOut().then((returnedData) => {
      const modalInfo: ModalData = {
        icon: '../../../../../assets/img/undraw_Travel_mode_re_2lxo.svg',
        title: 'Cerrar sesión',
        message: 'Fue bueno tenerte por aquí, sin embargo esperamos que vuelvas pronto.',
      };
      this.showModal(this.logOutModal, modalInfo);
    });
  }
  // Funcion para cerrar la sesion del usuario
  // Funcion para desplegar el modal
  showModal(modalToShow, modalData: ModalData): void {
    this.modalData.modalIcon = modalData.icon;
    this.modalData.modalTitle = modalData.title;
    this.modalData.modalDescription = modalData.message;
    this.modalReference = this.modalService.show(modalToShow);
  }
  // Funcion para desplegar el modal
}
