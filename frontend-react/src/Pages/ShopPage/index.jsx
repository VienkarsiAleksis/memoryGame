import './index.scss';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ShopPage = () => {
    
    const userName = Cookies.get('name');
    const navigate = useNavigate();
    const [confirmPopup, setConfirmPopup] = useState(false);
    const [notEnoughCoins, setNotEnoughCoins] = useState(false);

    const [coins, setCoins] = useState(0);
    const [selectedColor, setSelectedColor] = useState('');
    const [selectedCost, setSelectedCost] = useState(0);
    const [shopData, setShopData] = useState([]);
    const [purchasing, setPurchasing] = useState(false);
    const [shopMessage, setShopMessage] = useState('');

    const userID = Cookies.get('id');
    const color = Cookies.get('theam');

    useEffect(() => {
        if (!userName) {
            navigate('/login');
            return;
        }
    }, [userName, navigate]);

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

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await axios.get(`http://localhost:8000/api/users/${userID}`);
                setCoins(response.data.coins);
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };
        fetchUserData();
    }, [userID]);

    const handleLogout = () => {
        Cookies.remove('name');
        Cookies.remove('id');
        Cookies.remove('theam');
        navigate('/');
    };

    const handleBuy = (color, cost) => {
        if (coins >= cost) {
            setSelectedColor(color);
            setSelectedCost(cost);
            setConfirmPopup(true);
        } else {
            setNotEnoughCoins(true);
        }
    };

    const confirmPurchase = async () => {
        setPurchasing(true);
        setShopMessage('');
        try {
            const response = await axios.post('http://localhost:8000/api/shop/insert', {
                user_id: userID,
                color: selectedColor
            });
            setShopData(current => [
                ...(Array.isArray(current) ? current : []),
                response.data.item,
            ]);
            setCoins(response.data.coins);
            setShopMessage(response.data.message);
            setConfirmPopup(false);
        } catch (error) {
            setShopMessage(error.response?.data?.message || 'Purchase failed. Please try again.');
        } finally {
            setPurchasing(false);
        }
    };

    const blueItem = shopData.find(item => item.color === 'blue');
    const redItem = shopData.find(item => item.color === 'red');
    const greenItem = shopData.find(item => item.color === 'green');
    const pinkItem = shopData.find(item => item.color === 'pink');

    return (
        <div className={`shopPage ${color}`}>
            {confirmPopup && (
                <div className={`popup ${color}-btn`}>
                    <p>Are you sure you want to purchase {selectedColor} waves for {selectedCost} coins?</p>
                    <button onClick={confirmPurchase} disabled={purchasing}>{purchasing ? 'Purchasing...' : 'Confirm'}</button>
                    <button onClick={() => setConfirmPopup(false)} disabled={purchasing}>Cancel</button>
                </div>
            )}
            {notEnoughCoins && (
                <div className={`popup ${color}-btn`}>
                    <p>You don't have enough coins!</p>
                    <button onClick={() => setNotEnoughCoins(false)}>Okey! :(</button>
                </div>
            )}
            <div className="black-capacity">
                <div className={`border ${color}`}>
                    <div className="navbar">
                        <a href="/levels">Play now</a>
                        {!userName && <a href="/login">Login</a>}
                        {userName && <button onClick={handleLogout}>Logout</button>}
                        {userName && <a href={`/profile/${userID}`}>Profile</a>}
                        {userName && <a href="/shop" style={{ color: "black" }}>Shop</a>}
                        <h1>mind`F`er</h1>
                    </div>
                    <p className='coins'>You have {coins} coins</p>
                    <div className="main-border">
                        {shopMessage && <p role="status">{shopMessage}</p>}
                        {blueItem ? (
                            <div className="sale">
                                <button className='theam' disabled>
                                    <img src="https://preview.redd.it/desktop-wallpaper-4k-wave-v0-0i5uvw692wu81.png?width=640&crop=smart&auto=webp&s=66f97abe7e1518266b0cf13e37761871a3fd900b" alt="" />
                                </button>
                            <p>Blue Waves (sold)</p>
                        </div>
                        ) : (
                            <div className="sale">
                                <button className='theam' onClick={() => handleBuy("blue", 200)}>
                                    <img src="https://preview.redd.it/desktop-wallpaper-4k-wave-v0-0i5uvw692wu81.png?width=640&crop=smart&auto=webp&s=66f97abe7e1518266b0cf13e37761871a3fd900b" alt="" />
                                </button>
                                <p>Blue Waves (200)</p>
                            </div>
                        )}

                        {redItem ? (
                            <div className="sale">
                                <button className='theam' disabled>
                                    <img src="https://t4.ftcdn.net/jpg/04/68/86/79/360_F_468867953_3BZvMPjAjY0k9KVtJJ8S0wm571MeVTd2.jpg" alt="" />
                                </button>
                            <p>Red Waves (sold)</p>
                        </div>
                        ) : (
                            <div className="sale">
                                <button className='theam' onClick={() => handleBuy("red", 400)}>
                                    <img src="https://t4.ftcdn.net/jpg/04/68/86/79/360_F_468867953_3BZvMPjAjY0k9KVtJJ8S0wm571MeVTd2.jpg" alt="" />
                                </button>
                            <p>Red Waves (400)</p>
                        </div>
                        )}

                        {greenItem ? (
                            <div className="sale">
                                <button className='theam' disabled>
                                    <img src="https://wallpapercave.com/wp/wp9716264.jpg" alt="" />
                                </button>
                            <p>Green Waves (sold)</p>
                        </div>
                        ) : (
                            <div className="sale">
                                <button className='theam' onClick={() => handleBuy("green", 600)}>
                                    <img src="https://wallpapercave.com/wp/wp9716264.jpg" alt="" />
                                </button>
                            <p>Green Waves (600)</p>
                        </div>
                        )}

                        {pinkItem ? (
                            <div className="sale">
                                <button className='theam' disabled>
                                    <img src="https://www.bhmpics.com/downloads/pink-wave-wallpaper/51.aesthetic-minimalist-pink-waves-fdnoccjuijf7wkix.jpg" alt="" />
                                </button>
                            <p>Pink Waves (sold)</p>
                        </div>
                        ) : (
                            <div className="sale">
                                <button className='theam' onClick={() => handleBuy("pink", 800)}>
                                    <img src="https://www.bhmpics.com/downloads/pink-wave-wallpaper/51.aesthetic-minimalist-pink-waves-fdnoccjuijf7wkix.jpg" alt="" />
                                </button>
                            <p>Pink Waves (800)</p>
                        </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ShopPage;