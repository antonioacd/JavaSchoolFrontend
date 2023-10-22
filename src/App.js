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
import HeaderComponent from "./components/HeaderComponent/HeaderComponent"
import AppRoutes from "./routes/AppRouter";
import AppRouter from "./routes/AppRouter";

function App(){
    return (
        <div>
            <AppRouter></AppRouter>
        </div>
    );
}

export default App;