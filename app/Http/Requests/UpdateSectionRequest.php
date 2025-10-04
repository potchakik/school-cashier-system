<?php

namespace App\Http\Requests;

use App\Models\Section;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateSectionRequest extends FormRequest
{
    public function authorize(): bool
    {
        return auth()->user()?->isAdmin() ?? false;
    }

    public function rules(): array
    {
        /** @var Section $section */
        $section = $this->route('section');

        $gradeLevelId = $this->input('grade_level_id', $section?->grade_level_id);

        return [
            'grade_level_id' => ['required', 'exists:grade_levels,id'],
            'name' => [
                'required',
                'string',
                'max:255',
                Rule::unique('sections', 'name')
                    ->where(fn ($query) => $query->where('grade_level_id', $gradeLevelId))
                    ->ignore($section?->id),
            ],
            'description' => ['nullable', 'string', 'max:1000'],
            'display_order' => ['nullable', 'integer', 'min:0'],
            'is_active' => ['nullable', 'boolean'],
        ];
    }
}
