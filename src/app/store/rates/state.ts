import { IXMLDateRecord } from '../../interfaces/xml.interface';

export interface IRatesState {
  RATES: Array<IXMLDateRecord>;
  isLoading?: boolean;
  error?: null | string;
}

export const initialState: IRatesState = {
  RATES: [],
  isLoading: false,
  error: null
};
