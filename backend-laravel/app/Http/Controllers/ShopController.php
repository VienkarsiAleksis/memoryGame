<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Shop;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;

class ShopController extends Controller
{
    private const COLOR_COSTS = [
        'blue' => 200,
        'red' => 400,
        'green' => 600,
        'pink' => 800,
    ];

    public function insert(Request $request)
    {
        $validated = $request->validate([
            'user_id' => ['required', 'integer', 'exists:users,id'],
            'color' => ['required', 'string', Rule::in(array_keys(self::COLOR_COSTS))],
        ]);

        $result = DB::transaction(function () use ($validated) {
            $user = User::whereKey($validated['user_id'])->lockForUpdate()->firstOrFail();
            $existingItem = Shop::where('user_id', $user->id)
                ->where('color', $validated['color'])
                ->first();

            if ($existingItem) {
                return [
                    'status' => 409,
                    'data' => ['message' => 'This theme has already been purchased.'],
                ];
            }

            $cost = self::COLOR_COSTS[$validated['color']];
            if ($user->coins < $cost) {
                return [
                    'status' => 422,
                    'data' => ['message' => 'Not enough coins.', 'coins' => $user->coins],
                ];
            }

            $user->coins -= $cost;
            $user->save();

            $item = Shop::create([
                'user_id' => $user->id,
                'color' => $validated['color'],
            ]);

            return [
                'status' => 201,
                'data' => [
                    'message' => 'Theme purchased successfully.',
                    'item' => $item,
                    'coins' => $user->coins,
                ],
            ];
        });

        return response()->json($result['data'], $result['status']);
    }

    public function checkUserPurchase(Request $request)
    {
        $validated = $request->validate([
            'user_id' => ['required', 'integer', 'exists:users,id'],
            'color' => ['required', 'string', Rule::in(array_keys(self::COLOR_COSTS))],
        ]);

        return response()->json([
            'purchased' => Shop::where('user_id', $validated['user_id'])
                ->where('color', $validated['color'])
                ->exists(),
        ]);
    }

    public function getAllShopData($userId)
    {
        if (! User::whereKey($userId)->exists()) {
            return response()->json(['message' => 'User not found.'], 404);
        }

        return response()->json(Shop::where('user_id', $userId)->get());
    }
}
