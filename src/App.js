import logo from './logo.svg';
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

            <footer>
                <p>created in 2023 by Jimmy Kang</p>
            </footer>
        </div>
    );
}

export default App;
