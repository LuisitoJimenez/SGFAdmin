import { Component } from '@angular/core';

@Component({
  selector: 'app-statistics-mgmt',
  templateUrl: './statistics-mgmt.component.html',
  styleUrls: ['./statistics-mgmt.component.scss']
})
export class StatisticsMgmtComponent {

  titleModule: string = 'Estadísticas';

  handleUserOperation(userId?: number): void { }

}
