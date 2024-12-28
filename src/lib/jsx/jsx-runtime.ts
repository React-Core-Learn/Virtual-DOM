export const FRAGMENT = 'FRAGMENT' as const;

type Fragment = typeof FRAGMENT;
type Type = keyof HTMLElementTagNameMap | Component | Fragment;
type Props = Record<string, any>;
type VNode = string | number | null | undefined | VDOM;
type Component = (props: Props) => VDOM;

interface VDOM {
  type?: Type;
  props: Props;
  children: VNode[];
}

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

function isHTMLElement(element: DocumentFragment | HTMLElement) {
  return element instanceof HTMLElement;
}

function isNullOrUndefined(node: VNode) {
  return node === null || node === undefined;
}

function isPrimitive(node: VNode) {
  return typeof node === 'string' || typeof node === 'number';
}
