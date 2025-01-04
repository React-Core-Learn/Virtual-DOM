import { useState } from './lib/render';

function Wrapper() {
  return (
    <>
      <p>HelloWorld</p>
    </>
  );
}

export default function App() {
  const [count, setCount] = useState(1);
  const handleIncrease = () => {
    setCount(count + 1);
  };

  // return (
  //   <div>
  //     <p>{count}</p>
  //     <button onClick={handleIncrease}>+1</button>
  //   </div>
  // );

  return (
    <>
      <p>{count}</p>
      <button onClick={handleIncrease}>+1</button>
      <Wrapper />
    </>
  );
}
