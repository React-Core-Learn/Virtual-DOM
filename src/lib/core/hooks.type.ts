import { VDOM, Component } from '../jsx/jsx-runtime.type';

export interface Internals {
  rootElement: HTMLElement | null;
  rootComponent: Component | null;
  currentVDOM: null | VDOM;
  states: any[];
  hookIndex: number;
}
