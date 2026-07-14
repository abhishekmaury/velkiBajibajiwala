import { Component, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-setting',
  standalone: true,
  imports: [],
  templateUrl: './setting.component.html',
  styleUrls: ['./setting.component.css']
})
export class SettingComponent {
  @Output() closeModal = new EventEmitter<void>();

  close() {
    this.closeModal.next()
  }
}
