import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  constructor() { }

  getAddedAndDeletedElements(prevData: any, newData: any): any {

    if (prevData === undefined || prevData === null || newData === undefined) {

      return 'undefined';
    } else if (prevData === '' || newData === '') {

      if (prevData === '') {
        const data = {
          dataDelete: [],
          dataAdd: newData,
          deleteValue: false,
          addValue: true,
        };

        return data;
      }

      if (newData === '') {
        const data = {
          dataDelete: prevData,
          dataAdd: [],
          deleteValue: true,
          addValue: false,
        };

        return data;
      }
    }

    else {
      console.log('entre');
      const dataDelete = prevData.filter((value: any) => !newData.includes(value));
      const dataAdd = newData.filter((value: any) => !prevData.includes(value));

      let deleteValue = false;
      let addValue = false;

      if (dataDelete.length > 0) {
        deleteValue = true;
      }

      if (dataAdd.length > 0) {
        addValue = true;
      }

      const data = {
        dataDelete: dataDelete,
        dataAdd: dataAdd,
        deleteValue: deleteValue,
        addValue: addValue,
      };

      return data;
    }
  }
}
