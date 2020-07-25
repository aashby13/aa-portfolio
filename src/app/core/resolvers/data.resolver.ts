import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { DataService } from '../services/data.service';
import { map, catchError } from 'rxjs/operators';
import { ResolveFilter, ResolveMapKeys } from '../../models';

@Injectable({
  providedIn: 'root'
})
export class DataResolver implements Resolve<any> {

  constructor(private dataService: DataService) {}

  resolve(route: ActivatedRouteSnapshot): Observable<any> {
    return this.dataService.getData(route.data.url).pipe(
      map(data => route.data.tree ? this.mapData(data, route.data.tree) : data),
      map(data => route.data.filters ? this.filterData(data, route.data.filters) : data),
      map(data => route.data.mapKeys ? this.mapDataKeys(data, route.data.mapKeys) : data),
      // TODO: better error handling
      catchError(err => throwError(err.headers))
    );
  }

  private mapData(data: any, tree: string | number | Array<string | number>): any {
    if (typeof tree === 'string' || typeof tree === 'number') {
      data = data[tree];
    } else if (tree.forEach) {
      tree.forEach(val => {
        data = data[val];
      });
    }
    return data;
  }

  private filterData(data: any, filters: ResolveFilter[]): any {
    let newData: any;
    // if data is array
    if (data.filter) {
      newData = [];
      // there may be a better way to do this
      data = data.filter((val, i) => {
        let include = false;
        filters.forEach(f => {
          switch (f.type) {
            case 'key':
              include = val.hasOwnProperty(f.match);
              if (include) {
                if (!newData[i]) newData.push({});
                newData[i][f.match] = val[f.match];
              }
              break;

            case 'value':
              include = f.match === val;
              break;

            case 'index':
              include = f.match === i;
              break;

            default:
              break;
          }
        });
        return include;
      });
      newData = newData.length ? newData : data;
    } else {
      // TODO if data is object
      newData = {};
    }
    return newData;
  }

  private mapDataKeys(data: any, mapKeys: ResolveMapKeys[]): any {
      data.map( obj => {
        mapKeys.forEach(keys => {
          obj[keys[1]] = obj[keys[0]];
          delete obj[keys[0]];
        });
        return obj;
      });
      return data;
  }
}
