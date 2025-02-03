import { Component, Input, input } from '@angular/core';

@Component({
  selector: 'app-multiple-selector',
  imports: [],
  templateUrl: './multiple-selector.component.html',
  styleUrl: './multiple-selector.component.css'
})
export class MultipleSelectorComponent {

  @Input({required: true})
  selected!: string[];

  @Input({required: true})
  noSelected!: string[];

  select(element: string, index: number){
    this.selected.push(element);
    this.noSelected.splice(index, 1);
  }

  deselect(element: string, index: number){
    this.noSelected.push(element);
    this.selected.splice(index, 1);
  }

  selectAll(){
    this.selected.push(...this.noSelected);

    this.noSelected.length = 0;
  }

  deselectAll(){
    this.noSelected.push(...this.selected);

    this.selected.length = 0;
  }
}
