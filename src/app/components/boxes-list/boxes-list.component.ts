import { ChangeDetectionStrategy, Component } from '@angular/core';
import { BoxItemComponent } from '../box-item/box-item.component';

@Component({
  selector: 'app-boxes-list',
  templateUrl: './boxes-list.component.html',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [BoxItemComponent],
})
export class BoxesListComponent {
  boxesIds = Array.from({ length: 10 }, (_, i) => i + 1);
}
