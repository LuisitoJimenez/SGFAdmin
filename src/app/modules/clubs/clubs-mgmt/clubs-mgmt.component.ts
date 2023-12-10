import { Component, OnInit } from '@angular/core';
import { CardModel } from 'src/app/models/CardModel';
import { AccessService } from 'src/app/services/access.service';
import { DefinitionService } from 'src/app/services/definition.service';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PanelComponent } from 'src/app/shared/components/panel/panel.component';
import { firstValueFrom } from 'rxjs';
import { DataService } from 'src/app/services/data.service';
import { SnackbarComponent } from 'src/app/shared/components/snackbar/snackbar.component';

@Component({
  selector: 'app-clubs-mgmt',
  templateUrl: './clubs-mgmt.component.html',
  styleUrl: './clubs-mgmt.component.scss'
})
export class ClubsMgmtComponent implements OnInit {

  clubsList: any[] = [];
  operation: string = '';
  openStep: number = 0;
  titleModule: string = 'Clubs';
  imageSrc!: { url: string, itemId: number };

  form: any = {
    definition: [],
    data: []
  }

  cardDefinition: CardModel = {
    title: 'name',
    subtitle: '',
    image: '',
    labels: [
      'Facebook',
      //'Instagram',
      //'Youtube',
      //'Twitter',
      //'Tiktok',
      'Sitio web',
      'Teléfono',
      'Correo electrónico'
    ],
    values: [
      { element: 'facebook' },
      //{ element: 'instagram' },
      //{ element: 'youtube' },
      //{ element: 'twitter' },
      //{ element: 'tiktok' },
      { element: 'website' },
      { element: 'phone' },
      { element: 'email' }
    ],
    showLabels: true,
    showImage: true
  }

  constructor(
    private accessService: AccessService,
    private definitionService: DefinitionService,
    public dialog: MatDialog,
    private snackBar: MatSnackBar,
    private dataService: DataService
  ) { }

  ngOnInit(): void {
    this.getClubsList();
    this.getDefinition();
  }

  getDefinition(): void {
    this.definitionService.getClubDefinition().subscribe((result) => {
      console.log(result);
      this.form.definition = JSON.parse(result);
      console.log(this.form.definition);
    });
  }

  getClubsList(): void {
    this.accessService.getClubsList().subscribe({
      next: (result: any) => {
        console.log(result);
        const newData = result.data.map((club: any) => {
          const { socialNetworks, ...rest } = club;
          const parsedNetworks = JSON.parse(socialNetworks);
          if (club.logo !== null) {
            this.getImageClub(club.id, club.logo);
          }
          return {
            ...rest,
            facebook: parsedNetworks.facebook || 'No disponible',
            instagram: parsedNetworks.instagram || 'No disponible',
            youtube: parsedNetworks.youtube || 'No disponible',
            tiktok: parsedNetworks.tiktok || 'No disponible',
            twitter: parsedNetworks.twitter || 'No disponible',
            website: parsedNetworks.website || 'No disponible',
            other: parsedNetworks.other || 'No disponible',
          }
        });
        this.clubsList = newData;
      },
      error: (error) => {
        console.log(error);
      }
    });
  }

  openOperationDialog(clubId?: number) {
    console.log(clubId);
    console.log(this.form.definition);
    const dialogRef = this.dialog.open(PanelComponent, {
      disableClose: true,
      data: {
        openStep: this.openStep,
        clubId: clubId,
        itemData: this.form.data,
        definition: this.form.definition,
        operation: this.operation
      },
      width: '50vw'
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log(result);
      if (result && this.operation === 'Editar' && clubId) {
        console.log(clubId);
        console.log(result.data);
        this.updateClubData(clubId, result.data, result.data.imageClub);
      } else if (result && this.operation === 'Agregar') {
        console.log(result);
        this.addClub(result.data, result.data.imageClub);
      }
    });
  }

  getClubData(clubId: number) {
    this.accessService.getClubData(clubId).subscribe({
      next: (result: any) => {
        console.log(result);
        if (result.success) {
          if (result.data.logo !== null) {
            this.getImageClub(result.data.id, result.data.logo).then(() => {
              this.dataService.setData('imageClub', this.imageSrc.url);
            });
          }
          console.log(result);
          const { logo, socialNetworks, ...rest } = result.data;
          const parsedNetworks = JSON.parse(socialNetworks);
          const newData = {
            ...rest,
            facebook: parsedNetworks.facebook,
            instagram: parsedNetworks.instagram,
            youtube: parsedNetworks.youtube,
            tiktok: parsedNetworks.tiktok,
            twitter: parsedNetworks.twitter,
            website: parsedNetworks.website,
            other: parsedNetworks.other,
          }
          this.openStep = 0;
          this.form.data = newData;
          this.openOperationDialog(clubId);
        }
      },
      error: error => {
        console.log(error);
        this.showSnackBar('No se ha podido obtener la información del club', 'error', 'red');
      }
    });
  }

  addClub(club: any, imageClub: string | File) {
    this.accessService.addClub(club).subscribe({
      next: (result: any) => {
        console.log(result);
        if (result.success) {
          console.log(imageClub);
          const formData = new FormData();
          if (typeof imageClub === 'string') {
            // Generar un nombre de archivo único con un timestamp
            const timestamp = this.formatDate(new Date());
            const fileName = `image_${timestamp}.jpg`;

            if (imageClub.startsWith('blob:')) {
              // Manejar URL de blob
              fetch(imageClub)
                .then(res => res.blob())
                .then(blob => {
                  const file = new File([blob], fileName, { type: 'image/jpeg' });
                  formData.append('file', file);
                  this.uploadImageClub(result.data.id, formData);
                });
            } else {
              // Manejar URL de datos
              const data = atob(imageClub.split(',')[1]);
              const array = [];
              for (let i = 0; i < data.length; i++) {
                array.push(data.charCodeAt(i));
              }
              const blob = new Blob([new Uint8Array(array)], { type: 'image/jpeg' });
              const file = new File([blob], fileName, { type: 'image/jpeg' });
              formData.append('file', file);
              this.uploadImageClub(result.data.id, formData);
            }
          } else {
            formData.append('file', imageClub);
            this.uploadImageClub(result.data.id, formData);
          }
        }
        this.showSnackBar('El club se ha agregado', 'check_circle', 'green');
        setTimeout(() => {
          this.getClubsList();
        }, 1500);
      },
      error: (error: any) => {
        console.log(error);
        this.showSnackBar('El club no se ha agregado', 'error', 'red');
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


  updateClubData(clubId: number, data: any, imageClub: string | File) {
    this.accessService.updateClubData(clubId, data).subscribe({
      next: (result: any) => {
        if (result.success) {

          const formData = new FormData();
          if (typeof imageClub === 'string') {
            // Generar un nombre de archivo único con un timestamp
            const timestamp = this.formatDate(new Date());
            const fileName = `image_${timestamp}.jpg`;

            if (imageClub.startsWith('blob:')) {
              // Manejar URL de blob
              fetch(imageClub)
                .then(res => res.blob())
                .then(blob => {
                  const file = new File([blob], fileName, { type: 'image/jpeg' });
                  formData.append('file', file);
                  this.uploadImageClub(clubId, formData);
                });
            } else {
              // Manejar URL de datos
              const data = atob(imageClub.split(',')[1]);
              const array = [];
              for (let i = 0; i < data.length; i++) {
                array.push(data.charCodeAt(i));
              }
              const blob = new Blob([new Uint8Array(array)], { type: 'image/jpeg' });
              const file = new File([blob], fileName, { type: 'image/jpeg' });
              formData.append('file', file);
              this.uploadImageClub(clubId, formData);
            }
          } else {
            formData.append('file', imageClub);
            this.uploadImageClub(clubId, formData);
          }
          setTimeout(() => {
            this.getClubsList();
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

  deleteClub(clubId: number) {
    this.accessService.deleteClub(clubId).subscribe({
      next: (result: any) => {
        console.log(result);
        if (result.success) {
          this.getClubsList();
          this.showSnackBar('El club se ha eliminado', 'check_circle', 'green');
        }
      },
      error: (error: any) => {
        console.log(error);
        this.showSnackBar('El club no se ha eliminado', 'error', 'red');
      }
    });
  }

  handlePlayerOperation(clubId?: number): void {
    console.log(clubId);
    if (clubId) {
      console.log(clubId);
      this.operation = 'Editar';
      this.form.definition.forEach((element: any) => {
        if (element.name === 'users') {
          element.hidden = true;
        }
      });
      this.getClubData(clubId);
    } else {
      console.log(this.form.definition);
      this.operation = 'Agregar';
      this.form.data = [];
      this.form.definition.forEach((element: any) => {
        if (element.name === 'users') {
          element.hidden = false;
        }
      });
      this.openOperationDialog();
    }
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


  uploadImageClub(clubId: number, file: FormData): void {
    console.log(clubId);
    console.log(file);
    this.accessService.uploadImageClub(clubId, file).subscribe({
      next: (result: any) => {
        console.log(result);
      },
      error: (error: any) => {
        console.log(error);
      }
    });
  }

  async getImageClub(clubId: number, fileId: string) {
    try {
      const result: any = await firstValueFrom(this.accessService.getImageClub(clubId, fileId));
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
        itemId: clubId
      }
      console.log(this.imageSrc);
    } catch (error) {
      console.log(error);
    }
  }
}
