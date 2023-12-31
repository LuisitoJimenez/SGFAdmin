import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiResponse } from '../models/ApiResponse';
import { environment } from 'src/environments/environment';
import { TeamModel } from '../models/player';

@Injectable({
  providedIn: 'root'
})
export class TeamService {

  constructor(
    private http: HttpClient
  ) { }

  getTeamList(): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(`${environment.baseService}${'/teams'}`);
  }

  addTeam(team: TeamModel, clubId: number) {
    const headers = new HttpHeaders({
      clubId: clubId,
    });
    return this.http.post<TeamModel>(`${environment.baseService}${'/teams'}`, team, { headers });
  }

  updateTeam(team: TeamModel, teamId: number) {
    const headers = new HttpHeaders({
      teamId: teamId,
    });
    return this.http.patch<TeamModel>(`${environment.baseService}${'/teams'}`, team, { headers });
  }

  deleteTeam(teamId: number) {
    return this.http.delete<void>(`${environment.baseService}${'/teams'}/${teamId}`);
  }

  getTeamData(teamId: number) {
    return this.http.get<ApiResponse>(`${environment.baseService}${'/teams'}/${teamId}`);
  }

}
