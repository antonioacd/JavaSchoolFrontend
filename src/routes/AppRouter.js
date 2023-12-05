import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from '../components/Other/HeaderComponent/HeaderComponent';
import CreateTrainPage from '../pages/Train/CreateTrainPage';
import CreateSchedulePage from '../pages/Schedule/CreateSchedulePage';
import CreateStationPage from '../pages/Station/CreateStationPage';
import SearchSchedulePage from '../pages/Schedule/SearchSchedulePage';
import CreateUserPage from '../pages/User/CreateUserPage';
import ViewUsersPage from '../pages/User/ViewUsersPage';
import HomePage from '../pages/Home/HomePage';
import ViewTrainsPage from '../pages/Train/ViewTrainsPage';
import ViewSchedulesPage from '../pages/Schedule/ViewSchedulesPage';
import ViewStationsPage from '../pages/Station/ViewStationsPage';
import LoginPage from '../pages/LoginPage';
import ProtectedRoute from './ProtectedRoute';
import DetailSchedulePage from '../pages/Schedule/DetailSchedulePage';
import DetailTrainPage from '../pages/Train/DetailTrainPage';
import DetailStationPage from '../pages/Station/DetailStationPage';
import RegisterPage from '../pages/RegisterPage';
import ProfilePage from '../pages/ProfilePage';
import CreateTicketPage from '../pages/Ticket/CreateTicketPage';
import ViewTicketsPage from '../pages/Ticket/ViewTicketPage';
import ErrorPage from '../pages/ErrorPage';
import FooterComponent from '../components/Other/FooterComponent/FooterComponent';
import TodaySchedulesPage from '../pages/Schedule/TodaySchedulesPage';


const AppRouter = () => {
    return (
        <Router>
            <Header/>
            <FooterComponent/>
            <div style={{marginTop: '60px'}}>
                <Routes>
                    {/* Login and Register */}

                    <Route 
                        path="/register"
                        element={<RegisterPage/>}
                    />

                    <Route 
                        path="/login"
                        element={<LoginPage/>}
                    />

                    <Route 
                        path="*"
                        element={<ErrorPage/>}
                    />
                    
                    {/* Home */}

                    <Route element={<ProtectedRoute/>}>
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
                        <Route 
                            path="/profile"
                            element={<ProfilePage/>}
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
                        <Route 
                            path="/station/details/:id"
                            element={<DetailStationPage />}
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
                        <Route 
                            path="/train/details/:id"
                            element={<DetailTrainPage />}
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
                            path="/schedule/today"
                            element={<TodaySchedulesPage/>}
                        />
                        <Route 
                            path="/schedule/view"
                            element={<ViewSchedulesPage/>}
                        />
                        <Route 
                            path="/schedule/details/:id"
                            element={<DetailSchedulePage />}
                        />

                        {/* Ticket */}

                        <Route 
                            path="/ticket/buy/:scheduleId"
                            element={<CreateTicketPage/>}
                        />
                        <Route 
                            path="/ticket/view"
                            element={<ViewTicketsPage/>}
                        />

                    </Route>
                </Routes>
            </div>
        </Router>
    );
  };
  
  export default AppRouter;