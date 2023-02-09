/* Modules */
import { Routes, Route } from 'react-router-dom';
/* Components */
import AllView from './Components/AllView';
import ErrorPage from './Components/ErrorPage';
import Medicine from './Components/Medicine';
/* Assets */
import './App.css';
import {default as github } from './github.svg'

function App() {
    return (
        <div className="wrapper">
            <Routes>
                <Route path='/' element={ 
                    <>
                        <header>
                            <h1>Med Tracker</h1>
                            <p>Save your energy, let this track for you</p>
                            <p>one daily tracking per med</p>
                            <p>for multiple times a day, create multiple of the meds needed</p>
                        </header>
                        <AllView /> 
                    </>
                } />
                <Route path='/medicine/:medKey' element={ <Medicine />} />
                <Route path='*' element={ <ErrorPage />} />      
            </Routes>

            <footer>
                <p>Created at <a className='junoCollege' href='https://junocollege.com/'>Juno College</a> in 2023 by Jimmy Kang <a href='https://github.com/sjimmykang'><img src={github} alt='Link to my github profile' className='gitHubIcon' /></a></p>
            </footer>
        </div>
    );
}

export default App;
