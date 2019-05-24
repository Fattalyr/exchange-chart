import {
  Component,
  OnInit,
  OnDestroy,
  ChangeDetectionStrategy,
  ChangeDetectorRef
} from '@angular/core';
import { Store, select } from '@ngrx/store';
import { StoreState, RangeActions, StoreSelectors } from '../../store';
import { IJSONPoint } from 'src/app/interfaces/xml.interface';
import { Observable, Subscription, of } from 'rxjs';
import * as moment from 'moment';
import { RatesActions } from '../../store/rates';

@Component({
  selector: 'app-canvas',
  templateUrl: './canvas.component.html',
  styleUrls: ['./canvas.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CanvasComponent implements OnInit, OnDestroy {
  rates: IJSONPoint[];
  ratesSubscription: Subscription;

  constructor(
    private store: Store<StoreState.State>,
    private changeDetector: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.ratesSubscription = this.store.pipe(select(
      StoreSelectors.selectAllRates
    )).subscribe((rates) => {
      this.rates = [...rates];
      this.changeDetector.detectChanges();
      // console.log(this.rates);
    });
  }

  ngOnDestroy() {
    this.ratesSubscription.unsubscribe();
  }
}
