import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { IPointOfEvent } from '../interfaces/pointer-canvas.interface';

@Injectable({
  providedIn: 'root'
})
export class PointDataService {
  private point: IPointOfEvent = null;
  public pointDataSource = new BehaviorSubject<IPointOfEvent>(this.point);

  private event: MouseEvent = null;
  public eventSource = new BehaviorSubject<MouseEvent>(this.event);

  public setPointData(val: IPointOfEvent) {
    this.point = val;
    this.pointDataSource.next(this.point);
  }

  public setEvent(val: MouseEvent) {
    this.event = val;
    this.eventSource.next(this.event);
  }
}
