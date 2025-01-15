<?php

namespace Database\Factories;

use App\Models\Income;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Income>
 */
class IncomeFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    protected $model = Income::class;
    public function definition()
    {
        $sources = ['Salary', 'Bonus', 'Freelance', 'Investment', 'Gift','Other'];

        return [
            'amount' => $this->faker->randomFloat(2, 100, 10000), // Nasumičan iznos između 100 i 10,000
            'description' => $this->faker->sentence(), // Nasumičan opis
            'user_id' => User::inRandomOrder()->first()->id, // Nasumičan postojeći korisnik
            'source' => $this->faker->randomElement($sources), // Izvor prihoda
            'currency' => $this->faker->currencyCode(), // Nasumična valuta (npr. USD, EUR)
            'date' => $this->faker->date(), // Nasumičan datum
        ];
    }
}
