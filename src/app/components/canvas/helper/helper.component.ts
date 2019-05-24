import {
  ChangeDetectionStrategy,
  Component,
  OnInit
} from '@angular/core';

@Component({
  selector: 'app-helper',
  templateUrl: './helper.component.html',
  styleUrls: ['./helper.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HelperComponent implements OnInit {
  ngOnInit() {}
}
