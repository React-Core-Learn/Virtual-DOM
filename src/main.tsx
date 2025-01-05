type Props = { [key: string]: any };

interface VirtualNode {
  type: string;
  props: Props;
  children: VirtualNode[];
}

function h(type: string, props: Props | null, ...children: any[]) {
  if (children.length === 0) {
    return {
      type,
      props,
      children: [],
    };
  }

  const flatChildren = children.flat().filter((child) => child != null);

  return {
    type,
    props: props || {},
    children: flatChildren,
  };
}

function createElement(node: VirtualNode): Node {
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

const state = [
  { id: 1, completed: false, content: 'todo list item 1' },
  { id: 2, completed: true, content: 'todo list item 2' },
];

const realDom = createElement(
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
  </div>,
);

document.body.appendChild(realDom);
