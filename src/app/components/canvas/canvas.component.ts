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
import * as moment from 'moment';
import { ITimeline } from '../../interfaces/timeline.interface';

@Component({
  selector: 'app-canvas',
  templateUrl: './canvas.component.html',
  styleUrls: ['./canvas.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CanvasComponent implements OnInit, OnDestroy {
  timeline: ITimeline;
  ratesSubscription: Subscription;

  constructor(
    private store: Store<StoreState.State>,
    private changeDetector: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.ratesSubscription = this.store.pipe(select(
      StoreSelectors.selectTimeline
    )).subscribe((timeline) => {
      this.timeline = {...timeline};
      this.changeDetector.detectChanges();
    });
  }

  ngOnDestroy() {
    this.ratesSubscription.unsubscribe();
  }
}
