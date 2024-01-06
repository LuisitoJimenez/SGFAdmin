import { Component, OnInit } from '@angular/core';
import { CardModel } from 'src/app/models/CardModel';
import { FieldService } from 'src/app/services/field.service';

@Component({
  selector: 'app-fields-mgmt',
  templateUrl: './fields-mgmt.component.html',
  styleUrl: './fields-mgmt.component.scss'
})
export class FieldsMgmtComponent implements OnInit {

  constructor(
    private fieldService: FieldService
  ) { }

  ngOnInit(): void {
    this.getListFields();
  }

  getListFields(): void {
    this.fieldService.getListFields().subscribe({
      next: (result) => {
        if (result.success) {
          this.fieldsList = result.data.map((field: any) => {
            const { address, ...rest } = field;
            return {
              ...rest,
              address: JSON.parse(address)
            }
          });
          console.log(this.fieldsList);
        }
      },
      error: (error) => {
        console.log(error);
      }
    });
  }

  fieldsList: any;
  imageSrc!: { url: string; itemId: number; };
  cardDefinition!: CardModel;
  titleModule: String = 'Canchas';
  handleFieldOperation(userId?: number) {
    throw new Error('Method not implemented.');
  }
  deleteField($event: any) {
    throw new Error('Method not implemented.');
  }

}
