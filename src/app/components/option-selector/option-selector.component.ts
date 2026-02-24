import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { BoxSelectionService } from '../../state/box-selection.service';
import { Observable } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { Option } from '../../models/option.model';
import { OptionItemComponent } from '../option-item/option-item.component';

@Component({
  selector: 'app-option-selector',
  templateUrl: './option-selector.component.html',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AsyncPipe, OptionItemComponent],
})
export class OptionSelectorComponent {
  private readonly boxSelectionService = inject(BoxSelectionService);

  selectedBoxId$!: Observable<number | null>;
  options$!: Observable<Option[]>;
  selectionHistory$!: Observable<Record<number, Option | null>>;

  ngOnInit() {
    this.selectedBoxId$ = this.boxSelectionService.selectedBoxId$;
    this.options$ = this.boxSelectionService.options$;
    this.selectionHistory$ = this.boxSelectionService.selectionHistory$;
  }
}
