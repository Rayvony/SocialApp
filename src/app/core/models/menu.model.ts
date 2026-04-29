export interface MenuActionItem {
  id: string;
  label: string;
  icon?: string;
  disabled?: boolean;
  url?: string;
  action?: () => void;
  children?: MenuActionItem[];
}
