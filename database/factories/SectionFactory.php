<?php

namespace Database\Factories;

use App\Models\GradeLevel;
use App\Models\Section;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<Section>
 */
class SectionFactory extends Factory
{
    protected $model = Section::class;

    public function definition(): array
    {
        $gradeLevel = GradeLevel::factory();
        $name = strtoupper(fake()->unique()->randomLetter());

        return [
            'grade_level_id' => GradeLevel::exists() ? GradeLevel::inRandomOrder()->first()->id : $gradeLevel,
            'name' => $name,
            'slug' => Str::slug($name . '-' . fake()->numberBetween(1, 1000)),
            'description' => fake()->optional()->sentence(),
            'display_order' => fake()->numberBetween(1, 10),
            'is_active' => true,
        ];
    }
}
