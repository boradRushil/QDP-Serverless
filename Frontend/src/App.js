import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Home from './pages/Home';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import ForgotPassword from './pages/ForgotPassword';
import LoginVerify from './pages/LoginVerify';
import VerifyEmail from './pages/VerifyEmail';
import SecurityQuestions from './pages/SecurityQuestions';
import DummyBot from './pages/DummyBot';
import Dashboard from './pages/Dashboard';
import Service1 from './components/services/Service1';
import Service2 from './components/services/Service2';
import Service3 from './components/services/Service3';
import { Auth } from './context/authContext';

function App() {
    return (
        <Auth>
            <Router>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<SignUp />} />
                    <Route path="/forgot-password" element={<ForgotPassword />} />
                    <Route path="/loginverify" element={<LoginVerify />} />
                    <Route path="/verifyemail" element={<VerifyEmail />} />
                    <Route path="/securityquestions" element={<SecurityQuestions />} />
                    <Route path="/dummybot" element={<DummyBot />} />
                    <Route path="/dashboard" element={<Dashboard />}>
                        <Route
                            path="service1"
                            element={<Service1 service={{ name: 'JSON to CSV Converter' }} />}
                        />
                        <Route
                            path="service2"
                            element={<Service2 service={{ name: 'Named Entity Extractor' }} />}
                        />
                        <Route
                            path="service3"
                            element={<Service3 service={{ name: 'Word Cloud Generator' }} />}
                        />
                    </Route>
                </Routes>
                <Toaster />
            </Router>
        </Auth>
    );
}

export default App;
