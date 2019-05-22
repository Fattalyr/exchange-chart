import { Component, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { RatesService } from './services/rates.service';
import { RatesActions } from 'src/app/store/rates';

import { IJSONPoint } from 'src/app/interfaces/xml.interface';

import { StoreState, StoreSelectors } from 'src/app/store';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  constructor(
    // public rates: RatesService,
    private store: Store<StoreState.State>
  ) {
  }

  title = 'rates-exchange-ngrx';

  rates: IJSONPoint[] = [];

  ngOnInit() {
    // this.rates.getRates('01/01/2019', '10/04/2019').subscribe(rates => {
    //   console.log(rates);
    // });

    this.store.pipe(select(
      StoreSelectors.selectAllRates
    )).subscribe((rates) => {
      this.rates = rates;
      console.log(this.rates);
    });
  }
}
