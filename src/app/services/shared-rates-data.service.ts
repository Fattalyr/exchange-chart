import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedRatesDataService {
  private ratesLength = 0;
  public ratesLengthSource = new BehaviorSubject<number>(this.ratesLength);

  private ratesMin = 0;
  public ratesMinSource = new BehaviorSubject<number>(this.ratesMin);

  private ratesMax = 0;
  public ratesMaxSource = new BehaviorSubject<number>(this.ratesMax);

  setRatesLength(val: number) {
    this.ratesLength = val;
    this.ratesLengthSource.next(this.ratesLength);
  }

  setRatesMin(val: number) {
    this.ratesMin = val;
    this.ratesMinSource.next(this.ratesMin);
  }

  setRatesMax(val: number) {
    this.ratesMax = val;
    this.ratesMaxSource.next(this.ratesMax);
  }
}
