import { Routes, Route } from 'react-router-dom';

// Components
import Header from './components/header/Header';

// Pages
import Home from './pages/home/Home'; 

export default function App() {
  return (
    <>
      <Header />

      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </>
  );
}