import { Injectable } from '@angular/core';
import { BehaviorSubject, combineLatestWith, map, Observable } from 'rxjs';
import { Option, SelectionsMap } from '../models/option.model';
import { OPTION_LIST } from '../data/options.data';

const saveToStorage = (selections: SelectionsMap) => {
  localStorage.setItem('selection-history', JSON.stringify(selections));
};

const loadHistoryFromStorage = () => {
  const storedHistory = localStorage.getItem('selection-history');
  return storedHistory ? (JSON.parse(storedHistory) as SelectionsMap) : {};
};

export const BOX_COUNT = 10;

@Injectable({
  providedIn: 'root',
})
export class BoxSelectionService {
  private readonly _selectedBoxId$ = new BehaviorSubject<number | null>(null);
  private readonly _selectionHistory = new BehaviorSubject<SelectionsMap>(loadHistoryFromStorage());
  private readonly options = new BehaviorSubject<Option[]>(OPTION_LIST);

  readonly selectedBoxId$: Observable<number | null> = this._selectedBoxId$.asObservable();
  readonly options$: Observable<Option[]> = this.options.asObservable();
  readonly selectionHistory$: Observable<SelectionsMap> = this._selectionHistory.asObservable();
  readonly totalPrice$: Observable<number> = this.selectionHistory$.pipe(
    map((history) => {
      const total = Object.values(history).reduce((sum, opt) => sum + (opt?.value || 0), 0);
      return Math.round(total * 100) / 100;
    }),
  );

  readonly selectedOptionIdForCurrentBox$: Observable<number | null> = this._selectedBoxId$.pipe(
    combineLatestWith(this._selectionHistory),
    map(([selectedBoxId, history]) => {
      if (selectedBoxId === null) return null;
      return history[selectedBoxId]?.id ?? null;
    }),
  );

  selectBox(boxId: number) {
    this._selectedBoxId$.next(boxId);
  }

  selectOption(option: Option) {
    // save the new selection option
    const boxId = this._selectedBoxId$.getValue();
    if (boxId === null) return;
    const currentHistory = this._selectionHistory.getValue();
    const updatedHistory = { ...currentHistory, [boxId]: option };
    this._selectionHistory.next(updatedHistory);

    saveToStorage(updatedHistory);

    // auto select the next box if exists
    const nextBoxId = boxId + 1;
    if (nextBoxId <= BOX_COUNT) {
      this._selectedBoxId$.next(nextBoxId);
    }
  }

  isBoxSelected(boxId: number): Observable<boolean> {
    return this._selectedBoxId$.pipe(map((selectedBoxId) => selectedBoxId === boxId));
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
    this._selectedBoxId$.next(null);
    localStorage.removeItem('selection-history');
  }
}
