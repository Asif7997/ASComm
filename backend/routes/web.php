<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AIController;
use App\Http\Controllers\TradeController;
use App\Http\Controllers\AuthController;

Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);
Route::post('/logout', [AuthController::class, 'logout']);
Route::get('/user', [AuthController::class, 'user'])->middleware('auth:sanctum');




Route::get('/{any}', function () {
    return file_get_contents(public_path('index.html'));
})->where('any', '.*');

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/calculations', [TradeController::class, 'index']);
    Route::post('/calculations', [TradeController::class, 'store']);
});

Route::post('/ai-gemini', [AIController::class, 'askGemini']);
