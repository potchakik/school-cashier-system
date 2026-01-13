<?php

namespace Database\Seeders;

use App\Models\Payment;
use App\Models\Student;
use App\Models\User;
use Illuminate\Database\Seeder;

class StudentSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create a cashier for payment processing
        $cashier = User::where('role', 'cashier')->first() ?? User::factory()->create([
            'name' => 'Test Cashier',
            'email' => 'cashier@school.test',
            'role' => 'cashier',
            'is_active' => true,
        ]);

        // Create 50 students with varying payment statuses
        $students = Student::factory(50)->create();

        foreach ($students as $index => $student) {
            // 30% fully paid
            if ($index < 15) {
                $totalFees = $student->expected_fees;
                Payment::factory()->create([
                    'student_id' => $student->id,
                    'user_id' => $cashier->id,
                    'amount' => $totalFees,
                    'payment_purpose' => 'Tuition Fee',
                    'payment_date' => now()->subDays(rand(1, 30)),
                ]);
            }
            // 40% partial payment
            elseif ($index < 35) {
                $totalFees = $student->expected_fees;
                $partialAmount = $totalFees * (rand(30, 70) / 100);
                Payment::factory()->create([
                    'student_id' => $student->id,
                    'user_id' => $cashier->id,
                    'amount' => $partialAmount,
                    'payment_purpose' => 'Tuition Fee',
                    'payment_date' => now()->subDays(rand(1, 60)),
                ]);
            }
            // 30% outstanding (no payment)
        }
    }
}
