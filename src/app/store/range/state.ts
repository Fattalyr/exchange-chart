export interface IRangeState {
  startDate: string | null;
  endDate: string | null;
}

export const initialState: IRangeState = {
  startDate: null,
  endDate: null
};
