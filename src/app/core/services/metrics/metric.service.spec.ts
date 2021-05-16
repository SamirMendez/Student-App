import { TestBed } from '@angular/core/testing';
import { AngularFireModule } from '@angular/fire';
import { AngularFireAnalyticsModule } from '@angular/fire/analytics';
import { AngularFirePerformanceModule } from '@angular/fire/performance';
import { environment } from 'src/environments/environment';

import { MetricService } from './metric.service';

describe('MetricService', () => {
  let service: MetricService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        AngularFireModule.initializeApp(environment.firebase),
        AngularFireAnalyticsModule,
        AngularFirePerformanceModule,
      ]
    });
    service = TestBed.inject(MetricService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
