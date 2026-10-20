import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import './index.scss';
import { useNavigate } from 'react-router-dom';
import Confetti from 'react-confetti';
import Cookies from 'js-cookie';
import axios from 'axios';

const GamePage = () => {
    const [cards, setCards] = useState([]);
    const [flipped, setFlipped] = useState([]);
    const [solved, setSolved] = useState([]);
    const [disabled, setDisabled] = useState(false);
    const [score, setScore] = useState(0);
    const [startTimer, setStartTimer] = useState(0);
    const [timer, setTimer] = useState(0);
    const [coins, setCoins] = useState(0);
    const [attempts, setAttempts] = useState(0);
    const [gameOver, setGameOver] = useState(false);
    const [TimeOut, setTimeOut] = useState(false);
    const [pairs, setPairs] = useState(0);
    const [leaderboardData, setLeaderboardData] = useState([]);
    const [shopData, setShopData] = useState([]);
    const [backgroundColor, setBackgroundColor] = useState(Cookies.get('theam'));

    const [firstCardFlipped, setFirstCardFlipped] = useState(false);

    const navigate = useNavigate();
    const { level } = useParams();
    const userID = Cookies.get('id');
    const userName = Cookies.get('name');

    const fetchLeaderboard = useCallback(async () => {
        try {
            const response = await axios.get(`http://localhost:8000/api/leaderboard/${level}`);
            setLeaderboardData(response.data);
        } catch (error) {
            console.error('Error fetching leaderboard data:', error);
        }
    }, [level]);

    useEffect(() => {
        if (level === '1') {
            setStartTimer(10);
            setPairs(2);
        } else if (level === '2') {
            setStartTimer(20);
            setPairs(3);
        } else if (level === '3') {
            setStartTimer(30);
            setPairs(4);
        } else if (level === '4') {
            setStartTimer(40);
            setPairs(5);
        } else if (level === '5') {
            setStartTimer(50);
            setPairs(6);
        } else if (level === '6') {
            setStartTimer(60);
            setPairs(7);
        } else if (level === '7') {
            setStartTimer(60);
            setPairs(8);
        } else if (level === '8') {
            setStartTimer(60);
            setPairs(9);
        } else if (level === '9') {
            setStartTimer(60);
            setPairs(10);
        } else if (level === '10') {
            setStartTimer(60);
            setPairs(11);
        } else if (level === '11') {
            setStartTimer(70);
            setPairs(12);
        } else if (level === '12') {
            setStartTimer(80);
            setPairs(13);
        } else if (level === '13') {
            setStartTimer(90);
            setPairs(14);
        } else if (level === '14') {
            setStartTimer(100);
            setPairs(15);
        } else if (level === '15') {
            setStartTimer(100);
            setPairs(15);
        } else if (level === '16') {
            setStartTimer(100);
            setPairs(16);
        } else if (level === '17') {
            setStartTimer(100);
            setPairs(18);
        } else if (level === '18') {
            setStartTimer(90);
            setPairs(18);
        } else if (level === '19') {
            setStartTimer(80);
            setPairs(19);
        } else if (level === '20') {
            setStartTimer(70);
            setPairs(20);
        } else {
            navigate('/levels');
        }
    }, [level, navigate]);

    useEffect(() => {
        if (startTimer > 0) {
            setTimer(startTimer);
        }
    }, [startTimer]);

    const generateCards = (pairs) => {
        const emojis = ["✌","😂","😝","😁","😱","👉","🙌","🍻","🔥","🌈","☀","🎈","🌹","💄","🎀","⚽","🎾","🏁","😡","👿","🐻","🐶","🐬","🐟","🍀","👀","🚗","🍎","💝","💙","👌","❤","😍","😉","😓","😳","💪","💩","🍸","🔑","💖","🌟","🎉","🌺","🎶","👠","🏈","⚾","🏆","👽","💀","🐵","🐮","🐩","🐎","💣","👃","👂","🍓","💘","💜","👊","💋","😘","😜","😵","🙏","👋","🚽","💃","💎","🚀","🌙","🎁","⛄","🌊","⛵","🏀","🎱","💰","👶","👸","🐰","🐷","🐍","🐫","🔫","👄","🚲","🍉","💛","💚"];

        function getRandomEmojis(arr, count) {
            const shuffled = arr.slice();
            for (let i = shuffled.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
            }
            return shuffled.slice(0, count);
        }

        const randomEmojis = getRandomEmojis(emojis, pairs);
        const symbols = [...randomEmojis, ...randomEmojis];
        let cardsArray = [];

        for (let i = 0; i < symbols.length; i++) {
            const card = {
                id: i,
                key: i, // Add a unique key to each card object
                symbol: symbols[i],
                flipped: false,
                solved: false
            };
            cardsArray.push(card);
        }

        // Shuffle the cards using the key
        cardsArray.sort(() => Math.random() - 0.5);

        setCards(cardsArray);
    };

    useEffect(() => {
        generateCards(pairs);
    }, [pairs]);

    useEffect(() => {
        if (!gameOver && !TimeOut && firstCardFlipped) {
            const timerId = setInterval(() => {
                if (solved.length === cards.length) {
                    clearInterval(timerId);
                    setGameOver(true);

                    if (solved.length === cards.length || !TimeOut) {
                        const data = {
                            user: userID,
                            level: level,
                            score: score
                        };

                        axios.post('http://localhost:8000/api/games', data)
                            .then(response => {
                                console.log('Game score stored or updated successfully:', response.data);
                                // Handle successful response here
                                fetchLeaderboard();
                            })
                            .catch(error => {
                                console.error('Error storing or updating game score:', error.response.data);
                                // Handle error response here
                            });

                        const dataCoins = {
                            name: userName,
                            coins: coins,
                        };

                        axios.post('http://localhost:8000/api/coins', dataCoins)
                            .then(response => {
                                console.log('Game coins stored or updated successfully:', response.data);
                                // Handle successful response here
                            })
                            .catch(error => {
                                console.error('Error storing or updating game coins:', error.response.data);
                                // Handle error response here
                            });
                    }

                } else if (timer > 0) {
                    setTimer(timer - 1);
                } else {
                    clearInterval(timerId);
                    setTimeOut(true);
                }
            }, 1000);

            return () => clearInterval(timerId);
        }
    }, [timer, solved, cards.length, gameOver, TimeOut, firstCardFlipped, userID, level, score, userName, coins, fetchLeaderboard]);

    const resetCards = () => {
        setCards([]); // Reset cards state to an empty array
        setFlipped([]);
        setSolved([]);
        setDisabled(false);
        setScore(0);
        setAttempts(0);
        setCoins(0);
        setLeaderboardData([]);
    };

    const handleRetry = () => {
        setGameOver(false);
        setTimeOut(false);
        setTimer(startTimer);
        resetCards();
        generateCards(pairs); // Generate new set of cards
        setFirstCardFlipped(false);
    };

    const handleNextLevel = () => {
        const nextLevel = parseInt(level) + 1;
        navigate(`/level/${nextLevel}`);
        setGameOver(false);
        setTimeOut(false);
        setTimer(startTimer);
        resetCards();
        generateCards();
        setFirstCardFlipped(false);

    };

    const handleBackToMenu = () => {
        navigate('/levels');
    };

    const handleClick = (id) => {
        if (gameOver || disabled || solved.includes(id) || flipped.includes(id) || TimeOut) return;

        setDisabled(true);

        if (flipped.length === 0) {
            setFlipped([id]);
            setDisabled(false);

            setFirstCardFlipped(true);
        } else {
            if (flipped.length === 1) {
                setFlipped([flipped[0], id]);

                const card1 = cards.find(card => card.id === flipped[0]);
                const card2 = cards.find(card => card.id === id);

                if (card1.symbol === card2.symbol) {
                    // If the symbols match, mark both cards as solved
                    const updatedSolved = [...solved, flipped[0], id];
                    setSolved(updatedSolved);
                    setScore(Math.round(score + (timer * 4.5)));
                    setCoins(coins + 10);
                    setFlipped([]); // Remove flipped cards here
                    setDisabled(false);
                } else {
                    setTimeout(() => {
                        setFlipped([]); // Remove flipped cards after a delay
                        setDisabled(false);
                    }, 500);
                }
                setAttempts(attempts + 1);
            }
        }
    };

    const handleConfetti = () => {
        if (solved.length === cards.length) {
            return <Confetti width={window.innerWidth} height={window.innerHeight} />;
        }
    };

    const calculateGridColumns = (pairs) => {
        // Calculate the number of columns based on the number of pairs
        return `repeat(${Math.ceil(Math.sqrt(pairs * 2))}, 1fr)`;
    };

    useEffect(() => {
        console.log(leaderboardData);
    }, [leaderboardData]);

    useEffect(() => {
        const fetchShopData = async () => {
            try {
                const response = await axios.get(`http://localhost:8000/api/shop/${userID}`);
                setShopData(Array.isArray(response.data) ? response.data : []);
            } catch (error) {
                console.error('Error fetching shop data:', error);
                setShopData([]);
            }
        };
        fetchShopData();
    }, [userID]);

    const changeBackground = async (color) => {
        try {
            const response = await axios.put(`http://localhost:8000/api/users/${userID}/theme`, { theam: color });
            console.log(response.data);
            Cookies.set('theam', color);
            setBackgroundColor(color); // Update the background color state
        } catch (error) {
            throw new Error(error.response.data.error || 'Failed to update theme');
        }
    };

    return (
        <div className={`gamepage ${backgroundColor}`}>
            {handleConfetti()}
            {gameOver && (
                <div className={`modal ${backgroundColor}-btn`}>
                    <div className="modal-content">
                        <h2>Congratulations!</h2>
                        <p>You completed the level!</p>
                        <div className="table">
                            <h2>Leaderboard</h2>
                            <table>
                                <thead>
                                    <tr>
                                        <th>Place</th>
                                        <th>Name</th>
                                        <th>Score</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {leaderboardData.map((entry, index) => (
                                        <tr key={index}>
                                            <td>{index + 1}</td>
                                            <td>{entry.name}</td>
                                            <td>{entry.score}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <button onClick={handleRetry}>Retry</button>
                        <button onClick={handleBackToMenu}>Back to Menu</button>
                        <button onClick={handleNextLevel}>Next Level</button>
                    </div>
                </div>
            )}
            {TimeOut && (
                <div className={`modal ${backgroundColor}-btn`}>
                    <div className="modal-content">
                        <h2>Game Over!</h2>
                        <p>Time ran out</p>
                        <div className="table">
                            <h2>Leaderboard</h2>
                            <table>
                                <thead>
                                    <tr>
                                        <th>Place</th>
                                        <th>Name</th>
                                        <th>Score</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {leaderboardData.map((entry, index) => (
                                        <tr key={index}>
                                            <td>{index + 1}</td>
                                            <td>{entry.name}</td>
                                            <td>{entry.score}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <button onClick={handleRetry}>Retry</button>
                        <button onClick={handleBackToMenu}>Back to Menu</button>
                    </div>
                </div>
            )}
            <div className="black-capacity">
                <div className={`border ${backgroundColor}`}>
                    <div className="header">
                        <div>Score: {score}</div>
                        <div>Timer: {timer} seconds</div>
                        <div>Attempts: {attempts}</div>
                        <div>Coins: {coins}</div>
                        <div className="theam">
                                <button onClick={() => changeBackground('yellow')}>
                                    <img src="https://images.squarespace-cdn.com/content/v1/6136fa570fcb4430259d7153/35ba01f2-b1ab-499d-ae68-feb6be481354/website+background.jpg" alt="Red Waves" />
                                </button>
                            {shopData.some(item => item.color === 'red') && (
                                <button onClick={() => changeBackground('red')}>
                                    <img src="https://t4.ftcdn.net/jpg/04/68/86/79/360_F_468867953_3BZvMPjAjY0k9KVtJJ8S0wm571MeVTd2.jpg" alt="Red Waves" />
                                </button>
                            )}
                            {shopData.some(item => item.color === 'blue') && (
                                <button onClick={() => changeBackground('blue')}>
                                    <img src="https://preview.redd.it/desktop-wallpaper-4k-wave-v0-0i5uvw692wu81.png?width=640&crop=smart&auto=webp&s=66f97abe7e1518266b0cf13e37761871a3fd900b" alt="Blue Waves" />
                                </button>
                            )}
                            {shopData.some(item => item.color === 'green') && (
                                <button onClick={() => changeBackground('green')}>
                                    <img src="https://wallpapercave.com/wp/wp9716264.jpg" alt="Green Waves" />
                                </button>
                            )}
                            {shopData.some(item => item.color === 'pink') && (
                                <button onClick={() => changeBackground('pink')}>
                                    <img src="https://www.bhmpics.com/downloads/pink-wave-wallpaper/51.aesthetic-minimalist-pink-waves-fdnoccjuijf7wkix.jpg" alt="Pink Waves" />
                                </button>
                            )}
                        </div>
                    </div>
                    <div className="layout-cont">
                        <div className="grid" style={{ gridTemplateColumns: calculateGridColumns(pairs) }}>
                            {cards.map((card) => (
                                <div
                                    key={card.id}
                                    onClick={() => handleClick(card.id)}
                                    className={`card ${flipped.includes(card.id) || solved.includes(card.id) ? 'flipped' : ''}`}
                                >
                                    {flipped.includes(card.id) || solved.includes(card.id) ? card.symbol : ' '}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GamePage;
