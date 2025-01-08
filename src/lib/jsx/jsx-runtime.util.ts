import type { VNode } from './jsx-runtime.type';

/**
 * NOTE: createElement Helper Function
 */
export function isHTMLElement(element: DocumentFragment | HTMLElement) {
  return element instanceof HTMLElement;
}

export function isNullOrUndefined(node: VNode) {
  return node === null || node === undefined;
}

export function isPrimitive(node: VNode) {
  return typeof node === 'string' || typeof node === 'number';
}

export function isVDOM(node: VNode) {
  return typeof node === 'object' && node !== null && 'type' in node;
}
