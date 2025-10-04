<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Str;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('grade_levels', function (Blueprint $table) {
            $table->id();
            $table->string('name')->unique();
            $table->string('slug')->unique();
            $table->unsignedInteger('display_order')->default(0);
            $table->text('description')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        Schema::create('sections', function (Blueprint $table) {
            $table->id();
            $table->foreignId('grade_level_id')->constrained()->cascadeOnDelete();
            $table->string('name');
            $table->string('slug');
            $table->text('description')->nullable();
            $table->boolean('is_active')->default(true);
            $table->unsignedInteger('display_order')->default(0);
            $table->timestamps();

            $table->unique(['grade_level_id', 'name']);
            $table->unique(['grade_level_id', 'slug']);
        });

        Schema::table('students', function (Blueprint $table) {
            $table->foreignId('grade_level_id')->nullable()->after('last_name')->constrained('grade_levels')->restrictOnDelete();
            $table->foreignId('section_id')->nullable()->after('grade_level_id')->constrained('sections')->nullOnDelete();
        });

        Schema::table('fee_structures', function (Blueprint $table) {
            $table->foreignId('grade_level_id')->nullable()->after('id')->constrained('grade_levels')->restrictOnDelete();
            $table->boolean('is_required')->default(true)->after('description');
        });

        // Populate grade levels from existing data
        $gradeLevels = collect()
            ->merge(DB::table('students')->distinct()->pluck('grade_level'))
            ->merge(DB::table('fee_structures')->distinct()->pluck('grade_level'))
            ->filter()
            ->unique()
            ->values();

        $now = now();
        $gradeLevelMap = [];
        foreach ($gradeLevels as $index => $name) {
            $slug = Str::slug($name);

            // Ensure slug uniqueness
            $baseSlug = $slug ?: Str::slug('grade-' . ($index + 1));
            $slug = $baseSlug;
            $suffix = 1;
            while (DB::table('grade_levels')->where('slug', $slug)->exists()) {
                $slug = $baseSlug . '-' . $suffix;
                $suffix++;
            }

            $gradeLevelId = DB::table('grade_levels')->insertGetId([
                'name' => $name,
                'slug' => $slug,
                'display_order' => $index + 1,
                'description' => null,
                'is_active' => true,
                'created_at' => $now,
                'updated_at' => $now,
            ]);

            $gradeLevelMap[$name] = $gradeLevelId;
        }

        // Update students with grade_level_id
        foreach ($gradeLevelMap as $name => $id) {
            DB::table('students')->where('grade_level', $name)->update(['grade_level_id' => $id]);
        }

        // Populate sections based on existing student data
        $sections = DB::table('students')
            ->select('grade_level', 'section')
            ->whereNotNull('section')
            ->where('section', '!=', '')
            ->distinct()
            ->get();

        foreach ($sections as $section) {
            $gradeLevelId = $gradeLevelMap[$section->grade_level] ?? null;
            if (!$gradeLevelId) {
                continue;
            }

            $baseSlug = Str::slug($section->section);
            $slug = $baseSlug ?: Str::slug('section-' . $section->section);
            $suffix = 1;
            while (DB::table('sections')->where('grade_level_id', $gradeLevelId)->where('slug', $slug)->exists()) {
                $slug = $baseSlug . '-' . $suffix;
                $suffix++;
            }

            $sectionId = DB::table('sections')->insertGetId([
                'grade_level_id' => $gradeLevelId,
                'name' => $section->section,
                'slug' => $slug,
                'description' => null,
                'is_active' => true,
                'display_order' => 0,
                'created_at' => $now,
                'updated_at' => $now,
            ]);

            DB::table('students')
                ->where('grade_level', $section->grade_level)
                ->where('section', $section->section)
                ->update(['section_id' => $sectionId]);
        }

        // Update fee structures with grade_level_id
        foreach ($gradeLevelMap as $name => $id) {
            DB::table('fee_structures')->where('grade_level', $name)->update(['grade_level_id' => $id]);
        }

        // Ensure new foreign keys are not null where possible
        $defaultGradeLevelId = !empty($gradeLevelMap) ? reset($gradeLevelMap) : null;

        if ($defaultGradeLevelId) {
            DB::table('students')->whereNull('grade_level_id')->update(['grade_level_id' => $defaultGradeLevelId]);
            DB::table('fee_structures')->whereNull('grade_level_id')->update(['grade_level_id' => $defaultGradeLevelId]);
        }

        Schema::table('students', function (Blueprint $table) {
            $table->dropIndex('students_grade_level_section_index');
            $table->dropColumn(['grade_level', 'section']);
        });

        Schema::table('fee_structures', function (Blueprint $table) {
            $table->dropUnique('fee_structures_grade_level_fee_type_school_year_unique');
            $table->dropColumn('grade_level');
            $table->unique(['grade_level_id', 'fee_type', 'school_year']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('fee_structures', function (Blueprint $table) {
            $table->dropForeign(['grade_level_id']);
            $table->string('grade_level')->nullable()->after('id');
            $table->dropUnique('fee_structures_grade_level_id_fee_type_school_year_unique');
        });

        Schema::table('students', function (Blueprint $table) {
            $table->dropForeign(['section_id']);
            $table->dropForeign(['grade_level_id']);
            $table->string('grade_level')->nullable()->after('last_name');
            $table->string('section')->nullable()->after('grade_level');
        });

        // Repopulate legacy columns
        $studentGrades = DB::table('grade_levels')->pluck('name', 'id');
        $sectionNames = DB::table('sections')->pluck('name', 'id');

        foreach ($studentGrades as $id => $name) {
            DB::table('students')->where('grade_level_id', $id)->update(['grade_level' => $name]);
        }

        foreach ($sectionNames as $id => $name) {
            DB::table('students')->where('section_id', $id)->update(['section' => $name]);
        }

        Schema::table('students', function (Blueprint $table) {
            $table->dropColumn(['grade_level_id', 'section_id']);
            $table->index(['grade_level', 'section']);
        });

        foreach ($studentGrades as $id => $name) {
            DB::table('fee_structures')->where('grade_level_id', $id)->update(['grade_level' => $name]);
        }

        Schema::table('fee_structures', function (Blueprint $table) {
            $table->dropColumn(['grade_level_id', 'is_required']);
            $table->unique(['grade_level', 'fee_type', 'school_year']);
        });

        Schema::dropIfExists('sections');
        Schema::dropIfExists('grade_levels');
    }
};
