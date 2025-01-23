<?php

namespace App\Http\Controllers;

use App\Models\Goal;
use App\Http\Resources\GoalResource;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Mail;
use App\Mail\GoalNotificationMail;

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
            'status' => 'required|in:in_progress,achieved,failed',
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
            'status' => 'required|in:in_progress,achieved,failed',
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
        // Provera statusa cilja i potencijalno slanje notifikacija
        $percentageAchieved = ($goal->current_amount / $goal->target_amount) * 100;

        // Ako je postignuto 80%, 90% ili 100%, šaljemo email notifikaciju
        if ($percentageAchieved >= 80 && $percentageAchieved < 90) {
            $this->sendGoalNotification($goal, 80);
        } elseif ($percentageAchieved >= 90 && $percentageAchieved < 100) {
            $this->sendGoalNotification($goal, 90);
        } elseif ($percentageAchieved >= 100) {
            $this->sendGoalNotification($goal, 100);
        }

        // Provera da li je cilj postignut
        if ($goal->current_amount >= $goal->target_amount) {
            $goal->status = 'achieved';
            $goal->save();
        }

        if ($goal->current_amount < $goal->target_amount) {
            $goal->status = 'in_progress';
            $goal->save();
        }
        return response()->json(new GoalResource($goal), 200);
    }

    public function sendGoalNotification($goal, $percentage)
    {
        $data = [
            'goalTitle' => $goal->title,
            'percentage' => $percentage,
            'targetAmount' => $goal->target_amount,
            'currentAmount' => $goal->current_amount,
            'remainingAmount' => $goal->target_amount - $goal->current_amount,
        ];

        Mail::to(auth()->user()->email)->send(new GoalNotificationMail($data));
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
