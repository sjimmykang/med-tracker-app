// Modules
import { Routes, Route } from 'react-router-dom'
// Components
import AllView from './Components/AllView';
import Medicine from './Components/Medicine';
// Assets
import './App.css';

function App() {
    




    return (
        <div className="App">
            <header>
                <h1>Med Tracker</h1>
                <p>Save your energy, let this track for you</p>
                <p>one daily tracking per med. if multiple times a day, create multiple med to track (eg: VitC-Morning, VitC-Evening)</p>
            </header>

            <Routes>
                <Route path='/' element={ 
                    <AllView />
                } />
                <Route path='/medicine/:medkey' element={<Medicine />}>
                    
                </Route>
            </Routes>
        </div>
    );
}

export default App;
