import { updateElement } from '@/lib/jsx/jsx-runtime';
import { VDOM, Component } from './jsx/jsx-runtime.type';

interface Global {
  rootElement: HTMLElement | null;
  rootComponent: Component | null;
  currentVDOM: null | VDOM;
  states: any[];
  hookIndex: number;
}

export const { useState, render } = (function () {
  const global: Global = {
    rootElement: null,
    rootComponent: null,
    currentVDOM: null,
    states: [],
    hookIndex: 0,
  };

  const render = (rootElement: HTMLElement, component: any) => {
    global.rootElement = rootElement;
    global.rootComponent = component;
    _render();
  };

  const _render = () => {
    const newVDOM = global.rootComponent!();
    updateElement(global.rootElement!, newVDOM, global.currentVDOM);
    global.hookIndex = 0;
    global.currentVDOM = newVDOM;
  };

  const useState = <T>(initialState: T) => {
    const index = global.hookIndex;
    const state = global.states[index] ?? initialState;

    const setState = (newState: T) => {
      global.states[index] = newState;
      _render();
    };

    global.hookIndex++;

    return [state, setState];
  };

  return { useState, render };
})();
