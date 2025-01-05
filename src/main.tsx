type RecordType = Record<string, any>;

interface VirtualNode {
  type: string;
  props: RecordType;
  children: (VirtualNode | string)[];
}

function h(type: string, props: RecordType | null, ...children: any[]): VirtualNode {
  return {
    type,
    props: props || {},
    children: children.flat().filter((child) => child != null),
  };
}

function createElement(node: VirtualNode | string): Node {
  if (typeof node === 'string') {
    return document.createTextNode(node);
  }

  const $element = document.createElement(node.type);

  Object.entries(node.props || {})
    .filter(([_, value]) => value)
    .forEach(([attr, value]) => $element.setAttribute(attr, value));

  node.children.map(createElement).forEach((child) => $element.appendChild(child));

  return $element;
}

function updateElement(parent: Node, oldNode: VirtualNode | string, newNode: VirtualNode | string, index = 0) {
  const childNode = parent.childNodes[index];

  if (!newNode && oldNode) {
    if (childNode) parent.removeChild(childNode);
    return;
  }

  if (newNode && !oldNode) {
    parent.appendChild(createElement(newNode));
    return;
  }

  if (typeof newNode === 'string' && typeof oldNode === 'string') {
    if (newNode !== oldNode) {
      if (childNode) parent.replaceChild(createElement(newNode), childNode);
    }
    return;
  }

  if (typeof newNode !== 'string' && typeof oldNode !== 'string' && newNode.type !== oldNode.type) {
    if (childNode) parent.replaceChild(createElement(newNode), childNode);
    return;
  }

  if (typeof oldNode !== 'string' && typeof newNode !== 'string') {
    if (childNode instanceof HTMLElement) {
      updateAttributes(childNode, newNode.props, oldNode.props);
    }

    const maxLength = Math.max(newNode.children.length, oldNode.children.length);
    for (let i = 0; i < maxLength; i++) {
      updateElement(childNode!, oldNode.children[i], newNode.children[i], i);
    }
  }

  function updateAttributes(target: HTMLElement, newProps: RecordType, oldProps: RecordType) {
    for (const [attr, value] of Object.entries(newProps)) {
      if (oldProps[attr] !== value) target.setAttribute(attr, value);
    }
    for (const attr of Object.keys(oldProps)) {
      if (!(attr in newProps)) target.removeAttribute(attr);
    }
  }
}

const render = (state: RecordType[]) => (
  <div id="app">
    <ul>
      {state.map(({ completed, content }) => (
        <li class={completed ? 'completed' : null}>
          <input type="checkbox" class="toggle" checked={completed} />
          {content}
          <button class="remove">삭제</button>
        </li>
      ))}
    </ul>
    <form>
      <input type="text" />
      <button type="submit">추가</button>
    </form>
  </div>
);

const oldState = [
  { id: 1, completed: false, content: 'todo list item 1' },
  { id: 2, completed: true, content: 'todo list item 2' },
];

const newState = [
  { id: 1, completed: true, content: 'todo list item 1 updated' },
  { id: 2, completed: true, content: 'todo list item 2' },
  { id: 3, completed: false, content: 'todo list item 3' },
];

const oldNode = render(oldState);
const newNode = render(newState);

const $root = document.createElement('div');
document.body.appendChild($root);

$root.appendChild(createElement(oldNode));

setTimeout(() => updateElement($root, oldNode, newNode), 1000);
