// Modules
import { Routes, Route } from 'react-router-dom'
// Components
import AllView from './Components/AllView';
import Medicine from './Components/Medicine';
import ErrorPage from './Components/ErrorPage';
// Assets
import './App.css';

function App() {
    
    return (
        <div className="wrapper">

            <Routes>
                <Route path='/' element={ 
                    <>
                        <header>
                            <h1>Med Tracker</h1>
                            <p>Save your energy, let this track for you</p>
                            <p>one daily tracking per med. if multiple times a day, create multiple med to track (eg: VitC-Morning, VitC-Evening)</p>
                        </header>
                        <AllView /> 
                    </>
                } />
                <Route path='/medicine/:medKey' element={ <Medicine />} />
                <Route path='*' element={ <ErrorPage />} />
                    
            </Routes>
        </div>
    );
}

export default App;
