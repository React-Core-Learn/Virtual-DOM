type Props = Record<string, any> | null;
type Children = (string | VNode)[];

interface VNode {
  type: keyof HTMLElementTagNameMap;
  props: Props;
  children: Children;
}

function h(type: keyof HTMLElementTagNameMap, props: Props, ...children: Children): VNode {
  return { type, props, children };
}

console.log(
  h(
    'div',
    { id: 'app' },
    h(
      'ul',
      null,
      h(
        'li',
        null,
        h('input', { type: 'checkbox', className: 'toggle' }),
        'todo list item 1',
        h('button', { className: 'remove' }, '삭제'),
        'Hello World',
      ),
      h(
        'li',
        { className: 'completed' },
        h('input', { type: 'checkbox', className: 'toggle', checked: true }),
        'todo list item 2',
        h('button', { className: 'remove' }, '삭제'),
      ),
    ),
    h('form', h('input', { type: 'text' }), h('button', { type: 'submit' }, '추가')),
  ),
);
