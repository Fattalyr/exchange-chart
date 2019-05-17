import { Injectable } from '@angular/core';
import { RatesService } from './rates.service';

@Injectable({
  providedIn: 'root'
})
export class RangeService {
  constructor(private rates: RatesService) {}

}
