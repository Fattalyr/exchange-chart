import {
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  ChangeDetectionStrategy,
  ChangeDetectorRef
} from '@angular/core';
import { PointDataService } from 'src/app/services/point-data.service';
import { IPointOfEvent } from 'src/app/interfaces/pointer-canvas.interface';
import { fromEvent } from 'rxjs';
import { throttleTime } from 'rxjs/operators';

@Component({
  selector: 'app-helper',
  templateUrl: './helper.component.html',
  styleUrls: ['./helper.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HelperComponent implements OnInit {
  @ViewChild('helper') helper: ElementRef;
  @ViewChild('eventInterceptor') eventInterceptor: ElementRef;
  point: IPointOfEvent;
  color = '#9299a2';
  diff = '';

  constructor(
    private pointData: PointDataService,
    private changeDetector: ChangeDetectorRef
  ) {}

  ngOnInit() {
    fromEvent(this.eventInterceptor.nativeElement, 'mousemove')
      .pipe(throttleTime(20))
      .subscribe((e) => {
        this.pointData.setEvent(e as MouseEvent);
      });

    this.pointData.pointDataSource.subscribe(data => {
      this.point = data;
      if (data && data.pixelData) {
        if (data.pixelData.previous === true) {
          this.color = '#af111c';
          this.diff = '▼';
        } else if (data.pixelData.previous === false) {
          this.color = '#22a053';
          this.diff = '▲';
        } else {
          this.color = '#9299a2';
          this.diff = '';
        }
      }
      this.changeDetector.detectChanges();
    });
  }
}
