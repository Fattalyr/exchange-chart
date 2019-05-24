/* Base Angular modules */
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

/* Custom Components */
import { CanvasComponent } from './canvas.component';
import { ChartComponent } from './chart/chart.component';
import { HelperComponent } from './helper/helper.component';
import { PointerComponent } from './pointer/pointer.component';

@NgModule({
  declarations: [
    CanvasComponent,
    ChartComponent,
    HelperComponent,
    PointerComponent
  ],
  imports: [
    BrowserModule
  ],
  exports: [ CanvasComponent ]
})
export class CanvasModule { }
