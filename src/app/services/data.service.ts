import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { tap, catchError, map } from 'rxjs/operators';
import { TypesData, ProjectTypeData } from '../interfaces/project-data';

@Injectable({
    providedIn: 'root'
})
export class DataService {
    private _dataUrl = './assets/json/data.json';

    constructor(private _http: HttpClient) { }

    getData(): Observable<any> {
        return this._http.get<any>(this._dataUrl)
            .pipe(map(data => {
                return this.buildData(data);
            }))
            .pipe(tap(data => console.log('data.json loaded', data)))
            .pipe(catchError(this.handleError));
    }

    private handleError(err: HttpErrorResponse) {
        console.log(err.message);
        return throwError(err.headers);
    }

    private buildData(data) {
        const types = new Array<ProjectTypeData>();
        const typesData: TypesData = {};
        const prjs = data.projects;
        const roles = data.roles;
        const l = prjs.length;
        // change project.type to ProjectTypeData object {text:string, id:string}
        for (let i = l - 1; i >= 0; i--) {
            const p = prjs[i],
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
        data.projects = prjs;
        data.roles = roles;
        data.types = types;
        return data;
    }

}
