import './App.css';
import { useState } from "react"
import axios from 'axios';





function App() {

  const instruction = "Rewrite the following question so thats it uses topics, characters and objects relevant to" 

  const [name, setName] = useState("");

  const handleNameChange = (event) => {
    const value = event.target.value;
    setName(value);
  };
  
  const [age, setAge] = useState("");

  const handleAgeChange = (event) => {
    const value = event.target.value;
    setAge(value);
  };
  
  const [interest, setInterest] = useState("");

  const handleInterestChange = (event) => {
    const value = event.target.value;
    setInterest(value);
  };
  
  const [question1, setQuestion1] = useState("");

  const handleQuestion1Change = (event) => {
    const value = event.target.value;
    setQuestion1(value);
  };
  
  const [question2, setQuestion2] = useState();

  const handleQuestion2Change = (event) => {
    const value = event.target.value;
    setQuestion2(value);
  };
  
  const [question3, setQuestion3] = useState();

  const handleQuestion3Change = (event) => {
    const value = event.target.value;
    setQuestion3(value);
  };

  const [result, setResult] = useState();

  const handleResultChange = (event) => {
    const value = event.target.value;
    setResult(value);
  };

  const handleClick = async () => {
    var questions = [question1, question2, question3];
    for(let i = 0; i < questions.length; i++) {
      questions[i] = encodeURIComponent(instruction + " " + interest + " " + questions[i]);
    }
    const response = await axios.get(`http://localhost:8080/api/v1/questions?q=${questions.join("&q=")}`);
    console.log(response);
    setResult(response.data.result.join("\r\n\r\n"));
  console.log(name)
  };



  return (
    <div className="App">
      <div className='logo'>
        <img height="120px" src='logo.png'/>
      </div>
      <div className='banner'>
      </div>
      <div className='page-box'>
        <div className='student-detail-container'>
          <div className='student-detail'>
            <p>Input your students details</p>
            <div className='student-form'>
              <p>Name: </p>
              <input type='text' className='name' onChange={handleNameChange} value={name}/>
            </div>
            <div className='student-form'>
              <p>Age: </p>
              <input type='text' className='age' onChange={handleAgeChange} value={age}/>
            </div>
            <div className='student-form'>
              <p>Special interest: </p>
              <input type='text' className='special-interest' onChange={handleInterestChange} value={interest}/>
            </div>
          </div>
        </div>
        <div className='question-boxes-container'>
          <div className='question-boxes'>
            <div className='question-1'>
              <p>Question 1: </p>
              <textarea className='question-box' onChange={handleQuestion1Change} value={question1}/>
            </div>
            <div className='question-2'>
              <p>Question 2: </p>
              <textarea className='question-box' onChange={handleQuestion2Change} value={question2}/>
            </div>
            <div className='question-3'>
              <p>Question 3: </p>
              <textarea className='question-box' onChange={handleQuestion3Change} value={question3}/>
            </div>
            <div className='submit-button'>
              <button onClick={handleClick}>Submit</button>
            </div>
          </div>
        </div>
        <div className='output'>
          <p>Result: </p>
          <textarea className='result' onChange={handleResultChange} value={result}/>
        </div>
      </div>
      <div className='footer-text'>
          <h1>What is DISC Drive?</h1>
          <p>DISC Drive is a powerful software tool designed to help teachers create personalised learning
            resources quickly and easily. With AI-driven insight, DISC Drive enables educators to tailor lessons
            to each student's unique interests and needs, making it simple to deliver engaging, customised educational
            experiences that support every learner's growth.
          </p>
        </div>
    </div>
  );
}

export default App;
