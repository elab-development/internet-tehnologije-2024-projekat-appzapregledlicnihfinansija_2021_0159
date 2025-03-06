<?php

namespace App\Http\Controllers;

use App\Models\Income;
use App\Http\Resources\IncomeResource;
use App\Models\Goal;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Mail;
use App\Mail\GoalNotificationMail;

class IncomeController extends Controller
{
    /**
     * Prikaz svih prihoda.
     */
    public function index(Request $request)
    {
        $query = Income::where('user_id', auth()->id());

        if ($request->filled('description')) {
            $query->where('description', 'LIKE', '%' . $request->description . '%');
        }
        if ($request->filled('date')) {
            $query->whereDate('date', $request->date);
        }
        if ($request->filled('currency')) {
            $query->where('currency', $request->currency);
        }
        if ($request->filled('goal_id')) {
            $query->where('goal_id', $request->goal_id);
        }

        $incomes = $query->orderBy('date', 'desc')->paginate(5);

        return response()->json($incomes, 200);
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
     * Kreiranje novog prihoda (sa transakcijom).
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'amount' => 'required|numeric|min:0',
            'description' => 'nullable|string|max:255',
            'source' => 'required|string|max:255',
            'currency' => 'required|string|max:3',
            'date' => 'required|date',
            'goal_id' => 'nullable|exists:goals,id',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        DB::beginTransaction();
        try {
            // 1) Kreiramo Income
            $income = Income::create([
                'amount'      => $request->amount,
                'description' => $request->description,
                'source'      => $request->source,
                'user_id'     => auth()->id(),
                'currency'    => $request->currency,
                'date'        => $request->date,
                'goal_id'     => $request->goal_id,
            ]);

            // 2) Ako postoji goal_id, uvećavamo current_amount tog goal-a
            if ($income->goal_id) {
                $goal = Goal::findOrFail($income->goal_id);
                $goal->current_amount += $income->amount;


                // Provera statusa cilja i potencijalno slanje notifikacija
                $percentageAchieved = ($goal->current_amount / $goal->target_amount) * 100;

                // Ako je postignuto 80%, 90% ili 100%, šaljemo email notifikaciju
                if ($percentageAchieved >= 80 && $percentageAchieved < 90) {
                    // Funkcija za slanje email-a za 80%
                    $this->sendGoalNotification($goal, 80);
                } elseif ($percentageAchieved >= 90 && $percentageAchieved < 100) {
                    // Funkcija za slanje email-a za 90%
                    $this->sendGoalNotification($goal, 90);
                } elseif ($percentageAchieved >= 100) {
                    // Funkcija za slanje email-a za 100%
                    $this->sendGoalNotification($goal, 100);
                }
                // Provera da li je cilj postignut
                if ($goal->current_amount >= $goal->target_amount) {
                    $goal->status = 'achieved';
                }

                $goal->save();
            }

            DB::commit();
            return response()->json(new IncomeResource($income), 201);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'error' => 'Neuspešno kreiranje prihoda: ' . $e->getMessage()
            ], 500);
        }
    }

    public function sendGoalNotification($goal, $percentage)
    {
        if ($percentage >= 100) {
            $data = [
                'goalTitle' => $goal->title,
                'percentage' => $percentage,
                'targetAmount' => $goal->target_amount,
                'currentAmount' => $goal->current_amount,
                'remainingAmount' => 0,
            ];
        } else {
            $data = [
                'goalTitle' => $goal->title,
                'percentage' => $percentage,
                'targetAmount' => $goal->target_amount,
                'currentAmount' => $goal->current_amount,
                'remainingAmount' => $goal->target_amount - $goal->current_amount,
            ];
        }


        Mail::to(auth()->user()->email)->send(new GoalNotificationMail($data));
    }

    /**
     * Ažuriranje postojećeg prihoda (sa transakcijom).
     */
    public function update(Request $request, $id)
    {
        $income = Income::where('user_id', auth()->id())->findOrFail($id);

        $validator = Validator::make($request->all(), [
            'amount'      => 'required|numeric|min:0',
            'description' => 'nullable|string|max:255',
            'source'      => 'required|string|max:255',
            'currency'    => 'required|string|max:3',
            'date'        => 'required|date',
            'goal_id'     => 'nullable|exists:goals,id',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        // Čuvamo staru vrednost
        $oldGoalId   = $income->goal_id;
        $oldAmount   = $income->amount;

        DB::beginTransaction();
        try {
            // 1) Ažuriramo Income
            $income->update([
                'amount'      => $request->amount,
                'description' => $request->description,
                'source'      => $request->source,
                'currency'    => $request->currency,
                'date'        => $request->date,
                'goal_id'     => $request->goal_id,
            ]);

            // 2) Vratimo stari iznos starom goal-u (ako je postojao)
            if ($oldGoalId) {
                $oldGoal = Goal::findOrFail($oldGoalId);
                $oldGoal->current_amount -= $oldAmount;
                if ($oldGoal->current_amount < $oldGoal->target_amount && $oldGoal->status === 'achieved') {
                    $oldGoal->status = 'in_progress'; // ili nešto slično
                }

                $oldGoal->save();
            }

            // 3) Ako sada Income ima novi goal_id, dodajemo novi amount novom goal-u
            if ($income->goal_id) {
                $newGoal = Goal::findOrFail($income->goal_id);
                $newGoal->current_amount += $income->amount;

                // Provera da li je cilj postignut
                if ($newGoal->current_amount >= $newGoal->target_amount) {
                    $newGoal->status = 'achieved';
                }

                $newGoal->save();
            }

            DB::commit();
            return response()->json(new IncomeResource($income), 200);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'error' => 'Neuspešno ažuriranje prihoda: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Brisanje prihoda (sa transakcijom).
     */
    public function destroy($id)
    {
        $income = Income::where('user_id', auth()->id())->findOrFail($id);

        DB::beginTransaction();
        try {
            // Ako je Income vezan za cilj, treba da vratimo iznos
            if ($income->goal_id) {
                $goal = Goal::findOrFail($income->goal_id);

                // Pošto smo Income dodavali u goal, sad ga ODUZIMAMO
                $goal->current_amount -= $income->amount;

                // Možda goal više nije achieved
                if ($goal->current_amount < $goal->target_amount && $goal->status === 'achieved') {
                    $goal->status = 'in_progress'; // ili neki drugi status
                }

                $goal->save();
            }

            $income->delete();

            DB::commit();
            return response()->json(['message' => 'Prihod uspešno obrisan.'], 200);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'error' => 'Neuspešno brisanje prihoda: ' . $e->getMessage()
            ], 500);
        }
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
