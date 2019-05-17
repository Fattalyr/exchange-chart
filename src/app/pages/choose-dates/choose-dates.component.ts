import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-choose-dates',
  templateUrl: './choose-dates.component.html',
  styleUrls: ['./choose-dates.component.scss']
})
export class ChooseDatesComponent implements OnInit {
  startDate = new FormControl(this.generateStartDate());
  endDate = new FormControl(new Date());

  ngOnInit() {}

  generateStartDate(): Date {
    const now = new Date();
    const thisYear = now.getFullYear();
    return new Date(`January 1, ${thisYear} 00:00:00`);
  }
}
