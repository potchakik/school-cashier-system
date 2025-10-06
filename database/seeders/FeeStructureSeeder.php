<?php

namespace Database\Seeders;

use App\Models\FeeStructure;
use App\Models\GradeLevel;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class FeeStructureSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $schoolYear = FeeStructure::currentSchoolYear();

        $feeSchedules = [
            [
                'grades' => range(1, 6),
                'fees' => [
                    ['fee_type' => 'Tuition', 'amount' => 25000],
                    ['fee_type' => 'Miscellaneous', 'amount' => 5000],
                    ['fee_type' => 'Books', 'amount' => 3000],
                ],
            ],
            [
                'grades' => range(7, 10),
                'fees' => [
                    ['fee_type' => 'Tuition', 'amount' => 30000],
                    ['fee_type' => 'Miscellaneous', 'amount' => 6000],
                    ['fee_type' => 'Books', 'amount' => 4000],
                    ['fee_type' => 'Laboratory', 'amount' => 2000],
                ],
            ],
            [
                'grades' => range(11, 12),
                'fees' => [
                    ['fee_type' => 'Tuition', 'amount' => 35000],
                    ['fee_type' => 'Miscellaneous', 'amount' => 7000],
                    ['fee_type' => 'Books', 'amount' => 5000],
                    ['fee_type' => 'Laboratory', 'amount' => 3000],
                ],
            ],
        ];

        $displayOrder = 1;

        foreach ($feeSchedules as $schedule) {
            foreach ($schedule['grades'] as $gradeNumber) {
                $gradeName = "Grade {$gradeNumber}";
                $slug = Str::slug($gradeName);

                $gradeLevel = GradeLevel::updateOrCreate(
                    ['name' => $gradeName],
                    [
                        'slug' => $slug,
                        'display_order' => $displayOrder,
                        'description' => null,
                        'is_active' => true,
                    ],
                );

                $displayOrder++;

                foreach ($schedule['fees'] as $fee) {
                    FeeStructure::updateOrCreate(
                        [
                            'grade_level_id' => $gradeLevel->id,
                            'fee_type' => $fee['fee_type'],
                            'school_year' => $schoolYear,
                        ],
                        [
                            'amount' => $fee['amount'],
                            'description' => $fee['description'] ?? null,
                            'is_required' => $fee['is_required'] ?? true,
                            'is_active' => $fee['is_active'] ?? true,
                        ],
                    );
                }
            }
        }
    }
}
