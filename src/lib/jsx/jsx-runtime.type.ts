import { FRAGMENT } from './jsx-runtime.constant';

export type Fragment = typeof FRAGMENT;
export type Type = keyof HTMLElementTagNameMap | Component | Fragment;
export type Props = Record<string, any>;
export type VNode = string | number | null | undefined | VDOM;
export type Component = (props: Props) => VDOM;

export interface VDOM {
  type?: Type;
  props: Props;
  children: VNode[];
}
