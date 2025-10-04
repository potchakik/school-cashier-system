<?php

namespace App\Http\Requests;

use App\Models\GradeLevel;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateGradeLevelRequest extends FormRequest
{
    public function authorize(): bool
    {
        return auth()->user()?->isAdmin() ?? false;
    }

    public function rules(): array
    {
        /** @var GradeLevel $gradeLevel */
        $gradeLevel = $this->route('gradeLevel');

        return [
            'name' => ['required', 'string', 'max:255', Rule::unique('grade_levels', 'name')->ignore($gradeLevel?->id)],
            'description' => ['nullable', 'string', 'max:1000'],
            'display_order' => ['nullable', 'integer', 'min:0'],
            'is_active' => ['nullable', 'boolean'],
        ];
    }
}
