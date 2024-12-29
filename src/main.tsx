function h(type, props, ...children) {
  if (children.length === 0) {
    return { type, props, children: [] };
  }

  const flatChildren = children.flat().filter((child) => child != null);

  return {
    type,
    props: props || {},
    children: flatChildren,
  };
}

function createElement(node) {
  if (typeof node === 'string' || typeof node === 'number') {
    return document.createTextNode(node);
  }

  if (!node) {
    return document.createTextNode('');
  }

  const element = document.createElement(node.type);

  if (node.props) {
    Object.entries(node.props).forEach(([name, value]) => {
      if (name === 'className') {
        element.setAttribute('class', value);
      } else if (name.startsWith('on')) {
        element.addEventListener(name.toLowerCase().slice(2), value);
      } else if (typeof value === 'boolean' && value) {
        element.setAttribute(name, '');
      } else {
        element.setAttribute(name, value);
      }
    });
  }

  node.children.forEach((child) => {
    element.appendChild(createElement(child));
  });

  return element;
}

const virtualNode = <div id="app">Hello World</div>;
const realNode = createElement(virtualNode);
document.body.appendChild(realNode);

const app = createElement(
  <div id="app">
    <ul>
      <li>
        <input type="checkbox" className="toggle" />
        todo list item 1<button className="remove">삭제</button>
      </li>
      <li className="completed">
        <input type="checkbox" className="toggle" checked />
        todo list item 2<button className="remove">삭제</button>
      </li>
    </ul>
    <form>
      <input type="text" />
      <button type="submit">추가</button>
    </form>
  </div>,
);

document.body.appendChild(app);
