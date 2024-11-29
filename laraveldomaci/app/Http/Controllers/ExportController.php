<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Income;
use App\Models\Expense;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ExportController extends Controller
{
    /**
     * Izvoz svih podataka za sve korisnike.
     *
     * @return \Illuminate\Http\Response
     */
    public function exportAll()
    {
        // Dohvata sve korisnike zajedno sa njihovim prihodima (incomes) i troškovima (expenses).
        $users = User::with(['incomes', 'expenses'])->get();

        // Definiše naziv CSV fajla koji će sadržati podatke o svim korisnicima.
        $fileName = 'all_users_data.csv';

        // Putanja gde će fajl privremeno biti smešten na serveru.
        $filePath = storage_path('app/public/' . $fileName);

        // Otvara fajl za pisanje.
        $file = fopen($filePath, 'w');

        // Dodavanje zaglavlja u CSV fajl.
        // Svaka kolona predstavlja određeni podatak o korisnicima.
        fputcsv($file, ['User ID', 'User Name', 'Total Income', 'Total Expense', 'Balance']);

        // Iteracija kroz sve korisnike kako bi se dodali njihovi podaci u fajl.
        foreach ($users as $user) {
            // Izračunava ukupan prihod korisnika.
            $totalIncome = $user->incomes->sum('amount');

            // Izračunava ukupan trošak korisnika.
            $totalExpense = $user->expenses->sum('amount');

            // Izračunava krajnji balans korisnika (prihod - trošak).
            $balance = $totalIncome - $totalExpense;

            // Dodaje red u CSV fajl sa podacima o trenutnom korisniku.
            fputcsv($file, [
                $user->id,         // ID korisnika.
                $user->name,       // Ime korisnika.
                $totalIncome,      // Ukupan prihod.
                $totalExpense,     // Ukupan trošak.
                $balance,          // Krajnji balans.
            ]);
        }

        // Zatvara fajl nakon što su svi podaci dodani.
        fclose($file);

        // Preuzima generisani CSV fajl kao odgovor korisniku i briše ga sa servera nakon preuzimanja.
        return response()->download($filePath)->deleteFileAfterSend(true);
    }

    /**
     * Izvoz podataka za određenog korisnika.
     *
     * @param int $id ID korisnika čiji podaci se eksportuju.
     * @return \Illuminate\Http\Response
     */
    public function exportUser($id)
    {
        // Pronalazi korisnika po ID-ju i učitava njegove prihode i troškove.
        // Ako korisnik ne postoji, metoda findOrFail baca grešku 404.
        $user = User::with(['incomes', 'expenses'])->findOrFail($id);

        // Definiše naziv CSV fajla za podatke o konkretnom korisniku.
        $fileName = 'user_' . $id . '_data.csv';

        // Putanja gde će fajl privremeno biti smešten na serveru.
        $filePath = storage_path('app/public/' . $fileName);

        // Otvara fajl za pisanje.
        $file = fopen($filePath, 'w');

        // Dodavanje zaglavlja u CSV fajl.
        fputcsv($file, ['User ID', 'User Name', 'Total Income', 'Total Expense', 'Balance']);

        // Izračunava ukupan prihod korisnika.
        $totalIncome = $user->incomes->sum('amount');

        // Izračunava ukupan trošak korisnika.
        $totalExpense = $user->expenses->sum('amount');

        // Izračunava krajnji balans korisnika (prihod - trošak).
        $balance = $totalIncome - $totalExpense;

        // Dodaje red u CSV fajl sa podacima o korisniku.
        fputcsv($file, [
            $user->id,         // ID korisnika.
            $user->name,       // Ime korisnika.
            $totalIncome,      // Ukupan prihod.
            $totalExpense,     // Ukupan trošak.
            $balance,          // Krajnji balans.
        ]);

        // Zatvara fajl nakon što su podaci dodani.
        fclose($file);

        // Preuzima generisani CSV fajl kao odgovor korisniku i briše ga sa servera nakon preuzimanja.
        return response()->download($filePath)->deleteFileAfterSend(true);
    }
}
