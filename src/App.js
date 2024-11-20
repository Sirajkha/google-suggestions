import React, { useState,useEffect } from 'react';
import './App.css';

function App() {
 // State Variables:
 // query : stores the current search input value.
 // suggestions : stores the Array of suggestions from the google API
  const [ query, setQuery ] = useState('');
  const [suggestions, setSuggestions ] = useState([]);

  useEffect(() =>{
    // funtion to fetch suggestions from the Google API
    const fetchSuggestions = async () => {
      if(query.trim() === ''){
        setSuggestions([]);
        return;
      }

      try {
        // Using CORS proxy to bypass CORS restrictions
        // Making GET request to google suggest API with the current query 
        const response = await fetch(`https://cors-anywhere.herokuapp.com/http://suggestqueries.google.com/complete/search?client=firefox&q=${encodeURIComponent(query)}`)
        const data = await response.json();
        console.log('API response:' , data);
        setSuggestions(data[1]); // data[1] contains the Array of suggestions
      } catch (error) {
        console.error('Error fetching suggestions:', error);
      }
    };

    //Debouncing: Wait 300ms after user stop typing before making API call
    //this prevent excessive api call when user is typing
    const timeoutId = setTimeout(() => {
      fetchSuggestions();
    },300)

    //
    return () => clearTimeout(timeoutId);
  },[query]); //effect runs when query changes

  return (
    <div className='App'>
      <div className='search-container'>
        <h1>Google Search Suggestions</h1>
        <input 
          type = 'test'
          value = {query}
          onChange = {(e) => setQuery(e.target.value)}
          placeholder = 'Start typing to see suggestions...'
          className='search-input'
        />
        {suggestions.length > 0 && (
          <ul className='suggestions-list'>
          {suggestions.map((suggestion,index) => (
            <li key={index} onClick={() => setQuery(suggestion)}>{suggestion}</li>
          ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default App;
