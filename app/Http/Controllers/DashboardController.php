<?php

namespace App\Http\Controllers;

use App\Models\Payment;
use App\Models\Student;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    /**
     * Display the dashboard with statistics
     */
    public function index(): Response
    {
        // Get current date context
        $today = Carbon::today();
        $thisMonth = Carbon::now()->startOfMonth();
        $thisYear = Carbon::now()->startOfYear();

        // Total students statistics
        $totalStudents = Student::count();
        $activeStudents = Student::where('status', 'active')->count();

        // Payment statistics
        $todayPayments = Payment::whereDate('payment_date', $today)->sum('amount');
        $monthlyPayments = Payment::whereDate('payment_date', '>=', $thisMonth)->sum('amount');
        $yearlyPayments = Payment::whereDate('payment_date', '>=', $thisYear)->sum('amount');
        $todayPaymentCount = Payment::whereDate('payment_date', $today)->count();

        // Last 7 days payment trend
        $last7Days = [];
        for ($i = 6; $i >= 0; $i--) {
            $date = Carbon::today()->subDays($i);
            $last7Days[] = [
                'date' => $date->format('M d'),
                'amount' => (float) Payment::whereDate('payment_date', $date)->sum('amount'),
                'count' => Payment::whereDate('payment_date', $date)->count(),
            ];
        }

        // Monthly trend (last 6 months)
        $monthlyTrend = [];
        for ($i = 5; $i >= 0; $i--) {
            $month = Carbon::now()->subMonths($i)->startOfMonth();
            $monthEnd = Carbon::now()->subMonths($i)->endOfMonth();
            $monthlyTrend[] = [
                'month' => $month->format('M Y'),
                'amount' => (float) Payment::whereBetween('payment_date', [$month, $monthEnd])->sum('amount'),
                'count' => Payment::whereBetween('payment_date', [$month, $monthEnd])->count(),
            ];
        }

        // Payment method distribution
        $paymentMethods = Payment::select('payment_method', DB::raw('count(*) as count'), DB::raw('sum(amount) as total'))
            ->whereDate('payment_date', '>=', $thisMonth)
            ->groupBy('payment_method')
            ->get()
            ->map(function ($item) {
                return [
                    'method' => ucfirst($item->payment_method),
                    'count' => $item->count,
                    'total' => (float) $item->total,
                ];
            });

        // Payment purpose distribution
        $paymentPurposes = Payment::select('payment_purpose', DB::raw('count(*) as count'), DB::raw('sum(amount) as total'))
            ->whereDate('payment_date', '>=', $thisMonth)
            ->groupBy('payment_purpose')
            ->limit(5)
            ->orderByDesc('total')
            ->get()
            ->map(function ($item) {
                return [
                    'purpose' => ucfirst(str_replace('_', ' ', $item->payment_purpose)),
                    'count' => $item->count,
                    'total' => (float) $item->total,
                ];
            });

        // Recent payments
        $recentPayments = Payment::with(['student', 'user'])
            ->latest('payment_date')
            ->take(5)
            ->get()
            ->map(function ($payment) {
                return [
                    'id' => $payment->id,
                    'receipt_number' => $payment->receipt_number,
                    'student_name' => $payment->student->full_name ?? 'N/A',
                    'amount' => (float) $payment->amount,
                    'payment_date' => $payment->payment_date->format('M d, Y'),
                    'payment_purpose' => ucfirst(str_replace('_', ' ', $payment->payment_purpose)),
                ];
            });

        return Inertia::render('dashboard', [
            'statistics' => [
                'students' => [
                    'total' => $totalStudents,
                    'active' => $activeStudents,
                ],
                'payments' => [
                    'today' => (float) $todayPayments,
                    'todayCount' => $todayPaymentCount,
                    'monthly' => (float) $monthlyPayments,
                    'yearly' => (float) $yearlyPayments,
                ],
                'last7Days' => $last7Days,
                'monthlyTrend' => $monthlyTrend,
                'paymentMethods' => $paymentMethods,
                'paymentPurposes' => $paymentPurposes,
                'recentPayments' => $recentPayments,
            ],
        ]);
    }
}
