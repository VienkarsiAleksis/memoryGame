<?php

namespace App\Http\Controllers;

use App\Models\Game;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class GameController extends Controller
{
    public function storeOrUpdate(Request $request)
    {
        $request->validate([
            'user' => 'required|integer',
            'level' => 'required|string',
            'score' => 'required|integer',
        ]);

            $game = new Game();
            $game->user = $request->user;
            $game->level = $request->level;
            $game->score = $request->score;
            $game->save();
            return response()->json(['message' => 'Score inserted successfully'], 201);
    }

    public function addCoinsOrUpdate(Request $request)
    {
        $request->validate([
            'name' => 'required|string',
            'coins' => 'required|integer',
        ]);

        $user = User::where('name', $request->name)->first();

        if ($user) {
            $user->coins += $request->coins; // Increment the coins
            $user->save();
            return response()->json(['message' => 'Coins updated successfully'], 200);
        } else {
            return response()->json(['error' => 'User not found'], 404);
        }
    }
    public function leaderboard(Request $request, $level)
    {
        $leaderboard = Game::join('users', 'game.user', '=', 'users.id')
            ->select('users.name AS name', 'game.score', 'game.level')
            ->where('game.level', $level)
            ->whereRaw('game.score = (SELECT MAX(score) FROM game WHERE user = users.id AND level = ?)', [$level])
            ->orderByDesc('game.score')
            ->orderBy('game.level')
            ->orderByRaw('RAND()')
            ->limit(10)
            ->distinct()
            ->get();

        return response()->json($leaderboard);
    }

    public function HighestScoreByLevel($userId)
    {
        $highestScores = Game::select('user', 'level', Game::raw('MAX(score) AS highest_score'))
            ->where('user', $userId)
            ->groupBy('user', 'level')
            ->get();

        return response()->json($highestScores);
    }
}
