import { ChangeDetectionStrategy, Component, DestroyRef, inject } from '@angular/core';
import { BoxSelectionService } from '../../state/box-selection.service';
import { Observable, Subject, withLatestFrom } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { Option } from '../../models/option.model';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-option-selector',
  templateUrl: './option-selector.component.html',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AsyncPipe],
})
export class OptionSelectorComponent {
  private readonly boxSelectionService = inject(BoxSelectionService);
  private readonly destroyRef = inject(DestroyRef);

  selectedBoxId$: Observable<number | null> = new Observable();
  options$: Observable<Option[]> = new Observable();
  selectionHistory$: Observable<Record<number, Option | null>> = new Observable();
  private readonly optionSelectClick$ = new Subject<Option>();

  ngOnInit() {
    this.selectedBoxId$ = this.boxSelectionService.selectedBoxId$;
    this.options$ = this.boxSelectionService.options$;
    this.selectionHistory$ = this.boxSelectionService.selectionHistory$;

    this.optionSelectClick$
      .pipe(
        withLatestFrom(this.boxSelectionService.selectedBoxId$),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe(([option, boxId]) => {
        if (boxId !== null) {
          this.boxSelectionService.selectOption(boxId, option);
        }
      });
  }

  onOptionSelect(option: Option) {    
    this.optionSelectClick$.next(option);
  }
}
