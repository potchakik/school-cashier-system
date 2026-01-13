<?php

namespace Database\Factories;

use App\Models\GradeLevel;
use App\Models\Section;
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
        return [
            'student_number' => 'STU-' . now()->year . '-' . fake()->unique()->numberBetween(1000, 9999),
            'first_name' => fake()->firstName(),
            'middle_name' => fake()->optional(0.7)->lastName(),
            'last_name' => fake()->lastName(),
            'grade_level_id' => function () {
                $existing = GradeLevel::inRandomOrder()->first();

                return $existing?->id ?? GradeLevel::factory()->create()->id;
            },
            'section_id' => function (array $attributes) {
                $gradeLevelId = $attributes['grade_level_id'] ?? GradeLevel::factory()->create()->id;

                $existingSection = Section::where('grade_level_id', $gradeLevelId)
                    ->inRandomOrder()
                    ->first();

                return $existingSection?->id ?? Section::factory()->create([
                    'grade_level_id' => $gradeLevelId,
                ])->id;
            },
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
