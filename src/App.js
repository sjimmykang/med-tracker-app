// Modules
import firebase from './firebase';
import { getDatabase, push, remove, ref, onValue } from 'firebase/database';
import { useState, useEffect } from 'react';
// Components
// Assets
import './App.css';

function App() {
    // create medicine state that will store our data
    const [meds, setMeds] = useState([]);
    // create user input value to track
    const [userInput, setUserInput] = useState('');

    const handleInputChange = e => {
        setUserInput(e.target.value);
    }

    const handleSubmit = e => {
        e.preventDefault();
        // to prevent empty medicine name
        if (userInput) {
            const database = getDatabase(firebase);
            const dbRef = ref(database);
            // send user's input to firebase
            push(dbRef, userInput);
        } else {
            // likely edit this to be more of small error message in the form area rather than alert
            alert('please enter a name for your medicine');
        }
        setUserInput('');
    }

    useEffect( () => {
        // variable to hold our database detail
        const database = getDatabase(firebase);
        // variable to hold reference to our database
        const dbRef = ref(database);
        // gt db info on page load and on change
        onValue(dbRef, response => {
            // use Firebase's .val() to parse our db into format we want
            const data = response.val();
            const newState = [];
            // for in loop to push key value to later modify or delete the med
            for (const key in data) {
                newState.push(
                    { key: key, name: data[key], date: [] }
                )
            }
            // set state to match the medicine array
            setMeds(newState);
        })
    }, []);

    return (
        <div className="App">
            <h1>Med-Tracker</h1>

            <form>
                <label htmlFor='medicine'>Add a new medicine to track</label>
                <input
                    onChange={handleInputChange}
                    type='text'
                    id='medicine'
                    value={userInput}
                />
                <button onClick={handleSubmit}>Add a Med!</button>
            </form>

            <ul>
                {meds.map( med => {
                    return (
                        <li key={med.key}>
                            <p>{med.name}</p>
                        </li>
                    )
                })}
            </ul>
        </div>
    );
}

export default App;
