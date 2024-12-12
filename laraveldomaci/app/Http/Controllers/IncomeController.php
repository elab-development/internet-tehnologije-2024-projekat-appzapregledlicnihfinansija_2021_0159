<?php

namespace App\Http\Controllers;

use App\Models\Income;
use App\Http\Resources\IncomeResource;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class IncomeController extends Controller
{
    /**
     * Prikaz svih prihoda.
     */
    public function index(Request $request)
    {
        $incomes = Income::where('user_id', auth()->id())
            ->orderBy('date', 'desc')
            ->get();

        return response()->json(IncomeResource::collection($incomes), 200);
    }

    /**
     * Prikaz jednog prihoda po ID-ju.
     */
    public function show($id)
    {
        $income = Income::where('user_id', auth()->id())->findOrFail($id);
        return response()->json(new IncomeResource($income), 200);
    }

    /**
     * Kreiranje novog prihoda.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'amount' => 'required|numeric|min:0',
            'description' => 'nullable|string|max:255',
            'source' => 'required|string|max:255',
            'currency' => 'required|string|max:3',
            'date' => 'required|date',
            'goal_id' => 'nullable|exists:goals,id', // Validacija za goal_id
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $income = Income::create([
            'amount' => $request->amount,
            'description' => $request->description,
            'source' => $request->source,
            'user_id' => auth()->id(),
            'currency' => $request->currency,
            'date' => $request->date,
            'goal_id' => $request->goal_id, // Postavljanje goal_id ako je prosleđen
        ]);

        return response()->json(new IncomeResource($income), 201);
    }

    /**
     * Ažuriranje postojećeg prihoda.
     */
    public function update(Request $request, $id)
    {
        $income = Income::where('user_id', auth()->id())->findOrFail($id);

        $validator = Validator::make($request->all(), [
            'amount' => 'required|numeric|min:0',
            'description' => 'nullable|string|max:255',
            'source' => 'required|string|max:255',
            'currency' => 'required|string|max:3',
            'date' => 'required|date',
            'goal_id' => 'nullable|exists:goals,id', // Validacija za goal_id
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $income->update([
            'amount' => $request->amount,
            'description' => $request->description,
            'source' => $request->source,
            'currency' => $request->currency,
            'date' => $request->date,
            'goal_id' => $request->goal_id, // Postavljanje goal_id ako je prosleđen
        ]);

        return response()->json(new IncomeResource($income), 200);
    }

    /**
     * Brisanje prihoda.
     */
    public function destroy($id)
    {
        $income = Income::where('user_id', auth()->id())->findOrFail($id);
        $income->delete();

        return response()->json(['message' => 'Prihod uspešno obrisan.'], 200);
    }

    /**
     * Pretraga prihoda za ulogovanog korisnika.
     */
    public function search(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'query' => 'required|string|max:255',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $query = $request->input('query');

        $incomes = Income::where('user_id', auth()->id())
            ->where(function ($queryBuilder) use ($query) {
                $queryBuilder->where('description', 'LIKE', "%{$query}%")
                    ->orWhere('source', 'LIKE', "%{$query}%")
                    ->orWhere('currency', 'LIKE', "%{$query}%");
            })
            ->get();

        return response()->json(IncomeResource::collection($incomes), 200);
    }
}
