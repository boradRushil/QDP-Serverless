import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { getQuestions, postUser, postAnswers } from '../apis/AuthApis';
import { toast } from 'react-toastify';

const SecurityQuestionsComponent = (data) => {
  const navigate = useNavigate();
  const email = data.email;
  const name = data.name;
  
  const [questions, setQuestions] = useState([]);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [answer, setAnswer] = useState('');
  const [message, setMessage] = useState(null);

  useEffect(() => {
    console.log(selectedQuestion);
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      const response = await getQuestions();
      console.log('Security questions:', response.data.body);
      setQuestions(response.data.body);
    } catch (error) {
      console.error('Failed to fetch security questions:', error);
      setMessage('Failed to fetch security questions. Please try again.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log(email, selectedQuestion);
      const ansData = await postAnswers({
        email: email,
        ans: answer 
      });

      console.log('Security answer submitted:', ansData);
      console.log("-------------------", email, selectedQuestion, name);
      const data = await postUser({
        email: email,
        queId: selectedQuestion,
        name: name,
        role: "user"
      });

      console.log('Security answer submitted:', data);
      
      navigate('/');
      toast.success('Security answer submitted successfully');
    } catch (error) {
      console.error('Failed to submit security answer:', error);
      setMessage('Failed to submit security answer. Please try again.');
    }
  };

  return (
    <div>
      <h2>Choose Security Question</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor="question">Security Question</label>
        <select
          id="question"
          value={selectedQuestion || ''}
          onChange={(e) => setSelectedQuestion(parseInt(e.target.value))}
          required
        >
          <option value="">Select a question</option>
          {questions.map((q, idx) => (
            <option key={idx} value={q.id}>{q.question}</option>
          ))}
        </select>

        <input
          type="text"
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          placeholder="Your answer"
          required
        />

        {message && <p>{message}</p>}

        <button type="submit">Submit Answer</button>
      </form>
    </div>
  );
};

export default SecurityQuestionsComponent;
