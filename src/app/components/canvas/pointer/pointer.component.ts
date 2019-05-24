import {
  Component,
  OnInit,
  Input,
  AfterViewInit,
  ElementRef,
  ViewChild,
  Renderer2,
  ChangeDetectionStrategy,
  ChangeDetectorRef
} from '@angular/core';
import { Observable } from 'rxjs';
import { IJSONPoint } from '../../../interfaces/xml.interface';

@Component({
  selector: 'app-pointer',
  templateUrl: './pointer.component.html',
  styleUrls: ['./pointer.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PointerComponent implements OnInit {
  _rates: IJSONPoint[];
  @Input('rates')
  set rates(val: IJSONPoint[]) {
    this._rates = val;
  }
  get rates(): IJSONPoint[] {
    return this._rates;
  }

  constructor() {}

  ngOnInit() {}
}
