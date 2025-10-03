<?php

namespace Database\Factories;

use App\Models\Student;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Payment>
 */
class PaymentFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $purposes = [
            'Tuition Fee',
            'Miscellaneous Fee',
            'Books',
            'Uniforms',
            'Laboratory Fee',
            'Field Trip',
            'Events',
        ];

        $paymentDate = fake()->dateTimeBetween('-3 months', 'now');

        return [
            'student_id' => Student::factory(),
            'user_id' => User::factory(),
            'receipt_number' => null, // Will be auto-generated
            'amount' => fake()->randomFloat(2, 500, 10000),
            'payment_date' => $paymentDate,
            'payment_purpose' => fake()->randomElement($purposes),
            'payment_method' => fake()->randomElement(['cash', 'cash', 'cash', 'check', 'online']),
            'notes' => fake()->optional(0.3)->sentence(),
            'printed_at' => fake()->optional(0.8)->dateTimeBetween($paymentDate, 'now'),
        ];
    }
}
