import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import About from "./pages/About";
import User from "./pages/User";
import AllUsers from "./pages/AllUsers";
import "./App.css";
import ScheduleSearcherPage from "./pages/ScheduleSearcherPage";
import CreateTrainPage from "./pages/CreateTrain";
import CreateStationPage from "./pages/CreateStation";
import CreateSchedulePage from "./pages/CreateSchedule";

function App(){
    return (
        <div className="App">
            <Router>
                <Routes>
                    <Route 
                        path="/"
                        element={<Home/>}
                    />
                    <Route 
                        path="/about"
                        element={<About/>}
                    />
                    <Route 
                        path="/user"
                        element={<User/>}
                    />
                    <Route 
                        path="/users"
                        element={<AllUsers/>}
                    />
                    <Route 
                        path="/searcher"
                        element={<ScheduleSearcherPage/>}
                    />
                    <Route 
                        path="/create-train"
                        element={<CreateTrainPage/>}
                    />
                    <Route 
                        path="/create-station"
                        element={<CreateStationPage/>}
                    />
                    <Route 
                        path="/create-schedule"
                        element={<CreateSchedulePage/>}
                    />
                </Routes>
            </Router>
        </div>
    );
}

export default App;