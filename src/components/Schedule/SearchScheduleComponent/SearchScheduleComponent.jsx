import React, { Component } from 'react';
import ScheduleSearcherItem from './SearchItemScheduleComponent/SearchItemScheduleComponent';
import ScheduleService from '../../../services/ScheduleService';
import AutocompleteComponent from '../../Other/AutocompleteComponent/AutocompleteComponent';
import './SearchScheduleComponent.css';

class SearchScheduleComponent extends Component {
  constructor(props) {
    super(props);
    // Initialize the component's state with default values.
    this.state = {
      schedules: [],
      search: {
        departureCity: '',
        arrivalCity: '',
        selectedDate: '',
      },
      departureCities: [],
      arrivalCities: [],
    };
  }

  componentDidMount() {
    // Fetch schedules data and populate the departureCities state.
    ScheduleService.getSchedules().then((res) => {
      const schedules = res.data;
      const departureCitiesSet = new Set();

      schedules.forEach((schedule) => {
        departureCitiesSet.add(schedule.departureStation.city);
      });

      const departureCities = [...departureCitiesSet];

      this.setState({ departureCities: departureCities });
    });
  }

  // Update the departureCity in the search state when input changes.
  changeDepartureCityHandler = (input) => {
    this.setState({ search: { ...this.state.search, departureCity: input } });

    // Fetch schedules and populate the arrivalCities state based on the selected departureCity.
    ScheduleService.getSchedules().then((res) => {
      const schedules = res.data;
      const arrivalCitiesSet = new Set();

      schedules.forEach((schedule) => {
        if (this.state.search.departureCity === schedule.departureStation.city) {
          arrivalCitiesSet.add(schedule.arrivalStation.city);
        }
      });

      const arrivalCities = [...arrivalCitiesSet];

      this.setState({ arrivalCities: arrivalCities });
    });
  }

  // Update the arrivalCity in the search state when input changes.
  changeArrivalCityHandler = (input) => {
    this.setState({ search: { ...this.state.search, arrivalCity: input } });
  }

  // Update the selectedDate in the search state when the date input changes.
  changeDate = (event) => {
    this.setState({ search: { ...this.state.search, selectedDate: event.target.value } });
  }

  // Perform a search based on user input and update the schedules state.
  handleSearch = () => {
    ScheduleService.getSchedules().then((res) => {
      const schedulesData = res.data;

      const correctSchedules = schedulesData.filter((schedule) =>
        schedule.departureStation.city === this.state.search.departureCity &&
        schedule.arrivalStation.city === this.state.search.arrivalCity &&
        schedule.departureTime.substring(0, 10) === this.state.search.selectedDate
      );

      this.setState({ schedules: correctSchedules });
    });
  }

  // Handle the selection of a suggestion and update the departureCity in the search state.
  suggestionSelectedHandler = (suggestion) => {
    this.setState({ search: { ...this.state.search, departureCity: suggestion } });
  }

  render() {
    return (
      <div>
        <div className="row my-3 justify-content-center">
          <div className="col-md-12 schedule-search-form form-inline d-flex justify-content-between search-content">
            <div className="form-group">
              <label>Departure City</label>
              {/* Render AutocompleteComponent for departure cities. */}
              <AutocompleteComponent
                cities={this.state.departureCities}
                onInputChange={this.changeDepartureCityHandler}
              />
            </div>
            <div className="form-group">
              <label>Arrival City</label>
              {/* Render AutocompleteComponent for arrival cities. */}
              <AutocompleteComponent
                cities={this.state.arrivalCities}
                onInputChange={this.changeArrivalCityHandler}
              />
            </div>
            <div className="form-group">
              <label>Select Date</label>
              {/* Render the date input and handle its change. */}
              <input
                type="date"
                className="form-control"
                name="selectedDate"
                value={this.state.search.selectedDate}
                onChange={this.changeDate}
              />
            </div>
            <div className="form-group mt-4">
              {/* Button to trigger the search. */}
              <button
                type="button"
                className="search-button px-4 btn btn-primary"
                onClick={this.handleSearch}
              >
                Search
              </button>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-md-12">
            {/* Render the schedules based on the search results. */}
            {this.state.schedules.map((schedule) => (
              <ScheduleSearcherItem key={schedule.id} schedule={schedule} />
            ))}
          </div>
        </div>
      </div>
    );
  }
}

export default SearchScheduleComponent;
