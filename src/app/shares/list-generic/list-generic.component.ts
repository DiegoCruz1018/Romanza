import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-list-generic',
  imports: [],
  templateUrl: './list-generic.component.html',
  styleUrl: './list-generic.component.css'
})
export class ListGenericComponent {
  @Input({required: true})
  list: any;
}
