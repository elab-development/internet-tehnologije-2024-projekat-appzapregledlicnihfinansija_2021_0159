<?php

namespace Database\Factories;
use App\Models\ExpenseCategory;
use App\Models\Expense;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Expense>
 */
class ExpenseFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    protected $model = Expense::class;
    public function definition()
    {
        return [
            'amount' => $this->faker->randomFloat(2, 10, 1000), // Nasumičan iznos između 10 i 1000
            'description' => $this->faker->sentence(), // Nasumičan opis
            'expense_category_id' => ExpenseCategory::inRandomOrder()->first()->id, // Nasumična postojeća kategorija
            'user_id' => User::inRandomOrder()->first()->id, // Nasumičan postojeći korisnik
            'currency' => $this->faker->currencyCode(), // Nasumična valuta (npr. USD, EUR)
            'date' => $this->faker->date(), // Nasumičan datum
            'status' => $this->faker->randomElement(['paid', 'unpaid']), // Status troška
        ];
    }
}
