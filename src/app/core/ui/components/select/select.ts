import {
  Component,
  input,
  output,
  signal,
  computed,
  ElementRef,
  HostListener,
} from '@angular/core';
import { FormControl } from '@angular/forms';

export interface SelectOption {
  label: string;
  value: string | number;
  disabled?: boolean;
}

@Component({
  selector: 'ui-select',

  imports: [],
  templateUrl: './select.html',
  styleUrl: './select.css',
  host: { class: 'ignore-host' },
})
export class SelectComponent {
  readonly placeholder = input<string>('Seleccionar...');
  readonly options = input<Array<SelectOption>>([]);
  readonly control = input<FormControl | null>(null);
  readonly multiple = input<boolean>(false);
  readonly onChange = output<string | number | Array<string | number>>();

  readonly disabled = computed<boolean>(() => !!this.control()?.disabled);
  readonly invalid = computed<boolean>(
    () => !!this.control()?.touched && !!this.control()?.invalid,
  );

  uid = Math.random().toString(36).slice(2, 9);
  readonly open = signal(false);
  focusedIndex = signal<number | null>(null);

  private searchBuffer = '';
  private searchTimeout: any = null;

  constructor(private el: ElementRef<HTMLElement>) {}

  @HostListener('document:focusin', ['$event'])
  onDocumentFocusIn(event: FocusEvent) {
    const target = event.target as Node | null;
    if (!target) return;
    if (!this.el.nativeElement.contains(target)) {
      if (this.open()) this.handleCloseClick();
    }
  }

  @HostListener('keydown', ['$event'])
  onHostKeydown(event: KeyboardEvent) {
    if (!this.open()) return;
    if (event.key === 'Tab') {
      this.handleCloseClick();
      return;
    }
    if (event.key === 'Escape') {
      this.handleCloseClick();
      (this.el.nativeElement.querySelector(`#dropdown-button-${this.uid}`) as HTMLElement)?.focus();
      event.preventDefault();
      return;
    }
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      this.moveFocus(event.key === 'ArrowDown' ? 1 : -1);
    }
  }

  onMenuKeydown(event: KeyboardEvent) {
    this.onHostKeydown(event);
  }

  moveFocus(direction: 1 | -1) {
    const options = this.options();
    if (!options.length) return;
    let idx = this.focusedIndex();
    if (idx == null) {
      const selectedIdx = options.findIndex((o) => this.isSelected(o));
      idx = selectedIdx !== -1 ? selectedIdx : direction === 1 ? 0 : options.length - 1;
    } else {
      let next = idx;
      do {
        next = (next + direction + options.length) % options.length;
      } while (options[next].disabled && next !== idx);
      idx = next;
    }
    this.focusedIndex.set(idx);
    setTimeout(() => {
      (this.el.nativeElement.querySelectorAll('.dropdown-option')[idx!] as HTMLElement)?.focus();
    });
  }

  handleToggleOpen() {
    this.open.update((v) => !v);
    if (this.open()) {
      this.attachKeyboardSearch();
      const selectedIdx = this.options().findIndex((o) => this.isSelected(o));
      this.focusedIndex.set(this.options().length ? (selectedIdx !== -1 ? selectedIdx : 0) : null);
      setTimeout(() => {
        const idx = this.focusedIndex();
        if (idx != null) {
          (this.el.nativeElement.querySelectorAll('.dropdown-option')[idx] as HTMLElement)?.focus();
        }
      });
    } else {
      this.control()?.markAsTouched();
      this.detachKeyboardSearch();
      this.focusedIndex.set(null);
    }
  }

  handleCloseClick() {
    this.searchBuffer = '';
    this.focusedIndex.set(null);
    this.open.set(false);
    this.control()?.markAsTouched();
    this.detachKeyboardSearch();
  }

  attachKeyboardSearch() {
    window.addEventListener('keydown', this.handleKeySearch);
  }
  detachKeyboardSearch() {
    window.removeEventListener('keydown', this.handleKeySearch);
  }

  private handleKeySearch = (e: KeyboardEvent) => {
    if (!this.open()) return;
    const key = e.key.toLowerCase();
    if (key.length !== 1 || e.ctrlKey || e.metaKey || e.altKey) return;
    this.searchBuffer += key;
    clearTimeout(this.searchTimeout);
    this.searchTimeout = setTimeout(() => (this.searchBuffer = ''), 800);
    const index = this.options().findIndex((opt) =>
      opt.label.toLowerCase().startsWith(this.searchBuffer),
    );
    if (index !== -1) {
      this.focusedIndex.set(index);
      setTimeout(() => {
        document.querySelectorAll('.dropdown-option')[index]?.scrollIntoView({ block: 'nearest' });
      });
    }
  };

  isSelected(item: SelectOption): boolean {
    const ctrl = this.control();
    const val = ctrl?.value;
    if (!ctrl) return false;
    return this.multiple() && Array.isArray(val) ? val.includes(item.value) : val === item.value;
  }

  handleOptionClick(option: SelectOption) {
    if (option.disabled) return;
    const ctrl = this.control();
    if (!ctrl) return;
    const val = ctrl.value;
    if (this.multiple()) {
      const values = Array.isArray(val) ? [...val] : [];
      const newValues = values.includes(option.value)
        ? values.filter((v) => v !== option.value)
        : [...values, option.value];
      ctrl.setValue(newValues);
      this.onChange.emit(newValues);
    } else {
      ctrl.setValue(val !== option.value ? option.value : null);
      this.open.set(false);
      this.onChange.emit(option.value);
    }
    ctrl.markAsDirty();
  }

  get dropdownLabel(): string {
    const ctrl = this.control();
    const val = ctrl?.value;
    const opts = this.options();
    if (!ctrl || val == null || (Array.isArray(val) && val.length === 0)) return this.placeholder();
    if (!this.multiple()) return opts.find((o) => o.value === val)?.label ?? this.placeholder();
    if (Array.isArray(val)) {
      const selected = opts.filter((o) => val.includes(o.value));
      if (!selected.length) return this.placeholder();
      return selected.length === 1 ? selected[0].label : `${selected.length} seleccionados`;
    }
    return this.placeholder();
  }
}
