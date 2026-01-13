<?php

namespace Database\Factories;

use App\Models\GradeLevel;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<GradeLevel>
 */
class GradeLevelFactory extends Factory
{
    protected $model = GradeLevel::class;

    public function definition(): array
    {
        $name = 'Grade ' . fake()->numberBetween(1, 12);

        return [
            'name' => $name,
            'slug' => Str::slug($name . '-' . fake()->unique()->numberBetween(1, 1000)),
            'description' => fake()->optional()->sentence(),
            'display_order' => fake()->numberBetween(1, 12),
            'is_active' => true,
        ];
    }
}
