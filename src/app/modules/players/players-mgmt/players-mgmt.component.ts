import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { firstValueFrom } from 'rxjs';
import { CardModel } from 'src/app/models/CardModel';
import { optionsElement } from 'src/app/models/definition';
import { AccessService } from 'src/app/services/access.service';
import { DataService } from 'src/app/services/data.service';
import { DefinitionService } from 'src/app/services/definition.service';
import { PanelComponent } from 'src/app/shared/components/panel/panel.component';
import { SnackbarComponent } from 'src/app/shared/components/snackbar/snackbar.component';

/* export interface CardModel {
  title: string;
  subtitle: string;
  labels: string[];
  values: value[];
  showLabels: boolean;
}

export interface value {
  element: string;
}
 */
@Component({
  selector: 'app-players-mgmt',
  templateUrl: './players-mgmt.component.html',
  styleUrls: ['./players-mgmt.component.scss']
})
export class PlayersMgmtComponent implements OnInit {
  playerList2: any[] = [];
  playersList: any[] = [];
  operation: string = '';
  openStep: number = 0;

  titleModule: string = 'Jugadores';

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
      //'Foto'
    ],
    values: [
      { element: 'birthplace' },
      { element: 'age' },
      { element: 'height' },
      { element: 'weight' },
      //{ element: 'photo' }
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
    this.getPlayerList();
    this.getDefinition();
    this.getStatesOptions();
    this.getGenderOptions();
    //this.getUserOptions();

    /*   this.dataService.setData(this.imageSrc); */
  }

  getDefinition(): void {
    this.definitionService.getPlayerDefinition().subscribe((result) => {
      console.log(result);
      this.form.definition = JSON.parse(result);
      console.log(this.form.definition);
    })
  }


  getUserOptions(): void {
    this.accessService.getUsersList().subscribe((result) => {
      //console.log(result);
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
          this.playersList.forEach((player) => {
            if (option.value === player.userId) {
              indicesToRemove.push(index);
            }
          });
        });

        // Ordenar los índices en orden descendente y eliminar los elementos
        indicesToRemove.sort((a, b) => b - a).forEach((index) => {
          options.splice(index, 1);
        });

        console.log(options);
        /* console.log(options);

          // Quitar de options el usuario que existe en playersList es un arreglo de objetocs
          console.log(this.playersList);
          options.forEach((option) => {
            console.log(option);
            //console.log(option.value);
            this.playersList.forEach((player) => {
              console.log(player.userId);
              console.log(option.value);
              if (option.value === player.userId) {
                console.log(player.userId);
                console.log(option.value);
                console.log(option);
                const index = options.indexOf(option);
                console.log(index);
                if (index > -1) {
                  console.log(index);
                  options.splice(index, 1);
                }
              }
            });
          });
          console.log(options); */

        this.form.definition.forEach((step: any) => {
          console.log(step);
          step.content.forEach((element: any) => {
            console.log(element);
            /* if (element.name === 'players') {
            element.options = options;
          } */

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

  getPlayerList() {
    this.accessService.getPlayersList().subscribe({
      next: (result: any) => {
        console.log(result.data);
        const newData = result.data.map((player: any) => {
          const { birthplace, genderId, name, playerId, ...rest } = player;
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
          if (player.photo !== null) {
            console.log(player.photo);
            console.log(player.id);
            this.getImagePlayer(player.id, player.photo);
          }

          return {
            id: playerId,
            name: `${name.first} ${name.last} ${name.secondLast}`,
            birthplace: `${parsedBirthplace.town}, ${parsedBirthplace.state}`,
            ...rest
          }
        });

        this.playersList = newData;

        this.getUserOptions();
      },
      error: (error) => {

      }
    });
  }

  getPlayerData(userId: number) {
    this.imageSrc = { url: '', itemId: 0 };
    this.accessService.getPlayerData(userId).subscribe((player: any) => {
      console.log(player);
      if (player.success) {
        if (player.photo !== null) {
          const photo = JSON.parse(player.data.photo);
          if (photo !== null) {
            this.getImagePlayer(player.data.id, photo.name).then(() => {
              this.dataService.setData('imagePlayer', this.imageSrc.url);
            });
          }
        }
        /* if (player.photo !== null) {
          const photo = JSON.parse(player.data.photo);
          console.log(photo);
          console.log(player.data.photo);
          console.log(player.data.id);
          this.getImagePlayer(player.data.id, photo.name).then(() => {
            console.log(this.imageSrc);
            this.dataService.setData('imagePlayer', this.imageSrc.url);
            //this.dataService.setData('file', 'https://w7.pngwing.com/pngs/111/788/png-transparent-santa-claus-christmas-christmas-decoration-buckle-free-s-holidays-christmas-decoration-grass.png');
          });;
          console.log(this.imageSrc);
        } */
        console.log(player.data);
        const { photo, genderId, name, birthplace, ...rest } = player.data;
        const parsedBirthplace = JSON.parse(birthplace);
        console.log(rest);


        console.log(player);


        const newData = {
          ...rest,
          name: `${name.first} ${name.last} ${name.secondLast}`,
          state: parsedBirthplace.state,
          town: parsedBirthplace.town,
          gender: genderId,
          birthplace: parsedBirthplace,
          //imagePlayer: this.imageSrc.url
        };

        console.log(newData);
        this.form.data = newData;
        console.log(this.form.data);
        this.openStep = 1;
        this.openOperationDialog(userId);
      }
    });
  }

  addPlayer(player: any, userId: number, imagePlayer: string | File) {
    this.accessService.addPlayer(player, userId).subscribe({
      next: (result: any) => {
        console.log(result);
        console.log(imagePlayer);
        if (result.success) {
          console.log(imagePlayer);
          const formData = new FormData();
          if (typeof imagePlayer === 'string') {
            // Generar un nombre de archivo único con un timestamp
            const timestamp = this.formatDate(new Date());
            const fileName = `image_${timestamp}.jpg`;

            if (imagePlayer.startsWith('blob:')) {
              // Manejar URL de blob
              fetch(imagePlayer)
                .then(res => res.blob())
                .then(blob => {
                  const file = new File([blob], fileName, { type: 'image/jpeg' });
                  formData.append('file', file);
                  this.uploadImagePlayer(result.data.id, formData);
                });
            } else {
              // Manejar URL de datos
              const data = atob(imagePlayer.split(',')[1]);
              const array = [];
              for (let i = 0; i < data.length; i++) {
                array.push(data.charCodeAt(i));
              }
              const blob = new Blob([new Uint8Array(array)], { type: 'image/jpeg' });
              const file = new File([blob], fileName, { type: 'image/jpeg' });
              formData.append('file', file);
              this.uploadImagePlayer(result.data.id, formData);
            }
          } else {
            formData.append('file', imagePlayer);
            this.uploadImagePlayer(result.data.id, formData);
          }
        }
        this.showSnackBar('El jugador se ha agregado', 'check_circle', 'green');
        setTimeout(() => {
          this.getPlayerList();
        }, 1000);
      },
      error: (error: any) => {
        console.log(error);
        this.showSnackBar('El jugador no se ha agregado', 'error', 'red');
      }
    });
  }

  deletePlayer(playerId: number) {
    console.log(playerId);
    this.accessService.deletePlayer(playerId).subscribe({
      next: (result: any) => {
        console.log(result);
        this.getPlayerList();
        this.showSnackBar('El jugador se ha eliminado', 'check_circle', 'green');
      },
      error: (error: any) => {
        console.log(error);
        this.showSnackBar('El jugador no se ha eliminado', 'error', 'red');
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

  updatePlayerData(userId: number, player: any, imagePlayer: string | File) {
    this.accessService.updatePlayerData(userId, player).subscribe({
      next: (result: any) => {
        console.log(result);
        if (result.success) {
          console.log(imagePlayer);
          const formData = new FormData();
          if (typeof imagePlayer === 'string') {
            // Generar un nombre de archivo único con un timestamp
            const timestamp = this.formatDate(new Date());
            const fileName = `image_${timestamp}.jpg`;

            if (imagePlayer.startsWith('blob:')) {
              // Manejar URL de blob
              fetch(imagePlayer)
                .then(res => res.blob())
                .then(blob => {
                  const file = new File([blob], fileName, { type: 'image/jpeg' });
                  formData.append('file', file);
                  this.uploadImagePlayer(userId, formData);
                });
            } else {
              // Manejar URL de datos
              const data = atob(imagePlayer.split(',')[1]);
              const array = [];
              for (let i = 0; i < data.length; i++) {
                array.push(data.charCodeAt(i));
              }
              const blob = new Blob([new Uint8Array(array)], { type: 'image/jpeg' });
              const file = new File([blob], fileName, { type: 'image/jpeg' });
              formData.append('file', file);
              this.uploadImagePlayer(userId, formData);
            }
          } else {
            formData.append('file', imagePlayer);
            this.uploadImagePlayer(userId, formData);
          }
        }
        this.showSnackBar('El jugador se ha actualizado', 'check_circle', 'green');
        setTimeout(() => {
          this.getPlayerList();
          console.log("Se actualizó la lista de jugadores");
        }, 1000);
      },
      error: (error: any) => {
        console.log(error);
        this.showSnackBar('El jugador no se ha actualizado', 'error', 'red');
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
        this.updatePlayerData(userId, result.data, result.data.imagePlayer);

      } else if (result && this.operation === 'Agregar') {
        console.log(result);
        console.log(result.data);
        this.addPlayer(result.data, result.data.users[0], result.data.imagePlayer);
      }

    });
  }

  handlePlayerOperation(userId?: number): void {
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
      this.getPlayerData(userId);
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

  /*   getImagePlayer(playerId: number, fileId: string) {
      this.accessService.getImagePlayer(playerId, fileId).subscribe({
        next: (result: any) => {
          let urlItem;
          console.log(result);
          // Si el resultado es un Blob
          if (result instanceof Blob) {
            urlItem = URL.createObjectURL(result);
            console.log(urlItem);
          }
          // Si el resultado es un ArrayBuffer
          else if (result instanceof ArrayBuffer) {
            // Convierte el ArrayBuffer a Blob
            const blob = new Blob([result]);
            urlItem = URL.createObjectURL(blob);
            console.log(urlItem);
          }
          // Si el resultado es una URL de imagen
          else {
            urlItem = result;
            console.log(urlItem);
          }

          this.imageSrc = {
            url: urlItem,
            playerId: playerId
          };
          console.log(this.imageSrc);
        },
        error: (error: any) => {
          console.log(error);
        }
      });
    } */
  async getImagePlayer(playerId: number, fileId: string): Promise<void> {
    try {
      const result: any = await firstValueFrom(this.accessService.getImagePlayer(playerId, fileId));
      let urlItem;

      // Si el resultado es un Blob
      if (result instanceof Blob) {
        urlItem = URL.createObjectURL(result);
      }
      // Si el resultado es un ArrayBuffer
      else if (result instanceof ArrayBuffer) {
        // Convierte el ArrayBuffer a Blob
        const blob = new Blob([result]);
        urlItem = URL.createObjectURL(blob);
      }
      // Si el resultado es una URL de imagen
      else {
        urlItem = result;
      }

      this.imageSrc = {
        url: urlItem,
        itemId: playerId
      };

      console.log(this.imageSrc);
      console.log(this.imageSrc.url);
    } catch (error) {
      console.error('Error al obtener la imagen del jugador:', error);
    }
  }

  /* async getImagePlayer(playerId: number, fileId: string): Promise<void> {
    const result: any = await firstValueFrom(this.accessService.getImagePlayer(playerId, fileId));
    let urlItem;

    // Si el resultado es un Blob
    if (result instanceof Blob) {
      urlItem = URL.createObjectURL(result);
    }
    // Si el resultado es un ArrayBuffer
    else if (result instanceof ArrayBuffer) {
      // Convierte el ArrayBuffer a Blob
      const blob = new Blob([result]);
      urlItem = URL.createObjectURL(blob);
    }
    // Si el resultado es una URL de imagen
    else {
      urlItem = result;
    }

    this.imageSrc = {
      url: urlItem,
      playerId: playerId
    };

    console.log(this.imageSrc);
    console.log(this.imageSrc.url);
  } */

  /*   async getImagePlayer(playerId: number, fileId: string): Promise<void> {
      const result: any = await this.accessService.getImagePlayer(playerId, fileId).toPromise();
      let urlItem;

      // Si el resultado es un Blob
      if (result instanceof Blob) {
        urlItem = URL.createObjectURL(result);
      }
      // Si el resultado es un ArrayBuffer
      else if (result instanceof ArrayBuffer) {
        // Convierte el ArrayBuffer a Blob
        const blob = new Blob([result]);
        urlItem = URL.createObjectURL(blob);
      }
      // Si el resultado es una URL de imagen
      else {
        urlItem = result;
      }

      this.imageSrc = {
        url: urlItem,
        playerId: playerId
      };


      console.log(this.imageSrc);
      console.log(this.imageSrc.url);
    } */

  uploadImagePlayer(playerId: number, file: FormData): void {
    console.log(file);
    this.accessService.uploadImagePlayer(playerId, file).subscribe({
      next: (result: any) => {
        console.log(result);
        //this.showSnackBar('La imagen se subió correctamente');
      },
      error: (error: any) => {
        console.log(error);
        //this.showSnackBar('La imagen no se subió');
      }
    });
  }

  /*   getImagePlayer(playerId: number, fileId: string) {
      this.accessService.getImagePlayer(playerId, fileId).subscribe({
        next: (result: any) => {
          console.log(result);
        },
        error: (error: any) => {
          console.log(error);
        }
      });
    } */

  /* getImagePlayer(playerId: number, fileId: string) {
    this.accessService.getImagePlayer(playerId, fileId).subscribe({
      next: (result: any) => {
        let imageSrc;
        // Si el resultado es un Blob
        if (result instanceof Blob) {
          imageSrc = URL.createObjectURL(result);
          console.log(imageSrc);
        }
        // Si el resultado es un ArrayBuffer
        else if (result instanceof ArrayBuffer) {
          // Convierte el ArrayBuffer a Blob
          const blob = new Blob([result]);
          imageSrc = URL.createObjectURL(blob);
        }
        // Si el resultado es una URL de imagen
        else {
          imageSrc = result;
        }

      },
      error: (error: any) => {
        console.log(error);

      }
    });

  } */
}
