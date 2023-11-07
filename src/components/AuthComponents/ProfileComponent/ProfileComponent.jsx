import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom"; // Importa Link de React Router

const UserProfile = () => {
  const [user, setUser] = useState({
    name: "Your Name",
    surname: "Your Last Name",
    email: "your@email.com",
    roles: { id: 1, name: "User Role" },
  });

  useEffect(() => {
    // Lógica para cargar los datos del usuario desde tu fuente de datos.
  }, []);

  return (
    <div className="full-screen">
      <div className="container-custom-big">
        <div className="text-center">
          <h1>Hi, {user.name} {user.surname} !!</h1>
          <hr />
          <h4>There are no scheduled trips yet.</h4>
          <Link to="/schedule/search" className="btn btn-primary">
            Search for Trips
          </Link>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
