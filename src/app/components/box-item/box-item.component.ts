import {
  ChangeDetectionStrategy,
  Component,
  Input,
  inject,
  OnInit,
  ElementRef,
  DestroyRef,
} from '@angular/core';
import { fromEvent, Observable } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { BoxSelectionService } from '../../state/box-selection.service';
import { Option } from '../../models/option.model';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-box-item',
  templateUrl: './box-item.component.html',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AsyncPipe],
})
export class BoxItemComponent implements OnInit {
  private readonly boxSelectionService = inject(BoxSelectionService);
  private readonly el = inject(ElementRef<HTMLElement>);
  private readonly destroyRef = inject(DestroyRef);

  @Input({ required: true }) boxId!: number;

  isBoxSelected$!: Observable<boolean>;
  selectedOption$!: Observable<Option | null>;

  ngOnInit() {
    this.isBoxSelected$ = this.boxSelectionService.isBoxSelected(this.boxId);
    this.selectedOption$ = this.boxSelectionService.getBoxSelectedOption(this.boxId);

    fromEvent(this.el.nativeElement, 'click')
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.boxSelectionService.selectBox(this.boxId));
  }
}
