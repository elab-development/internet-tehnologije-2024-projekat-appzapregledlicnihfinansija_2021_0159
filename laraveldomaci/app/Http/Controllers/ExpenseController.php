<?php

namespace App\Http\Controllers;

use App\Models\Expense;
use App\Http\Resources\ExpenseResource;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class ExpenseController extends Controller
{
    /**
     * Prikaz svih troškova.
     */
    public function index()
    {
        $expenses = Expense::where('user_id', auth()->id())->get();
        return response()->json(ExpenseResource::collection($expenses), 200);
    }

    /**
     * Prikaz jednog troška po ID-ju.
     */
    public function show($id)
    {
        $expense = Expense::where('user_id', auth()->id())->findOrFail($id);
        return response()->json(new ExpenseResource($expense), 200);
    }

    /**
     * Kreiranje novog troška.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'amount' => 'required|numeric|min:0',
            'description' => 'nullable|string|max:255',
            'expense_category_id' => 'required|exists:expense_categories,id',
            'currency' => 'required|string|max:3',
            'date' => 'required|date',
            'status' => 'required|in:paid,pending',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $expense = Expense::create([
            'amount' => $request->amount,
            'description' => $request->description,
            'expense_category_id' => $request->expense_category_id,
            'user_id' => auth()->id(),
            'currency' => $request->currency,
            'date' => $request->date,
            'status' => $request->status,
        ]);

        return response()->json(new ExpenseResource($expense), 201);
    }

    /**
     * Ažuriranje postojećeg troška.
     */
    public function update(Request $request, $id)
    {
        $expense = Expense::where('user_id', auth()->id())->findOrFail($id);

        $validator = Validator::make($request->all(), [
            'amount' => 'required|numeric|min:0',
            'description' => 'nullable|string|max:255',
            'expense_category_id' => 'required|exists:expense_categories,id',
            'currency' => 'required|string|max:3',
            'date' => 'required|date',
            'status' => 'required|in:paid,pending',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $expense->update([
            'amount' => $request->amount,
            'description' => $request->description,
            'expense_category_id' => $request->expense_category_id,
            'currency' => $request->currency,
            'date' => $request->date,
            'status' => $request->status,
        ]);

        return response()->json(new ExpenseResource($expense), 200);
    }

    /**
     * Brisanje troška.
     */
    public function destroy($id)
    {
        $expense = Expense::where('user_id', auth()->id())->findOrFail($id);
        $expense->delete();

        return response()->json(['message' => 'Trošak uspešno obrisan.'], 200);
    }
}
