export const FRAGMENT = 'FRAGMENT' as const;

type Fragment = typeof FRAGMENT;
type Type = keyof HTMLElementTagNameMap | Component | Fragment;
type Props = Record<string, any> | null;
type VNode = string | number | null | undefined | VDOM;
type Component = (props: Props) => VDOM;

interface VDOM {
  type?: Type;
  props: Props;
  children: VNode[];
}

export function h(type: Type, props: Props, ...children: VNode[]): VDOM {
  if (typeof type === 'function') return type(props);
  return { type, props, children: children.flat() };
}

export function createElement(node: VNode) {
  if (node === null || node === undefined) {
    return document.createDocumentFragment();
  }

  if (typeof node === 'string' || typeof node === 'number') {
    return document.createTextNode(String(node));
  }

  node.props = node.props || {};

  const element =
    node.type === FRAGMENT
      ? document.createDocumentFragment()
      : document.createElement(node.type as keyof HTMLElementTagNameMap);

  Object.entries(node.props)
    .filter(([_, value]) => value)
    .forEach(([attr, value]) => {
      if (element instanceof DocumentFragment) return;
      element.setAttribute(attr, value);
    });

  node.children.map(createElement).forEach((child) => element.appendChild(child));

  return element;
}
