import { createElement } from '@/lib/jsx/jsx-runtime';
import App from './App';

const app = document.getElementById('app')!;

app.appendChild(createElement(<App count={3} />)!);
console.log(<App count={3} />);
