import { CommonModule } from '@angular/common';
import { Component, computed, input, signal } from '@angular/core';
import { Router } from '@angular/router';
import { ClickOutsideDirective } from '@core/directives';
import { MenuActionItem } from '@core/models';
import { ButtonComponent, IconComponent } from '@core/ui/components';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.css',
  imports: [IconComponent, ClickOutsideDirective, CommonModule, ButtonComponent],
})
export class MenuComponent {
  private readonly router = new Router();

  readonly items = input<MenuActionItem[]>([]);
  readonly buttonLabel = input<string>('');
  readonly buttonIcon = input<string | null>(null);
  readonly disabled = input<boolean>(false);

  readonly open = signal(false);
  readonly activePath = signal<string | null>(null);

  readonly mappedItems = computed(() => this.buildParentTree(this.items()));

  toggle(): void {
    if (this.disabled()) return;
    this.open.update((v) => !v);
  }

  close(): void {
    this.open.set(false);
    this.activePath.set(null);
  }

  isOpen(path?: string): boolean {
    if (!path) return false;
    const active = this.activePath();
    if (!active) return false;

    return active === path || active.startsWith(`${path}?`);
  }

  handleItemClick(item: MenuActionItem & { parentTree?: string }): void {
    if (item.disabled) return;

    if (item.children?.length) {
      const path = item.parentTree ?? null;
      const active = this.activePath();

      if (active === path) {
        this.activePath.set(this.getParentPath(path));
        return;
      }

      this.activePath.set(path);
      return;
    }

    if (item.action) {
      item.action();
      this.close();
      return;
    }

    if (item.url) {
      this.router.navigateByUrl(item.url);
      this.close();
    }
  }

  private getParentPath(path: string | null): string | null {
    if (!path) return null;

    const parts = path.split('?');
    parts.pop();

    return parts.length ? parts.join('?') : null;
  }

  private buildParentTree(
    items: MenuActionItem[],
    parentPath: string = '',
  ): Array<MenuActionItem & { parentTree: string }> {
    return items.map((item) => {
      const currentPath = parentPath ? `${parentPath}?${item.id}` : item.id;

      return {
        ...item,
        parentTree: currentPath,
        children: item.children ? this.buildParentTree(item.children, currentPath) : undefined,
      };
    });
  }
}
