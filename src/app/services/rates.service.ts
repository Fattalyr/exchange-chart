import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map } from 'rxjs/operators';
import { NgxXml2jsonService } from 'ngx-xml2json';

@Injectable({
  providedIn: 'root'
})
export class RatesService {
  private readonly root = '/cbr/scripts/XML_dynamic.asp?';
  private startDate = '01/01/2018';
  private endDate = '31/12/2018';
  private cbrURL = '';

  constructor(private http: HttpClient, private xmlToJson: NgxXml2jsonService) {
    const now = new Date();
    const thisYear = now.getFullYear();
    this.startDate = '01/01/' + thisYear.toString();
    this.endDate = '31/12/' + thisYear.toString();
    this.cbrURL = this.root + 'date_req1=' + this.startDate + '&date_req2=' + this.endDate + '&VAL_NM_RQ=R01235';
  }

  public getRates(): Observable<any> {
    const headers = new HttpHeaders({
      'Access-Control-Allow-Origin': '*',
      'Content-Type': 'text/xml'
    });
    return this.http.get(this.cbrURL, { headers })
      .pipe(
        map(rates => {
          const parser = new DOMParser();
          const xml = parser.parseFromString(rates.toString(), 'text/xml');
          const jsonObj = this.xmlToJson.xmlToJson(xml);
          console.log(jsonObj);
          return jsonObj;
        })
      );
  }

}
