import React, { useContext, useEffect, useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import { useLocation, useNavigate } from 'react-router-dom';
import { getUser, checkAnswer, getOneQuestion } from '../apis/AuthApis';
import { useAuth } from '../context/authContext';
import { toast } from 'react-toastify';

const LoginVerifyComponent = () => {
    const { setRole, setStatus, authenticate } = useAuth();
    const [question, setQuestion] = useState('');
    const [userDetails, setUserDetails] = useState('');
    const [answer, setAnswer] = useState('');
    const location = useLocation();
    const email = location.state?.email || '';
    const password = location.state?.password || '';
    const navigate = useNavigate();

    useEffect(() => {
        getUserDetails();
    }, []);

    const getUserDetails = async () => { 
        try {
            console.log('Fetching user details for:', email);
            const response = await getUser(email);
            console.log('User details:', response);
            const queId = response.data.queId;
            const role = response.data.role;
            setUserDetails(role);
            const data = await getOneQuestion(queId);
            setQuestion(data.data.question);
            console.log('Question:', data);
 // Adjust according to your API response structure
        } catch (error) {
            console.error('Failed to fetch user details:', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await checkAnswer({
                email,
                ans: answer,
            });

            if (response.data.statusCode === 200) {
                await authenticate(email, password);
                setRole(userDetails);
                setStatus(true);
                navigate('/');
                toast.success('Login successful');
            } else {
                toast.error('Login failed');
            }
        } catch (error) {
            console.error("Login verification failed:", error);
            toast.error('Login failed');
        }
    };

    return (
        <div className="container">
            <h1>Login Verification</h1>
            <Form onSubmit={handleSubmit}>
                <Form.Group controlId="question">
                    <Form.Label>Question: {question}</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Answer the question"
                        value={answer}
                        onChange={(e) => setAnswer(e.target.value)}
                    />
                </Form.Group>
                <Button variant="primary" type="submit">
                    Submit
                </Button>
            </Form>
        </div>
    );
};

export default LoginVerifyComponent;
