import { DefinitionService } from './../../../services/definition.service';
import { AccessService } from 'src/app/services/access.service';
import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DefinitionModel } from 'src/app/models/definition';
import { MatDialog } from '@angular/material/dialog';
import { LoadModel } from 'src/app/models/load';
import { PanelComponent } from 'src/app/shared/components/panel/panel.component';
import { SnackbarComponent } from 'src/app/shared/components/snackbar/snackbar.component';

@Component({
  selector: 'app-users-mgmt',
  templateUrl: './users-mgmt.component.html',
  styleUrls: ['./users-mgmt.component.scss']
})
export class UsersMgmtComponent implements OnInit {

  definition: DefinitionModel[] = [];
  operation: string = '';
  openStep: number = 0;
  toolbarTitle = 'Usuarios';
  titleModule: string = 'Usuarios';
  userList: any[] = [];

  form: any = {
    definition: [],
    data: []
  }

  load: LoadModel = {
    isLoaded: false,
  }

  tableDefinition = {
    tableHeader: [
      'ID',
      'Nombre',
      'Correo electrónico',
      'Teléfono'
    ],
    tableBody: [
      { element: 'id' },
      { element: 'name' },
      { element: 'email' },
      { element: 'phone' }
    ]
  }

  constructor(
    private accessService: AccessService,
    private definitionService: DefinitionService,
    public dialog: MatDialog,
    private _snackBar: MatSnackBar,
  ) { }

  ngOnInit(): void {
    this.getUserList();
    this.getDefinition();
  }

  getDefinition(): void {
    this.definitionService.getUserDefinition().subscribe((result) => {
      this.form.definition = JSON.parse(result);
    })
  }

  getUserList(): void {
    this.accessService.getUsersList().subscribe((response) => {
      const users = response.data.map((user: any) => {
        const { address, name, birthday, ...rest } = user;
        return {
          ...rest,
          name: `${user.name.first} ${user.name.last} ${user.name.secondLast}`,
          age: user.birthday
        }
      });
      this.userList = users;
    });
  }

  getUserData(userId: number) {
    this.accessService.getUserData(userId).subscribe((result: any) => {
      if (result.success) {
        const newData = {
          ...result.data,
          first: result.data.name.first,
          last: result.data.name.last,
          secondLast: result.data.name.secondLast
        };
        this.form.data = newData;
        this.openStep = 0;
        this.openOperationDialog(userId);
        this.load.isLoaded = true;
      }
    });
  }

  adduser(user: any) {
    this.accessService.addUser(user).subscribe({
      next: (result: any) => {
        console.log(result);
        this.getUserList();
        this.showSnackBar('El usuario se ha agregado','check_circle', 'green');
      },
      error: (error: any) => {
        console.log(error);
        this.showSnackBar('Error al agregar el usuario', 'error', 'red');
      }
    });
  }

  updateUserData(userId: number, userData: any) {
    console.log(userData);
    this.accessService.updateUserData(userId, userData).subscribe((result) => {
      if (result.success) {
        this.getUserList();
        this.showSnackBar('El usuario se ha actualizado', 'check_circle', 'green');
      }
    },
      (error) => {
        console.log(error);
        this.showSnackBar('Error al actualizar el usuario', 'error', 'red');
      });
  }

  deleteUser(userId: number) {
    this.accessService.deleteUser(userId).subscribe({
      next: (result: any) => {
        this.getUserList();
        this.showSnackBar('El usuario se ha eliminado', 'check_circle', 'green');
      },
      error: (error: any) => {
        console.log(error);
        this.showSnackBar('Error al eliminar el usuario', 'error', 'red');
      }
    });
  }

  openOperationDialog(userId?: number) {
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
      if (result && this.operation === 'Editar' && userId) {

        this.updateUserData(userId, result.data);
      } else if (result && this.operation === 'Agregar') {
        this.adduser(result.data);
      }
    });
  }

  handleUserOperation(userId?: number): void {
    if (userId) {
      this.operation = 'Editar';
      console.log(this.form.definition);
      this.form.definition.forEach((step: any) => {
        step.content.forEach((element: any) => {
          if (element.name === 'password') {
            //step.hidden = false;
            element.hidden = true;
            element.validation = { required: false };
          }
        });
      });
      this.getUserData(userId);
    } else {
      this.operation = 'Agregar';
      this.form.data = [];
      this.form.definition.forEach((step: any) => {
        step.content.forEach((element: any) => {
          if (element.name === 'password') {
            element.hidden = false;
            element.validation = { required: true };
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

}
