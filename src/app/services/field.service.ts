import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiResponse } from '../models/ApiResponse';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { FieldModel } from '../models/player';

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

  getFieldData(fieldId: number): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(`${environment.baseService}${'/fields'}/${fieldId}`);
  }

  addField(field: FieldModel) {
    return this.http.post<FieldModel>(`${environment.baseService}${'/fields'}`, field);
  }

  updateFieldData(fieldId: number, field: FieldModel) {
    return this.http.patch<void>(`${environment.baseService}${'/fields'}/${fieldId}`, field);
  }

  deleteField(fieldId: number) {
    return this.http.delete<void>(`${environment.baseService}${'/fields'}/${fieldId}`);
  }

  getImageField(fieldId: number, fileId: String) {
    return this.http.get(`${environment.baseService}${'/fields'}/${fieldId}${'/image'}/${fileId}`, { responseType: 'blob' });
  }

  uploadImageField(fieldId: number, file: any) {
    return this.http.post(`${environment.baseService}${'/fields'}/${fieldId}`, file);
  }

  
}
