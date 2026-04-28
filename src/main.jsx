import { createRoot } from 'react-dom/client';
import App from './App.jsx';

// StrictMode removed — it double-invokes effects in dev which breaks
// the Loader's one-shot boot sequence timer
createRoot(document.getElementById('root')).render(<App />);
