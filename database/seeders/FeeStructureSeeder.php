<?php

namespace Database\Seeders;

use App\Models\FeeStructure;
use Illuminate\Database\Seeder;

class FeeStructureSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $schoolYear = FeeStructure::currentSchoolYear();

        // Elementary (Grades 1-6)
        $elementaryFees = [
            ['fee_type' => 'Tuition', 'amount' => 25000],
            ['fee_type' => 'Miscellaneous', 'amount' => 5000],
            ['fee_type' => 'Books', 'amount' => 3000],
        ];

        for ($grade = 1; $grade <= 6; $grade++) {
            foreach ($elementaryFees as $fee) {
                FeeStructure::create([
                    'grade_level' => "Grade {$grade}",
                    'fee_type' => $fee['fee_type'],
                    'amount' => $fee['amount'],
                    'school_year' => $schoolYear,
                    'is_active' => true,
                ]);
            }
        }

        // Junior High (Grades 7-10)
        $juniorHighFees = [
            ['fee_type' => 'Tuition', 'amount' => 30000],
            ['fee_type' => 'Miscellaneous', 'amount' => 6000],
            ['fee_type' => 'Books', 'amount' => 4000],
            ['fee_type' => 'Laboratory', 'amount' => 2000],
        ];

        for ($grade = 7; $grade <= 10; $grade++) {
            foreach ($juniorHighFees as $fee) {
                FeeStructure::create([
                    'grade_level' => "Grade {$grade}",
                    'fee_type' => $fee['fee_type'],
                    'amount' => $fee['amount'],
                    'school_year' => $schoolYear,
                    'is_active' => true,
                ]);
            }
        }

        // Senior High (Grades 11-12)
        $seniorHighFees = [
            ['fee_type' => 'Tuition', 'amount' => 35000],
            ['fee_type' => 'Miscellaneous', 'amount' => 7000],
            ['fee_type' => 'Books', 'amount' => 5000],
            ['fee_type' => 'Laboratory', 'amount' => 3000],
        ];

        for ($grade = 11; $grade <= 12; $grade++) {
            foreach ($seniorHighFees as $fee) {
                FeeStructure::create([
                    'grade_level' => "Grade {$grade}",
                    'fee_type' => $fee['fee_type'],
                    'amount' => $fee['amount'],
                    'school_year' => $schoolYear,
                    'is_active' => true,
                ]);
            }
        }
    }
}
