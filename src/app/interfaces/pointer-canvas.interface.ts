export interface IPointerCanvasPixel {
  [n: number]: IPixelData | null; // n - это координата X.
}

export interface IPixelData {
  x: number; // X-координата.
  y: number; // Y-координата.
  value: number; // Котировка.
  previous?: boolean | null; // Предыдущее больше, меньше или нет предыдущей котировки.
  date: string | Date;
}

export interface IPointOfEvent {
  pixelData: IPixelData;
  x: number;
  y: number;
}
