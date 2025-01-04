import { isHTMLElement, isNullOrUndefined, isPrimitive, isVDOM } from './jsx-runtime.util';
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
      if (attr.startsWith('on') && typeof props[attr] === 'function') {
        const eventType = attr.slice(2).toLowerCase();
        element.addEventListener(eventType, props[attr]);
      }

      element.setAttribute(attr, value);
    });
}

const diffTextVDOM = (newVDOM: VNode, currentVDOM: VNode) => {
  if (JSON.stringify(newVDOM) === JSON.stringify(currentVDOM)) return false;
  if (typeof newVDOM === 'object' || typeof currentVDOM === 'object') return false;
  return true;
};

export function updateElement(parent: HTMLElement, newNode?: VNode, oldNode?: VNode, index: number = 0) {
  if (!newNode && oldNode) {
    parent.removeChild(parent.childNodes[index]);
    return;
  }

  if (newNode && !oldNode) {
    parent.appendChild(createElement(newNode));
    return;
  }

  if (!parent.childNodes[index]) return;

  if (diffTextVDOM(newNode, oldNode)) {
    parent.replaceChild(createElement(newNode), parent.childNodes[index]);
    return;
  }

  if (!isVDOM(oldNode) || !isVDOM(newNode)) return;

  const maxLength = Math.max(newNode!.children.length, oldNode!.children.length);

  if (newNode.type === FRAGMENT || oldNode.type === FRAGMENT) {
    const fragmentElement = parent.childNodes[index]?.parentNode || parent;
    Array.from({ length: maxLength }).forEach((_, i) =>
      updateElement(fragmentElement as HTMLElement, newNode.children[i], oldNode.children[i], i),
    );
  }

  if (newNode.type !== oldNode.type) {
    parent.replaceChild(createElement(newNode), parent.childNodes[index]);
    return;
  }

  if (parent.childNodes.length) {
    updateAttributes(parent.childNodes[index] as HTMLElement, newNode.props, oldNode.props);
  }

  Array.from({ length: maxLength }).forEach((_, i) =>
    updateElement(parent.childNodes[index] as HTMLElement, newNode.children[i], oldNode.children[i], i),
  );
}

function updateAttributes(target: HTMLElement, newProps: Props = {}, oldProps: Props = {}) {
  for (const [attr, value] of Object.entries(newProps)) {
    if (oldProps[attr] === newProps[attr]) continue;
    if (attr.startsWith('on') && typeof newProps[attr] === 'function') {
      const eventType = attr.slice(2).toLowerCase();
      target.removeEventListener(eventType, oldProps[attr]);
      target.addEventListener(eventType, newProps[attr]);
    }

    target.setAttribute(attr, value);
  }

  for (const attr of Object.keys(oldProps)) {
    if (newProps[attr] !== undefined) continue;
    target.removeAttribute(attr);
  }
}
