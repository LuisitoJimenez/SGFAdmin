import { Injectable } from '@angular/core';
import { BehaviorSubject, ReplaySubject, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  private data$ = new BehaviorSubject<{ [key: string]: any }>({});

  setData(name: string, data: any) {
    console.log('setData', name, data);
    const currentData = this.data$.getValue();
    this.data$.next({ ...currentData, [name]: data });
  }

  getData(name: string) {
    return this.data$.asObservable().pipe(map(data => data[name]));
  }

}
