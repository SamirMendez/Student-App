import { Injectable } from '@angular/core';
import { AngularFireAnalytics } from '@angular/fire/analytics';
import { AngularFirePerformance } from '@angular/fire/performance';

@Injectable({
  providedIn: 'root'
})
export class MetricService {

  constructor(private appAnalytics: AngularFireAnalytics, private appPerformance: AngularFirePerformance) { }

  // Registros de Google Analytics
  public registerEvent(eventName: string): void {
    this.appAnalytics.logEvent(eventName);
  }
  // Registros de Google Analytics
  // ============================================================================================================================== //
  // Registros de Performance
  public async performingTrace(traceName: string): Promise<any> {
    const appTracing = await this.appPerformance.trace(traceName);
    appTracing.start();
  }
  public async closeTrace(traceName: string): Promise<any> {
    const appTracing = await this.appPerformance.trace(traceName);
    appTracing.stop();
  }
  // Registros de Performance
}
