import {
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  ChangeDetectionStrategy,
  ChangeDetectorRef
} from '@angular/core';
import { PointDataService } from 'src/app/services/point-data.service';
import { IPixelData, IPointOfEvent } from 'src/app/interfaces/pointer-canvas.interface';
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

  setHelperPosition(point: IPixelData) {
    if (!this.helper) {
      return;
    }
    const helperNode = this.helper.nativeElement;
    const width = parseFloat(window.getComputedStyle(helperNode).width.replace('px', ''));
    const height = parseFloat(window.getComputedStyle(helperNode).height.replace('px', ''));
    if (isNaN(width) || isNaN(height)) {
      return;
    }
    const maxWidth: number = parseFloat(window.getComputedStyle(this.eventInterceptor.nativeElement).width.replace('px', ''));
    let typicalTopOffset = point.y - height - 6;
    let typicalLeftOffset = point.x + 6;

    if (typicalTopOffset < 6) {
      typicalTopOffset += height + 12;
    }
    helperNode.style.top = typicalTopOffset + 'px';

    if ((width + point.x + 8) > maxWidth) {
      typicalLeftOffset -= width + 12;
    }
    helperNode.style.left = typicalLeftOffset + 'px';
  }

  ngOnInit() {
    fromEvent(this.eventInterceptor.nativeElement, 'mousemove')
      .pipe(throttleTime(20))
      .subscribe((e) => {
        this.pointData.setEvent(e as MouseEvent);
      });

    this.pointData.pointDataSource.subscribe(data => {
      this.point = data;
      if (data && data.pixelData) {
        this.setHelperPosition(data.pixelData);
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
