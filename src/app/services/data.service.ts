import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class DataService {
    private _dataUrl = './assets/json/data.json';

    constructor(private _http: HttpClient) { }

    getData(): Observable<any> {
        return this._http.get<any>(this._dataUrl)
            .pipe(tap(data => console.log('data.json loaded', data)))
            .pipe(catchError(this.handleError));
    }

    private handleError(err: HttpErrorResponse) {
        console.log(err.message);
        return throwError(err.headers);
    }

}
