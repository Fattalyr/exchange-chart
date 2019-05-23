import { Component, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';

import { IJSONPoint } from 'src/app/interfaces/xml.interface';

import { StoreState, StoreSelectors } from 'src/app/store';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  constructor(
    private store: Store<StoreState.State>
  ) {
  }

  title = 'rates-exchange-ngrx';

  rates: IJSONPoint[] = [];

  ngOnInit() {
    this.store.pipe(select(
      StoreSelectors.selectAllRates
    )).subscribe((rates) => {
      this.rates = rates;
      console.log(this.rates);
    });
  }
}
