import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { firstValueFrom } from 'rxjs';
import { CardModel } from 'src/app/models/CardModel';
import { DataService } from 'src/app/services/data.service';
import { DefinitionService } from 'src/app/services/definition.service';
import { FieldService } from 'src/app/services/field.service';
import { StateService } from 'src/app/services/state.service';
import { PanelComponent } from 'src/app/shared/components/panel/panel.component';
import { SnackbarComponent } from 'src/app/shared/components/snackbar/snackbar.component';

@Component({
  selector: 'app-fields-mgmt',
  templateUrl: './fields-mgmt.component.html',
  styleUrl: './fields-mgmt.component.scss'
})
export class FieldsMgmtComponent implements OnInit {

  cardDefinition: CardModel = {
    title: 'name',
    subtitle: '',
    image: '',
    labels: [
      'Nombre',
      'Capacidad',
      'Correo',
      'Dirección'
    ],
    values: [
      { element: 'name' },
      { element: 'capacity' },
      { element: 'email' },
      { element: 'address' }
    ],
    showLabels: true,
    showImage: false
  }

  form: any = {
    definition: [],
    value: []
  }

  fieldsList: any;
  imageSrc!: { url: string, itemId: number };
  operation: string = '';
  openStep: number = 0;
  titleModule: String = 'Canchas';

  constructor(
    private dialog: MatDialog,
    private definitionService: DefinitionService,
    private fieldService: FieldService,
    private stateService: StateService,
    private snackBar: MatSnackBar,
    private dataService: DataService
  ) { }

  ngOnInit(): void {
    this.getFieldList();
    this.getDefinition();
    this.getStatesOptions();
  }

  getDefinition(): void {
    this.definitionService.getFieldFormDefinition().subscribe({
      next: (response) => {
        if (response) {
          this.form.definition = JSON.parse(response);
        } else {
          console.log('Error al obtener la definición del formulario');
        }
      },
      error: (error) => {
        console.log(error);
      }
    });
  }

  getFieldList(): void {
    this.fieldService.getListFields().subscribe({
      next: (result) => {
        if (result.success) {
          this.fieldsList = result.data.map((field: any) => {
            const { address, ...rest } = field;
            console.log(field.id, field.logo);
            if (field.logo !== null) {
              this.getImageField(field.id, field.logo);
            }
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

  getStatesOptions() {
    this.stateService.getStates().subscribe((result) => {
      const options = result.map((state) => {
        const option = {
          value: state.name,
          label: state.name
        };
        return option;
      });
      console.log(options);

      this.form.definition.forEach((step: any) => {
        step.content.forEach((element: any) => {
          if (element.name === 'state') {
            element.options = options;
          }
        });

      });
      console.log(this.form.definition);

    });
  }

  handleFieldOperation(fieldId?: number): void {
    if (fieldId) {
      this.operation = 'Editar';
      this.form.definition.forEach((step: any) => {
        step.content.forEach((element: any) => {
          if (element.name === 'clubs') {
            step.hidden = true;
            element.hidden = true;
          }
          if (element.name === 'id') {
            element.readonly = true;
            element.disabled = false;
          }
        });
      });
      this.getFieldData(fieldId);
    } else {
      this.operation = 'Agregar';
      this.form.data = [];
      this.form.definition.forEach((step: any) => {
        step.content.forEach((element: any) => {
          if (element.name === 'users') {
            step.hidden = false;
            element.hidden = false;
          }
          if (element.name === 'id') {
            element.readonly = true;
            element.disabled = true;
          }
        });
      });
      this.openForm();
    }
  }

  getFieldData(fieldId: number): void {
    //this.imageSrc = { url: '', itemId: 0 };
    this.fieldService.getFieldData(fieldId).subscribe({
      next: (response) => {
        if (response.success) {
          if (response.data.logo !== null) {
            console.log(response.data.id, response.data.logo);
            this.getImageField(response.data.id, response.data.logo).then(() => {
              console.log(this.imageSrc)
            this.dataService.setData('imageField', this.imageSrc.url)
          });
          }
          const { address, ...rest } = response.data;
          const parsedAddress = JSON.parse(address);
          const newData = {
            ...rest,
            street: parsedAddress.street,
            municipality: parsedAddress.municipality,
            state: parsedAddress.state,
            postalCode: parsedAddress.postalCode,
            town: parsedAddress.town
          }
          this.openStep = 0;
          this.form.data = newData;
          this.openForm(fieldId);
        }
      },
      error: (error) => {
        console.log(error);
        this.showSnackBar('Error al obtener los datos de la cancha', 'error', 'red');
      }
    });
  }

  addField(field: any, imageField: string | File): void {
    console.log(field, imageField);
    this.fieldService.addField(field).subscribe({
      next: (response: any) => {
        if (response.success) {
          const formData = new FormData();
          if (typeof imageField === 'string') {
            const timestamp = this.formatDate(new Date());
            const fileName = `image_${timestamp}.jpg`;

            if (imageField.startsWith('blob:')) {
              fetch(imageField)
                .then(res => res.blob())
                .then(blob => {
                  const file = new File([blob], fileName, { type: 'image/jpeg' });
                  formData.append('file', file);
                  this.uploadImageField(response.data, formData);
                });
            } else {
              const data = atob(imageField.split(',')[1]);
              const array = [];
              for (let i = 0; i < data.length; i++) {
                array.push(data.charCodeAt(i));
              }
              const blob = new Blob([new Uint8Array(array)], { type: 'image/jpeg' });
              const file = new File([blob], fileName, { type: 'image/jpeg' });
              formData.append('file', file);
              this.uploadImageField(response.data, formData);
            }
          } else {
            formData.append('file', imageField);
            this.uploadImageField(response.data, formData);
          }
        }
        this.showSnackBar('El club se ha agregado', 'check_circle', 'green');
        setTimeout(() => {
          this.getFieldList();
        }, 1500);
      }
    });
  }

  updateFieldData(fieldId: number, data: any, imageField: string | File) {
    this.fieldService.updateFieldData(fieldId, data).subscribe({
      next: (result: any) => {
        if (result.success) {

          const formData = new FormData();
          if (typeof imageField === 'string') {
            // Generar un nombre de archivo único con un timestamp
            const timestamp = this.formatDate(new Date());
            const fileName = `image_${timestamp}.jpg`;

            if (imageField.startsWith('blob:')) {
              // Manejar URL de blob
              fetch(imageField)
                .then(res => res.blob())
                .then(blob => {
                  const file = new File([blob], fileName, { type: 'image/jpeg' });
                  formData.append('file', file);
                  this.uploadImageField(fieldId, formData);
                });
            } else {
              // Manejar URL de datos
              const data = atob(imageField.split(',')[1]);
              const array = [];
              for (let i = 0; i < data.length; i++) {
                array.push(data.charCodeAt(i));
              }
              const blob = new Blob([new Uint8Array(array)], { type: 'image/jpeg' });
              const file = new File([blob], fileName, { type: 'image/jpeg' });
              formData.append('file', file);
              this.uploadImageField(fieldId, formData);
            }
          } else {
            formData.append('file', imageField);
            this.uploadImageField(fieldId, formData);
          }
          setTimeout(() => {
            this.getFieldList();
          }, 1500);
          this.showSnackBar('El club se ha actualizado', 'check_circle', 'green');
        }
      },
      error: (error: any) => {
        console.log(error);
        this.showSnackBar('El club no se ha actualizado', 'error', 'red');
      }
    });
  }

  deleteField($event: any) {
    throw new Error('Method not implemented.');
  }

  openForm(fieldId?: number) {
    console.log(fieldId);
    const dialogRef = this.dialog.open(PanelComponent, {
      disableClose: true,
      data: {
        fieldId: fieldId,
        itemData: this.form.data,
        definition: this.form.definition,
        operation: this.operation,
        openStep: this.openStep
      },
      width: '50vw'
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log(result);
      console.log(this.operation, fieldId);
      if (result && this.operation ===  'Editar' && fieldId) {
        console.log(result);
        this.updateFieldData(fieldId, result.data, result.data.imageField);
      } else {
        console.log(result);
        this.addField(result.data, result.data.imageField); 
      }
    });
  }

  formatDate(date: Date) {
    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const day = ('0' + date.getDate()).slice(-2);
    const hour = ('0' + date.getHours()).slice(-2);
    const minute = ('0' + date.getMinutes()).slice(-2);
    const second = ('0' + date.getSeconds()).slice(-2);
    return `${year}-${month}-${day}T${hour}_${minute}_${second}`;
  }

  showSnackBar(message: string, snackIcon: string, iconColor: string) {
    this.snackBar.openFromComponent(SnackbarComponent, {
      data: { message: message, snackIcon: snackIcon, iconColor: iconColor},
      duration: 1000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
      panelClass: ['center-message']
    });
  }

  uploadImageField(fieldId: number, file: FormData): void {
    console.log(fieldId, file);
    this.fieldService.uploadImageField(fieldId, file).subscribe({
      next: (result: any) => {
        console.log(result);
      },
      error: (error: any) => {
        console.log(error);
      }
    });
  }

  async getImageField(fieldId: number, fileId: string): Promise<void> {
    console.log(fieldId, fileId);
    try {
      const result: any = await firstValueFrom(this.fieldService.getImageField(fieldId, fileId));
      let urlItem;

      if (result instanceof Blob) {
        urlItem = URL.createObjectURL(result);
      } else if (result instanceof ArrayBuffer) {
        const blob = new Blob([result]);
        urlItem = URL.createObjectURL(blob);
      } else {
        urlItem = result;
      }

      this.imageSrc = {
        url: urlItem,
        itemId: fieldId
      };
      console.log(this.imageSrc);

    } catch (error) {
      console.error('Error al obtener la imagen del jugador:', error);
    }
  }

}
