<?php

namespace Database\Factories;

use App\Models\FeeStructure;
use App\Models\GradeLevel;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\FeeStructure>
 */
class FeeStructureFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $feeTypes = ['Tuition', 'Miscellaneous', 'Books', 'Laboratory'];

        $gradeLevelId = GradeLevel::inRandomOrder()->value('id') ?? GradeLevel::factory()->create()->id;

        return [
            'grade_level_id' => $gradeLevelId,
            'fee_type' => fake()->randomElement($feeTypes),
            'amount' => fake()->randomFloat(2, 5000, 30000),
            'school_year' => FeeStructure::currentSchoolYear(),
            'description' => fake()->optional(0.5)->sentence(),
            'is_required' => true,
            'is_active' => true,
        ];
    }
}
