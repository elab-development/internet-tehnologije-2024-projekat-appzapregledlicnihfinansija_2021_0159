<?php

namespace App\Http\Controllers;

use App\Models\ExpenseCategory;
use App\Http\Resources\ExpenseCategoryResource;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class ExpenseCategoryController extends Controller
{
    /**
     * Prikaz svih kategorija.
     */
    public function index()
    {
        $categories = ExpenseCategory::where('user_id', auth()->id())->get();
        return response()->json(ExpenseCategoryResource::collection($categories), 200);
    }

    /**
     * Prikaz jedne kategorije po ID-ju.
     */
    public function show($id)
    {
        $category = ExpenseCategory::where('user_id', auth()->id())->findOrFail($id);
        return response()->json(new ExpenseCategoryResource($category), 200);
    }

    /**
     * Kreiranje nove kategorije.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $category = ExpenseCategory::create([
            'name' => $request->name,
            'user_id' => auth()->id(),
        ]);

        return response()->json(new ExpenseCategoryResource($category), 201);
    }

    /**
     * Ažuriranje postojeće kategorije.
     */
    public function update(Request $request, $id)
    {
        $category = ExpenseCategory::where('user_id', auth()->id())->findOrFail($id);

        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $category->update([
            'name' => $request->name,
        ]);

        return response()->json(new ExpenseCategoryResource($category), 200);
    }

    /**
     * Brisanje kategorije.
     */
    public function destroy($id)
    {
        $category = ExpenseCategory::where('user_id', auth()->id())->findOrFail($id);
        $category->delete();

        return response()->json(['message' => 'Kategorija uspešno obrisana.'], 200);
    }
}
