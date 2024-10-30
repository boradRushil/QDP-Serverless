import logo from './logo.svg';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import {Toaster} from 'react-hot-toast';
import './App.css';
import Home from './pages/Home';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import LoginVerify from './pages/LoginVerify';
import VerifyEmail from './pages/VerifyEmail';
import SecurityQuestions from './pages/SecurityQuestions';
import { Auth } from './context/authContext';


function App() {
  return (
    <Auth>
   <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/loginverify" element={<LoginVerify />} />
        <Route path="/verifyemail" element={<VerifyEmail />} />
        <Route path="/securityquestions" element={<SecurityQuestions />} />
      </Routes>
      <Toaster />
    </Router>
    </Auth>
  );
}

export default App;
