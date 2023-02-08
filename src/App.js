// Modules
import firebase from './firebase';
import { getDatabase, push, remove, ref, onValue } from 'firebase/database';
import { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom'
// Components
import Form from './Components/Form';
// Assets
import './App.css';

function App() {
    




    return (
        <div className="App">
            <header>
                <h1>Med Tracker</h1>
                <p>Save your energy, let this track for you</p>
            </header>

            <Routes>
                <Route path='/' element={ 
                    <Form />
                } />
            </Routes>
        </div>
    );
}

export default App;
