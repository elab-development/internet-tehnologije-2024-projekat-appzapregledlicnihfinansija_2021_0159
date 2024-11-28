<?php

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\ExpenseCategory;
use App\Models\Expense;
use App\Models\Income;
use App\Models\Goal;
class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     *
     * @return void
     */
    public function run()
    {
        // \App\Models\User::factory(10)->create();

        // \App\Models\User::factory()->create([
        //     'name' => 'Test User',
        //     'email' => 'test@example.com',
        // ]);

         // Kreiranje korisnika
         User::factory(20)->create(); // Generiše 20 korisnika

         // Kreiranje kategorija troškova
         ExpenseCategory::factory(50)->create(); // Generiše 50 kategorija troškova
 
         // Kreiranje troškova
         Expense::factory(100)->create(); // Generiše 100 troškova
 
         // Kreiranje prihoda
         Income::factory(100)->create(); // Generiše 100 prihoda
 
         // Kreiranje ciljeva
         Goal::factory(30)->create(); // Generiše 30 ciljeva
    }
}
