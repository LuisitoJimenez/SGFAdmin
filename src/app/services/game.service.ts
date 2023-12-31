import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { ApiResponse } from '../models/ApiResponse';
import { GameModel } from '../models/player';

@Injectable({
  providedIn: 'root'
})
export class GameService {

  constructor(
    private http: HttpClient
  ) { }

  getGamesList() {
    return this.http.get<ApiResponse>(`${environment.baseService}${'/games'}`);
  }

  deleteGame(gameId: number) {
    return this.http.delete<void>(`${environment.baseService}${'/games'}/${gameId}`);
  }

  addGame(game: GameModel) {
    return this.http.post<GameModel>(`${environment.baseService}${'/games'}`, game);
  }

  getGameData(gameId: number) {
    return this.http.get<ApiResponse>(`${environment.baseService}${'/games'}/${gameId}`);
  }

  updateGame(game: GameModel, gameId: number) {
    return this.http.patch<GameModel>(`${environment.baseService}${'/games'}/${gameId}`, game);
  }

}
