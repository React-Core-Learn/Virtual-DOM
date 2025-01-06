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

function updateElement(parent: Node, oldNode: Node | null, newNode: Node | null) {
  if (!newNode && oldNode && oldNode instanceof HTMLElement) {
    oldNode.remove();
    return;
  }

  if (newNode && !oldNode) {
    parent.appendChild(newNode);
    return;
  }

  if (!oldNode || !newNode) return;

  if (newNode instanceof Text && oldNode instanceof Text) {
    if (newNode.nodeValue !== oldNode.nodeValue) {
      oldNode.nodeValue = newNode.nodeValue;
    }
    return;
  }

  if (oldNode instanceof Element && newNode instanceof Element) {
    if (newNode.nodeName !== oldNode.nodeName) {
      oldNode.replaceWith(newNode);
      return;
    }

    updateAttributes(oldNode, newNode);

    const newChildren = Array.from(newNode.childNodes);
    const oldChildren = Array.from(oldNode.childNodes);
    const maxLength = Math.max(newChildren.length, oldChildren.length);

    for (let i = 0; i < maxLength; i++) {
      updateElement(oldNode, oldChildren[i] || null, newChildren[i] || null);
    }
  }
}

function updateAttributes(oldNode: Element, newNode: Element) {
  const oldProps = Array.from(oldNode.attributes);
  const newProps = Array.from(newNode.attributes);

  for (const { name, value } of newProps) {
    if (oldNode.getAttribute(name) !== value) {
      oldNode.setAttribute(name, value);
    }
  }

  for (const { name } of oldProps) {
    if (!newNode.hasAttribute(name)) {
      oldNode.removeAttribute(name);
    }
  }
}

const render = (state: RecordType[]) => {
  const element = document.createElement('div');
  element.innerHTML = `
    <div id="app">
      <ul>
        ${state
          .map(
            ({ completed, content }) => `
              <li class="${completed ? 'completed' : ''}">
                <input type="checkbox" class="toggle" ${completed ? 'checked' : ''} />
                ${content}
                <button class="remove">삭제</button>
              </li>
            `,
          )
          .join('')}
      </ul>
      <form>
        <input type="text" />
        <button type="submit">추가</button>
      </form>
    </div>
  `.trim();

  return element.firstElementChild;
};

const oldState = [
  { id: 1, completed: false, content: 'todo list item 1' },
  { id: 2, completed: true, content: 'todo list item 2' },
];

const newState = [
  { id: 1, completed: true, content: 'todo list item 1 updated' },
  { id: 2, completed: true, content: 'todo list item 2' },
  { id: 3, completed: false, content: 'todo list item 3' },
];

const $root = document.createElement('div');
document.body.appendChild($root);

const oldNode = render(oldState);
if (oldNode) {
  $root.appendChild(oldNode);
}

setTimeout(() => {
  const newNode = render(newState);
  if (oldNode && newNode) {
    updateElement($root, oldNode, newNode);
  }
}, 1000);
