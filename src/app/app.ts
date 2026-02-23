import { Component } from '@angular/core';
import { OptionSelectorComponent } from './components/option-selector/option-selector.component';
import { BoxesListComponent } from './components/boxes-list/boxes-list.component';
import { ClearButtonComponent } from './components/clear-button/clear-button.component';

@Component({
  selector: 'app-root',
  imports: [BoxesListComponent, ClearButtonComponent, OptionSelectorComponent],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {}
