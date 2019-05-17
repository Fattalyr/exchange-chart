import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import * as rangeActions from './actions';

@Injectable()
export class RangeEffects {
  constructor(private actions$: Actions) {}

  @Effect()
  changeRangeEffect$: Observable<Action> = this.actions$.pipe(
    ofType<rangeActions.ChangeRangeAction>(rangeActions.ActionTypes.CHANGE_RANGE),
    switchMap(
      action => of(new rangeActions.ChangeRangeAction(action.payload))
    )
  );
}
