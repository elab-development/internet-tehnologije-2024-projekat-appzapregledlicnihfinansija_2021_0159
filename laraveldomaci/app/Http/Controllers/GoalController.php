<?php

namespace App\Http\Controllers;

use App\Models\Goal;
use App\Http\Resources\GoalResource;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class GoalController extends Controller
{
    /**
     * Prikaz svih ciljeva korisnika.
     */
    public function index()
    {
        $goals = Goal::where('user_id', auth()->id())->get();
        return response()->json(GoalResource::collection($goals), 200);
    }

    /**
     * Prikaz pojedinačnog cilja.
     */
    public function show($id)
    {
        $goal = Goal::where('user_id', auth()->id())->findOrFail($id);
        return response()->json(new GoalResource($goal), 200);
    }

    /**
     * Kreiranje novog cilja.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'title' => 'required|string|max:255',
            'description' => 'nullable|string|max:255',
            'target_amount' => 'required|numeric|min:0',
            'current_amount' => 'nullable|numeric|min:0',
            'deadline' => 'nullable|date',
            'status' => 'required|in:active,completed,canceled',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $goal = Goal::create([
            'title' => $request->title,
            'description' => $request->description,
            'target_amount' => $request->target_amount,
            'current_amount' => $request->current_amount ?? 0,
            'user_id' => auth()->id(),
            'deadline' => $request->deadline,
            'status' => $request->status,
        ]);

        return response()->json(new GoalResource($goal), 201);
    }

    /**
     * Ažuriranje postojećeg cilja.
     */
    public function update(Request $request, $id)
    {
        $goal = Goal::where('user_id', auth()->id())->findOrFail($id);

        $validator = Validator::make($request->all(), [
            'title' => 'required|string|max:255',
            'description' => 'nullable|string|max:255',
            'target_amount' => 'required|numeric|min:0',
            'current_amount' => 'nullable|numeric|min:0',
            'deadline' => 'nullable|date',
            'status' => 'required|in:active,completed,canceled',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $goal->update([
            'title' => $request->title,
            'description' => $request->description,
            'target_amount' => $request->target_amount,
            'current_amount' => $request->current_amount,
            'deadline' => $request->deadline,
            'status' => $request->status,
        ]);

        return response()->json(new GoalResource($goal), 200);
    }

    /**
     * Brisanje cilja.
     */
    public function destroy($id)
    {
        $goal = Goal::where('user_id', auth()->id())->findOrFail($id);
        $goal->delete();

        return response()->json(['message' => 'Cilj uspešno obrisan.'], 200);
    }
}
