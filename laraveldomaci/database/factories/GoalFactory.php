<?php

namespace Database\Factories;

use App\Models\Goal;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Goal>
 */
class GoalFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    protected $model = Goal::class;
    public function definition()
    {
        $statuses = ['in_progress', 'achieved', 'failed'];

        return [
            'title' => $this->faker->sentence(3), // Nasumičan naslov od 3 reči
            'description' => $this->faker->paragraph(), // Nasumičan opis
            'target_amount' => $this->faker->randomFloat(2, 500, 50000), // Ciljani iznos između 500 i 50,000
            'current_amount' => $this->faker->randomFloat(2, 0, 25000), // Trenutni iznos (maksimum pola ciljanog)
            'user_id' => User::inRandomOrder()->first()->id, // Nasumičan postojeći korisnik
            'deadline' => $this->faker->optional()->date(), // Rok može biti null
            'status' => $this->faker->randomElement($statuses), // Status cilja
        ];
    }
}
