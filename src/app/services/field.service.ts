import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiResponse } from '../models/ApiResponse';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FieldService {

  constructor(
    private http: HttpClient
  ) { }

  getListFields() {
    return this.http.get<ApiResponse>(`${environment.baseService}${'/fields'}`)
  }
  
}
