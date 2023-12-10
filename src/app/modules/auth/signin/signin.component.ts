import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/models/user';
import { CognitoService } from 'src/app/services/cognito.service';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss'],
})
export class SigninComponent implements OnInit {
  user: User = {} as User;

  newPassword: string = '';
  isNewPasswordRequired: boolean = false;
  isForgotPassword: boolean = false;
  errorUser: boolean = false;
  isLogin: boolean = true;
  isRecovery: boolean = false;
  isVerify: boolean = false;
  isComfirm: boolean = false;
  userCognito: any;

  constructor(private router: Router, private cognitoService: CognitoService) {}

  ngOnInit(): void {
    this.user = {} as User;
  }

  signInWithCognito() {
    if (this.user && this.user.email && this.user.password) {
      this.cognitoService
        .signIn(this.user)
        .then((user) => {
          this.userCognito = user;
          console.log(user);
          var tokens = user.signInUserSession;
          if (tokens != null) {
            this.router.navigate(['/home']);
          } else if (user.challengeName === 'NEW_PASSWORD_REQUIRED') {
            this.isComfirm = true;
            this.isLogin = false;
            this.isRecovery = false;
            this.isVerify = false;
            this.isForgotPassword = false;
          }
          //this.router.navigate(['/home']);
        })
        .catch((error: any) => {
          this.errorUser = true;
        });
    } else {
    }
  }

  forgotPassword() {
    if (this.user && this.user.email) {
      this.cognitoService
        .forgotPassword(this.user)
        .then(() => {
          this.isLogin = false;
          this.isRecovery = true;
        })
        .catch((error: any) => {
          console.log(error);
        });
    }
  }

  newPasswordSubmit() {
    if (
      this.user &&
      this.user.code &&
      this.user.newPassword.trim().length != 0
    ) {
      this.cognitoService
        .forgotPasswordSubmit(this.user, this.newPassword)
        .then(() => {
          this.isLogin = true;
          this.isRecovery = false;
          this.isForgotPassword = false;
        })
        .catch((error: any) => {
          console.log(error);
        });
    }
  }

  goConfirmPassword() {
    if (this.user.newPassword) {
      console.log(this.user.newPassword);
      console.log(this.userCognito);
      this.cognitoService
        .confirmPassword(this.userCognito, this.user.newPassword)
        .then(() => {})
    }
  }
  verifyUser() {
    this.cognitoService
      .verifyAttributeSubmit(this.userCognito, this.user.code)
      .then((data) => {
        console.log(data);
      })
      .catch((error) => {
        console.log(error);
        setTimeout(() => {
          this.router.navigate(['/pages/home']);
        }, 2000);
      });
  }
}
