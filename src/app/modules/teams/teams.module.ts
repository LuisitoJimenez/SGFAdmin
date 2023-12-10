import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TeamsRoutingModule } from './teams-routing.module';
import { TeamsMgmtComponent } from './teams-mgmt/teams-mgmt.component';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [
    TeamsMgmtComponent
  ],
  imports: [
    CommonModule,
    TeamsRoutingModule,
    SharedModule
  ]
})
export class TeamsModule { }
