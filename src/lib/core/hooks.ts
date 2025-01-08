import { updateElement } from '@/lib/jsx/jsx-runtime';
import { Component } from '../jsx/jsx-runtime.type';
import { Internals } from './hooks.type';

export const { useState, render } = (function () {
  const INTERNALS: Internals = {
    rootElement: null,
    rootComponent: null,
    currentVDOM: null,
    states: [],
    hookIndex: 0,
  };

  const render = (rootElement: HTMLElement, component: Component) => {
    INTERNALS.rootElement = rootElement;
    INTERNALS.rootComponent = component;
    _render();
  };

  const _render = () => {
    const newVDOM = INTERNALS.rootComponent!();
    updateElement(INTERNALS.rootElement!, newVDOM, INTERNALS.currentVDOM);
    INTERNALS.hookIndex = 0;
    INTERNALS.currentVDOM = newVDOM;
  };

  const useState = <T>(initialState: T) => {
    const index = INTERNALS.hookIndex;
    const state = INTERNALS.states[index] ?? initialState;

    const setState = (newState: T) => {
      INTERNALS.states[index] = newState;
      _render();
    };

    INTERNALS.hookIndex++;

    return [state, setState];
  };

  return { useState, render };
})();
