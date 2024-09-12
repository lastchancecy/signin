import React from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import SignIn from './SignIn';
import SignUp from './SignUp';
import Home from './home';
import Add from './create';
import AdDetails from './AdDetails';
import Profile from './profile';

const App: React.FC = () => {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<Home/>}/>
          <Route path="/signup" element={<SignUp />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/create" element={<Add />} />
          <Route path="/ads/:id" element={<AdDetails />} />
          <Route path="/profile" element={<Profile />} />

        </Routes>
      </Router>
    </div>
  );
};

export default App;
