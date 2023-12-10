import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StatisticsRoutingModule } from './statistics-routing.module';
import { StatisticsMgmtComponent } from './statistics-mgmt/statistics-mgmt.component';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [
    StatisticsMgmtComponent
  ],
  imports: [
    CommonModule,
    StatisticsRoutingModule,
    SharedModule
  ]
})
export class StatisticsModule { }
