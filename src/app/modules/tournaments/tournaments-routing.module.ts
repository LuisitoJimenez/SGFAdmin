import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TournamentsMgmtComponent } from './tournaments-mgmt/tournaments-mgmt.component';

const routes: Routes = [
  {
    path: '',
    component: TournamentsMgmtComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TournamentsRoutingModule { }
