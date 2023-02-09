import { useState, useEffect } from 'react';
import firebase from '../firebase';
import { getDatabase, push, ref, onValue, update, remove } from 'firebase/database';
import { Link } from 'react-router-dom';

const AllView = () => {
    const handleSubmit = e => {
        e.preventDefault();
        // to prevent empty medicine name
        if (userInput) {
            const database = getDatabase(firebase);
            const dbRef = ref(database);
            // send user's input to firebase
            const medObj = {
                name: userInput
            };
            push(dbRef, medObj);
        } else {
            // likely edit this to be more of small error message in the form area rather than alert
            alert('please enter a name for your medicine');
        }
        setUserInput('');
    }
    
    const handleInputChange = e => {
        setUserInput(e.target.value);
    }

    const handleTaken = med => {
        const database = getDatabase(firebase);
        const dbRef = ref(database, `${med.key}`);
        const todayFull = new Date();
        /* split today's time into string then only grab hr, min, am/pm that i need */
        const todayShort = todayFull.toDateString();
        const todayTimeArr = todayFull.toLocaleTimeString().split(':');
        const todayTimeLastIndex = todayTimeArr[2];
        const todayTime = `${todayTimeArr[0]}:${todayTimeArr[1]} ${todayTimeLastIndex[todayTimeLastIndex.length-2]}${todayTimeLastIndex[todayTimeLastIndex.length-1]}`
        console.log(todayTime)
        const updates = {};
        updates.datesFull = [...med.datesFull];
        updates.datesFull.unshift(todayFull);
        updates.datesShort = [...med.datesShort];
        updates.datesShort.unshift(todayShort);
        updates.datesTime = [...med.datesTime];
        updates.datesTime.unshift(todayTime);

        update(dbRef, updates).then(() => {
            console.log("Data updated");
        }).catch((e) => {
            console.log(e);
        })
    }

    const handleRemoveMed = key => {
        const database = getDatabase(firebase);
        const dbRef = ref(database, `${key}`);
        remove(dbRef);
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
            // console.log(response);
            // console.log('res val ', response.val());
            const newState = [];
            // for in loop to push key value to later modify or delete the med
            for (const key in data) {
                /* to avoid undefined error. create empty array if datesFull array does not exist on firebase */
                
                if (data[key].datesFull === undefined) {
                    newState.push({ 
                        key: key, 
                        name: data[key].name, 
                        datesFull: [], 
                        datesShort: [],
                        datesTime: []
                    })
                } else {
                    newState.push({ 
                        key: key, 
                        name: data[key].name, 
                        datesFull: data[key].datesFull, 
                        datesShort: data[key].datesShort,
                        datesTime:  data[key].datesTime
                    })

                }
                
            }
            setMeds(newState);
        })
    }, []);

    return (
        <div className='allView'>
            <form onSubmit={handleSubmit}>
                <label htmlFor='medicine'>Add a new medicine to track</label>
                <div className='inputContainer'>
                    <input
                        onChange={handleInputChange}
                        type='text'
                        id='medicine'
                        value={userInput}
                    />
                    <button type='submit'>Add a Med!</button>
                </div>
            </form>

            <h2>Quick View</h2>
            {/* ol for the past dates to display */}
            <ol className='quickview'>
                <li className='sectionHeadings'>Dates</li>
                {
                    pastDates.map( (day, index) => {
                        /* mdn to get month and day of the week: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toDateString */
                        const dayArray = day.toDateString().split(' ');

                        return (
                            /* different class to indicate today column better */
                            
                            <li 
                                key={`pastDates-${pastDates.indexOf(day)}`}
                                className={(pastDates.indexOf(day) === (pastDates.length - 1)) ? `pastday${index} today singles` : `pastday${index} singles`}    
                            >
                                <p>{dayArray[0]}</p>
                                <p>{`${dayArray[1]} ${dayArray[2]}`}</p>
                            </li>
                        )
                    })
                }
            </ol>


            <div className='med-quickview'>
                {meds.map(med => {
                    return (
                        <ul key={`med-${med.key}`} className='quickview'>
                            <li className='sectionHeadings' key={med.key}>
                                <Link to={`/medicine/${med.key}`} >
                                    <p>{med.name}</p>
                                </Link>
                                <button onClick={() => handleRemoveMed(med.key)} className='red-text removeMedButton'>
                                    Remove Med
                                </button>
                            </li>
                            {
                                pastDates.map( (day, index) => {
                                    const thisDay = day.toDateString();
                                    let dayCheck = -1;
                                    if (med.datesShort.indexOf(thisDay) !== undefined) {
                                        dayCheck = (med.datesShort.indexOf(thisDay));
                                    }
                                    
                                    if (pastDates.indexOf(day) === (pastDates.length - 1)) {
                                        return (
                                            <li key={`med-pastDates-${pastDates.indexOf(day)}`} className={(pastDates.indexOf(day) === (pastDates.length - 1)) ? `pastday${index} today singles` : `pastday${index} singles`}>
                                                {
                                                    (dayCheck !== -1) ?
                                                        <p>{med.datesTime}</p>
                                                        :
                                                        <button onClick={() => handleTaken(med)} className='takenButton'>
                                                            <p className='sr-only'>click if taken</p>
                                                            taken?
                                                        </button>
                                                }
                                            </li>
                                        )
                                    } else {
                                        return (
                                            <li className={(pastDates.indexOf(day) === (pastDates.length - 1)) ? `pastday${index} today singles` : `pastday${index} singles`} key={`med-pastDates-${pastDates.indexOf(day)}`}>
                                                {
                                                    (dayCheck !== -1) ? 
                                                        <p>{med.datesTime}</p> :
                                                        <p></p>
                                                }
                                            </li>
                                        )
                                    }
                                })
                            }
                        </ul>
                    )
                })}
            </div>
        </div>
    )
}

export default AllView;