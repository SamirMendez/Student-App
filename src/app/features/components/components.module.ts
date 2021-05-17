import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ComponentsRoutingModule } from './components-routing.module';
import { MetricService } from '@services/metrics/metric.service';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    ComponentsRoutingModule
  ],
  providers: [
    MetricService
  ]
})
export class ComponentsModule { }
