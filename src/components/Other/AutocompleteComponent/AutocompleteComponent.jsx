import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

// AutocompleteComponent is a React component for handling autocomplete functionality.
class AutocompleteComponent extends Component {
  constructor() {
    super();
    // Initialize the component's state with userInput and suggestions.
    this.state = {
      userInput: '',
      suggestions: [],
    };
  }

  // handleInputChange is called when the user types into the input field.
  handleInputChange = (e) => {
    const userInput = e.currentTarget.value;
    // Filter cities based on the user's input.
    const suggestions = this.props.cities.filter(
      (city) => city.toLowerCase().indexOf(userInput.toLowerCase()) > -1
    );

    this.setState({
      userInput,
      suggestions,
    });

    // Call the parent component's onInputChange function, if provided.
    if (this.props.onInputChange) {
      this.props.onInputChange(userInput);
    }
  }

  // handleFieldChange is called when the input field loses focus (onBlur).
  handleFieldChange = () => {
    this.setState({
      suggestions: [],
    });
  }

  // handleSuggestionClick is called when a suggestion from the list is clicked.
  handleSuggestionClick = (suggestion) => {
    this.setState({
      userInput: suggestion,
      suggestions: [],
    });

    // Call the parent component's onSuggestionSelected function, if provided.
    if (this.props.onSuggestionSelected) {
      this.props.onSuggestionSelected(suggestion);
    }
  }

  render() {
    const { userInput, suggestions } = this.state;

    return (
      <div>
        <input
          type="text"
          value={userInput}
          onChange={this.handleInputChange}
          onBlur={this.handleFieldChange}
          className="form-control"
        />
        {userInput && suggestions.length > 0 && (
          <ul className="list-group">
            {suggestions.map((city, index) => (
              <li
                key={index}
                className="list-group-item"
                onClick={() => this.handleSuggestionClick(city)}
                style={{ cursor: 'pointer' }}
              >
                {city}
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  }
}

export default AutocompleteComponent;
