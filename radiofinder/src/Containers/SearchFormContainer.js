import React, { useState, useEffect } from 'react';
import styles from '../Components/SearchForm.module.css';

function SearchFormContainer() {

    const [isFetched, setIsFetched] = useState(false);
    const [searchResult, setSearchResult] = useState('');
    const [address, setAddress] = useState('');
    const [geoLocation, setGeoLocation] = useState({x: 0.0, y: 0.0});
    const [station, setStation] = useState('')

    const handleChange = (event) => {
        setAddress(event.target.value)
    }

    const searchAddress = async (event) => {
        async function fetchAddress() {
            const uriAddress = encodeURIComponent(address);
            const url = `https://nominatim.openstreetmap.org/search?q=${uriAddress}&format=geojson`
            try {
                const response = await fetch(url);
                if (response.ok) {
                    const addData = await response.json();
                    setGeoLocation({x: addData.features[0].geometry.coordinates[0], y: addData.features[0].geometry.coordinates[1]});
                    console.log(geoLocation);
                    console.log(addData);
                } else {
                    throw new Error('Network response was not good for address search');
                    console.log(url);
                }
            } catch {
                console.log('There was an unexpected error in finding the geolocation.')
            }
        }
        fetchAddress();
    }

    const findWeatherStation = async () => {
        async function fetchStation() {
            const url = `https://api.weather.gov/points/${geoLocation.y},${geoLocation.x}`
            try {
                const response = await fetch(url);
                if (response.ok) {
                    const geoData = await response.json();
                    setStation(geoData.properties.forecast);
                    console.log(geoData);
                } else {
                    throw new Error('Network response was not good for station identification')
                }
            } catch {
                console.log('There was an unexpected error in finding the nearest station.')
            }
        }
        fetchStation();
    }

    const pullWeather = async () => {
        const url = station;
            const response = await fetch(url);
            if (response.ok) {
                const data = await response.json();
                setIsFetched(true);
                setSearchResult(data.properties.periods);
                console.log(data.properties.periods);
            } else {
                throw new Error('Network response was not ok.');
            }
    }

    useEffect(() => {
        if (geoLocation.x !== 0 || geoLocation.y !== 0) {
            findWeatherStation();
        }
    }, [geoLocation]);

    useEffect(() => {
        if (station != '') {
            pullWeather();
        }
    }, [station]);

    const searchForecast = async (event) => {
        event.preventDefault();
        setIsFetched(false);
        try {
            await searchAddress();
        }   catch {
            console.log('Error! Please try again.');
        }}
             

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
            <h3>Search Address Here:</h3>
            <form onSubmit = {searchForecast}>
                <label for="address">Enter Address Here:</label>
                <input id="address" type="text" value={address} onChange={handleChange}/>
                <input id="submit" type="submit" />
            </form>
            <h4>Search Results:</h4>
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