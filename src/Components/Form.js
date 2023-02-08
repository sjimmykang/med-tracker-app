import { useState, useEffect } from 'react';
import firebase from '../firebase';
import { getDatabase, push, remove, ref, onValue } from 'firebase/database';

const Form = () => {
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
    
    const handleInputChange = e => {
        setUserInput(e.target.value);
    }

    // create user input value to track
    const [userInput, setUserInput] = useState('');
    // create 5 day previous array to track past medicine record for quick view
    const [pastDates, setPastDates] = useState([]);
    // create medicine state that will store our data
    const [meds, setMeds] = useState([]);
    
    useEffect(() => {
        /* in future to add user input to allow monthly view */
        const daysToView = 5;
        const pastView = [];
        const today = new Date();
        /* for loop to create the dates for past view */
        for (let index = 0; index < daysToView; index++) {
            const day = new Date();
            day.setDate(day.getDate() - index);
            pastView.unshift(day);

        }
        // console.log(pastView);
        setPastDates(pastView);


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
        <div>
            <form onSubmit={handleSubmit}>
                <label htmlFor='medicine'>Add a new medicine to track</label>
                <input
                    onChange={handleInputChange}
                    type='text'
                    id='medicine'
                    value={userInput}
                />
                <button onClick={handleSubmit}>Add a Med!</button>
            </form>

                <h2>Quick View</h2>
                <ol>
                    <li>Dates</li>
                    {
                        pastDates.map( day => {
                            const dayArray = day.toDateString().split(' ');
                            const dayString = `${dayArray[0]} ${dayArray[1]} ${dayArray[2]}`


                            return (
                                <li 
                                    key={`pastDates-${pastDates.indexOf(day)}`}
                                    className={(pastDates.indexOf(day) === (pastDates.length - 1)) ? 'today' : null}    
                                >
                                    {dayString}
                                </li>
                            )
                        })
                    }
                </ol>
            <ul>

                {meds.map(med => {
                    return (
                        <li key={med.key}>
                            <p>{med.name}</p>
                        </li>
                    )
                })}
            </ul>
        </div>
    )
}

export default Form;