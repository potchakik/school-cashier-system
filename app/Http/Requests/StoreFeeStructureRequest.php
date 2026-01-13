<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreFeeStructureRequest extends FormRequest
{
    public function authorize(): bool
    {
        return auth()->user()?->isAdmin() ?? false;
    }

    public function rules(): array
    {
        return [
            'grade_level_id' => ['required', 'exists:grade_levels,id'],
            'fee_type' => [
                'required',
                'string',
                'max:255',
                Rule::unique('fee_structures')->where(fn ($query) => $query
                    ->where('grade_level_id', $this->input('grade_level_id'))
                    ->where('fee_type', $this->input('fee_type'))
                    ->where('school_year', $this->input('school_year'))),
            ],
            'amount' => ['required', 'numeric', 'min:0'],
            'school_year' => ['required', 'string', 'max:25'],
            'description' => ['nullable', 'string', 'max:1000'],
            'is_active' => ['nullable', 'boolean'],
            'is_required' => ['nullable', 'boolean'],
            'composite' => [
                Rule::unique('fee_structures')->where(fn ($query) => $query
                    ->where('grade_level_id', $this->input('grade_level_id'))
                    ->where('fee_type', $this->input('fee_type'))
                    ->where('school_year', $this->input('school_year'))),
            ],
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
