import {
  Component,
  OnInit,
  OnDestroy,
  ChangeDetectionStrategy,
  ChangeDetectorRef
} from '@angular/core';
import { Store, select } from '@ngrx/store';
import { StoreState, StoreSelectors } from 'src/app/store';
import { Subscription } from 'rxjs';
import { ITimeline } from 'src/app/interfaces/timeline.interface';
import { IJSONPoint } from 'src/app/interfaces/xml.interface';

@Component({
  selector: 'app-canvas',
  templateUrl: './canvas.component.html',
  styleUrls: ['./canvas.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CanvasComponent implements OnInit, OnDestroy {
  timeline: ITimeline;
  rates: IJSONPoint[];
  timelineSubscription: Subscription;
  ratesSubscription: Subscription;
  ratesAreLoading = this.store.pipe(select(
    StoreSelectors.selectRatesAreLoading
  ));

  constructor(
    private store: Store<StoreState.State>,
    private changeDetector: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.timelineSubscription = this.store.pipe(select(
      StoreSelectors.selectTimeline
    )).subscribe((timeline) => {
      this.timeline = timeline;
      this.changeDetector.detectChanges();
    });

    this.ratesSubscription = this.store.pipe(select(
      StoreSelectors.selectAllRates
    )).subscribe((rates) => {
      this.rates = rates;
      this.changeDetector.detectChanges();
    });
  }

  ngOnDestroy() {
    this.timelineSubscription.unsubscribe();
    this.ratesSubscription.unsubscribe();
  }
}
