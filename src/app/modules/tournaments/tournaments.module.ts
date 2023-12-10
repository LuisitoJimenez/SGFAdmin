import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TournamentsRoutingModule } from './tournaments-routing.module';
import { TournamentsMgmtComponent } from './tournaments-mgmt/tournaments-mgmt.component';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [
    TournamentsMgmtComponent
  ],
  imports: [
    CommonModule,
    TournamentsRoutingModule,
    SharedModule
  ]
})
export class TournamentsModule { }
