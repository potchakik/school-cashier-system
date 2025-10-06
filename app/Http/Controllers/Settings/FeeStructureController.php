<?php

namespace App\Http\Controllers\Settings;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreFeeStructureRequest;
use App\Http\Requests\UpdateFeeStructureRequest;
use App\Models\FeeStructure;
use App\Models\GradeLevel;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class FeeStructureController extends Controller
{
    public function index(Request $request): Response
    {
        $this->authorizeAdmin();

        $filters = $request->only(['grade_level_id', 'school_year', 'status']);
        $schoolYear = $filters['school_year'] ?? FeeStructure::currentSchoolYear();

        $query = FeeStructure::query()->with('gradeLevel');

        if (!empty($filters['grade_level_id'])) {
            $query->where('grade_level_id', $filters['grade_level_id']);
        }

        if (!empty($schoolYear)) {
            $query->where('school_year', $schoolYear);
        }

        if (!empty($filters['status'])) {
            if ($filters['status'] === 'active') {
                $query->where('is_active', true);
            } elseif ($filters['status'] === 'inactive') {
                $query->where('is_active', false);
            }
        }

        $feeStructures = $query
            ->orderByDesc('school_year')
            ->orderBy('grade_level_id')
            ->orderBy('fee_type')
            ->get()
            ->map(fn (FeeStructure $fee) => [
                'id' => $fee->id,
                'grade_level_id' => $fee->grade_level_id,
                'grade_level_name' => $fee->gradeLevel?->name,
                'fee_type' => $fee->fee_type,
                'amount' => $fee->amount,
                'school_year' => $fee->school_year,
                'is_required' => $fee->is_required,
                'is_active' => $fee->is_active,
                'description' => $fee->description,
            ]);

        $gradeLevels = GradeLevel::orderBy('display_order')->orderBy('name')->get(['id', 'name']);

        $schoolYears = FeeStructure::select('school_year')
            ->distinct()
            ->orderByDesc('school_year')
            ->pluck('school_year');

    return Inertia::render('academics/fee-structures/index', [
            'feeStructures' => $feeStructures,
            'gradeLevels' => $gradeLevels,
            'schoolYears' => $schoolYears,
            'filters' => [
                'grade_level_id' => $filters['grade_level_id'] ?? null,
                'school_year' => $schoolYear,
                'status' => $filters['status'] ?? null,
            ],
        ]);
    }

    public function store(StoreFeeStructureRequest $request): RedirectResponse
    {
        $this->authorizeAdmin();

        $data = $request->validated();

        FeeStructure::create([
            'grade_level_id' => $data['grade_level_id'],
            'fee_type' => $data['fee_type'],
            'amount' => $data['amount'],
            'school_year' => $data['school_year'],
            'description' => $data['description'] ?? null,
            'is_required' => $data['is_required'] ?? true,
            'is_active' => $data['is_active'] ?? true,
        ]);

        return redirect()->back()->with('success', 'Fee structure created successfully.');
    }

    public function update(UpdateFeeStructureRequest $request, FeeStructure $feeStructure): RedirectResponse
    {
        $this->authorizeAdmin();

        $data = $request->validated();

        $feeStructure->update([
            'grade_level_id' => $data['grade_level_id'],
            'fee_type' => $data['fee_type'],
            'amount' => $data['amount'],
            'school_year' => $data['school_year'],
            'description' => $data['description'] ?? null,
            'is_required' => $data['is_required'] ?? $feeStructure->is_required,
            'is_active' => $data['is_active'] ?? $feeStructure->is_active,
        ]);

        return redirect()->back()->with('success', 'Fee structure updated successfully.');
    }

    public function destroy(FeeStructure $feeStructure): RedirectResponse
    {
        $this->authorizeAdmin();

        $feeStructure->delete();

        return redirect()->back()->with('success', 'Fee structure removed successfully.');
    }

    protected function authorizeAdmin(): void
    {
        abort_unless(auth()->user()?->isAdmin(), 403);
    }
}
