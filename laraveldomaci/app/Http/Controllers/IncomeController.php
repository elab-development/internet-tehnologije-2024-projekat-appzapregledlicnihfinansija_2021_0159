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
    public function index()
    {
        $incomes = Income::where('user_id', auth()->id())->get();
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
}
