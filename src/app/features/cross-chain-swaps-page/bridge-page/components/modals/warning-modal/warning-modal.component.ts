import { Component, Output, EventEmitter, Input, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'warning-modal',
  templateUrl: './warning-modal.component.html',
  styleUrls: ['./warning-modal.component.scss']
})
export class WarningModalComponent {
  @Input() warningText: string;

  constructor(@Inject(MAT_DIALOG_DATA) public data: { text: string }) {
    this.warningText = data.text;
  }
}
