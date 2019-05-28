export interface ITimeline {
  [n: number]: IYear;
  length?: number;
}

export interface IYear {
  [n: number]: IMonth;
  length?: number;
}

export interface IMonth {
  [n: number]: IDay;
  length?: number;
}

export interface IDay {
  number: number; // Номер дня в месяце, от 1 до 31.
  value: number; // Котировка, цена доллара в рублях.
  date: Date; // Дата в формате Date.
  monthStart?: boolean;
  yearStart?: boolean;
}
