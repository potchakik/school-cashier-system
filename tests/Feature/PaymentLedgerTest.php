<?php

describe('Payment ledger integration', function () {
    it('creates a ledger entry when a payment is made', function () {
        $student = \App\Models\Student::factory()->create();
        $user = \App\Models\User::factory()->create();
        $this->actingAs($user);

        $response = $this->post(route('payments.store'), [
            'student_id' => $student->id,
            'amount' => 100.00,
            'payment_date' => now()->format('Y-m-d'),
            'payment_purpose' => 'Tuition',
            'payment_method' => 'cash',
        ]);

        $response->assertRedirect();
        $this->assertDatabaseHas('payments', [
            'student_id' => $student->id,
            'amount' => 100.00,
        ]);
        $payment = \App\Models\Payment::first();
        $this->assertDatabaseHas('ledgers', [
            'student_id' => $student->id,
            'payment_id' => $payment->id,
            'amount' => 100.00,
            'type' => 'payment',
            'date' => $payment->payment_date,
        ]);
    });
});
