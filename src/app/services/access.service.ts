import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ModuleModel } from '../models/module';
import { Observable } from 'rxjs';
import { ApiResponse } from '../models/ApiResponse';
import { environment } from 'src/environments/environment';
import { GenderModel, UserModel } from '../models/user';
import { State } from '../models/state';
import { ClubModel, PlayerModel, RefereeModel, SubModel } from '../models/player';
import { NumberSymbol } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class AccessService {

  constructor(
    private http: HttpClient
  ) { }

  getUserData(userId: number): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(`${environment.baseService}${'/users'}/${userId}`);
  }

  addUser(user: UserModel): Observable<UserModel[]> {
    return this.http.post<UserModel[]>(`${environment.baseService}${'/users'}`, user);
  }

  updateUserData(userId: number, user: UserModel[]): Observable<any> {
    return this.http.patch<void>(`${environment.baseService}${'/users'}/${userId}`, user);
  }

  deleteUser(userId: number): Observable<void> {
    return this.http.delete<void>(`${environment.baseService}${'/users'}/${userId}`);
  }

  getPlayerData(playerId: number) {
    return this.http.get<ApiResponse>(`${environment.baseService}${'/players'}/${playerId}`);
  }

  addPlayer(player: PlayerModel, userId: number) {
    const headers = new HttpHeaders({
      userId: userId,
    });
    return this.http.post<PlayerModel>(`${environment.baseService}${'/players'}`, player, { headers });
  }

  deletePlayer(playerId: number) {
    const headers = new HttpHeaders({
      playerId: playerId,
    });
    return this.http.delete<void>(`${environment.baseService}${'/players'}`, { headers });
  }

  updatePlayerData(playerId: number, player: PlayerModel) {
    const headers = new HttpHeaders({
      playerId: playerId,
    })
    return this.http.patch<void>(`${environment.baseService}${'/players'}`, player, { headers });
  }

  getModules() {
    return this.http.get<ModuleModel[]>('./assets/data/menu.json');
  }

  getUsersList(): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(`${environment.baseService}${'/users'}`);
  }

  getGendersList(): Observable<GenderModel[]> {
    return this.http.get<GenderModel[]>('./assets/data/gender.json');
  }

  getStates() {
    return this.http.get<State[]>('./assets/data/state.json');
  }

  getPlayersList(): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(`${environment.baseService}${'/players'}`);
  }

  getClubsList(): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(`${environment.baseService}${'/clubs'}`);
  }

  addClub(club: ClubModel) {
    return this.http.post<ClubModel>(`${environment.baseService}${'/clubs'}`, club);
  }

  getClubData(clubId: number) {
    return this.http.get<ApiResponse>(`${environment.baseService}${'/clubs'}/${clubId}`);
  }

  updateClubData(clubId: number, data: ClubModel) {
    return this.http.patch<void>(`${environment.baseService}${'/clubs'}/${clubId}`, data);
  }

  deleteClub(clubId: number) {
    return this.http.delete<void>(`${environment.baseService}${'/clubs'}/${clubId}`);
  }

  getRefereesList(): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(`${environment.baseService}${'/referees'}`);
  }

  getRefereeData(refereeId: number) {
    return this.http.get<ApiResponse>(`${environment.baseService}${'/referees'}/${refereeId}`);
  }

  addReferee(referee: RefereeModel, userId: number) {
    return this.http.post<RefereeModel>(`${environment.baseService}${'/referees'}/${userId}`, referee);
  }

  deleteReferee(refereeId: number) {
    return this.http.delete<void>(`${environment.baseService}${'/referees'}/${refereeId}`);
  }

  updateRefereeData(refereeId: number, referee: RefereeModel) {
    return this.http.patch<void>(`${environment.baseService}${'/referees'}/${refereeId}`, referee);
  }

/*   getSubsList(): Observable<SubModel[]> {
    return this.http.get<SubModel[]>('./assets/data/subs.json');
  } */

  getSubsList(): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(`${environment.baseService}${'/categories/subs'}`);
  }

  getImagePlayer(playerId: number, fileId: string) {
    return this.http.get(`${environment.baseService}${'/players'}/${playerId}${'/image'}/${fileId}`, { responseType: 'blob' });
  }

  uploadImagePlayer(playerId: number, file: any) {
    return this.http.post(`${environment.baseService}${'/players'}/${playerId}`, file);
  }

  getImageReferee(refereeId: number, fileId: string) {
    return this.http.get(`${environment.baseService}${'/referees'}/${refereeId}${'/image'}/${fileId}`, { responseType: 'blob' });
  }

  uploadImageReferee(refereeId: number, file: any) {
    return this.http.post(`${environment.baseService}${'/referees'}/${refereeId}${'/image'}`, file);
  }

  getImageClub(clubId: number, fileId: String) {
    return this.http.get(`${environment.baseService}${'/clubs'}/${clubId}${'/image'}/${fileId}`, { responseType: 'blob' });
  }

  uploadImageClub(clubId: number, file: any) {
    return this.http.post(`${environment.baseService}${'/clubs'}/${clubId}`, file);
  }

}
