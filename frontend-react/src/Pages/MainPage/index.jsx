import './index.scss';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import React, { useEffect } from 'react';
import axios from 'axios';

const MainPage = () => {
    
    const userName = Cookies.get('name');
    const navigate = useNavigate();

    useEffect(() => {
        if (userName) {
            // Make a request to the Laravel backend with the user's name
            axios.post('http://localhost:8000/api/get-user-id', {
                name: userName,
            })
            .then(response => {
                Cookies.set('id', response.data.user_id);
                Cookies.set('theam', response.data.theam);
            })
            .catch(error => {
                console.error('Error:', error);
            });
        }
    }, [userName]);

    const userID = Cookies.get('id');

    let color = "yellow";

    if (Cookies.get('theam')) {
        color = Cookies.get('theam');
    }

    const handleLogout = () => {
        Cookies.remove('name');
        Cookies.remove('id');
        Cookies.remove('theam');
        navigate('/');
    };    

    return(
        <div className={`mainPage ${color}`}>
            <div className="black-capacity">
                <div className={`border ${color}`}>
                    <div className="navbar">
                        <a href="/levels">Play now</a>
                        {!userName && <a href="/login">Login</a>}
                        {userName && <button onClick={handleLogout}>Logout</button>}
                        {userName && <a href={`/profile/${userID}`}>Profile</a>}
                        {userName && <a href="/shop">Shop</a>}
                        <h1>mind`F`er</h1>
                    </div>
                    <div className="main-border">
                        <h1>mind`f`er</h1>
                        <p>Concentration is a round game in which all of the cards are laid face down on a surface and two cards are flipped face up over each turn. The object of the game is to turn over pairs of matching cards.</p>
                        <a href="/levels" className = {`${color}-btn`}>play now</a>
                    </div>
                </div>
            </div>
       </div>
    );
};

export default MainPage;