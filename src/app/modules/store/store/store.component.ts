import { Component } from '@angular/core';

@Component({
  selector: 'app-store',
  templateUrl: './store.component.html',
  styleUrls: ['./store.component.scss']
})
export class StoreComponent {

  titleModule: string = 'Tienda';

  handleUserOperation(userId?: number): void { }

}
