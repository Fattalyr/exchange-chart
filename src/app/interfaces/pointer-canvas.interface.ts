export interface IPointerCanvasPixel {
  [n: number]: IPixelData; // n - это координата X.
}

export interface IPixelData {
  y: number; // Y-координата.
  value: number; // Котировка.
  previous: boolean | null; // Предыдущее больше, меньше или нет предыдущей котировки.
}
