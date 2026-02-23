import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { Option, SelectionsMap } from '../models/option.model';
import { OPTION_LIST } from '../data/options.mock';

const saveToStorage = (selections: SelectionsMap, totalPrice: number) => {
  localStorage.setItem('selection-history', JSON.stringify(selections));
  localStorage.setItem('total-price', totalPrice.toString());
};

const loadHistoryFromStorage = () => {
  const storedHistory = localStorage.getItem('selection-history');
  return storedHistory ? (JSON.parse(storedHistory) as SelectionsMap) : {};
};

const loadTotalPriceFromStorage = () => {
  const storedPrice = localStorage.getItem('total-price');
  return storedPrice ? parseFloat(storedPrice) : 0;
};

export const BOX_COUNT = 10;

@Injectable({
  providedIn: 'root',
})
export class BoxSelectionService {
  private readonly _selectedBoxId$ = new BehaviorSubject<number | null>(null);
  private readonly _selectionHistory = new BehaviorSubject<SelectionsMap>(loadHistoryFromStorage());
  private readonly options = new BehaviorSubject<Option[]>(OPTION_LIST);
  private readonly _totalPrice$ = new BehaviorSubject<number>(loadTotalPriceFromStorage());

  readonly selectedBoxId$: Observable<number | null> = this._selectedBoxId$.asObservable();
  readonly options$: Observable<Option[]> = this.options.asObservable();
  readonly selectionHistory$: Observable<SelectionsMap> = this._selectionHistory.asObservable();
  readonly totalPrice$: Observable<number> = this._totalPrice$.asObservable();

  selectBox(boxId: number) {
    this._selectedBoxId$.next(boxId);
  }

  selectOption(boxId: number, option: Option) {
    // save the new selection option
    const currentHistory = this._selectionHistory.getValue();
    const updatedHistory = { ...currentHistory, [boxId]: option };
    this._selectionHistory.next(updatedHistory);

    // update the total price whenever an option is selected
    const totalPrice = Object.values(updatedHistory).reduce(
      (sum, opt) => sum + (opt?.value || 0),
      0,
    );
    const roundedTotal = Math.round(totalPrice * 100) / 100;
    this._totalPrice$.next(roundedTotal);
    saveToStorage(updatedHistory, roundedTotal);

    // auto select the next box if exists
    const nextBoxId = boxId + 1;
    if (nextBoxId <= BOX_COUNT) {
      this._selectedBoxId$.next(nextBoxId);
    }
  }

  isBoxSelected(boxId: number): Observable<boolean> {
    return this._selectedBoxId$.pipe(map((selectedBoxId) => selectedBoxId === boxId));
  }

  isOptionSelected(boxId: number | null): Observable<boolean> {
    if (boxId === null) {
      return new BehaviorSubject<boolean>(false).asObservable();
    }
    return this._selectionHistory.pipe(
      map((history) => history[boxId] !== undefined && history[boxId] !== null),
    );
  }

  getBoxSelectedOption(boxId: number): Observable<Option | null> {
    return this.selectionHistory$.pipe(
      map((history) => {
        const optionId = history[boxId]?.id;
        return this.options.getValue().find((option) => option.id === optionId) || null;
      }),
    );
  }

  clearAllBoxes() {
    this._selectionHistory.next({});
    this._totalPrice$.next(0);
    this._selectedBoxId$.next(null);
    localStorage.removeItem('selection-history');
    localStorage.removeItem('total-price');
  }
}
