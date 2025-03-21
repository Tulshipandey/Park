import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './Page/Home';
import Login from './Page/Login'
import Booking from './Page/Booking';

const App = () => {
  return (
    <div>

      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/book" element={<Booking />} />
      </Routes>
    </div>
    
  );
};

export default App;
