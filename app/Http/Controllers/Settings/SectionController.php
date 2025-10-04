<?php

namespace App\Http\Controllers\Settings;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreSectionRequest;
use App\Http\Requests\UpdateSectionRequest;
use App\Models\Section;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Str;

class SectionController extends Controller
{
    public function store(StoreSectionRequest $request): RedirectResponse
    {
        $this->authorizeAdmin();

        $data = $request->validated();

        $section = Section::create([
            'grade_level_id' => $data['grade_level_id'],
            'name' => $data['name'],
            'slug' => $this->generateSlug($data['name'], $data['grade_level_id']),
            'description' => $data['description'] ?? null,
            'display_order' => $data['display_order'] ?? (Section::where('grade_level_id', $data['grade_level_id'])->max('display_order') + 1),
            'is_active' => $data['is_active'] ?? true,
        ]);

        return redirect()->back()->with('success', "Section {$section->name} created successfully.");
    }

    public function update(UpdateSectionRequest $request, Section $section): RedirectResponse
    {
        $this->authorizeAdmin();

        $data = $request->validated();

        $section->update([
            'grade_level_id' => $data['grade_level_id'],
            'name' => $data['name'],
            'slug' => $this->generateSlug($data['name'], $data['grade_level_id'], $section->id),
            'description' => $data['description'] ?? null,
            'display_order' => $data['display_order'] ?? $section->display_order,
            'is_active' => $data['is_active'] ?? $section->is_active,
        ]);

        return redirect()->back()->with('success', "Section {$section->name} updated successfully.");
    }

    public function destroy(Section $section): RedirectResponse
    {
        $this->authorizeAdmin();

        if ($section->students()->exists()) {
            return redirect()->back()->with('error', 'Cannot delete a section that has enrolled students.');
        }

        $section->delete();

        return redirect()->back()->with('success', 'Section removed successfully.');
    }

    protected function authorizeAdmin(): void
    {
        abort_unless(auth()->user()?->isAdmin(), 403);
    }

    protected function generateSlug(string $name, int $gradeLevelId, ?int $ignoreId = null): string
    {
        $base = Str::slug($name) ?: Str::slug('section');
        $slug = $base;
        $suffix = 1;

        $query = Section::where('grade_level_id', $gradeLevelId);
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
