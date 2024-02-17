import React, { useState, useEffect } from 'react';
import styles from '../Components/SearchForm.module.css';

function SearchFormContainer() {

    const [isFetched, setIsFetched] = useState(false);
    const [searchResult, setSearchResult] = useState('');
    
    useEffect(() => {
        setIsFetched(false);
        async function fetchData() {
          const url = `https://api.weather.gov/gridpoints/TOP/32,81/forecast`;
        try {
          const response = await fetch(url);
          if (response.ok) {
            const data = await response.json();
            setIsFetched(true);
            setSearchResult(data.properties.periods)
            console.log(data.properties.periods);
          } else {
            throw new Error('Network response was not ok.');
            
          }
        } catch {
            console.log('Error');
        }}
    
        fetchData();
      }, [])

    const parsedResult = () => {
        return searchResult.map((item)=>{
            let temperatureClass = '';
            if (item.temperature < 40) {temperatureClass = styles.cold}
            else if (item.temperature < 65) {temperatureClass = styles.cool}
            else if (item.temperature < 85) {temperatureClass = styles.warm}
            else {temperatureClass = styles.hot}
        
            return (
            <tr id={item.number}>
                <th className={styles.day} scope="row">{item.name}</th>
                <td className={temperatureClass}>{item.detailedForecast}</td>
                <td className={temperatureClass}>{item.temperature} degrees f</td>
            </tr>)
    });
    }
    
    const noResult = () => {
        return <p>Still Loading!</p>
    }

    const nullOpt = () => {
        return <></>
    }

    return (
        <>
            <h1>Hello Search!</h1>
            <p>Search Results:</p>
            <table>
                <caption>
                    Weather forecast
                </caption>
                <tr>
                    <th className={styles.day} scope="col">Day</th>
                    <th className={styles.day} scope="col">Forecast</th>
                    <th className={styles.day} scope="col">Temperature</th>
                </tr>
                {isFetched ? parsedResult() : noResult()}
            </table>
        </>
    )
}

export default SearchFormContainer;