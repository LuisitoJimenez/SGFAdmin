import { Injectable } from '@angular/core';
import { Amplify, Auth } from 'aws-amplify';
import { environment } from 'src/environments/environment';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root',
})
export class CognitoService {

  constructor() {
    Amplify.configure({
      Auth: environment.cognito,
    });
  }

  public signUp(user: User): Promise<any> {
    return Auth.signUp({
      username: user.email,
      password: user.password,
      attributes: {
        email: user.email,
        name: user.fullname,
      },
    });
  }

  public confirmSignUp(user: User): Promise<any> {
    return Auth.confirmSignUp(user.email, user.code);
  }

  public getUser(): Promise<any> {
    return Auth.currentUserInfo();
  }

  public signIn(user: User): Promise<any> {
    return Auth.signIn(user.email, user.password);
  }

  public signOut(): Promise<any> {
    return Auth.signOut();
  }

  public forgotPassword(user: User): Promise<any> {
    return Auth.forgotPassword(user.email);
  }

  public forgotPasswordSubmit(user: User, newPassword: string): Promise<any> {
    return Auth.forgotPasswordSubmit(user.email, user.code, newPassword);
  }

  public completeNewPassword(user: User, newPassword: string): Promise<any> {
    return Auth.completeNewPassword(user, newPassword);
  }

  public async confirmPassword(user: any, newPassword:string) {
    return Auth.completeNewPassword(user, newPassword, []);
  }
  public async updatecurrentAuthenticatedUser(user: any) {
    return Auth.updateUserAttributes(user, {
      email: user.attributes.email,
    });
  }
  public async verifyAttribute(userCognito: any) {
    return Auth.verifyUserAttribute(userCognito, 'email');
  }
  public async verifyAttributeSubmit(userCognito: any, code: string) {
    return Auth.verifyUserAttributeSubmit(userCognito, 'email', code);
  }
}
