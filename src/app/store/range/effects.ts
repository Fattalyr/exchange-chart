import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { switchMap, map } from 'rxjs/operators';
import * as rangeActions from './actions';
import { RangeService } from 'src/app/services/range.service';

@Injectable()
export class RangeEffects {
  constructor(
    private actions$: Actions,
    private rangeService: RangeService
  ) {}

  @Effect()
  changeRangeEffect$: Observable<Action> = this.actions$.pipe(
    ofType<rangeActions.ChangeRangeAction>(rangeActions.ActionTypes.CHANGE_RANGE),
    switchMap(
      action =>
        of(this.rangeService
          .callForDateWithNewRange(action.payload.startDate, action.payload.endDate)
        ).pipe(
          map(() => new rangeActions.ChangeRangeAction(action.payload))
        )

      // action => of(new rangeActions.ChangeRangeAction(action.payload))
    )
  );
}
