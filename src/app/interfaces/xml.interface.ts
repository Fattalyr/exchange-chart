export interface XMLAttributes {
  ID?: string;
  DateRange1?: string;
  DateRange2?: string;
  name?: string;
  Date?: string;
  Id?: string;
}
export interface XMLDateRecord {
  '@attributes'?: XMLAttributes;
  Nominal: string;
  Value: string;
}
export interface XMLDateArray {
  '@attributes'?: XMLAttributes;
  Record: Array<XMLDateRecord>;
}
export interface XMLData {
  ValCurs?: XMLDateArray;
}
