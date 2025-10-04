import FeeStructureController from '@/actions/App/Http/Controllers/Settings/FeeStructureController';
import HeadingSmall from '@/components/heading-small';
import InputError from '@/components/input-error';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';
import feeStructureRoutes from '@/routes/academics/fee-structures';
import { type BreadcrumbItem } from '@/types';
import { Head, router, useForm, usePage } from '@inertiajs/react';
import { Pencil, Plus, Trash } from 'lucide-react';
import { useState, type FormEvent } from 'react';

type Nullable<T> = T | null;

interface GradeLevelOption {
    id: number;
    name: string;
}

interface FeeStructureItem {
    id: number;
    grade_level_id: number;
    grade_level_name: string | null;
    fee_type: string;
    amount: number;
    school_year: string;
    is_required: boolean;
    is_active: boolean;
    description: string | null;
}

interface FeeStructureFilters {
    grade_level_id?: string | number | null;
    school_year?: string | null;
    status?: string | null;
}

interface PageProps extends Record<string, unknown> {
    feeStructures: FeeStructureItem[];
    gradeLevels: GradeLevelOption[];
    schoolYears: (string | number)[];
    filters: FeeStructureFilters;
}

type FeeStructureDialogState =
    | { mode: 'create' }
    | {
          mode: 'edit';
          feeStructure: FeeStructureItem;
      };

type FeeStructureFormData = {
    grade_level_id: string;
    fee_type: string;
    amount: string;
    school_year: string;
    description: string;
    is_required: boolean;
    is_active: boolean;
};

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Fee structures',
        href: feeStructureRoutes.index().url,
    },
];

const formatCurrency = (amount: number): string => `₱${amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

export default function FeeStructuresPage() {
    const { feeStructures, gradeLevels, schoolYears, filters } = usePage<PageProps>().props;

    const [dialogState, setDialogState] = useState<Nullable<FeeStructureDialogState>>(null);

    const gradeLevelFilterValue = filters?.grade_level_id ? String(filters.grade_level_id) : 'all';
    const schoolYearFilterValue = filters?.school_year ? String(filters.school_year) : 'all';
    const statusFilterValue = filters?.status ?? 'all';

    const applyFilters = (overrides: Partial<{ grade_level_id: string; school_year: string; status: string }>) => {
        const next = {
            grade_level_id: gradeLevelFilterValue,
            school_year: schoolYearFilterValue,
            status: statusFilterValue,
            ...overrides,
        };

        const query: Record<string, string> = {};

        if (next.grade_level_id !== 'all') {
            query.grade_level_id = next.grade_level_id;
        }

        if (next.school_year !== 'all') {
            query.school_year = next.school_year;
        }

        if (next.status !== 'all') {
            query.status = next.status;
        }

        router.get(FeeStructureController.index.url({ query }), {}, { preserveScroll: true, preserveState: true });
    };

    const handleDelete = (feeStructure: FeeStructureItem) => {
        if (!confirm(`Delete fee structure "${feeStructure.fee_type}" for ${feeStructure.grade_level_name ?? 'this grade level'}?`)) {
            return;
        }

        router.delete(FeeStructureController.destroy.url({ feeStructure: feeStructure.id }), {
            preserveScroll: true,
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Fee structures" />

            <SettingsLayout>
                <div className="space-y-8">
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        <HeadingSmall
                            title="Fee structures"
                            description="Define tuition, miscellaneous fees, and other charges per grade level and school year."
                        />

                        <Button
                            type="button"
                            onClick={() => setDialogState({ mode: 'create' })}
                            disabled={gradeLevels.length === 0}
                            title={gradeLevels.length === 0 ? 'Create a grade level before adding fees.' : undefined}
                        >
                            <Plus className="h-4 w-4" />
                            New fee structure
                        </Button>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-3">
                        <div className="space-y-2">
                            <Label htmlFor="fee-filter-grade">Grade level</Label>
                            <Select value={gradeLevelFilterValue} onValueChange={(value) => applyFilters({ grade_level_id: value })}>
                                <SelectTrigger id="fee-filter-grade">
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

                        <div className="space-y-2">
                            <Label htmlFor="fee-filter-year">School year</Label>
                            <Select value={schoolYearFilterValue} onValueChange={(value) => applyFilters({ school_year: value })}>
                                <SelectTrigger id="fee-filter-year">
                                    <SelectValue placeholder="All school years" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All school years</SelectItem>
                                    {schoolYears.map((year) => (
                                        <SelectItem key={year} value={String(year)}>
                                            {year}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="fee-filter-status">Status</Label>
                            <Select value={statusFilterValue} onValueChange={(value) => applyFilters({ status: value })}>
                                <SelectTrigger id="fee-filter-status">
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

                    {gradeLevels.length === 0 && (
                        <Alert className="border-amber-200 bg-amber-50 text-amber-900">
                            <AlertTitle>Grade levels required</AlertTitle>
                            <AlertDescription>
                                Add at least one grade level before configuring fee structures. Fees must be linked to a grade level and school year.
                            </AlertDescription>
                        </Alert>
                    )}

                    <Card>
                        <CardHeader className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                            <div className="space-y-1">
                                <CardTitle>Configured fees</CardTitle>
                                <CardDescription>
                                    {feeStructures.length} fee structure{feeStructures.length === 1 ? '' : 's'} shown
                                </CardDescription>
                            </div>
                        </CardHeader>
                        <CardContent>
                            {feeStructures.length === 0 ? (
                                <p className="rounded-lg border border-dashed py-10 text-center text-sm text-muted-foreground">
                                    No fee structures match the selected filters. Create one to get started.
                                </p>
                            ) : (
                                <div className="overflow-hidden rounded-lg border border-border/70">
                                    <table className="min-w-full divide-y divide-border/70 text-left text-sm">
                                        <thead className="bg-muted/40 text-muted-foreground">
                                            <tr>
                                                <th className="px-4 py-3 font-medium">Fee</th>
                                                <th className="px-4 py-3 font-medium">Grade level</th>
                                                <th className="px-4 py-3 font-medium">School year</th>
                                                <th className="px-4 py-3 font-medium">Amount</th>
                                                <th className="px-4 py-3 font-medium">Requirement</th>
                                                <th className="px-4 py-3 font-medium">Status</th>
                                                <th className="px-4 py-3 text-right font-medium">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-border/60">
                                            {feeStructures.map((feeStructure) => (
                                                <tr key={feeStructure.id} className="hover:bg-muted/30">
                                                    <td className="px-4 py-3">
                                                        <div className="font-medium text-foreground">{feeStructure.fee_type}</div>
                                                        {feeStructure.description && (
                                                            <p className="text-xs text-muted-foreground">{feeStructure.description}</p>
                                                        )}
                                                    </td>
                                                    <td className="px-4 py-3 text-muted-foreground">{feeStructure.grade_level_name ?? '—'}</td>
                                                    <td className="px-4 py-3 text-muted-foreground">{feeStructure.school_year}</td>
                                                    <td className="px-4 py-3 font-semibold text-foreground">{formatCurrency(feeStructure.amount)}</td>
                                                    <td className="px-4 py-3">
                                                        <Badge variant={feeStructure.is_required ? 'secondary' : 'outline'}>
                                                            {feeStructure.is_required ? 'Required' : 'Optional'}
                                                        </Badge>
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        <Badge
                                                            variant={feeStructure.is_active ? 'secondary' : 'outline'}
                                                            className={
                                                                feeStructure.is_active
                                                                    ? 'border-emerald-200 bg-emerald-500/10 text-emerald-600'
                                                                    : 'text-muted-foreground'
                                                            }
                                                        >
                                                            {feeStructure.is_active ? 'Active' : 'Inactive'}
                                                        </Badge>
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        <div className="flex justify-end gap-1">
                                                            <Button
                                                                type="button"
                                                                size="sm"
                                                                variant="ghost"
                                                                onClick={() => setDialogState({ mode: 'edit', feeStructure })}
                                                            >
                                                                <Pencil className="h-4 w-4" />
                                                                <span className="sr-only">Edit</span>
                                                            </Button>
                                                            <Button
                                                                type="button"
                                                                size="sm"
                                                                variant="ghost"
                                                                className="text-destructive hover:text-destructive"
                                                                onClick={() => handleDelete(feeStructure)}
                                                            >
                                                                <Trash className="h-4 w-4" />
                                                                <span className="sr-only">Delete</span>
                                                            </Button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </SettingsLayout>

            <Dialog open={dialogState !== null} onOpenChange={(open) => !open && setDialogState(null)}>
                {dialogState && (
                    <DialogContent className="max-w-lg">
                        <DialogHeader>
                            <DialogTitle>
                                {dialogState.mode === 'create' ? 'Create fee structure' : `Edit ${dialogState.feeStructure.fee_type}`}
                            </DialogTitle>
                            <DialogDescription>
                                {dialogState.mode === 'create'
                                    ? 'Add a new fee for a grade level and school year.'
                                    : 'Update the details for this fee structure.'}
                            </DialogDescription>
                        </DialogHeader>

                        <FeeStructureForm
                            key={dialogState.mode === 'edit' ? dialogState.feeStructure.id : 'create'}
                            mode={dialogState.mode}
                            feeStructure={dialogState.mode === 'edit' ? dialogState.feeStructure : undefined}
                            gradeLevels={gradeLevels}
                            onClose={() => setDialogState(null)}
                        />
                    </DialogContent>
                )}
            </Dialog>
        </AppLayout>
    );
}

function FeeStructureForm({
    mode,
    feeStructure,
    gradeLevels,
    onClose,
}: {
    mode: 'create' | 'edit';
    feeStructure?: FeeStructureItem;
    gradeLevels: GradeLevelOption[];
    onClose: () => void;
}) {
    const { data, setData, post, put, processing, errors, reset, clearErrors, transform } = useForm<FeeStructureFormData>({
        grade_level_id: feeStructure?.grade_level_id ? feeStructure.grade_level_id.toString() : gradeLevels[0] ? gradeLevels[0].id.toString() : '',
        fee_type: feeStructure?.fee_type ?? '',
        amount: feeStructure ? String(feeStructure.amount) : '',
        school_year: feeStructure?.school_year ?? '',
        description: feeStructure?.description ?? '',
        is_required: feeStructure?.is_required ?? true,
        is_active: feeStructure?.is_active ?? true,
    });

    const requiredCheckboxId = mode === 'create' ? 'fee-required-new' : `fee-required-${feeStructure?.id}`;
    const activeCheckboxId = mode === 'create' ? 'fee-active-new' : `fee-active-${feeStructure?.id}`;

    const submit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        transform((formData) => {
            const payload: Record<string, unknown> = {
                grade_level_id: Number(formData.grade_level_id),
                fee_type: formData.fee_type,
                amount: Number(formData.amount),
                school_year: formData.school_year,
                is_required: formData.is_required ? 1 : 0,
                is_active: formData.is_active ? 1 : 0,
            };

            payload.description = formData.description.trim() !== '' ? formData.description : null;

            return payload;
        });

        const options = {
            preserveScroll: true,
            onSuccess: () => {
                reset();
                clearErrors();
                onClose();
            },
        } as const;

        if (mode === 'create') {
            post(FeeStructureController.store.url(), options);
            return;
        }

        if (feeStructure) {
            put(FeeStructureController.update.url({ feeStructure: feeStructure.id }), options);
        }
    };

    return (
        <form onSubmit={submit} className="space-y-6">
            <div className="space-y-2">
                <Label htmlFor="fee-grade-level">Grade level</Label>
                <Select value={data.grade_level_id} onValueChange={(value) => setData('grade_level_id', value)}>
                    <SelectTrigger id="fee-grade-level">
                        <SelectValue placeholder="Select grade level" />
                    </SelectTrigger>
                    <SelectContent>
                        {gradeLevels.map((gradeLevel) => (
                            <SelectItem key={gradeLevel.id} value={gradeLevel.id.toString()}>
                                {gradeLevel.name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                <InputError message={errors.grade_level_id} />
            </div>

            <div className="space-y-2">
                <Label htmlFor="fee-type">Fee name</Label>
                <Input
                    id="fee-type"
                    name="fee_type"
                    value={data.fee_type}
                    onChange={(event) => setData('fee_type', event.target.value)}
                    required
                    placeholder="e.g. Tuition"
                />
                <InputError message={errors.fee_type} />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                    <Label htmlFor="fee-amount">Amount</Label>
                    <Input
                        id="fee-amount"
                        name="amount"
                        type="number"
                        min={0}
                        step="0.01"
                        value={data.amount}
                        onChange={(event) => setData('amount', event.target.value)}
                        required
                        placeholder="0.00"
                    />
                    <InputError message={errors.amount} />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="fee-year">School year</Label>
                    <Input
                        id="fee-year"
                        name="school_year"
                        value={data.school_year}
                        onChange={(event) => setData('school_year', event.target.value)}
                        required
                        placeholder="2025-2026"
                    />
                    <InputError message={errors.school_year} />
                </div>
            </div>

            <div className="space-y-2">
                <Label htmlFor="fee-description">Description</Label>
                <Textarea
                    id="fee-description"
                    name="description"
                    value={data.description}
                    onChange={(event) => setData('description', event.target.value)}
                    rows={4}
                    placeholder="Optional notes about this fee"
                />
                <InputError message={errors.description} />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
                <div className="flex items-center gap-3">
                    <Checkbox
                        id={requiredCheckboxId}
                        checked={data.is_required}
                        onCheckedChange={(checked) => setData('is_required', Boolean(checked))}
                    />
                    <Label htmlFor={requiredCheckboxId}>Required fee</Label>
                </div>

                <div className="flex items-center gap-3">
                    <Checkbox id={activeCheckboxId} checked={data.is_active} onCheckedChange={(checked) => setData('is_active', Boolean(checked))} />
                    <Label htmlFor={activeCheckboxId}>Active</Label>
                </div>
            </div>

            <DialogFooter>
                <Button type="button" variant="outline" onClick={() => onClose()}>
                    Cancel
                </Button>
                <Button type="submit" disabled={processing}>
                    {processing ? 'Saving...' : mode === 'create' ? 'Create fee structure' : 'Save changes'}
                </Button>
            </DialogFooter>
        </form>
    );
}
