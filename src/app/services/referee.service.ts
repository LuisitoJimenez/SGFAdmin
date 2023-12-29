import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiResponse } from '../models/ApiResponse';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RefereeService {

  constructor(
    private http: HttpClient
  ) { }

  getRefereesOptions(): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(`${environment.baseService}${'/referees'}`);
  }
  
}
