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
import ViewStationsPage from '../pages/Station/ViewStationsPage';
import LoginPage from '../pages/LoginPage';
import ProtectedRoute from './ProtectedRoute';


const AppRouter = () => {
    return (
        <Router>
            <Header/>
            <div style={{marginTop: '70px'}}>
                <Routes>
                    {/* Login */}

                    <Route 
                        path="/login"
                        element={<LoginPage/>}
                    />
                    
                    {/* Home */}
                    <Route element={<ProtectedRoute/>}>
                    <Route 
                        path="/"
                        element={<HomePage/>}
                    />
                    </Route>

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
                    <Route 
                        path="/station/view"
                        element={<ViewStationsPage/>}
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