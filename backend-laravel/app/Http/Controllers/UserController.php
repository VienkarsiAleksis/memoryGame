<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class UserController extends Controller
{
    public function createUser(Request $request, User $user)
    {
        $messages = [
            'required.name' => 'The username field is required.',
            'unique.name' => 'This username is already taken.',
            'required.email' => 'The email field is required.',
            'regex.email' => "The email doesn't require email format.",
            'required.password' => 'The password field is required.',
        ];

        $validator = Validator::make($request->all(), [
            'name' => 'required|string|unique:users',
            'email' => 'required|string|regex:/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/',
            'password' => 'required|string',
        ], $messages);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $validatedData = $validator->validated();

        $user->name = $validatedData['name'];
        $user->email = $validatedData['email'];
        $user->theam = "yellow";
        $user->password = Hash::make($validatedData['password']);

        if ($user->save()) {
            $token = $user->createToken('Personal Access Token')->plainTextToken;
            return response()->json(['token' => $token], 201);
        } else {
            return response()->json(['error' => 'Failed to create user.'], 500);
        }
    }

    public function checkUserNameExists($username)
    {
        $existingUser = User::where('name', $username)->first();

        if ($existingUser) {
            return response()->json(['message' => true], 200);
        } else {
            return response()->json(['message' => false], 200);
        }
    }
    
    
    public function checkPassword(Request $request)
    {
        try {
            $request->validate([
                'name' => 'required|string',
                'password' => 'required|string',
            ]);

            // Assuming you have a name model
            $name = User::where('name', $request->name)->first();

            if (!$name) {
                return response()->json(['error' => 'name not found'], 404);
            }

            // Check if the provided password matches the hashed password from the database
            if (Hash::check($request->password, $name->password)) {
                return response()->json(['message' => 'Password is correct']);
            } else {
                return response()->json(['error' => 'Password is incorrect'], 401);
            }
        } catch (\Exception $e) {
            return response()->json(['error' => 'Internal Server Error'], 500);
        }
    }


    public function getUserIdByUserName(Request $request)
    {
        try {
            $userName = $request->input('name');

            if (!$userName) {
                return response()->json(['error' => 'User name not provided'], 400);
            }

            $user = User::where('name', $userName)->first();

            if ($user) {
                $userData = [
                    'user_id' => $user->id,
                    'theam' => $user->theam, // Include theme data
                ];
                return response()->json($userData);
            } else {
                return response()->json(['error' => 'User not found'], 404);
            }
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }


    public function getUserById($id)
    {
        $user = User::find($id);

        if (!$user) {
            return response()->json(['message' => 'User not found'], 404);
        }

        return response()->json($user, 200);
    }


    public function changePassword(Request $request, $userId)
    {
        // Validate the request data
        $validator = Validator::make($request->all(), [
            'current_password' => ['required', 'string'],
            'new_password' => ['required', 'string', 'min:8'],
        ]);
        
        if ($validator->fails()) {
            return response()->json(['error' => $validator->errors()], 422);
        }

        // Find the user by ID
        $user = User::find($userId);

        // Check if the user exists
        if (!$user) {
            return response()->json(['error' => 'User not found'], 404);
        }

        // Check if the current password matches the user's password
        if (!Hash::check($request->current_password, $user->password)) {
            return response()->json(['error' => 'The current password is incorrect.'], 422);
        }

        // Update the user's password
        $user->password = Hash::make($request->new_password);
        $user->save();

        // Return success response
        return response()->json(['message' => 'Password changed successfully.'], 200);
    }


    public function update(Request $request, $id)
    {
        $user = User::findOrFail($id);
    
        $request->validate([
            'name' => 'nullable|string|unique:users,name,' . $user->id,
            'email' => 'nullable|string|email|unique:users,email,' . $user->id,
        ]);
    
        $successMessages = [];
    
        // Update name if provided in the request
        if ($request->filled('name')) {
            $user->name = $request->name;
            $successMessages['name'] = 'Username updated successfully';
        }
    
        // Update email if provided in the request
        if ($request->filled('email')) {
            $user->email = $request->email;
            $successMessages['email'] = 'Email updated successfully';
        }
    
        // Save the user if any fields were updated
        if (!empty($successMessages)) {
            $user->save();
            return response()->json($successMessages, 200);
        }
    
        // No fields were updated
        return response()->json(['message' => 'No fields provided for update'], 400);
    }

    public function updateCoins(Request $request, $userId)
    {
        try {
            $newCoins = $request->input('coins');
            $user = User::findOrFail($userId);
            $user->coins = $newCoins;
            $user->save();

            return response()->json(['message' => 'User coins updated successfully']);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function updateTheme(Request $request, $id)
    {
        $user = User::find($id);

        if (!$user) {
            return response()->json(['error' => 'User not found'], 404);
        }

        $user->theam = $request->input('theam');
        $user->save();

        return response()->json(['message' => 'Theme updated successfully']);
    }
}

