import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StatisticsMgmtComponent } from './statistics-mgmt/statistics-mgmt.component';

const routes: Routes = [
  {
    path: '',
    component: StatisticsMgmtComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StatisticsRoutingModule { }
