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
        // console.log(med);
        const database = getDatabase(firebase);
        const dbRef = ref(database, `${med.key}`);
        const todayFull = new Date();
        // console.log(todayFull)
        const todayShort = todayFull.toDateString();

        // const full = med.datesFull.unshift(todayFull);
        // const short = med.datesShort.unshift(todayShort);
        const updates = {};
        updates.datesFull = [...med.datesFull];
        updates.datesFull.unshift(todayFull);
        updates.datesShort = [...med.datesShort];
        updates.datesShort.unshift(todayShort);
        // console.log(updates.datesFull);
        // console.log(updates.datesShort);
        // console.log(med)

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
                        datesFull: [], datesShort: [] 
                    })
                } else {
                    newState.push({ 
                        key: key, 
                        name: data[key].name, 
                        datesFull: data[key].datesFull, 
                        datesShort: data[key].datesShort 
                    })

                }
                
            }
            // set state to match the medicine array
            // console.log('newState ', newState)
            // console.log(newState);
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
                <button type='submit'>Add a Med!</button>
            </form>

            <h2>Quick View</h2>
            <ol className='quickview'>
                <li className='quickview'>Dates</li>
                {
                    pastDates.map( day => {
                        /* mdn to get month and day of the week: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toDateString */
                        const dayArray = day.toDateString().split(' ');
                        const dayString = `${dayArray[0]} ${dayArray[1]} ${dayArray[2]}`
                        // console.log('full ',day)
                        // console.log('short ', day.toDateString())

                        return (
                            /* different class to indicate today column better */
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


            <div className='med-quickview'>
                {meds.map(med => {
                    return (
                        <ul key={`med-${med.key}`} className='quickview'>
                            <li key={med.key}>
                                <Link to={`/medicine/${med.key}`} handleTaken={handleTaken} med={med} >
                                    <p>{med.name}</p>
                                </Link>
                                <button onClick={() => handleRemoveMed(med.key)} className='red-text'>
                                    Remove Med
                                </button>
                            </li>
                            {
                                pastDates.map( day => {
                                    const thisDay = day.toDateString();
                                    // console.log(med)
                                    let dayCheck = -1;
                                    // console.log(med)
                                    if (med.datesShort.indexOf(thisDay) !== undefined) {
                                        dayCheck = (med.datesShort.indexOf(thisDay));
                                    }
                                    // console.log(dayCheck !== -1);
                                    // console.log('full: ',med.datesFull)
                                    // console.log('short- ', med.datesShort)
                                    // console.log(med.datesFull[dayCheck])
                                    
                                    if (pastDates.indexOf(day) === (pastDates.length - 1)) {
                                        return (
                                            <li key={`med-pastDates-${pastDates.indexOf(day)}`} className={(pastDates.indexOf(day) === (pastDates.length - 1)) ? 'today' : null}>
                                                {/* {
                                                   
                                                        <button onClick={() => handleTaken(med)}>
                                                            <p className='sr-only'>click if taken</p>
                                                            taken?
                                                        </button>
                                                } */}
                                                {
                                                    (dayCheck !== -1) ?
                                                        <p>yeah</p>
                                                        :
                                                        <button onClick={() => handleTaken(med)}>
                                                            <p className='sr-only'>click if taken</p>
                                                            taken?
                                                        </button>
                                                }
                                            </li>
                                        )
                                    } else {
                                        return (
                                            <li key={`med-pastDates-${pastDates.indexOf(day)}`}>
                                                {
                                                    (dayCheck !== -1) ? 
                                                        <p>yes</p> :
                                                        <p>nada</p>
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