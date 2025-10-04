<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class FeeStructure extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'grade_level_id',
        'fee_type',
        'amount',
        'school_year',
    'description',
    'is_required',
    'is_active',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected function casts(): array
    {
        return [
            'grade_level_id' => 'integer',
            'amount' => 'decimal:2',
            'is_required' => 'boolean',
            'is_active' => 'boolean',
            'created_at' => 'datetime',
            'updated_at' => 'datetime',
        ];
    }

    protected $appends = [
        'grade_level_name',
    ];

    /**
     * Scope a query to only include active fees
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    /**
     * Scope a query to filter by school year
     */
    public function scopeSchoolYear($query, $schoolYear)
    {
        return $query->where('school_year', $schoolYear);
    }

    /**
     * Scope a query to filter by grade level
     */
    public function scopeGradeLevel($query, $gradeLevel)
    {
        if (is_numeric($gradeLevel)) {
            return $query->where('grade_level_id', (int) $gradeLevel);
        }

        return $query->whereHas('gradeLevel', function ($relation) use ($gradeLevel) {
            $relation->where('slug', $gradeLevel)
                ->orWhere('name', $gradeLevel);
        });
    }

    public function gradeLevel(): BelongsTo
    {
        return $this->belongsTo(GradeLevel::class);
    }

    public function getGradeLevelNameAttribute(): ?string
    {
        return $this->gradeLevel?->name;
    }

    /**
     * Get current school year (e.g., "2024-2025")
     */
    public static function currentSchoolYear(): string
    {
        $month = now()->month;
        $year = now()->year;

        // School year typically starts in June/July
        if ($month >= 6) {
            return $year . '-' . ($year + 1);
        }

        return ($year - 1) . '-' . $year;
    }
}
