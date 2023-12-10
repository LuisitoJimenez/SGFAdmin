import { Component, Input, OnInit } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { Router } from '@angular/router';
import { CognitoService } from 'src/app/services/cognito.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  @Input() snav!: MatSidenav;

  userName: string = '';

  constructor(
    private router: Router,
    private cognitoService: CognitoService
  ) { }

  ngOnInit(): void {
    this.getUserDetails();
  }

  getUserDetails() {
    this.cognitoService.getUser().then((user: any) => {
      console.log(user);
      if (user) {
        this.userName = user.attributes.name;
      } else {
        this.userName = 'No user found';
      }
    });
  }

  signOut() {
    //sessionStorage.removeItem('accessToken');
    this.router.navigate(['auth/login']);
    this.cognitoService.signOut().then(() => {
      //window.location.reload();
    });
  }
}
