<?php

namespace App\Http\Controllers;

use App\Models\Expense;
use App\Http\Resources\ExpenseResource;
use App\Models\Goal;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

    // /**
    //  * za seminarski je ovaj kontroler dopunjen sa transakcijama
    //  */


class ExpenseController extends Controller
{
    // /**
    //  * Prikaz svih troškova.
    //  */
    public function index(Request $request)
    {
        $query = Expense::where('user_id', auth()->id());

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

        $expenses = $query->orderBy('date', 'desc')->paginate(10);

        return response()->json($expenses, 200);
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
     * Kreiranje novog troška (sa ažuriranjem Goal-a unutar jedne transakcije).
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
            'goal_id' => 'nullable|exists:goals,id',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        // Sprovesti sve u jednoj DB transakciji
        DB::beginTransaction();
        try {
            // Kreiramo novi trošak
            $expense = Expense::create([
                'amount' => $request->amount,
                'description' => $request->description,
                'expense_category_id' => $request->expense_category_id,
                'user_id' => auth()->id(),
                'currency' => $request->currency,
                'date' => $request->date,
                'status' => $request->status,
                'goal_id' => $request->goal_id,
            ]);

            // Ako je trošak vezan za neki cilj, ažuriramo current_amount za taj cilj
            if ($expense->goal_id) {
                $goal = Goal::findOrFail($expense->goal_id);
                // Npr. oduzimamo expense->amount od goal->current_amount
                $goal->current_amount -= $expense->amount;

                // Logika za status goal-a (primer)
                if ($goal->current_amount < 0) {
                    $goal->current_amount = 0;
                    $goal->status = 'failed';
                }

                $goal->save();
            }

            DB::commit();  // sve OK
            return response()->json(new ExpenseResource($expense), 201);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'error' => 'Neuspešno dodavanje troška: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Ažuriranje postojećeg troška (sa ažuriranjem Goal-a u jednoj transakciji).
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
            'goal_id' => 'nullable|exists:goals,id',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        // Čuvamo stare vrednosti pre ažuriranja
        $oldGoalId = $expense->goal_id;
        $oldAmount = $expense->amount;

        DB::beginTransaction();
        try {
            // Ažuriramo trošak
            $expense->update([
                'amount' => $request->amount,
                'description' => $request->description,
                'expense_category_id' => $request->expense_category_id,
                'currency' => $request->currency,
                'date' => $request->date,
                'status' => $request->status,
                'goal_id' => $request->goal_id,
            ]);

            // 1) Vraćamo stari iznos goal-u kome je trošak pripadao (ako ga je bilo)
            if ($oldGoalId) {
                $oldGoal = Goal::findOrFail($oldGoalId);
                // Pošto smo pri kreiranju expense-a oduzimali amount, sada taj stari iznos vraćamo
                $oldGoal->current_amount += $oldAmount;
                $oldGoal->save();
            }

            // 2) Ako sada trošak pripada novom goal-u (ili isto starom, ali se iznos promenio):
            if ($expense->goal_id) {
                $newGoal = Goal::findOrFail($expense->goal_id);
                // Sada ponovo oduzimamo novi iznos
                $newGoal->current_amount -= $expense->amount;


                // Provera statusa cilja i potencijalno slanje notifikacija
                $percentageAchieved = (($newGoal->target_amount - $newGoal->current_amount) / $newGoal->target_amount) * 100;

                // Ako je postignuto 80%, 90% ili 100%, šaljemo email notifikaciju
                if ($percentageAchieved >= 80 && $percentageAchieved < 90) {
                    // Funkcija za slanje email-a za 80%
                    $this->sendGoalNotification($newGoal, 80);
                } elseif ($percentageAchieved >= 90 && $percentageAchieved < 100) {
                    // Funkcija za slanje email-a za 90%
                    $this->sendGoalNotification($newGoal, 90);
                } elseif ($percentageAchieved >= 100) {
                    // Funkcija za slanje email-a za 100%
                    $this->sendGoalNotification($newGoal, 100);
                }


                // Provera da li je newGoal pao ispod 0
                if ($newGoal->current_amount < 0) {
                    $newGoal->current_amount = 0;
                    $newGoal->status = 'failed';
                }

                $newGoal->save();
            }

            DB::commit();
            return response()->json(new ExpenseResource($expense), 200);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'error' => 'Neuspešno ažuriranje troška: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Brisanje troška (sa ažuriranjem Goal-a).
     */
    public function destroy($id)
    {
        $expense = Expense::where('user_id', auth()->id())->findOrFail($id);

        DB::beginTransaction();
        try {
            // Ako je trošak vezan za cilj, treba da "vratimo" amount tom cilju (pošto smo ga oduzimali)
            if ($expense->goal_id) {
                $goal = Goal::findOrFail($expense->goal_id);
                $goal->current_amount += $expense->amount;
                $goal->save();
            }

            $expense->delete();

            DB::commit();
            return response()->json(['message' => 'Trošak uspešno obrisan.'], 200);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'error' => 'Neuspešno brisanje troška: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Pretraga troškova za ulogovanog korisnika.
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

        $expenses = Expense::where('user_id', auth()->id())
            ->where(function ($queryBuilder) use ($query) {
                $queryBuilder->where('description', 'LIKE', "%{$query}%")
                    ->orWhere('currency', 'LIKE', "%{$query}%");
            })
            ->get();

        return response()->json(ExpenseResource::collection($expenses), 200);
    }
}
