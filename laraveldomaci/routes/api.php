<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\AuthController;

use App\Http\Controllers\ExpenseCategoryController;
use App\Http\Controllers\ExpenseController;
use App\Http\Controllers\ExportController;
use App\Http\Controllers\GoalController;
use App\Http\Controllers\IncomeController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/


Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/logout', [AuthController::class, 'logout'])->middleware('auth:sanctum');

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/expense-categories', [ExpenseCategoryController::class, 'index']);
    Route::get('/expense-categories/{id}', [ExpenseCategoryController::class, 'show']);
    Route::post('/expense-categories', [ExpenseCategoryController::class, 'store']);
    Route::put('/expense-categories/{id}', [ExpenseCategoryController::class, 'update']);
    Route::delete('/expense-categories/{id}', [ExpenseCategoryController::class, 'destroy']);



    Route::get('/expenses', [ExpenseController::class, 'index']);
    Route::get('/expenses/{id}', [ExpenseController::class, 'show']);
    Route::post('/expenses', [ExpenseController::class, 'store']);
    Route::put('/expenses/{id}', [ExpenseController::class, 'update']);
    Route::delete('/expenses/{id}', [ExpenseController::class, 'destroy']);

    Route::apiResource('incomes', IncomeController::class);
    Route::apiResource('goals', GoalController::class);




    Route::get('/export/all', [ExportController::class, 'exportAll']); // Izvoz svih korisnika
    Route::get('/export/user/{id}', [ExportController::class, 'exportUser']); // Izvoz određenog korisnika
});