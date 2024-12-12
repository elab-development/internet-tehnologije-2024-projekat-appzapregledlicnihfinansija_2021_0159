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
            'goal_id' => 'nullable|exists:goals,id', // Validacija za goal_id
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
            'goal_id' => $request->goal_id, // Postavljanje goal_id ako je prosleđen
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
            'goal_id' => 'nullable|exists:goals,id', // Validacija za goal_id
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
            'goal_id' => $request->goal_id, // Postavljanje goal_id ako je prosleđen
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






        /**
         * Pretraga troškova za ulogovanog korisnika.
         */
        public function search(Request $request)
        {
            // Validacija ulaznih podataka
            // 'query' je obavezan, mora biti string dužine do 255 karaktera
            $validator = Validator::make($request->all(), [
                'query' => 'required|string|max:255',
            ]);

            // Ako validacija ne uspe, vraća se greška sa statusom 422 (Unprocessable Entity)
            if ($validator->fails()) {
                return response()->json(['errors' => $validator->errors()], 422);
            }

            // Dohvata vrednost parametra 'query' iz zahteva
            $query = $request->input('query'); 

            // Filtriranje troškova koji pripadaju ulogovanom korisniku
            // Proverava user_id i koristi funkciju where za pretragu
            $expenses = Expense::where('user_id', auth()->id()) // Filtrira troškove za trenutno ulogovanog korisnika
                ->where(function ($queryBuilder) use ($query) {
                    // Dodaje uslov za pretragu prema opisu ili valuti
                    $queryBuilder->where('description', 'LIKE', "%{$query}%") // Traži opis koji sadrži uneseni tekst
                        ->orWhere('currency', 'LIKE', "%{$query}%"); // Traži valutu koja sadrži uneseni tekst
                })
                ->get(); // Dohvata rezultate pretrage

            // Vraća rezultate pretrage kao JSON koristeći ExpenseResource za formatiranje
            return response()->json(ExpenseResource::collection($expenses), 200);
        }

}
