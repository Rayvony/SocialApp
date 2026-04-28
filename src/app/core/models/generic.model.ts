export type ColorVariant =
  | 'primary'
  | 'secondary'
  | 'tertiary'
  | 'success'
  | 'danger'
  | 'warning'
  | 'info'
  | 'muted'
  | 'neutral'
  | 'dark'
  | 'light';

export interface ComponentStyles {
  color?: string;
  backgroundColor?: string;
  fontSize?: string;
  fontWeight?: string | number;
  textAlign?: 'left' | 'center' | 'right';
  padding?: string;
  border?: string;
  borderBottom?: string;
  whiteSpace?: 'normal' | 'nowrap';
  textOverflow?: 'clip' | 'ellipsis';
  overflow?: 'hidden' | 'visible';
}
