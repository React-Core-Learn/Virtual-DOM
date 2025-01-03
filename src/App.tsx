import { useState } from './lib/render';

export default function App() {
  const [count, setCount] = useState(1);
  const handleIncrease = () => {
    setCount(count + 1);
  };

  return (
    <div>
      <p>{count}</p>
      <button onClick={handleIncrease}>+1</button>
    </div>
  );
}
