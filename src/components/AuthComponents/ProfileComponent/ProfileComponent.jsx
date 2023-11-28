import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import TicketItemComponent from "./TicketItemComponent/TicketItemComponent";
import userService from "../../../services/UserService";
import ticketService from "../../../services/TicketService";
import LogoutIcon from '@mui/icons-material/Logout';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';

const UserProfile = () => {
  const [user, setUser] = useState({
    id: '',
    name: '',
    surname: '',
    email: '',
    password: '',
    rol: { id: 1 },
  });

  const [tickets, setTickets] = useState([]);

  useEffect(() => {
    getUser();
  }, []);

  useEffect(() => {
    getTickets();
  }, [user]);

  const handleSignOut = () => {
    localStorage.removeItem("accessToken");
    window.location.reload();
  }

  function getUser() {
    userService.getUserByEmail(localStorage.getItem('email'))
      .then((response) => {
        if (response.status === 200) {
          const userData = response.data;
          setUser(userData);
        } else {
          console.error("Error fetching user data.");
        }
      })
      .catch((error) => {
        console.error("Error fetching user data:", error);
      });
  }

  function getTickets() {
    ticketService.getTicketsByUser(user.id)
      .then((response) => {
        if (response.status === 200) {
          const ticketsData = response.data;
          setTickets(ticketsData);
        } else {
          console.error("Error fetching user data.");
        }
      })
      .catch((error) => {
        console.error("Error fetching user data:", error);
      });
  }

  return (
    <div className="full-screen">
      <div className="container-custom-big">
        <div className="text-center row">
          <div className="col">
            <h1>Hi, {user.name} {user.surname} !!</h1>
          </div>
          <div className="col-auto d-flex justify-content-between align-items-center">
            <button
              className="btn btn-danger"
              onClick={handleSignOut}
            >
              <LogoutIcon />
              <span className="d-none d-sm-inline">Log Out</span>
            </button>
          </div>
          {tickets.length > 0 ? (
            <div className="row mt-4">
              <h4>These are your next travels.</h4>
              {tickets.map((ticket, index) => (
                <TicketItemComponent key={index} ticket={ticket} />
              ))}
            </div>
          ) : (
            <div>
              <h4>There are no schedule trips yet.</h4>
              <Link to="/schedule/search" className="btn btn-primary">
                Search for Trips
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
