import { Directive, ElementRef, inject, OnDestroy, OnInit, output } from '@angular/core';

@Directive({
  selector: '[clickOutside]',

  host: {
    '(document:click)': 'onClick($event)',
  },
})
export class ClickOutsideDirective implements OnInit, OnDestroy {
  private elementRef = inject(ElementRef);
  private isInitialized = false;

  clickOutside = output<MouseEvent>();

  ngOnInit(): void {
    this.isInitialized = true;
  }

  ngOnDestroy(): void {
    this.isInitialized = false;
  }

  onClick(event: MouseEvent): void {
    if (!this.isInitialized) return;

    const clickedInside = this.elementRef.nativeElement.contains(event.target);
    if (!clickedInside) {
      this.clickOutside.emit(event);
    }
  }
}
