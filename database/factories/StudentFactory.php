<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Student>
 */
class StudentFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $gradeLevels = [
            'Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5', 'Grade 6',
            'Grade 7', 'Grade 8', 'Grade 9', 'Grade 10', 'Grade 11', 'Grade 12'
        ];

        $sections = ['A', 'B', 'C', 'D', 'E'];

        return [
            'student_number' => 'STU-' . now()->year . '-' . fake()->unique()->numberBetween(1000, 9999),
            'first_name' => fake()->firstName(),
            'middle_name' => fake()->optional(0.7)->lastName(),
            'last_name' => fake()->lastName(),
            'grade_level' => fake()->randomElement($gradeLevels),
            'section' => fake()->randomElement($sections),
            'contact_number' => fake()->optional(0.8)->numerify('09#########'),
            'email' => fake()->optional(0.5)->safeEmail(),
            'parent_name' => fake()->optional(0.9)->name(),
            'parent_contact' => fake()->optional(0.9)->numerify('09#########'),
            'parent_email' => fake()->optional(0.6)->safeEmail(),
            'status' => fake()->randomElement(['active', 'active', 'active', 'inactive']), // 75% active
            'notes' => fake()->optional(0.2)->sentence(),
        ];
    }
}
