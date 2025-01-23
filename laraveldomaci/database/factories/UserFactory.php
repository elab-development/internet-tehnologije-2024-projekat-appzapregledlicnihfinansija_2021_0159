<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\User>
 */
class UserFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition()
    {
        return [
            'name' => $this->faker->name(),
            'email' => $this->faker->unique()->safeEmail(),
            'email_verified_at' => now(),
            'password' => Hash::make('password'), // podrazumevana lozinka za testiranje
            'address' => $this->faker->address(),
            'phone_number' => $this->faker->phoneNumber(),
            'remember_token' => Str::random(10),
            'type' => $this->getRandomType(), // Dodajemo logiku za nasumičan izbor tipa, poziva se funkcija ispod

        ];
    }



 /**
     * Get a random user type with 'regular' as the most frequent type.
     *
     * @return string
     */
    private function getRandomType()
    {
        // Većinski regularni korisnici (npr. 70% regular, 20% guest, 10% admin)
        $types = [
            'regular', 'regular', 'regular', 'regular', 'regular', 'regular', 'regular',
            'guest', 'guest',
            'admin',
        ];

        return $this->faker->randomElement($types);
    }



    /**
     * Indicate that the model's email address should be unverified.
     *
     * @return static
     */
    public function unverified()
    {
        return $this->state(fn (array $attributes) => [
            'email_verified_at' => null,
        ]);
    }
}
