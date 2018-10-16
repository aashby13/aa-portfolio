import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, of } from 'rxjs';
import { tap, catchError, map } from 'rxjs/operators';
import { TypesData, ProjectTypeData, ProjectJsonData } from '../interfaces/project-data';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private _dataUrl = './assets/json/data.json';
  private _data: ProjectJsonData;

  constructor(private _http: HttpClient) { }

  getData(): Observable<ProjectJsonData> {
    if (this._data) {
      return of(this._data);
    } else {
      return this._http.get<ProjectJsonData>(this._dataUrl)
        .pipe(map(data => {
          return this.buildData(data);
        }))
        .pipe(tap(data => console.log('data.json loaded', data)))
        .pipe(catchError(this.handleError));
    }
  }

  private handleError(err: HttpErrorResponse) {
    return throwError(err.headers);
  }

  private buildData(data) {
    const types = new Array<ProjectTypeData>();
    const typesData: TypesData = {};
    const l = data.projects.length;
    // change project.type to ProjectTypeData object {text:string, id:string}
    for (let i = l - 1; i >= 0; i--) {
      const p = data.projects[i],
        t = (p.type as string).toLowerCase().replace(/ /g, '-'),
        typeObj = { text: p.type, id: t } as ProjectTypeData;
      p.type = typeObj;
      p.index = i;
      // build typesData object - no duplicates
      if (!typesData.hasOwnProperty(t)) {
        typesData[t] = typeObj;
        types.push(typeObj);
      }
    }
    data.types = types;
    this._data = data;
    return data;
  }
}
