import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { ratesReducer } from './reducers';
import { RatesEffects } from './effects';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    StoreModule.forFeature('rates', ratesReducer),
    EffectsModule.forFeature([RatesEffects])
  ],
  providers: [RatesEffects]
})
export class RatesModule {}
