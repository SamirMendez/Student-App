import { Injectable } from '@angular/core';
import { AngularFireAnalytics } from '@angular/fire/analytics';
import { AngularFirePerformance } from '@angular/fire/performance';
import { TraceAttribute } from '@models/metricModels';

@Injectable({
  providedIn: 'root'
})
export class MetricService {
  // Variable para el monitoreo del performance
  appTracing: firebase.default.performance.Trace;
  // Variable para el monitoreo del performance
  constructor(private appAnalytics: AngularFireAnalytics,
              private appPerformance: AngularFirePerformance) { }

  // Registros de Google Analytics
  public registerEvent(eventName: string): void {
    this.appAnalytics.logEvent(eventName);
  }
  // Registros de Google Analytics
  // ============================================================================================================================== //
  // Registros de Performance
  public async performingTrace(traceName: string): Promise<any> {
    this.appTracing = await this.appPerformance.trace(traceName);
    return this.appTracing.start();
  }
  public async closeTrace(): Promise<any> {
    return this.appTracing.stop();
  }
  public async setTraceAttribute(traceData: TraceAttribute): Promise<any> {
    return this.appTracing.putAttribute(traceData.attributeName, `${traceData.eventData}`);
  }
  // Registros de Performance
}
