import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/models/user';
import { CognitoService } from 'src/app/services/cognito.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
})
export class SignupComponent implements OnInit {
  user: User = {} as User;
  isRegister: boolean = true;
  isConfirm: boolean = false;
  is_Resend: boolean = false;

  constructor(private router: Router, private cognitoService: CognitoService) { }
  ngOnInit(): void {
    this.user = {} as User;
    this.isRegister = true;
  }

  public signUpWithCognito() {
    if (this.user && this.user.password && this.user.email) {
      this.cognitoService
        .signUp(this.user)
        .then(() => {
          this.isRegister = false;
          this.isConfirm = true;
        })
        .catch((error: any) => { });
    }
  }
  public confirmSignUp() {
    if (this.user) {
      this.cognitoService
        .confirmSignUp(this.user)
        .then(() => {
          this.router.navigate(['/auth/login']);
        })
        .catch((error: any) => { });
    }
  }
  resendCode() {
    this.is_Resend = true;
    console.log(this.user);
    this.cognitoService.forgotPassword(this.user);
  }
}
