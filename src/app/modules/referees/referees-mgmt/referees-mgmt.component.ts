import { Component, OnInit } from '@angular/core';
import { AccessService } from 'src/app/services/access.service';
import { DefinitionService } from 'src/app/services/definition.service';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { optionsElement } from 'src/app/models/definition';
import { CardModel } from 'src/app/models/CardModel';
import { PanelComponent } from 'src/app/shared/components/panel/panel.component';
import { firstValueFrom } from 'rxjs';
import { DataService } from 'src/app/services/data.service';
import { SnackbarComponent } from 'src/app/shared/components/snackbar/snackbar.component';

@Component({
  selector: 'app-referees-mgmt',
  templateUrl: './referees-mgmt.component.html',
  styleUrl: './referees-mgmt.component.scss'
})
export class RefereesMgmtComponent implements OnInit {
  refereesList: any[] = [];
  operation: string = '';
  openStep: number = 0;

  public titleModule: string = 'Árbitros';

  form: any = {
    definition: [],
    data: []
  }

  imageSrc!: { url: string, itemId: number };

  cardDefinition: CardModel = {
    title: 'name',
    subtitle: 'genderId',
    image: '',
    labels: [
      'Nació en',
      'Edad',
      'Altura',
      'Peso',
    ],
    values: [
      { element: 'birthplace' },
      { element: 'age' },
      { element: 'height' },
      { element: 'weight' },
    ],
    showLabels: true,
    showImage: true
  };

  constructor(
    private accessService: AccessService,
    private definitionService: DefinitionService,
    public dialog: MatDialog,
    private _snackBar: MatSnackBar,
    private dataService: DataService
  ) { }

  ngOnInit(): void {
    this.getRefereeList();
    this.getDefinition();
    this.getStatesOptions();
    this.getGenderOptions();
  }

  getDefinition(): void {
    this.definitionService.getRefereeDefinition().subscribe((result) => {
      console.log(result);
      this.form.definition = JSON.parse(result);
      console.log(this.form.definition);
    })
  }

  getUserOptions(): void {
    this.accessService.getUsersList().subscribe((result) => {
      if (result.success) {
        const options: optionsElement[] = result.data.map((user: any) => {
          const option: optionsElement = {
            value: user.id,
            label: `${user.id} ${user.name.first} ${user.name.last} ${user.name.secondLast}`
          };
          return option;
        });

        let indicesToRemove: number[] = [];

        options.forEach((option, index) => {
          this.refereesList.forEach((referee) => {
            if (option.value === referee.userId) {
              indicesToRemove.push(index);
            }
          });
        });
        indicesToRemove.sort((a, b) => b - a).forEach((index) => {
          options.splice(index, 1);
        });
        console.log(options);
        this.form.definition.forEach((step: any) => {
          console.log(step);
          step.content.forEach((element: any) => {
            console.log(element);
            if (element.name === 'users') {
              console.log(options);
              element.options = options;
            }
          });

        });

        console.log(this.form.definition);
      }
    });
  }

  getRefereeList() {
    this.accessService.getRefereesList().subscribe({
      next: (result: any) => {
        console.log(result.data);
        const newData = result.data.map((referee: any) => {
          const { birthplace, genderId, name, refereeId, ...rest } = referee;
          const parsedBirthplace = JSON.parse(birthplace);

          if (genderId === 1) {
            rest.genderId = 'Masculino';
          } else if (genderId === 2) {
            rest.genderId = 'Femenino';
          }
          const today = new Date();
          const birthDate = new Date(rest.birthday);
          let age = today.getFullYear() - birthDate.getFullYear();
          const m = today.getMonth() - birthDate.getMonth();
          if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            age--;
          }
          rest.age = age;
          if (referee.photo !== null) {
            console.log(referee.photo);
            console.log(referee.id);
            this.getImageReferee(referee.id, referee.photo);
          }

          return {
            id: refereeId,
            name: `${name.first} ${name.last} ${name.secondLast}`,
            birthplace: `${parsedBirthplace.town}, ${parsedBirthplace.state}`,
            ...rest
          }
        });

        this.refereesList = newData;

        this.getUserOptions();
      },
      error: (error) => {

      }
    });
  }

  getRefereeData(userId: number) {
    this.imageSrc = { url: '', itemId: 0 };
    this.accessService.getRefereeData(userId).subscribe((referee: any) => {
      console.log(referee);
      if (referee.success) {
        console.log(referee.photo);
        if (referee.photo !== null) {
          console.log(referee.data.photo);
          const photo = JSON.parse(referee.data.photo);
          if (photo !== null) {
            this.getImageReferee(referee.data.id, photo.name).then(() => {
              this.dataService.setData('imageReferee', this.imageSrc.url);
            });
          }
        }

        console.log(referee.data);
        const { photo, genderId, name, birthplace, ...rest } = referee.data;
        const parsedBirthplace = JSON.parse(birthplace);
        console.log(rest);


        console.log(referee);


        const newData = {
          ...rest,
          name: `${name.first} ${name.last} ${name.secondLast}`,
          state: parsedBirthplace.state,
          town: parsedBirthplace.town,
          gender: genderId,
          birthplace: parsedBirthplace,
          //imageReferee: this.imageSrc.url
        };

        console.log(newData);
        this.form.data = newData;
        console.log(this.form.data);
        this.openStep = 1;
        this.openOperationDialog(userId);
      }
    });
  }

  addReferee(referee: any, userId: number, imageReferee: string | File) {
    this.accessService.addReferee(referee, userId).subscribe({
      next: (result: any) => {
        console.log(result);
        console.log(imageReferee);
        if (result.success) {
          console.log(imageReferee);
          const formData = new FormData();
          if (typeof imageReferee === 'string') {
            const timestamp = this.formatDate(new Date());
            const fileName = `image_${timestamp}.jpg`;
            if (imageReferee.startsWith('blob:')) {
              fetch(imageReferee)
                .then(res => res.blob())
                .then(blob => {
                  const file = new File([blob], fileName, { type: 'image/jpeg' });
                  formData.append('file', file);
                  this.uploadImageReferee(result.data.id, formData);
                });
            } else {
              // Manejar URL de datos
              const data = atob(imageReferee.split(',')[1]);
              const array = [];
              for (let i = 0; i < data.length; i++) {
                array.push(data.charCodeAt(i));
              }
              const blob = new Blob([new Uint8Array(array)], { type: 'image/jpeg' });
              const file = new File([blob], fileName, { type: 'image/jpeg' });
              formData.append('file', file);
              this.uploadImageReferee(result.data.id, formData);
            }
          } else {
            formData.append('file', imageReferee);
            this.uploadImageReferee(result.data.id, formData);
          }
        }
        this.showSnackBar('El árbitro se ha agregado', 'check_circle', 'green');
        setTimeout(() => {
          this.getRefereeList();
        }, 1000);
      },
      error: (error: any) => {
        console.log(error);
        this.showSnackBar('El árbitro no se ha agregado', 'error', 'red');
      }
    });
  }

  deleteReferee(refereeId: number) {
    console.log(refereeId);
    this.accessService.deleteReferee(refereeId).subscribe({
      next: (result: any) => {
        console.log(result);
        this.getRefereeList();
        this.showSnackBar('El árbitro se ha eliminado', 'check_circle', 'green');
      },
      error: (error: any) => {
        console.log(error);
        this.showSnackBar('El árbitro no se ha eliminado', 'error', 'red');
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

  updateRefereeData(userId: number, referee: any, imageReferee: string | File) {
    this.accessService.updateRefereeData(userId, referee).subscribe({
      next: (result: any) => {
        console.log(result);
        if (result.success) {
          console.log(imageReferee);
          const formData = new FormData();
          if (typeof imageReferee === 'string') {
            // Generar un nombre de archivo único con un timestamp
            const timestamp = this.formatDate(new Date());
            const fileName = `image_${timestamp}.jpg`;

            if (imageReferee.startsWith('blob:')) {
              // Manejar URL de blob
              fetch(imageReferee)
                .then(res => res.blob())
                .then(blob => {
                  const file = new File([blob], fileName, { type: 'image/jpeg' });
                  formData.append('file', file);
                  this.uploadImageReferee(userId, formData);
                });
            } else {
              // Manejar URL de datos
              const data = atob(imageReferee.split(',')[1]);
              const array = [];
              for (let i = 0; i < data.length; i++) {
                array.push(data.charCodeAt(i));
              }
              const blob = new Blob([new Uint8Array(array)], { type: 'image/jpeg' });
              const file = new File([blob], fileName, { type: 'image/jpeg' });
              formData.append('file', file);
              this.uploadImageReferee(userId, formData);
            }
          } else {
            formData.append('file', imageReferee);
            this.uploadImageReferee(userId, formData);
          }
        }
        this.showSnackBar('El árbitro se ha actualizado', 'check_circle', 'green');
        setTimeout(() => {
          this.getRefereeList();
          console.log("Se actualizó la lista de árbitros");
        }, 1000);
      },
      error: (error: any) => {
        console.log(error);
        this.showSnackBar('El árbitro no se ha actualizado', 'error', 'red');
      }
    });
  }

  openOperationDialog(userId?: number) {
    console.log(userId);
    console.log(this.form.definition);
    const dialogRef = this.dialog.open(PanelComponent, {
      disableClose: true,
      data: {
        openStep: this.openStep,
        userId: userId,
        itemData: this.form.data,
        definition: this.form.definition,
        operation: this.operation
      },
      width: '50vw'
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log(result);
      if (result && this.operation === 'Editar' && userId) {
        console.log(userId);
        console.log(result.data);
        this.updateRefereeData(userId, result.data, result.data.imageReferee);

      } else if (result && this.operation === 'Agregar') {
        console.log(result);
        console.log(result.data);
        this.addReferee(result.data, result.data.users[0], result.data.imageReferee);
      }

    });
  }

  handleRefereeOperation(userId?: number): void {
    console.log(userId);
    if (userId) {
      console.log(userId);
      this.operation = 'Editar';
      this.form.definition.forEach((step: any) => {
        step.content.forEach((element: any) => {
          if (element.name === 'users') {
            step.hidden = true;
            element.hidden = true;
          }
          if (element.name === 'id') {
            element.readonly = true;
            element.disabled = false;
          }
        });
      });
      this.getRefereeData(userId);
    } else {
      console.log(this.form.definition);
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
      this.openOperationDialog();
    }
  }

  showSnackBar(message: string, snackIcon: string, iconColor: string) {
    this._snackBar.openFromComponent(SnackbarComponent, {
      data: { message: message, snackIcon: snackIcon, iconColor: iconColor},
      duration: 1000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
      panelClass: ['center-message']
    });
  }

  getStatesOptions() {
    this.accessService.getStates().subscribe((result) => {
      const options: optionsElement[] = result.map((state) => {
        const option: optionsElement = {
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

  getGenderOptions() {
    this.accessService.getGendersList().subscribe((result) => {
      const options: optionsElement[] = result.map((gender) => {
        const option: optionsElement = {
          value: gender.id,
          label: gender.name
        };
        return option;
      });
      console.log(options);

      this.form.definition.forEach((step: any) => {
        step.content.forEach((element: any) => {
          if (element.name === 'gender') {
            element.options = options;
          }
        });

      });
      console.log(this.form.definition);

    });
  }

  async getImageReferee(refereeId: number, fileId: string): Promise<void> {
    try {
      const result: any = await firstValueFrom(this.accessService.getImageReferee(refereeId, fileId));
      let urlItem;
      if (result instanceof Blob) {
        urlItem = URL.createObjectURL(result);
      }
      else if (result instanceof ArrayBuffer) {
        const blob = new Blob([result]);
        urlItem = URL.createObjectURL(blob);
      }
      else {
        urlItem = result;
      }

      this.imageSrc = {
        url: urlItem,
        itemId: refereeId
      };

      console.log(this.imageSrc);
      console.log(this.imageSrc.url);
    } catch (error) {
      console.error('Error al obtener la imagen del árbitro:', error);
    }
  }

  uploadImageReferee(refereeId: number, file: FormData): void {
    console.log(file);
    this.accessService.uploadImageReferee(refereeId, file).subscribe({
      next: (result: any) => {
        console.log(result);
      },
      error: (error: any) => {
        console.log(error);
      }
    });
  }

}
