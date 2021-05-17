import { TraceAttribute } from '@models/metricModels';
import { AngularFireDatabase } from '@angular/fire/database';
import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { MetricService } from '@services/metrics/metric.service';
import { RegisterData, AuthResponse, LoginData } from '@models/authModels';
import * as firebase from 'firebase';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  constructor(private userAuth: AngularFireAuth,
              private realtimeDatabase: AngularFireDatabase,
              private metricService: MetricService) { }

  // Metodo publico para crear un usuario en Firebase
  public async createUser(registerData: RegisterData): Promise<AuthResponse> {
    this.metricService.registerEvent('createUser');
    this.metricService.performingTrace('createUser');
    return await this.userAuth.createUserWithEmailAndPassword(registerData.email, registerData.password).then((userData: any) => {
      // Actualizando objeto del usuario
      this.userAuth.onAuthStateChanged((authData: firebase.default.User) => {
        authData.updateProfile({
          displayName: registerData.name
        });
      });
      // Actualizando objeto del usuario
      // Creando registro en la base de datos
      const UID = userData.user.uid;
      this.realtimeDatabase.database.ref(`studentsPlatform/users/${UID}/`).set({
        name: registerData.name,
        email: registerData.email,
        registerDate: Date.now(),
        userId: UID,
      });
      // Creando registro en la base de datos
      const attribute: TraceAttribute = {
        eventName: 'createUser',
        attributeName: 'registerSuccess',
        eventData: {email: registerData.email, success: true},
      };
      this.metricService.setTraceAttribute(attribute);
      this.metricService.closeTrace();
      return {status: true, data: userData};
    }).catch((error) => {
      const attribute: TraceAttribute = {
        eventName: 'createUser',
        attributeName: 'registerError',
        eventData: {email: error.code, success: false},
      };
      this.metricService.setTraceAttribute(attribute);
      this.metricService.closeTrace();
      return {status: false, code: error.code};
    });
  }
  // Metodo publico para crear un usuario en Firebase
  // Metodo publico para iniciar la sesión de un usuario
  public async loginUser(loginData: LoginData): Promise<AuthResponse> {
    this.metricService.registerEvent('loginUser');
    this.metricService.performingTrace('loginUser');
    return await this.userAuth.signInWithEmailAndPassword(loginData.email, loginData.password).then((userData: any) => {
      const attribute: TraceAttribute = {
        eventName: 'loginUser',
        attributeName: 'loginSuccess',
        eventData: {email: loginData.email, success: true},
      };
      this.metricService.setTraceAttribute(attribute);
      this.metricService.closeTrace();
      return {status: true, data: userData.user};
    }).catch((error) => {
      const attribute: TraceAttribute = {
        eventName: 'loginUser',
        attributeName: 'loginError',
        eventData: {email: error.code, success: false},
      };
      this.metricService.setTraceAttribute(attribute);
      this.metricService.closeTrace();
      return {status: false, code: error.code};
    });
  }
  // Metodo publico para iniciar la sesión de un usuario
  // Funcion para recuperar las cuentas del usuario
  public async recoverUser(email: string): Promise<any> {
    return await this.userAuth.sendPasswordResetEmail(email).then(() => {
      return true;
    }).catch((error) => {
      return error;
    });
  }
  // Funcion para recuperar las cuentas del usuario
}
