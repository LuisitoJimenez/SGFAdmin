import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RefereesRoutingModule } from './referees-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { RefereesMgmtComponent } from './referees-mgmt/referees-mgmt.component';

@NgModule({
  declarations: [
    RefereesMgmtComponent
  ],
  imports: [
    CommonModule,
    RefereesRoutingModule,
    SharedModule
  ]
})
export class RefereesModule { }
