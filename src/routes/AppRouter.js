import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from '../components/Other/HeaderComponent/HeaderComponent';
import CreateTrainPage from '../pages/Train/CreateTrainPage';
import CreateSchedulePage from '../pages/Schedule/CreateSchedulePage';
import CreateStationPage from '../pages/Station/CreateStationPage';
import SearchSchedulePage from '../pages/Schedule/SearchSchedulePage';
import CreateUserPage from '../pages/User/CreateUserPage';
import ViewUsersPage from '../pages/User/ViewUsersPage';
import HomePage from '../pages/HomePage';
import ViewTrainsPage from '../pages/Train/ViewTrainsPage';
import ViewSchedulesPage from '../pages/Schedule/ViewSchedulesPage';


const AppRouter = () => {
    return (
        <Router>
            <Header/>
            <div style={{marginTop: '70px'}}>
                <Routes>
                     {/* Home */}

                    <Route 
                        path="/"
                        element={<HomePage/>}
                    />

                    {/* User */}

                    <Route 
                        path="/user/view"
                        element={<ViewUsersPage/>}
                    />
                    <Route 
                        path="/user/create"
                        element={<CreateUserPage/>}
                    />

                    {/* Station */}

                    <Route 
                        path="/station/create"
                        element={<CreateStationPage/>}
                    />

                    {/* Train */}

                    <Route 
                        path="/train/create"
                        element={<CreateTrainPage/>}
                    />
                    <Route 
                        path="/train/view"
                        element={<ViewTrainsPage/>}
                    />

                    {/* Schedule */}

                    <Route 
                        path="/schedule/create"
                        element={<CreateSchedulePage/>}
                    />
                    <Route 
                        path="/schedule/search"
                        element={<SearchSchedulePage/>}
                    />
                    <Route 
                        path="/schedule/view"
                        element={<ViewSchedulesPage/>}
                    />
                </Routes>
            </div>
        </Router>
    );
  };
  
  export default AppRouter;