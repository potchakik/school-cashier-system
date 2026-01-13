import FeeStructureController from '@/actions/App/Http/Controllers/Settings/FeeStructureController';
import HeadingSmall from '@/components/heading-small';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { DataTable } from '@/components/ui/data-table';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import feeStructureRoutes from '@/routes/academics/fee-structures';
import { type BreadcrumbItem } from '@/types';
import { Head, router, usePage } from '@inertiajs/react';
import { Plus } from 'lucide-react';
import { useCallback, useMemo, useState } from 'react';

import { createFeeStructureColumns } from './columns';
import { FeeStructureDialog } from './fee-structure-dialog';
import { FeeStructureDialogState, FeeStructureFilters, FeeStructureItem, GradeLevelOption } from './types';

interface PageProps extends Record<string, unknown> {
    feeStructures: FeeStructureItem[];
    gradeLevels: GradeLevelOption[];
    schoolYears: (string | number)[];
    filters: FeeStructureFilters;
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Academics', href: '/academics' },
    { title: 'Fee structures', href: feeStructureRoutes.index().url },
];

export default function FeeStructuresPage() {
    const { feeStructures, gradeLevels, schoolYears, filters } = usePage<PageProps>().props;
    const [dialogState, setDialogState] = useState<FeeStructureDialogState | null>(null);

    const gradeLevelFilterValue = filters?.grade_level_id ? String(filters.grade_level_id) : 'all';
    const schoolYearFilterValue = filters?.school_year ? String(filters.school_year) : 'current';
    const statusFilterValue = filters?.status ?? 'all';

    const filterSchoolYear = filters?.school_year ?? null;

    const metrics = useMemo(() => {
        const total = feeStructures.length;
        const active = feeStructures.filter((fee) => fee.is_active).length;
        const required = feeStructures.filter((fee) => fee.is_required).length;

        return [
            { title: 'Total fees configured', value: total.toString() },
            { title: 'Active this year', value: active.toString() },
            { title: 'Required fees', value: required.toString() },
        ];
    }, [feeStructures]);

    const applyFilters = useCallback(
        (overrides: Partial<{ grade_level_id: string; school_year: string; status: string }>) => {
            const nextGradeLevel = overrides.grade_level_id ?? gradeLevelFilterValue;
            const nextSchoolYear = overrides.school_year ?? schoolYearFilterValue;
            const nextStatus = overrides.status ?? statusFilterValue;

            const query: Record<string, string> = {};

            if (nextGradeLevel !== 'all') {
                query.grade_level_id = nextGradeLevel;
            }

            if (nextSchoolYear !== 'current') {
                query.school_year = nextSchoolYear;
            }

            if (nextStatus !== 'all') {
                query.status = nextStatus;
            }

            const queryOptions = Object.keys(query).length > 0 ? { query } : undefined;

            router.get(FeeStructureController.index.url(queryOptions), {}, { preserveScroll: true, preserveState: true });
        },
        [gradeLevelFilterValue, schoolYearFilterValue, statusFilterValue],
    );

    const handleCreate = useCallback(() => {
        const gradeLevelId = gradeLevelFilterValue !== 'all' ? Number(gradeLevelFilterValue) : undefined;

        setDialogState({
            mode: 'create',
            gradeLevelId,
        });
    }, [gradeLevelFilterValue]);

    const handleEdit = useCallback((feeStructure: FeeStructureItem) => {
        setDialogState({ mode: 'edit', feeStructure });
    }, []);

    const handleDelete = useCallback((feeStructure: FeeStructureItem) => {
        const gradeLevelName = feeStructure.grade_level_name ?? 'this grade level';

        if (!confirm(`Delete fee "${feeStructure.fee_type}" for ${gradeLevelName}? This action cannot be undone.`)) {
            return;
        }

        router.delete(FeeStructureController.destroy.url({ feeStructure: feeStructure.id }), {
            preserveScroll: true,
        });
    }, []);

    const columns = useMemo(
        () =>
            createFeeStructureColumns({
                onEdit: handleEdit,
                onDelete: handleDelete,
            }),
        [handleDelete, handleEdit],
    );

    const defaultDialogSchoolYear = useMemo(() => {
        if (filterSchoolYear) {
            return String(filterSchoolYear);
        }

        if (feeStructures.length > 0 && feeStructures[0].school_year) {
            return feeStructures[0].school_year;
        }

        if (schoolYears.length > 0) {
            return String(schoolYears[0]);
        }

        return '';
    }, [feeStructures, filterSchoolYear, schoolYears]);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Fee structures" />

            <div className="p-4 md:p-8">
                <Card>
                    <CardHeader>
                        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
                            <div>
                                <CardTitle>Fee structures</CardTitle>
                                <CardDescription>
                                    Manage the annual fee catalog, adjust statuses, and keep grade-level pricing aligned.
                                </CardDescription>
                            </div>
                            <Button type="button" onClick={handleCreate} className="w-full sm:w-auto">
                                <Plus className="h-4 w-4" />
                                New fee
                            </Button>
                        </div>
                    </CardHeader>

                    <CardContent className="space-y-6">
                        <div className="grid gap-6 lg:grid-cols-3">
                            {metrics.map((metric) => (
                                <Card key={metric.title} className="shadow-sm">
                                    <CardHeader className="pb-2">
                                        <CardTitle className="text-sm font-medium text-muted-foreground">{metric.title}</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <span className="text-2xl font-semibold text-foreground">{metric.value}</span>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>

                        <div className="rounded-lg border bg-muted/40 p-4">
                            <div className="grid gap-4 md:grid-cols-3">
                                <div className="flex flex-col gap-2">
                                    <Label htmlFor="fee-grade-filter">Grade level</Label>
                                    <Select value={gradeLevelFilterValue} onValueChange={(value) => applyFilters({ grade_level_id: value })}>
                                        <SelectTrigger id="fee-grade-filter">
                                            <SelectValue placeholder="All grade levels" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">All grade levels</SelectItem>
                                            {gradeLevels.map((gradeLevel) => (
                                                <SelectItem key={gradeLevel.id} value={gradeLevel.id.toString()}>
                                                    {gradeLevel.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="flex flex-col gap-2">
                                    <Label htmlFor="fee-year-filter">School year</Label>
                                    <Select value={schoolYearFilterValue} onValueChange={(value) => applyFilters({ school_year: value })}>
                                        <SelectTrigger id="fee-year-filter">
                                            <SelectValue placeholder="All school years" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="current">Current year</SelectItem>
                                            {schoolYears.map((year) => (
                                                <SelectItem key={year} value={String(year)}>
                                                    {year}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="flex flex-col gap-2">
                                    <Label htmlFor="fee-status-filter">Status</Label>
                                    <Select value={statusFilterValue} onValueChange={(value) => applyFilters({ status: value })}>
                                        <SelectTrigger id="fee-status-filter">
                                            <SelectValue placeholder="All statuses" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">All statuses</SelectItem>
                                            <SelectItem value="active">Active only</SelectItem>
                                            <SelectItem value="inactive">Inactive only</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="mt-4 flex justify-end">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => applyFilters({ grade_level_id: 'all', school_year: 'current', status: 'all' })}
                                >
                                    Reset filters
                                </Button>
                            </div>
                        </div>

                        <div className="space-y-6 rounded-lg border border-border/60 bg-muted/30 p-6">
                            <HeadingSmall title="Fee library" description="Search, filter, and update the fee catalog for each grade level." />

                            {gradeLevels.length === 0 ? (
                                <div className="rounded-lg border border-dashed py-12 text-center text-sm text-muted-foreground">
                                    Create grade levels before configuring fees.
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {feeStructures.length === 0 && (
                                        <div className="rounded-lg border border-dashed py-12 text-center text-sm text-muted-foreground">
                                            No fee structures match the selected filters. Add a new fee to get started.
                                        </div>
                                    )}
                                    <DataTable columns={columns} data={feeStructures} />
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>

                <FeeStructureDialog
                    state={dialogState}
                    close={() => setDialogState(null)}
                    gradeLevels={gradeLevels}
                    defaultSchoolYear={defaultDialogSchoolYear}
                />
            </div>
        </AppLayout>
    );
}
