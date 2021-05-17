import { Component, OnDestroy, OnInit } from '@angular/core';
import { AngularFireAnalytics } from '@angular/fire/analytics';
import { Router } from '@angular/router';
import { MetricService } from 'src/app/core/services/metrics/metric.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {

  constructor(private router: Router, private metricService: MetricService) { }

  ngOnInit(): void {
    // Registrando eventos
    this.metricService.registerEvent('homeLoaded');
    this.metricService.performingTrace('homeScreen');
    // Registrando evento eventos
  }
  // Funciones para navegar
  goToLogin(): void {
    this.router.navigate(['/login']);
  }
  goToRegister(): void {
    this.router.navigate(['/register']);
  }
  // Funciones para navegar

  ngOnDestroy(): void {
    // Registrando eventos
    this.metricService.closeTrace();
    // Registrando evento eventos
  }
}
