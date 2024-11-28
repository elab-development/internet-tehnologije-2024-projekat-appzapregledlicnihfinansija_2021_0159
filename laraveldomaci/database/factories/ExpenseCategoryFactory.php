<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\ExpenseCategory>
 */
class ExpenseCategoryFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition()
    {
        $categories = [
            'Groceries', 'Utilities', 'Transportation', 'Rent',
            'Entertainment', 'Healthcare', 'Education', 'Dining Out',
            'Savings', 'Investments', 'Insurance', 'Personal Care',
            'Travel', 'Gifts', 'Clothing', 'Subscriptions'
        ];

        return [
            'name' => $this->faker->randomElement($categories),
            'user_id' => $this->faker->numberBetween(1, 20),
        ];
    }
}
