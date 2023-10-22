import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from '../components/HeaderComponent/HeaderComponent';
import CreateScheduleComponent from '../components/CreateScheduleComponent/CreateScheduleComponent';
import CreateStationComponent from '../components/CreateStationComponent/CreateStationComponent';
import CreateTrainComponent from '../components/CreateTrainCompoent/CreateTrainComponent';
import CreateTrainPage from '../pages/CreateTrain';
import ScheduleSearcher from '../components/ScheduleSearcherComponent/ScheduleSearcherComponent';
import AllUsers from '../pages/AllUsers';
import User from '../pages/User';
import { Home } from '@mui/icons-material';
import About from '../pages/About';


const AppRouter = () => {
    return (
        <Router>
            <Header/>
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
                    element={<ScheduleSearcher/>}
                />
                <Route 
                    path="/create-train"
                    element={<CreateTrainPage/>}
                />
                <Route 
                    path="/create-station"
                    element={<CreateStationComponent/>}
                />
                <Route 
                    path="/create-schedule"
                    element={<CreateScheduleComponent/>}
                />
            </Routes>
        </Router>
    );
  };
  
  export default AppRouter;