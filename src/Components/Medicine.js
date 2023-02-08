import { useParams, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import firebase from '../firebase';
import { getDatabase, get, ref, update } from 'firebase/database';

const Medicine = () => {
    const { medKey } = useParams();
    const [med, setMed] = useState({});
    const { name, datesShort } = med;
    
    /* info to use firebase get function from: https://stackoverflow.com/questions/71244451/angular-returning-a-value-from-onvalue-in-firebase-realtime-database */
    const getOneMed = async () => {
        const database = getDatabase(firebase);
        const oneMed = await get(ref(database, `${medKey}`));
        setMed(oneMed.val());
    }

    const handleRemoveDate = index => {
        const database = getDatabase(firebase);
        const dbRef = ref(database, `${medKey}`);
        const updates = {};
        updates.datesFull = [...med.datesFull];
        updates.datesFull.splice(index, 1);
        updates.datesShort = [...med.datesShort];
        updates.datesShort.splice(index, 1);
        updates.datesTime = [...med.datesTime];
        updates.datesTime.splice(index, 1);

        update(dbRef, updates).then(() => {
            console.log("Data updated");
        }).catch((e) => {
            console.log(e);
        })

        getOneMed();
    }

    useEffect( () => {
        const getMedDetail = async () => {
            const database = getDatabase(firebase);
            const oneMed = await get(ref(database, `${medKey}`));
            // console.log(oneMed);
            setMed(oneMed.val());
        }
        getMedDetail();
    }, [medKey]);

    if (datesShort) {        
            return (
                <div>
                    <h2>{name}</h2>
                    <h3>Dates medicine was taken</h3>
                    <ul>
                        {
                            datesShort.map((day, index) => {
                                return(
                                <li key={`${day}-${index}`}>
                                    <p>{day} {med.datesTime}</p>
                                    <button onClick={() => handleRemoveDate(index)}>Remove this date</button>
                                </li>
                                )
                            })
                        }
                    </ul>
        
                    <Link to='/'>
                        <h2>BACK</h2>
                    </Link>
                </div>
        
            )
    } else {
        return (
            <div>
                <h2>{name}</h2>
                <h3>Dates medicine was taken</h3>
                <h4>No Dates Found</h4>
                
                <Link to='/'>
                    <h2>BACK</h2>
                </Link>
            </div>
        )
    }
}

export default Medicine;