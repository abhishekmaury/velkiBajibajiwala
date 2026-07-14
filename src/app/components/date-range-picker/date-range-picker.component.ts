import { trigger, transition, style, animate } from '@angular/animations';
import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { DataHandlerService } from 'src/app/services/datahandler.service';

@Component({
  selector: 'app-date-range-picker',
  templateUrl: './date-range-picker.component.html',
  styleUrls: ['./date-range-picker.component.css'],
  animations: [
    trigger('slideInOut', [
      transition(':enter', [
        style({ transform: 'translateY(100%)', opacity: 0 }),
        animate('500ms ease-in-out', style({ transform: 'translateY(0)', opacity: 1 })),
      ]),
      transition(':leave', [
        animate('500ms ease-in-out', style({ transform: 'translateY(100%)', opacity: 0 }))
      ])
    ])
  ]
})
export class DateRangePickerComponent {



  @Input() startDate: Date | null = null;
  @Input() endDate: Date | null = null;

  @Output() rangeSelected = new EventEmitter<{ start: Date, end: Date }>();
  @Output() close = new EventEmitter<void>();

  currentMonth!: number;
  currentYear!: number;
  daysInMonth: any[] = [];

  startTime = '09:30';
  endTime = '09:29';

  today = new Date(); // current date (for disabling future)
  dayNames = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
  monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  showMonthYearPopup = false;
  todayMonth = new Date().getMonth();
  todayYear = new Date().getFullYear();
  definedays = false
  toggleMonthYearPopup() {
    this.showMonthYearPopup = !this.showMonthYearPopup;
  }
  isClassicTheme = false;

  constructor(private dataServe: DataHandlerService) { }
  ngOnInit() {
    this.dataServe.changeTheme$.subscribe({
      next:(f) => this.isClassicTheme = f,
    })
    const today = new Date();
    this.currentMonth = today.getMonth();
    this.currentYear = today.getFullYear();
    this.generateCalendar();
  }
  selectMonth(monthIndex: number) {
    this.currentMonth = monthIndex;
    this.generateCalendar();
    this.showMonthYearPopup = false;
  }
  // generateCalendar() {
  //   const firstDay = new Date(this.currentYear, this.currentMonth, 1);
  //   const lastDay = new Date(this.currentYear, this.currentMonth + 1, 0);

  //   const days = [];
  //   const startBlank = firstDay.getDay();

  //   for (let i = 0; i < startBlank; i++) {
  //     days.push({ date: '', blank: true });
  //   }

  //   for (let i = 1; i <= lastDay.getDate(); i++) {
  //     const dateObj = new Date(this.currentYear, this.currentMonth, i);

  //     const isFuture = dateObj > this.today;
  //     days.push({
  //       date: i,
  //       fullDate: dateObj,
  //       blank: false,
  //       disabled: isFuture
  //     });
  //   }

  //   this.daysInMonth = days;
  // }
  // const isFuture = dateObj > this.today;
  generateCalendar() {
    const firstDay = new Date(this.currentYear, this.currentMonth, 1);
    const lastDay = new Date(this.currentYear, this.currentMonth + 1, 0);

    const days = [];
    const startBlank = firstDay.getDay();

    // Today
    const today = new Date();

    // Allowed range → from 2 months before today’s month to today
    const minDate = new Date(today.getFullYear(), today.getMonth() - 2, 1); // 2 months before, start of month
    const maxDate = new Date(today.getFullYear(), today.getMonth(), today.getDate()); // today

    for (let i = 0; i < startBlank; i++) {
      days.push({ date: '', blank: true });
    }

    for (let i = 1; i <= lastDay.getDate(); i++) {
      const dateObj = new Date(this.currentYear, this.currentMonth, i);

      const isOutOfRange = dateObj < minDate || dateObj > maxDate;

      days.push({
        date: i,
        fullDate: dateObj,
        blank: false,
        disabled: isOutOfRange
      });
    }

    this.daysInMonth = days;
  }

  prevMonth() {
    if (this.currentMonth === 0) {
      this.currentMonth = 11;
      this.currentYear--;
    } else this.currentMonth--;
    this.generateCalendar();
  }

  nextMonth() {
    const nextMonthDate = new Date(this.currentYear, this.currentMonth + 1, 1);
    if (nextMonthDate > this.today) return;
    if (this.currentMonth === 11) {
      this.currentMonth = 0;
      this.currentYear++;
    } else this.currentMonth++;
    this.generateCalendar();
  }

  selectDate(day: any) {
    if (day.blank || day.disabled) return;

    if (!this.startDate || (this.startDate && this.endDate)) {
      this.startDate = day.fullDate;
      this.endDate = null;
    }
    else if (day.fullDate >= this.startDate) {
      this.endDate = day.fullDate;
    }
    else {
      this.endDate = this.startDate;
      this.startDate = day.fullDate;
    }
    if (this.startDate && this.endDate) {
      const diffTime = this.endDate.getTime() - this.startDate.getTime();
      const diffDays = diffTime / (1000 * 60 * 60 * 24);

      if (diffDays < 14 && diffDays >= 0) {
        this.rangeSelected.emit({ start: this.startDate, end: this.endDate });
        this.definedays = false
      } else {
        this.definedays = true
      }
      setTimeout(() => {
        this.definedays = false
      }, 4000);
    }

  }


  isInRange(day: any): boolean {
    if (day.blank || day.disabled) return false;
    if (this.startDate && this.endDate)
      return day.fullDate >= this.startDate && day.fullDate <= this.endDate;
    return false;
  }

  isStart(day: any): boolean {
    const start = this.startDate || this.startDate;
    return !!start && day.fullDate?.getTime() === start.getTime();
  }

  isEnd(day: any): boolean {
    const end = this.endDate || this.endDate;
    return !!end && day.fullDate?.getTime() === end.getTime();
  }
  ngOnChanges(changes: SimpleChanges) {
    if (changes['startDate']) {
      this.startDate = changes['startDate'].currentValue;

    }
    if (changes['endDate']) {
      this.endDate = changes['endDate'].currentValue;
    }


    if (this.startDate && this.endDate) {
      const diffTime = this.endDate.getTime() - this.startDate.getTime();
      const diffDays = diffTime / (1000 * 60 * 60 * 24);

      if (diffDays < 14 && diffDays >= 0) {
        this.definedays = false
      } else {
        this.definedays = true
      }
      setTimeout(() => {
        this.definedays = false
      }, 4000);
    }


  }
  applySelection() {
    if (this.startDate && this.endDate) {
      const diffTime = this.endDate.getTime() - this.startDate.getTime();
      const diffDays = diffTime / (1000 * 60 * 60 * 24);

      if (diffDays < 14 && diffDays >= 0) {
        this.rangeSelected.emit({ start: this.startDate, end: this.endDate });
        this.definedays = false
      } else {
        this.definedays = true
      }
      setTimeout(() => {
        this.definedays = false
      }, 4000);

    }
    this.close.emit();
  }

  closemsg() {
    this.definedays = false
  }
}
