import { ChangeDetectionStrategy, Component, DestroyRef, ElementRef, inject } from '@angular/core';
import { fromEvent, Observable } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { BoxSelectionService } from '../../state/box-selection.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-clear-button',
  templateUrl: './clear-button.component.html',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AsyncPipe],
})
export class ClearButtonComponent {
  private boxSelectionService = inject(BoxSelectionService);
  private readonly el = inject(ElementRef<HTMLElement>);
  private readonly destroyRef = inject(DestroyRef);

  totalPrice$: Observable<number> = new Observable();

  ngOnInit() {
    this.totalPrice$ = this.boxSelectionService.totalPrice$;

    fromEvent(this.el.nativeElement, 'click')
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.boxSelectionService.clearAllBoxes());
  }
}
