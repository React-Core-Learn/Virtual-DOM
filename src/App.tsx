export function Custom({ className }: { className: string }) {
  return (
    <div className={className}>
      <b>Custom</b>
    </div>
  );
}

export default function App({ count }: { count: number }) {
  return (
    <div>
      <Custom className="active" />
      <span>Hello World {count}</span>
    </div>
  );
}
