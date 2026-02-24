import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  inject,
  Input,
  OnInit,
} from '@angular/core';
import { Option } from '../../models/option.model';
import { fromEvent, Observable } from 'rxjs';
import { BoxSelectionService } from '../../state/box-selection.service';
import { AsyncPipe } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-option-item',
  templateUrl: './option-item.component.html',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AsyncPipe],
})
export class OptionItemComponent implements OnInit {
  @Input({ required: true }) option!: Option;

  private readonly boxSelectionService = inject(BoxSelectionService);
  private readonly el = inject(ElementRef<HTMLElement>);
  private readonly destroyRef = inject(DestroyRef);

  boxSelectedOptionId$: Observable<number | null> =
    this.boxSelectionService.selectedOptionIdForCurrentBox$;

  ngOnInit() {
    fromEvent(this.el.nativeElement, 'click')
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.boxSelectionService.selectOption(this.option));
  }
}
