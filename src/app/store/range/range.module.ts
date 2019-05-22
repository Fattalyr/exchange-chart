import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { rangeReducer } from './reducers';
import { RangeEffects } from './effects';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    StoreModule.forFeature('rangeData', rangeReducer),
    EffectsModule.forFeature([RangeEffects])
  ],
  providers: [RangeEffects]
})
export class RangeModule {}
