<?php

namespace App\Http\Requests;

use App\Models\FeeStructure;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateFeeStructureRequest extends FormRequest
{
    public function authorize(): bool
    {
        return auth()->user()?->isAdmin() ?? false;
    }

    public function rules(): array
    {
        /** @var FeeStructure $feeStructure */
        $feeStructure = $this->route('feeStructure');
        $gradeLevelId = $this->input('grade_level_id', $feeStructure?->grade_level_id);
        $schoolYear = $this->input('school_year', $feeStructure?->school_year);

        return [
            'grade_level_id' => ['required', 'exists:grade_levels,id'],
            'fee_type' => [
                'required',
                'string',
                'max:255',
                Rule::unique('fee_structures', 'fee_type')
                    ->where(fn ($query) => $query
                        ->where('grade_level_id', $gradeLevelId)
                        ->where('school_year', $schoolYear))
                    ->ignore($feeStructure?->id),
            ],
            'amount' => ['required', 'numeric', 'min:0'],
            'school_year' => ['required', 'string', 'max:25'],
            'description' => ['nullable', 'string', 'max:1000'],
            'is_active' => ['nullable', 'boolean'],
            'is_required' => ['nullable', 'boolean'],
        ];
    }

    protected function prepareForValidation(): void
    {
        $data = [];

        if ($this->has('school_year')) {
            $data['school_year'] = trim($this->input('school_year'));
        }

        $data['is_active'] = $this->boolean('is_active');
        $data['is_required'] = $this->has('is_required') ? $this->boolean('is_required') : true;

        $this->merge($data);
    }
}
