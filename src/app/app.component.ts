import { Component, OnInit } from '@angular/core';
import { RatesService } from './services/rates.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  constructor(public rates: RatesService) {
  }
  title = 'rates-exchange-ngrx';
  ngOnInit() {
    this.rates.getRates().subscribe(rates => {
      console.log(rates);
    });
  }
}
