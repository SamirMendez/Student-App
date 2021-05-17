import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { SharedModule } from 'src/app/shared/shared.module';

import { RegisterComponent } from './register.component';
import { ModalModule } from 'ngx-bootstrap/modal';
import { AuthenticationService } from '@services/authentication/authentication.service';
import { AngularFireModule } from '@angular/fire';
import { environment } from 'src/environments/environment';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        SharedModule,
        ModalModule.forRoot(),
        AngularFireModule.initializeApp(environment.firebase),
      ],
      declarations: [ RegisterComponent ],
      providers: [
        AuthenticationService
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
