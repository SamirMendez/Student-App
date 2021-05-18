import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthenticationGuard } from '@guards/authentication/authentication.guard';
import { DashboardComponent } from './dashboard.component';

const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'students'},
      { path: 'students', loadChildren: () => import('../students/students.module').then(m => m.StudentsModule), canActivate: [AuthenticationGuard] }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
