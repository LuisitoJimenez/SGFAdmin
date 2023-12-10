import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RefereesMgmtComponent } from './referees-mgmt/referees-mgmt.component';

const routes: Routes = [
  {
    path: '',
    component: RefereesMgmtComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RefereesRoutingModule { }
