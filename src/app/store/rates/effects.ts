import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { catchError, map, switchMap, mergeMap, concatMap } from 'rxjs/operators';
import { RatesService } from 'src/app/services/rates.service';
import * as ratesActions from './actions';
import * as timelineActions from '../timeline/actions';

@Injectable()
export class RatesEffects {
  constructor(private ratesService: RatesService, private actions$: Actions) {}

  @Effect()
  loadRequestEffect$: Observable<Action> = this.actions$.pipe(
    ofType<ratesActions.LoadRequestAction>(ratesActions.ActionTypes.LOAD_REQUEST),
    switchMap(action => this.ratesService
      .getRates(action.payload.startDate, action.payload.endDate)
      .pipe(
        map(rates => {
          console.log('First action', rates);
          return new ratesActions.LoadSuccessAction(rates);
        }),
        catchError(error => of(new ratesActions.LoadFailureAction({ error })))
      )
    ),
    concatMap(action => this.ratesService
      .processRates(action.payload)
      .pipe(
        map(rates => {
          console.log('Second action', rates);
          return new timelineActions.ProcessDataAction(rates);
        }),
        catchError(error => of(new timelineActions.ProcessErrorAction({ error })))
      )
    )
  );
}
