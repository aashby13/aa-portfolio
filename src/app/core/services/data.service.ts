import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, of } from 'rxjs';
import { tap, catchError, map } from 'rxjs/operators';
import { ProjectJsonData, ProjectTypeData, TypesData, ProjectData } from '../../models';
import { environment } from 'src/environments/environment';
import { DATA_PATHS } from '../../constants';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private cachedData: any = {};

  constructor(private http: HttpClient) { }

  getData(url: string): Observable<any> {
    if (this.cachedData[url]) {
      return of(this.cachedData[url]);
    } else {
      return this.http.get<any>(url)
        .pipe(map(data => this.mapData(url, data)),
          tap(data => {
            this.cachedData[url] = data;
            if (!environment.production) console.log(`DataService: ${url} loaded`, data);
          }),
          catchError(this.handleError)
        );
    }
  }
  // TODO: better error handling
  private handleError(err: HttpErrorResponse) {
    return throwError(err.headers);
  }

  private mapData(url: string, data: any): any {
    switch (url) {
      case DATA_PATHS.portfolio:
        return this.buildPortfolioData(data);
      default:
        return data;
    }
  }

  private buildPortfolioData(data: ProjectJsonData): ProjectJsonData {
    const types: ProjectTypeData[] = [];
    const typesData: TypesData = {};
    // change project.type to ProjectTypeData object {text:string, id:string}
    data.projects.map((project: ProjectData, i: number) => {
      const t = (project.type as string).toLowerCase().replace(/ /g, '-');
      const typeObj = { text: project.type, id: t } as ProjectTypeData;
      // build typesData object - no duplicates
      if (!typesData.hasOwnProperty(t)) {
        typesData[t] = typeObj;
        types.push(typeObj);
      }
      //
      return Object.assign(project, {type: typeObj, index: i});
    });
    data.types = types;
    return data;
  }
}
