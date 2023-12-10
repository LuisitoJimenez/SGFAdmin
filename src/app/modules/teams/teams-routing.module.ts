import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TeamsMgmtComponent } from './teams-mgmt/teams-mgmt.component';

const routes: Routes = [
  {
    path: '',
    component: TeamsMgmtComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TeamsRoutingModule { }
