import { isHTMLElement, isNullOrUndefined, isPrimitive } from './jsx-runtime.util';
import { FRAGMENT } from './jsx-runtime.constant';
import type { Type, Props, VNode, VDOM } from './jsx-runtime.type';

export function h(type: Type, props: Props, ...children: VNode[]): VDOM {
  props = props ?? {};
  if (typeof type === 'function') return type(props);
  return { type, props, children: children.flat() };
}

export function createElement(node: VNode) {
  if (isNullOrUndefined(node)) {
    return document.createDocumentFragment();
  }

  if (isPrimitive(node)) {
    return document.createTextNode(String(node));
  }

  const element =
    node.type === FRAGMENT
      ? document.createDocumentFragment()
      : document.createElement(node.type as keyof HTMLElementTagNameMap);

  if (isHTMLElement(element)) {
    elementSetAttribute(element, node.props);
  }

  node.children.map(createElement).forEach((child) => element.appendChild(child));

  return element;
}

function elementSetAttribute(element: HTMLElement, props: Props = {}) {
  Object.entries(props)
    .filter(([_, value]) => value)
    .forEach(([attr, value]) => {
      element.setAttribute(attr, value);
    });
}
