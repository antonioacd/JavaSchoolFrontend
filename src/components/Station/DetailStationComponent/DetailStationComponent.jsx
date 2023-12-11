import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import 'react-datepicker/dist/react-datepicker.css';
import CustomizableDialog from '../../Other/CustomizableDialog/CustomizableDialog';
import { IconButton, TextField } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import stationService from '../../../services/StationService';

/**
 * Component for viewing and editing station details.
 */
function DetailStationComponent() {
  // Get the ID from the URL
  const { id } = useParams();

  const [state, setState] = useState({
    id: "",
    name: "",
    city: ""
  });

  const [isSuccessDialogOpen, setSuccessDialogOpen] = useState(false);
  const [isErrorDialogOpen, setErrorDialogOpen] = useState(false);
  const [dialogMessage, setDialogMessage] = useState('');
  const [isEditable, setIsEditable] = useState(false);
  const [savedState, setSavedState] = useState([]);

  useEffect(() => {
    // Fetch station data based on the ID
    stationService.getStationById(id)
      .then((response) => {
        if (response.status === 200) {
          const stationData = response.data;
          setState(stationData);
          setSavedState(stationData);
        } else {
          console.error("Error fetching station data.");
        }
      })
      .catch((error) => {
        console.error("Error fetching station data:", error);
      });
  }, []);

  const saveStation = (event) => {
    event.preventDefault();
    if (isEditable) {
      const error = checkState();

      if (error) {
        setDialogMessage('Error adding station. Please try again.');
        setErrorDialogOpen(true);
      } else {
        // Update station data
        stationService.updateStation(state.id, state)
          .then((response) => {
            if (response.status === 200) {
              setDialogMessage('Station updated successfully');
              setSuccessDialogOpen(true);
            } else {
              setDialogMessage('Error updating station. Please try again.');
              setErrorDialogOpen(true);
            }
          })
          .catch((error) => {
            setDialogMessage(error.message);
            setErrorDialogOpen(true);
          });
      }
    }
  };

  /**
   * Check if the state has missing or invalid fields.
   * @returns {string} - An error message if validation fails, empty string otherwise.
   */
  function checkState() {
    // Perform validation and return an error message if needed
    return "";
  }

  const changeCityHandler = (event) => {
    setState({ ...state, city: event.target.value });
  };

  const changeNameHandler = (event) => {
    setState({ ...state, name: event.target.value });
  };

  /**
   * Toggle the edit mode for the station details.
   */
  function handleEditButton() {
    setIsEditable(!isEditable);

    if (isEditable) {
      setState(savedState);
    }
  }

  return (
    <div className="full-screen">
      <div className='container-custom-big'>
        <div className="mb-4 d-flex justify-content-between align-items-center">
          <h1 className="">Station Details</h1>
          <IconButton
            className="bg-primary"
            onClick={handleEditButton}
          >
            <EditIcon className='text-white'/>
          </IconButton>
        </div>

        <div className="row mt-4">
          <div className='col'>
            <TextField
              label="Id"
              variant="outlined"
              value={state.id}
              disabled={true}
            />
          </div>
          <div className='col'>
            <TextField
              label="Station Name"
              variant="outlined"
              value={state.name}
              disabled={!isEditable}
              onChange={changeNameHandler}
            />
          </div>
          <div className='col'>
            <TextField
              label="Station City"
              variant="outlined"
              value={state.city}
              disabled={!isEditable}
              onChange={changeCityHandler}
            />
          </div>
        </div>

        <div className="row mt-4 justify-content-between">
          {isEditable ? (
            <button type="button" className="btn btn-primary" onClick={saveStation}>
              Save station
            </button>
          ) : null}
        </div>

        <CustomizableDialog
          type='success'
          open={isSuccessDialogOpen}
          title="Success"
          content={dialogMessage}
          agreeButtonLabel="OK"
          showCancelButton={false}
          onAgree={() => {
            setSuccessDialogOpen(false);
            window.location.reload();
          }}
        />
        <CustomizableDialog
          type='error'
          open={isErrorDialogOpen}
          title="Error"
          content={dialogMessage}
          agreeButtonLabel="OK"
          showCancelButton={false}
          onAgree={() => setErrorDialogOpen(false)}
        />
      </div>
    </div>
  );
}

export default DetailStationComponent;
