export class CanvasLayer {
  idSelector: string;
  width: number;
  height: number;

  top: number;
  right: number;
  bottom: number;
  left: number;

  minY: number; // Минимальное значение по шкале Y (минимально возможное значение курса)
  maxY: number; // Максимальное значение по шкале Y (максимально возможное значение курса)

  axisXYears: number[]; // координаты лет по шкале X.
  axisXMonths: number[]; // координаты месяцев по шкале X. Месяцы по ширине равны в незаисимости от кол-ва точек.
  axisXPart: number; // кол-во пикселей в одном из делений по оси X

  domElement: HTMLCanvasElement | null;

  offsetY: number; // Отступ от верхней и нижней границы
                   // до коридора кривой графика, например 0.05 - это 5%
                   // от высоты коридора.

  constructor({
                idSelector,
                width = 900,
                height = 280,
                top = 30,
                right = 30,
                bottom = 30,
                left = 40,
                minY = -1,
                maxY = -1,
                axisXYears = [],
                axisXMonths = [],
                axisXPart = 0,
                domElement = null,
                offsetY = 0.05
              }) {
    this.idSelector = idSelector;
    this.width = width;
    this.height = height;
    this.top = top;
    this.right = right;
    this.bottom = bottom;
    this.left = left;
    this.minY = minY;
    this.maxY = maxY;
    this.axisXYears = axisXYears;
    this.axisXMonths = axisXMonths;
    this.axisXPart = axisXPart;
    this.domElement = domElement;
    this.offsetY = offsetY;
  }
}
