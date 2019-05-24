import { NativeDateAdapter } from '@angular/material';

export class MyDateAdapter extends NativeDateAdapter {
  parse(value: string) {
    const date = value.split('/');
    if (date.length === 3) {
      return new Date( +date[2], +date[1] - 1, +date[0], 12);
    }
  }

  format(date: Date, displayFormat: Object) {
    return ('0' + date.getDate()).slice(-2) + '/' + ('0' + (date.getMonth() + 1)).slice(-2) + '/' + date.getFullYear();
  }

  getFirstDayOfWeek(): number {
    return 1;
  }
}
