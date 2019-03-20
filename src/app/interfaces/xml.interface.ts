export interface IXMLAttributes {
  ID?: string;
  DateRange1?: string;
  DateRange2?: string;
  name?: string;
  Date?: string;
  Id?: string;
}
export interface IXMLDateRecord {
  '@attributes'?: IXMLAttributes;
  Nominal: string;
  Value: string;
}
export interface IXMLDateArray {
  '@attributes'?: IXMLAttributes;
  Record: Array<IXMLDateRecord>;
}
export interface IXMLData {
  ValCurs?: IXMLDateArray;
}
