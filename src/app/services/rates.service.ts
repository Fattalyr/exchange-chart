import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { NgxXml2jsonService } from 'ngx-xml2json';
import { isDevMode } from '@angular/core';
import { IXMLData, IJSONPoint } from '../interfaces/xml.interface';
import { ITimeline } from '../interfaces/timeline.interface';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class RatesService {
  // private readonly root = isDevMode ? '/scripts/XML_dynamic.asp?' : 'http://www.cbr.ru/scripts/XML_dynamic.asp?';
  private readonly root = '/scripts/XML_dynamic.asp?';
  private startDate = '01/01/2018';
  private endDate = '31/12/2018';
  private cbrURL = '';

  constructor(private http: HttpClient, private xmlToJson: NgxXml2jsonService) {
    const now = new Date();
    const thisYear = now.getFullYear();
    this.setEndsOfRange('01/01/' + thisYear.toString(), '31/12/' + thisYear.toString());
  }

  /**
   * Set ends of time range.
   * @param date1 - string format of date: 'DD/MM/YYYY'
   * @param date2 - string format of date: 'DD/MM/YYYY'
   */
  public setEndsOfRange(date1: string, date2: string): void {
    this.startDate = this.checkDate(date1, date2);
    this.endDate = this.checkDate(date2);
    this.rebuildURL();
  }

  /**
   * Rebuild URL for request to CBR server.
   */
  public rebuildURL() {
    this.cbrURL = this.root + 'date_req1=' + this.startDate + '&date_req2=' + this.endDate + '&VAL_NM_RQ=R01235';
  }

  public formatRates(rates: IXMLData): IJSONPoint[] {
    if (!rates.ValCurs) { return []; }
    const ratesArray = rates.ValCurs.Record;
    const formattedRates = [];
    ratesArray.forEach(rate => formattedRates.push({
        date: rate['@attributes'].Date,
        value: rate.Value
      })
    );
    return formattedRates;
  }

  /**
   * Get range of date, returns object with currency rates.
   * @param date1 - string format of date: 'DD/MM/YYYY'
   * @param date2 - string format of date: 'DD/MM/YYYY'
   */
  public getRates(date1: string, date2: string): Observable<IJSONPoint[]> {
    const headers = new HttpHeaders({
      'Access-Control-Allow-Origin': '*',
      'Content-Type': 'text/xml'
    });
    this.setEndsOfRange(date1, date2);
    return this.http.get(this.cbrURL, { headers, responseType: 'text' })
      .pipe(
        map(rates => {
          const parser = new DOMParser();
          const xml = parser.parseFromString(rates.toString(), 'text/xml');
          return this.xmlToJson.xmlToJson(xml);
        }),
        map(rates => this.formatRates(rates)),
        catchError(status => throwError(status))
      );
  }

  /**
   * Check if first date is before or equal the second date.
   * Else returns the second date.
   * @param date1 - string format of date: 'DD/MM/YYYY'
   * @param date2 - string format of date: 'DD/MM/YYYY'
   */
  public checkDate(date1: string, date2?: string): string {
    const momentDate1 = moment(date1, 'DD/MM/YYYY');
    const momentDate2 = date2 ? moment(date2, 'DD/MM/YYYY') : moment();
    if (!momentDate1.isValid() || momentDate1.isAfter(momentDate2)) {
      return momentDate2.format('DD/MM/YYYY');
    }
    return momentDate1.format('DD/MM/YYYY');
  }

  /**
   * Перегоняет дату из формата IJSONPoint в формат
   * [ DD: number, MM: number, YYYY: number ]
   * @param point - IJSONPoint
   */
  private processDate(point: IJSONPoint): number[] {
    const mDate = moment(point.date, 'DD.MM.YYYY');
    return [ +mDate.format('DD'), +mDate.format('MM'), +mDate.format('YYYY') ];
  }

  /**
   * Получает массив в формате IJSONPoint[],
   * отдаёт их формате ITimeline.
   */
  public processRates(data: IJSONPoint[] | {error: string}): Observable<ITimeline> {
    if ('error' in data) {
      return throwError('Something went wrong: ' + data.error);
    }

    const len = data.length;
    const timeline: ITimeline = {};
    for (let i = 0; i < len; i++) {
      const [day, month, year] = this.processDate(data[i]);
      if (!timeline[year]) {
        timeline[year] = {};
        if (!timeline.length) {
          timeline.length = 1;
        } else {
          timeline.length += 1;
        }
      }
      if (!timeline[year][month]) {
        timeline[year][month] = {};
        if (!timeline[year].length) {
          timeline[year].length = 1;
        } else {
          timeline[year].length += 1;
        }
      }
      timeline[year][month][day] = {
        value: data[i].value,
        number: day,
        date: new Date(year, month, day)
      };
      if (!timeline[year][month].length) {
        timeline[year][month].length = 1;
      } else {
        timeline[year][month].length += 1;
      }
    }
    return of(timeline);
  }

}
