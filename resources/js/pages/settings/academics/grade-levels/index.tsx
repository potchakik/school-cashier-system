import GradeLevelController from '@/actions/App/Http/Controllers/Settings/GradeLevelController';
import SectionController from '@/actions/App/Http/Controllers/Settings/SectionController';
import HeadingSmall from '@/components/heading-small';
import InputError from '@/components/input-error';
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
import gradeLevelRoutes from '@/routes/academics/grade-levels';
import { type BreadcrumbItem } from '@/types';
import { Head, router, useForm, usePage } from '@inertiajs/react';
import { Pencil, Plus, Trash } from 'lucide-react';
import { useMemo, useState, type FormEvent } from 'react';

type Nullable<T> = T | null;

interface GradeLevelFee {
    id: number;
    fee_type: string;
    amount: number;
    is_required: boolean;
    is_active: boolean;
}

interface GradeLevelSection {
    id: number;
    name: string;
    slug: string;
    description: string | null;
    is_active: boolean;
    display_order: number | null;
    grade_level_id?: number;
}

interface GradeLevelItem {
    id: number;
    name: string;
    slug: string;
    description: string | null;
    display_order: number | null;
    is_active: boolean;
    sections_count: number;
    students_count: number;
    fee_total: number;
    fees: GradeLevelFee[];
    sections: GradeLevelSection[];
}

interface GradeLevelFilters {
    school_year?: string | null;
}

interface PageProps extends Record<string, unknown> {
    gradeLevels: GradeLevelItem[];
    filters: GradeLevelFilters;
    schoolYears: (string | number)[];
}

type GradeLevelDialogState =
    | { mode: 'create' }
    | {
          mode: 'edit';
          gradeLevel: GradeLevelItem;
      };

type SectionDialogState =
    | {
          mode: 'create';
          gradeLevel: GradeLevelItem;
      }
    | {
          mode: 'edit';
          gradeLevel: GradeLevelItem;
          section: GradeLevelSection;
      };

type GradeLevelFormData = {
    name: string;
    description: string;
    display_order: string;
    is_active: boolean;
};

type SectionFormData = {
    grade_level_id: string;
    name: string;
    description: string;
    display_order: string;
    is_active: boolean;
};

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Grade levels',
        href: gradeLevelRoutes.index().url,
    },
];

const formatCurrency = (amount: number): string => `₱${amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

const getFeeLabel = (filters: GradeLevelFilters) => (filters?.school_year ? `Fees for ${filters.school_year}` : 'Fees for current year');

export default function GradeLevelsPage() {
    const { gradeLevels, filters, schoolYears } = usePage<PageProps>().props;

    const [gradeLevelDialog, setGradeLevelDialog] = useState<Nullable<GradeLevelDialogState>>(null);
    const [sectionDialog, setSectionDialog] = useState<Nullable<SectionDialogState>>(null);

    const schoolYearValue = filters?.school_year ? String(filters.school_year) : 'all';

    const gradeLevelOptions = useMemo(
        () =>
            gradeLevels.map((gradeLevel) => ({
                label: gradeLevel.name,
                value: gradeLevel.id.toString(),
            })),
        [gradeLevels],
    );

    const handleSchoolYearChange = (value: string) => {
        if (value === 'all') {
            router.get(GradeLevelController.index.url(), {}, { preserveScroll: true, preserveState: true });
            return;
        }

        router.get(GradeLevelController.index.url({ query: { school_year: value } }), {}, { preserveScroll: true, preserveState: true });
    };

    const handleDeleteGradeLevel = (gradeLevel: GradeLevelItem) => {
        if (!confirm(`Delete grade level "${gradeLevel.name}"? This action cannot be undone.`)) {
            return;
        }

        router.delete(GradeLevelController.destroy.url({ gradeLevel: gradeLevel.id }), {
            preserveScroll: true,
        });
    };

    const handleDeleteSection = (gradeLevel: GradeLevelItem, section: GradeLevelSection) => {
        if (!confirm(`Delete section "${section.name}" from ${gradeLevel.name}?`)) {
            return;
        }

        router.delete(SectionController.destroy.url({ section: section.id }), {
            preserveScroll: true,
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Grade levels" />

            <SettingsLayout>
                <div className="space-y-8">
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        <HeadingSmall
                            title="Grade levels"
                            description="Organize grade levels, their sections, and view the fees assigned for the selected school year."
                        />

                        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                            <Select value={schoolYearValue} onValueChange={handleSchoolYearChange}>
                                <SelectTrigger className="h-9 w-full sm:w-48">
                                    <SelectValue placeholder="School year" />
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

                            <Button type="button" className="sm:ml-3" onClick={() => setGradeLevelDialog({ mode: 'create' })}>
                                <Plus className="h-4 w-4" />
                                New grade level
                            </Button>
                        </div>
                    </div>

                    {gradeLevels.length === 0 ? (
                        <Card>
                            <CardHeader>
                                <CardTitle>No grade levels yet</CardTitle>
                                <CardDescription className="text-muted-foreground">
                                    Start by creating your first grade level. You can add sections and assign fee structures once a grade level
                                    exists.
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Button type="button" onClick={() => setGradeLevelDialog({ mode: 'create' })}>
                                    <Plus className="h-4 w-4" />
                                    Add grade level
                                </Button>
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="space-y-6">
                            {gradeLevels.map((gradeLevel) => {
                                const stats = [
                                    { label: 'Sections', value: gradeLevel.sections_count.toString() },
                                    { label: 'Students', value: gradeLevel.students_count.toString() },
                                    { label: 'Display order', value: gradeLevel.display_order ?? '—' },
                                    { label: getFeeLabel(filters), value: formatCurrency(gradeLevel.fee_total) },
                                ];

                                return (
                                    <Card key={gradeLevel.id}>
                                        <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                                            <div className="space-y-2">
                                                <CardTitle className="flex flex-wrap items-center gap-2">
                                                    {gradeLevel.name}
                                                    <Badge
                                                        variant={gradeLevel.is_active ? 'secondary' : 'outline'}
                                                        className={
                                                            gradeLevel.is_active
                                                                ? 'border-emerald-200 bg-emerald-500/10 text-emerald-600'
                                                                : 'text-muted-foreground'
                                                        }
                                                    >
                                                        {gradeLevel.is_active ? 'Active' : 'Inactive'}
                                                    </Badge>
                                                </CardTitle>
                                                <CardDescription>
                                                    {gradeLevel.description
                                                        ? gradeLevel.description
                                                        : 'No description provided for this grade level.'}
                                                </CardDescription>
                                            </div>

                                            <div className="flex gap-2">
                                                <Button
                                                    type="button"
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() => setGradeLevelDialog({ mode: 'edit', gradeLevel })}
                                                >
                                                    <Pencil className="h-4 w-4" />
                                                    Edit
                                                </Button>
                                                <Button
                                                    type="button"
                                                    size="sm"
                                                    variant="ghost"
                                                    className="text-destructive hover:text-destructive"
                                                    onClick={() => handleDeleteGradeLevel(gradeLevel)}
                                                >
                                                    <Trash className="h-4 w-4" />
                                                    Remove
                                                </Button>
                                            </div>
                                        </CardHeader>

                                        <CardContent className="space-y-8">
                                            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                                                {stats.map((stat) => (
                                                    <div key={stat.label} className="rounded-lg border border-dashed bg-muted/20 p-4">
                                                        <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                                                            {stat.label}
                                                        </p>
                                                        <p className="mt-1 text-lg font-semibold text-foreground">{stat.value}</p>
                                                    </div>
                                                ))}
                                            </div>

                                            <div className="space-y-3">
                                                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                                                    <p className="text-sm font-semibold tracking-wide text-muted-foreground uppercase">Sections</p>
                                                    <Button
                                                        type="button"
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={() =>
                                                            setSectionDialog({
                                                                mode: 'create',
                                                                gradeLevel,
                                                            })
                                                        }
                                                    >
                                                        <Plus className="h-4 w-4" />
                                                        Add section
                                                    </Button>
                                                </div>

                                                {gradeLevel.sections.length === 0 ? (
                                                    <p className="rounded-lg border border-dashed py-6 text-center text-sm text-muted-foreground">
                                                        No sections yet. Create the first section for this grade level.
                                                    </p>
                                                ) : (
                                                    <div className="overflow-hidden rounded-lg border border-border/70">
                                                        <table className="min-w-full divide-y divide-border/70 text-left text-sm">
                                                            <thead className="bg-muted/40 text-muted-foreground">
                                                                <tr>
                                                                    <th className="px-4 py-3 font-medium">Section</th>
                                                                    <th className="px-4 py-3 font-medium">Status</th>
                                                                    <th className="px-4 py-3 font-medium">Order</th>
                                                                    <th className="px-4 py-3 text-right font-medium">Actions</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody className="divide-y divide-border/60">
                                                                {gradeLevel.sections.map((section) => (
                                                                    <tr key={section.id} className="hover:bg-muted/30">
                                                                        <td className="px-4 py-3">
                                                                            <div className="font-medium text-foreground">{section.name}</div>
                                                                            {section.description && (
                                                                                <p className="text-xs text-muted-foreground">{section.description}</p>
                                                                            )}
                                                                        </td>
                                                                        <td className="px-4 py-3">
                                                                            <Badge
                                                                                variant={section.is_active ? 'secondary' : 'outline'}
                                                                                className={
                                                                                    section.is_active
                                                                                        ? 'border-emerald-200 bg-emerald-500/10 text-emerald-600'
                                                                                        : 'text-muted-foreground'
                                                                                }
                                                                            >
                                                                                {section.is_active ? 'Active' : 'Inactive'}
                                                                            </Badge>
                                                                        </td>
                                                                        <td className="px-4 py-3 text-muted-foreground">
                                                                            {section.display_order ?? '—'}
                                                                        </td>
                                                                        <td className="px-4 py-3">
                                                                            <div className="flex justify-end gap-1">
                                                                                <Button
                                                                                    type="button"
                                                                                    size="sm"
                                                                                    variant="ghost"
                                                                                    onClick={() =>
                                                                                        setSectionDialog({
                                                                                            mode: 'edit',
                                                                                            gradeLevel,
                                                                                            section: { ...section, grade_level_id: gradeLevel.id },
                                                                                        })
                                                                                    }
                                                                                >
                                                                                    <Pencil className="h-4 w-4" />
                                                                                    <span className="sr-only">Edit section</span>
                                                                                </Button>
                                                                                <Button
                                                                                    type="button"
                                                                                    size="sm"
                                                                                    variant="ghost"
                                                                                    className="text-destructive hover:text-destructive"
                                                                                    onClick={() => handleDeleteSection(gradeLevel, section)}
                                                                                >
                                                                                    <Trash className="h-4 w-4" />
                                                                                    <span className="sr-only">Delete section</span>
                                                                                </Button>
                                                                            </div>
                                                                        </td>
                                                                    </tr>
                                                                ))}
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                )}
                                            </div>

                                            <div className="space-y-3">
                                                <p className="text-sm font-semibold tracking-wide text-muted-foreground uppercase">
                                                    {getFeeLabel(filters)}
                                                </p>
                                                {gradeLevel.fees.length === 0 ? (
                                                    <p className="rounded-lg border border-dashed py-6 text-center text-sm text-muted-foreground">
                                                        No fee structures are associated with this grade level for the selected year.
                                                    </p>
                                                ) : (
                                                    <ul className="grid gap-3 sm:grid-cols-2">
                                                        {gradeLevel.fees.map((fee) => (
                                                            <li key={fee.id} className="rounded-lg border border-border/70 bg-muted/20 px-4 py-3">
                                                                <div className="flex items-start justify-between gap-2">
                                                                    <div className="space-y-1">
                                                                        <p className="text-sm font-medium text-foreground">{fee.fee_type}</p>
                                                                        <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                                                                            {fee.is_required ? (
                                                                                <Badge variant="secondary">Required</Badge>
                                                                            ) : (
                                                                                <Badge variant="outline">Optional</Badge>
                                                                            )}
                                                                            {!fee.is_active && <Badge variant="outline">Inactive</Badge>}
                                                                        </div>
                                                                    </div>
                                                                    <span className="text-sm font-semibold text-foreground">
                                                                        {formatCurrency(fee.amount)}
                                                                    </span>
                                                                </div>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                )}
                                            </div>
                                        </CardContent>
                                    </Card>
                                );
                            })}
                        </div>
                    )}
                </div>
            </SettingsLayout>

            <Dialog open={gradeLevelDialog !== null} onOpenChange={(open) => !open && setGradeLevelDialog(null)}>
                {gradeLevelDialog && (
                    <DialogContent className="max-w-lg">
                        <DialogHeader>
                            <DialogTitle>
                                {gradeLevelDialog.mode === 'create' ? 'Create grade level' : `Edit ${gradeLevelDialog.gradeLevel.name}`}
                            </DialogTitle>
                            <DialogDescription>
                                {gradeLevelDialog.mode === 'create'
                                    ? 'Define a new grade level. You can add sections immediately after creating it.'
                                    : 'Update the details of this grade level. Changes apply to new enrollments immediately.'}
                            </DialogDescription>
                        </DialogHeader>

                        <GradeLevelForm
                            key={gradeLevelDialog.mode === 'edit' ? gradeLevelDialog.gradeLevel.id : 'create'}
                            mode={gradeLevelDialog.mode}
                            gradeLevel={gradeLevelDialog.mode === 'edit' ? gradeLevelDialog.gradeLevel : undefined}
                            onClose={() => setGradeLevelDialog(null)}
                        />
                    </DialogContent>
                )}
            </Dialog>

            <Dialog open={sectionDialog !== null} onOpenChange={(open) => !open && setSectionDialog(null)}>
                {sectionDialog && (
                    <DialogContent className="max-w-lg">
                        <DialogHeader>
                            <DialogTitle>
                                {sectionDialog.mode === 'create'
                                    ? `Add section to ${sectionDialog.gradeLevel.name}`
                                    : `Edit ${sectionDialog.section.name}`}
                            </DialogTitle>
                            <DialogDescription>
                                {sectionDialog.mode === 'create'
                                    ? 'Sections help you organize students within a grade level.'
                                    : 'Adjust the section details or move it to a different grade level.'}
                            </DialogDescription>
                        </DialogHeader>

                        <SectionForm
                            key={sectionDialog.mode === 'edit' ? sectionDialog.section.id : `create-${sectionDialog.gradeLevel.id}`}
                            mode={sectionDialog.mode}
                            gradeLevel={sectionDialog.gradeLevel}
                            section={sectionDialog.mode === 'edit' ? sectionDialog.section : undefined}
                            gradeLevels={gradeLevels}
                            onClose={() => setSectionDialog(null)}
                        />
                    </DialogContent>
                )}
            </Dialog>
        </AppLayout>
    );
}

function GradeLevelForm({ mode, gradeLevel, onClose }: { mode: 'create' | 'edit'; gradeLevel?: GradeLevelItem; onClose: () => void }) {
    const { data, setData, post, put, processing, errors, reset, clearErrors, transform } = useForm<GradeLevelFormData>({
        name: gradeLevel?.name ?? '',
        description: gradeLevel?.description ?? '',
        display_order: gradeLevel?.display_order !== null && gradeLevel?.display_order !== undefined ? String(gradeLevel.display_order) : '',
        is_active: gradeLevel?.is_active ?? true,
    });

    const activeCheckboxId = mode === 'create' ? 'grade-level-active-new' : `grade-level-active-${gradeLevel?.id}`;

    const submit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        transform((formData) => {
            const payload: Record<string, unknown> = {
                name: formData.name,
                is_active: formData.is_active ? 1 : 0,
            };

            payload.description = formData.description.trim() !== '' ? formData.description : null;

            if (formData.display_order !== '') {
                payload.display_order = Number(formData.display_order);
            }

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
            post(GradeLevelController.store.url(), options);
            return;
        }

        if (gradeLevel) {
            put(GradeLevelController.update.url({ gradeLevel: gradeLevel.id }), options);
        }
    };

    return (
        <form onSubmit={submit} className="space-y-6">
            <div className="space-y-2">
                <Label htmlFor="grade-level-name">Name</Label>
                <Input
                    id="grade-level-name"
                    name="name"
                    value={data.name}
                    onChange={(event) => setData('name', event.target.value)}
                    required
                    placeholder="e.g. Grade 7"
                    autoFocus
                />
                <InputError message={errors.name} />
            </div>

            <div className="space-y-2">
                <Label htmlFor="grade-level-description">Description</Label>
                <Textarea
                    id="grade-level-description"
                    name="description"
                    value={data.description}
                    onChange={(event) => setData('description', event.target.value)}
                    rows={4}
                    placeholder="Optional context or learning objectives"
                />
                <InputError message={errors.description} />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                    <Label htmlFor="grade-level-display-order">Display order</Label>
                    <Input
                        id="grade-level-display-order"
                        name="display_order"
                        type="number"
                        min={0}
                        value={data.display_order}
                        onChange={(event) => setData('display_order', event.target.value)}
                        placeholder="Auto"
                    />
                    <InputError message={errors.display_order} />
                </div>

                <div className="flex items-center gap-3 pt-6">
                    <Checkbox id={activeCheckboxId} checked={data.is_active} onCheckedChange={(checked) => setData('is_active', Boolean(checked))} />
                    <Label htmlFor={activeCheckboxId}>Active grade level</Label>
                </div>
            </div>

            <DialogFooter>
                <Button type="button" variant="outline" onClick={() => onClose()}>
                    Cancel
                </Button>
                <Button type="submit" disabled={processing}>
                    {processing ? 'Saving...' : mode === 'create' ? 'Create grade level' : 'Save changes'}
                </Button>
            </DialogFooter>
        </form>
    );
}

function SectionForm({
    mode,
    gradeLevel,
    section,
    gradeLevels,
    onClose,
}: {
    mode: 'create' | 'edit';
    gradeLevel: GradeLevelItem;
    section?: GradeLevelSection;
    gradeLevels: GradeLevelItem[];
    onClose: () => void;
}) {
    const { data, setData, post, put, processing, errors, reset, clearErrors, transform } = useForm<SectionFormData>({
        grade_level_id: (section?.grade_level_id ?? gradeLevel.id).toString(),
        name: section?.name ?? '',
        description: section?.description ?? '',
        display_order: section?.display_order !== null && section?.display_order !== undefined ? String(section.display_order) : '',
        is_active: section?.is_active ?? true,
    });

    const activeCheckboxId = mode === 'create' ? `section-active-new-${gradeLevel.id}` : `section-active-${section?.id}`;

    const submit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        transform((formData) => {
            const payload: Record<string, unknown> = {
                grade_level_id: Number(formData.grade_level_id),
                name: formData.name,
                is_active: formData.is_active ? 1 : 0,
            };

            payload.description = formData.description.trim() !== '' ? formData.description : null;

            if (formData.display_order !== '') {
                payload.display_order = Number(formData.display_order);
            }

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
            post(SectionController.store.url(), options);
            return;
        }

        if (section) {
            put(SectionController.update.url({ section: section.id }), options);
        }
    };

    return (
        <form onSubmit={submit} className="space-y-6">
            <div className="space-y-2">
                <Label htmlFor="section-grade-level">Grade level</Label>
                <Select value={data.grade_level_id} onValueChange={(value) => setData('grade_level_id', value)}>
                    <SelectTrigger id="section-grade-level">
                        <SelectValue placeholder="Select grade level" />
                    </SelectTrigger>
                    <SelectContent>
                        {gradeLevels.map((option) => (
                            <SelectItem key={option.id} value={option.id.toString()}>
                                {option.name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                <InputError message={errors.grade_level_id} />
            </div>

            <div className="space-y-2">
                <Label htmlFor="section-name">Section name</Label>
                <Input
                    id="section-name"
                    name="name"
                    value={data.name}
                    onChange={(event) => setData('name', event.target.value)}
                    required
                    placeholder="e.g. Section A"
                />
                <InputError message={errors.name} />
            </div>

            <div className="space-y-2">
                <Label htmlFor="section-description">Description</Label>
                <Textarea
                    id="section-description"
                    name="description"
                    value={data.description}
                    onChange={(event) => setData('description', event.target.value)}
                    rows={4}
                    placeholder="Optional notes about this section"
                />
                <InputError message={errors.description} />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                    <Label htmlFor="section-display-order">Display order</Label>
                    <Input
                        id="section-display-order"
                        name="display_order"
                        type="number"
                        min={0}
                        value={data.display_order}
                        onChange={(event) => setData('display_order', event.target.value)}
                        placeholder="Auto"
                    />
                    <InputError message={errors.display_order} />
                </div>

                <div className="flex items-center gap-3 pt-6">
                    <Checkbox id={activeCheckboxId} checked={data.is_active} onCheckedChange={(checked) => setData('is_active', Boolean(checked))} />
                    <Label htmlFor={activeCheckboxId}>Active section</Label>
                </div>
            </div>

            <DialogFooter>
                <Button type="button" variant="outline" onClick={() => onClose()}>
                    Cancel
                </Button>
                <Button type="submit" disabled={processing}>
                    {processing ? 'Saving...' : mode === 'create' ? 'Create section' : 'Save changes'}
                </Button>
            </DialogFooter>
        </form>
    );
}
