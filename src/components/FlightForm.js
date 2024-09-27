import React, { useEffect, useState } from 'react';

// Define the FlightForm component
const FlightForm = () => {
  const [formData, setFormData] = useState({
     // Initial form fields with empty values
    airline: '',               // Airline name
    from: '',                  // Departure location
    to: '',                    // Destination location
    stops_category: '',        // Category for the number of stops
    class_category: '',        // Flight class (e.g., Economy, Business)
    duration_in_min: '',       // Flight duration in minutes
    dep_date: '',              // Departure date
    dep_daytime_category: '',  // Time of day category for the departure (e.g., Morning, Evening)
    stops: ''                  // Exact number of stops
  });

  // useState hook to manage dropdown data state
  const [dropdownData, setDropdownData] = useState({
    // Initial state for dropdown data with an empty array for airlines
    airlines: [],// List of airline options for the dropdown
  });

  // hook to manage the list of departure cities
  const [departureCities, setDepartureCities] = useState([]);

  // hook to manage the list of destination cities
  const [destinationCities, setDestinationCities] = useState([]);

  // hook to manage the list of number of stops for flights
  const [stopsCounts, setStopsCounts] = useState([]);

  // hook to manage the list of possible flight durations
  const [durations, setDurations] = useState([]);

  // hook to manage the list of flight class categories (e.g., Economy, Business)
  const [classCategories, setClassCategories] = useState([]);

  // hook to manage the list of departure times (e.g., morning, afternoon)
  const [depDaytimes, setDepDaytimes] = useState([]);

  // hook to manage the flight price prediction result
  const [prediction, setPrediction] = useState(null);

  // hook to manage any error message that might occur
  const [errorMessage, setErrorMessage] = useState('');


  // Fetch initial dropdown data (airlines)
  useEffect(() => {
    fetch('http://localhost:5000/dropdown-data')
      .then((response) => response.json())
      .then((data) => setDropdownData(data))
      .catch((error) => console.error('Error fetching dropdown data:', error));
  }, []);

  // Fetch departure cities based on selected airline
  useEffect(() => {
    if (formData.airline) {
      fetch(`http://localhost:5000/departure-cities?airline=${encodeURIComponent(formData.airline)}`)
        .then((response) => response.json())
        .then((data) => {
          setDepartureCities(data.cities);
        })
        .catch((error) => console.error('Error fetching departure cities:', error));
    } else {
      setDepartureCities([]);
    }
  }, [formData.airline]);

  // Fetch destination cities based on selected airline and departure city
  useEffect(() => {
    if (formData.airline && formData.from) {
      fetch(`http://localhost:5000/destination-cities?airline=${encodeURIComponent(formData.airline)}&from_city=${encodeURIComponent(formData.from)}`)
        .then((response) => response.json())
        .then((data) => {
          setDestinationCities(data.destinations);
        })
        .catch((error) => console.error('Error fetching destination cities:', error));
    } else {
      setDestinationCities([]);
    }
  }, [formData.airline, formData.from]);

  // Fetch available stops counts based on selections
  useEffect(() => {
    if (formData.airline && formData.from && formData.to) {
      fetch(`http://localhost:5000/available-stops-count?airline=${encodeURIComponent(formData.airline)}&from_city=${encodeURIComponent(formData.from)}&to_city=${encodeURIComponent(formData.to)}`)
        .then((response) => response.json())
        .then((data) => {
          setStopsCounts(data.stops_counts);
        })
        .catch((error) => console.error('Error fetching stops counts:', error));
    } else {
      setStopsCounts([]);
    }
  }, [formData.airline, formData.from, formData.to]);

  // Fetch available durations based on selections
  useEffect(() => {
    if (formData.airline && formData.from && formData.to && formData.stops !== '') {
      fetch(`http://localhost:5000/available-durations?airline=${encodeURIComponent(formData.airline)}&from_city=${encodeURIComponent(formData.from)}&to_city=${encodeURIComponent(formData.to)}&stops=${encodeURIComponent(formData.stops)}`)
        .then((response) => response.json())
        .then((data) => {
          setDurations(data.durations);
        })
        .catch((error) => console.error('Error fetching durations:', error));
    } else {
      setDurations([]);
    }
  }, [formData.airline, formData.from, formData.to, formData.stops]);

  // Fetch available classes based on selections
  useEffect(() => {
    if (formData.airline && formData.from && formData.to && formData.stops !== '' && formData.duration_in_min !== '') {
      fetch(`http://localhost:5000/available-classes?airline=${encodeURIComponent(formData.airline)}&from_city=${encodeURIComponent(formData.from)}&to_city=${encodeURIComponent(formData.to)}&stops=${encodeURIComponent(formData.stops)}&duration=${encodeURIComponent(formData.duration_in_min)}`)
        .then((response) => response.json())
        .then((data) => {
          setClassCategories(data.class_categories);
        })
        .catch((error) => console.error('Error fetching class categories:', error));
    } else {
      setClassCategories([]);
    }
  }, [formData.airline, formData.from, formData.to, formData.stops, formData.duration_in_min]);

  // Fetch available departure daytimes based on selections
  useEffect(() => {
    if (
      formData.airline &&
      formData.from &&
      formData.to &&
      formData.stops !== '' &&
      formData.duration_in_min !== '' &&
      formData.class_category
    ) {
      fetch(
        `http://localhost:5000/available-dep-daytimes?airline=${encodeURIComponent(
          formData.airline
        )}&from_city=${encodeURIComponent(
          formData.from
        )}&to_city=${encodeURIComponent(
          formData.to
        )}&stops=${encodeURIComponent(
          formData.stops
        )}&duration=${encodeURIComponent(
          formData.duration_in_min
        )}&class_category=${encodeURIComponent(formData.class_category)}`
      )
        .then((response) => response.json())
        .then((data) => {
          console.log('Departure daytimes data:', data); // Debugging
          setDepDaytimes(data.dep_daytime_categories);
        })
        .catch((error) => console.error('Error fetching departure daytimes:', error));
    } else {
      setDepDaytimes([]);
    }
  }, [
    formData.airline,
    formData.from,
    formData.to,
    formData.stops,
    formData.duration_in_min,
    formData.class_category,
  ]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => {
      let updatedFormData = { ...prev, [name]: value };

      // Reset dependent fields when certain fields change
      if (name === 'airline') {
        updatedFormData = {
          ...updatedFormData,
          from: '',
          to: '',
          stops: '',
          duration_in_min: '',
          class_category: '',
          dep_daytime_category: '',
          dep_date: '',
        };
        setDepartureCities([]);
        setDestinationCities([]);
        setStopsCounts([]);
        setDurations([]);
        setClassCategories([]);
        setDepDaytimes([]);
      } else if (name === 'from') {
        updatedFormData = {
          ...updatedFormData,
          to: '',
          stops: '',
          duration_in_min: '',
          class_category: '',
          dep_daytime_category: '',
          dep_date: '',
        };
        setDestinationCities([]);
        setStopsCounts([]);
        setDurations([]);
        setClassCategories([]);
        setDepDaytimes([]);
      } else if (name === 'to') {
        updatedFormData = {
          ...updatedFormData,
          stops: '',
          duration_in_min: '',
          class_category: '',
          dep_daytime_category: '',
          dep_date: '',
        };
        setStopsCounts([]);
        setDurations([]);
        setClassCategories([]);
        setDepDaytimes([]);
      } else if (name === 'stops') {
        updatedFormData = {
          ...updatedFormData,
          duration_in_min: '',
          class_category: '',
          dep_daytime_category: '',
          dep_date: '',
        };
        setDurations([]);
        setClassCategories([]);
        setDepDaytimes([]);
      } else if (name === 'duration_in_min') {
        updatedFormData = {
          ...updatedFormData,
          class_category: '',
          dep_daytime_category: '',
          dep_date: '',
        };
        setClassCategories([]);
        setDepDaytimes([]);
      } else if (name === 'class_category') {
        updatedFormData = {
          ...updatedFormData,
          dep_daytime_category: '',
          dep_date: '',
        };
        setDepDaytimes([]);
      }

      return updatedFormData;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log('Form data before prediction:', formData);

    try {
      // Map stops to stops_category
      function getStopsCategory(stops) {
        switch (parseInt(stops)) {
          case 0:
            return 'non-stop';
          case 1:
            return '1 stop';
          default:
            return 'Multiple-Stops';
        }
      }

      // Calculate arrival daytime based on departure daytime and duration
      function calculateArrivalDaytime(depDaytime, duration) {
        const depDaytimeValue = depDaytime === 'Day Departure' ? 0 : 1;
        const durationInHours = parseFloat(duration) / 60;
        let arrivalTimeInHours = depDaytimeValue === 0 ? 6 : 18; // 6 AM or 6 PM
        arrivalTimeInHours += durationInHours;
        arrivalTimeInHours = arrivalTimeInHours % 24;
        return arrivalTimeInHours >= 6 && arrivalTimeInHours < 18 ? 'Day Arrival' : 'Night Arrival';
      }

      // Calculate the arrival time category based on departure time and flight duration
      const arrivalDaytime = calculateArrivalDaytime(
        formData.dep_daytime_category,  // Departure time category (e.g., morning, afternoon)
        formData.duration_in_min        // Flight duration in minutes
      );

      // Create an object to hold the formatted flight data for processing
      const data = {
        airline: formData.airline,
        from: formData.from,
        to: formData.to,
        class_category: formData.class_category,
        stops_category: getStopsCategory(formData.stops),
        arr_daytime_category: arrivalDaytime,
        dep_daytime_category: formData.dep_daytime_category,
        duration_in_min: parseFloat(formData.duration_in_min),
        stops: parseInt(formData.stops),
        dep_date: formData.dep_date
      };

      console.log('Data for prediction:', data);

       // Check for any missing fields in the data object
      const missingFields = Object.entries(data).filter(
        ([key, value]) => value === undefined || value === '' || value === null
      );
      // If there are any missing fields, display an error message
      if (missingFields.length > 0) {
        setErrorMessage(
          // Set the error message to list the missing field names
          `Missing fields: ${missingFields.map(([key]) => key).join(', ')}`
        );
        // Exit the function if there are missing fields
        return;
      }

      // Send a POST request to the prediction API endpoint
      const response = await fetch('http://localhost:5000/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      // Parse the response data as JSON
      const result = await response.json();
       // If the response was successful (status is OK)
      if (response.ok) {
        // Set the prediction state with the predicted price from the result
        setPrediction(result.predicted_price);
        // Clear any previous error messages
        setErrorMessage('');
      } else {
        // If the response was not successful show the error message
        setErrorMessage(result.error || 'An error occurred');
      }
    } catch (error) {
      console.error('Prediction error:', error);
      setErrorMessage('Error fetching prediction. Please try again.');
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        {/* Airline Dropdown */}
        <label>
          Airline:
          <select
            name="airline"
            value={formData.airline}
            onChange={handleChange}
            required
          >
            <option value="">Select Airline</option>
            {dropdownData.airlines.map((airline, index) => (
              <option key={index} value={airline.value}>
                {airline.label}
              </option>
            ))}
          </select>
        </label>

        {/* From City Dropdown */}
        <label>
          From:
          <select
            name="from"
            value={formData.from}
            onChange={handleChange}
            required
          >
            <option value="">Select Departure City</option>
            {departureCities.map((city, index) => (
              <option key={index} value={city.value}>
                {city.label}
              </option>
            ))}
          </select>
        </label>

        {/* To City Dropdown */}
        <label>
          To:
          <select
            name="to"
            value={formData.to}
            onChange={handleChange}
            required
          >
            <option value="">Select Destination City</option>
            {destinationCities.map((city, index) => (
              <option key={index} value={city.value}>
                {city.label}
              </option>
            ))}
          </select>
        </label>

        {/* Number of Stops Dropdown */}
        <label>
          Number of Stops:
          <select
            name="stops"
            value={formData.stops}
            onChange={handleChange}
            required
          >
            <option value="">Select Number of Stops</option>
            {stopsCounts.map((stop, index) => (
              <option key={index} value={stop.value}>
                {stop.label}
              </option>
            ))}
          </select>
        </label>

        {/* Duration Dropdown */}
        <label>
          Duration (in minutes):
          <select
            name="duration_in_min"
            value={formData.duration_in_min}
            onChange={handleChange}
            required
          >
            <option value="">Select Duration</option>
            {durations.map((duration, index) => (
              <option key={index} value={duration.value}>
                {duration.label}
              </option>
            ))}
          </select>
        </label>

        {/* Class Category Dropdown */}
        <label>
          Class:
          <select
            name="class_category"
            value={formData.class_category}
            onChange={handleChange}
            required
          >
            <option value="">Select Class</option>
            {classCategories.map((flightClass, index) => (
              <option key={index} value={flightClass.value}>
                {flightClass.label}
              </option>
            ))}
          </select>
        </label>

        {/* Departure Date */}
        <label>
          Departure Date:
          <input
            type="date"
            name="dep_date"
            value={formData.dep_date}
            onChange={handleChange}
            required
          />
        </label>

        {/* Departure Daytime Dropdown */}
        <label>
          Departure Daytime:
          <select
            name="dep_daytime_category"
            value={formData.dep_daytime_category}
            onChange={handleChange}
            required
          >
            <option value="">Select Departure Daytime</option>
            {depDaytimes.map((daytime, index) => (
              <option key={index} value={daytime.value}>
                {daytime.label}
              </option>
            ))}
          </select>
        </label>

        <button type="submit">Predict</button>

        <div className="prediction-box">
          <h3>Predicted Price:</h3>
          {prediction !== null ? (
            <p>{prediction}</p>
          ) : (
            <p>No prediction made yet. Please fill out the form and click "Predict".</p>
          )}
        </div>
      </form>



      {errorMessage && (
        <div style={{ color: 'red', marginTop: '10px' }}>
          <p>{errorMessage}</p>
        </div>
      )}
    </div>
  );
};

export default FlightForm;
