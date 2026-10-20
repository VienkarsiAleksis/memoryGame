<?php

use App\Http\Controllers\GameController;
use App\Http\Controllers\ShopController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;
use App\Models\User;

Route::any('/register', [UserController::class, 'createUser']);
Route::get('/check-username-exists/{user}', [UserController::class, 'checkUsernameExists']);
Route::any('/check-password', [UserController::class, 'checkPassword']);
Route::any('/get-user-id', [UserController::class, 'getUserIdByUserName'])->name('get.user.id.by.username');
Route::get('/users/{id}', [UserController::class, 'getUserById']);
Route::any('users/{userId}/change-password', [UserController::class, 'changePassword']);
Route::any('/user/{id}/update', [UserController::class, 'update']);
Route::any('/games', [GameController::class, 'storeOrUpdate']);
Route::any('/coins', [GameController::class, 'addCoinsOrUpdate']);
Route::get('/leaderboard/{level}', [GameController::class, 'leaderboard']);
Route::get('user/{userId}/highest-scores', [GameController::class, 'HighestScoreByLevel']);
Route::post('/shop/insert', [ShopController::class, 'insert']);
Route::post('shop/check-purchase', [ShopController::class, 'checkUserPurchase']);
Route::get('/shop/{userId}', [ShopController::class, 'getAllShopData']);
Route::put('/users/{userId}/coins', [UserController::class, 'updateCoins']);
Route::put('/users/{id}/theme', [UserController::class, 'updateTheme']);