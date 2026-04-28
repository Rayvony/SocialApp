import { Component, input } from '@angular/core';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'ui-icon',
  standalone: true,
  imports: [LucideAngularModule],
  template: `
    <lucide-icon
      [name]="name()"
      [size]="size()"
      [strokeWidth]="strokeWidth()"
      [absoluteStrokeWidth]="true"
      [class]="className()"
      [style.color]="color()"
      [style.fill]="fill()"
    />
  `,
  host: { class: 'ignore-host' },
})
export class IconComponent {
  readonly name = input.required<string>();
  readonly size = input<number>(20);
  readonly strokeWidth = input<number>(1.75);
  readonly className = input<string>('');
  readonly color = input<string>('');
  readonly fill = input<string>('none');
}
