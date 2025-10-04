<?php

namespace App\Http\Controllers\Settings;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreGradeLevelRequest;
use App\Http\Requests\UpdateGradeLevelRequest;
use App\Models\FeeStructure;
use App\Models\GradeLevel;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class GradeLevelController extends Controller
{
    public function index(Request $request): Response
    {
        $this->authorizeAdmin();

        $schoolYear = $request->get('school_year') ?? FeeStructure::currentSchoolYear();

        $gradeLevels = GradeLevel::with([
            'sections' => fn ($query) => $query->orderBy('display_order')->orderBy('name'),
            'feeStructures' => fn ($query) => $query
                ->where('school_year', $schoolYear)
                ->orderBy('fee_type'),
        ])
            ->withCount(['sections', 'students'])
            ->orderBy('display_order')
            ->orderBy('name')
            ->get()
            ->map(function (GradeLevel $gradeLevel) use ($schoolYear) {
                $existingFees = $gradeLevel->feeStructures->where('school_year', $schoolYear);

                return [
                    'id' => $gradeLevel->id,
                    'name' => $gradeLevel->name,
                    'slug' => $gradeLevel->slug,
                    'description' => $gradeLevel->description,
                    'display_order' => $gradeLevel->display_order,
                    'is_active' => $gradeLevel->is_active,
                    'sections_count' => $gradeLevel->sections_count,
                    'students_count' => $gradeLevel->students_count,
                    'fee_total' => $existingFees->sum('amount'),
                    'fees' => $existingFees->map(fn ($fee) => [
                        'id' => $fee->id,
                        'fee_type' => $fee->fee_type,
                        'amount' => $fee->amount,
                        'is_required' => $fee->is_required,
                        'is_active' => $fee->is_active,
                    ])->values(),
                    'sections' => $gradeLevel->sections->map(fn ($section) => [
                        'id' => $section->id,
                        'name' => $section->name,
                        'slug' => $section->slug,
                        'description' => $section->description,
                        'is_active' => $section->is_active,
                        'display_order' => $section->display_order,
                    ])->values(),
                ];
            });

        $schoolYears = FeeStructure::select('school_year')
            ->distinct()
            ->orderByDesc('school_year')
            ->pluck('school_year');

        return Inertia::render('settings/academics/grade-levels/index', [
            'gradeLevels' => $gradeLevels,
            'filters' => [
                'school_year' => $schoolYear,
            ],
            'schoolYears' => $schoolYears,
        ]);
    }

    public function store(StoreGradeLevelRequest $request): RedirectResponse
    {
        $this->authorizeAdmin();

        $data = $request->validated();
        $gradeLevel = GradeLevel::create([
            'name' => $data['name'],
            'slug' => $this->generateSlug($data['name']),
            'description' => $data['description'] ?? null,
            'display_order' => $data['display_order'] ?? (GradeLevel::max('display_order') + 1),
            'is_active' => $data['is_active'] ?? true,
        ]);

        return redirect()
            ->back()
            ->with('success', "Grade level {$gradeLevel->name} created successfully.");
    }

    public function update(UpdateGradeLevelRequest $request, GradeLevel $gradeLevel): RedirectResponse
    {
        $this->authorizeAdmin();

        $data = $request->validated();

        $gradeLevel->update([
            'name' => $data['name'],
            'slug' => $this->generateSlug($data['name'], $gradeLevel->id),
            'description' => $data['description'] ?? null,
            'display_order' => $data['display_order'] ?? $gradeLevel->display_order,
            'is_active' => $data['is_active'] ?? $gradeLevel->is_active,
        ]);

        return redirect()
            ->back()
            ->with('success', "Grade level {$gradeLevel->name} updated successfully.");
    }

    public function destroy(GradeLevel $gradeLevel): RedirectResponse
    {
        $this->authorizeAdmin();

        if ($gradeLevel->students()->exists()) {
            return redirect()->back()->with('error', 'Cannot delete a grade level that has enrolled students.');
        }

        if ($gradeLevel->feeStructures()->exists()) {
            return redirect()->back()->with('error', 'Remove associated fee structures before deleting this grade level.');
        }

        $gradeLevel->sections()->delete();
        $gradeLevel->delete();

        return redirect()->back()->with('success', 'Grade level removed successfully.');
    }

    protected function authorizeAdmin(): void
    {
        abort_unless(auth()->user()?->isAdmin(), 403);
    }

    protected function generateSlug(string $name, ?int $ignoreId = null): string
    {
        $base = Str::slug($name) ?: Str::slug('grade-level');
        $slug = $base;
        $suffix = 1;

        $query = GradeLevel::query();
        if ($ignoreId) {
            $query->where('id', '!=', $ignoreId);
        }

        while ((clone $query)->where('slug', $slug)->exists()) {
            $slug = $base . '-' . $suffix;
            $suffix++;
        }

        return $slug;
    }
}
