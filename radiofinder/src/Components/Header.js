import React from 'react';
import styles from './Header.module.css';

function Header() {
    return (
        <>
            <header className={styles.header} >
                <h1 className={styles.heading}>Weather Forecaster</h1>
                <h2 className={styles.subheading}>mk. 1</h2>
                <hr className={styles.horiz}/>
                <h3 className={styles.tagline}>A tool for looking up weather forecasts</h3>
                <hr className={styles.horiz}/>
            </header>
        </>
    )
}

export default Header;