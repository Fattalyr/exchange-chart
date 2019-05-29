import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { Observable, of, merge } from 'rxjs';
import {
  catchError,
  map,
  switchMap,
  mergeMap
} from 'rxjs/operators';
import { RatesService } from 'src/app/services/rates.service';
import * as ratesActions from './actions';
import * as timelineActions from '../timeline/actions';

@Injectable()
export class RatesEffects {
  constructor(private ratesService: RatesService, private actions$: Actions) {}

  @Effect()
  loadRequestEffect$: Observable<Action> = this.actions$.pipe(
    ofType<ratesActions.LoadRequestAction>(
      ratesActions.ActionTypes.LOAD_REQUEST
    ),
    switchMap(action =>
      this.ratesService
        .getRates(action.payload.startDate, action.payload.endDate)
        .pipe(
          mergeMap(rates => ([
            new timelineActions.ProcessStartAction(),
            new ratesActions.LoadSuccessAction(rates)
          ])),
          catchError(error => of(new ratesActions.LoadFailureAction({ error })))
        )
    )
  );

  @Effect()
  loadSuccessEffect$: Observable<Action> = this.actions$.pipe(
    ofType<ratesActions.LoadSuccessAction>(
      ratesActions.ActionTypes.LOAD_SUCCESS
    ),
    switchMap(action =>
      this.ratesService
        .processRates(action.payload)
        .pipe(
          map(rates => new timelineActions.ProcessSuccessAction(rates)),
          catchError(error =>
            of(new timelineActions.ProcessErrorAction({ error }))
          )
      )
    )
  );
}
