import { IJSONPoint } from '../../interfaces/xml.interface';

export interface IRatesState {
  rates: Array<IJSONPoint>;
  isLoading?: boolean;
  error?: null | string;
}

export const initialState: IRatesState = {
  rates: [],
  isLoading: false,
  error: null
};
