import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import scheduleService from '../../../services/ScheduleService';
import SearchItemScheduleComponent from '../SearchScheduleComponent/SearchItemScheduleComponent/SearchItemScheduleComponent';
import CustomizableDialog from '../../Other/CustomizableDialog/CustomizableDialog';

/**
 * Component for searching schedules based on departure station, arrival station, and date.
 */
function TodaySchedulesComponent() {

  const [schedules, setSchedules] = useState([]);
  const [isErrorDialogOpen, setErrorDialogOpen] = useState(false);
  const [dialogMessage, setDialogMessage] = useState('No schedules were found for the selected criteria.');

  const navigate = useNavigate();

  useEffect(() => {
    searchSchedules();
  }, []);

  /**
   * Search for schedules based on the selected criteria (departure station, arrival station, and date).
   */
  const searchSchedules = () => {
    const today = dayjs();

    scheduleService
      .getSchedulesByCitiesAndDate(null, null, today)
      .then((res) => {
        const filteredSchedules = res.data;
        setSchedules(filteredSchedules);
      })
      .catch((error) => {
        setDialogMessage('Network error');
        setErrorDialogOpen(true);
      });
  };

  return (
    <div className='page-container'>
      <div className="full-screen-searcher">
        <div className='row container-custom-big'>
          <div className='row mt-4'>
            {schedules.length === 0 ? (
              <p>No trains available for today.</p>
            ) : (
              schedules.map((schedule, index) => (
                <SearchItemScheduleComponent key={index} schedule={schedule} />
              ))
            )}
          </div>
        </div>
      </div>

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
  );
}

export default TodaySchedulesComponent;
