import { useCallback, useEffect } from 'react';

import FeeStructureController from '@/actions/App/Http/Controllers/Settings/FeeStructureController';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useForm } from '@inertiajs/react';

import { FeeStructureDialogState, FeeStructureFormData, FeeStructureItem, GradeLevelOption } from './types';

type FeeStructureDialogProps = {
    state: FeeStructureDialogState | null;
    close: () => void;
    gradeLevels: GradeLevelOption[];
    defaultSchoolYear: string;
};

const blankForm = (gradeLevelId: string, schoolYear: string): FeeStructureFormData => ({
    grade_level_id: gradeLevelId,
    fee_type: '',
    amount: '',
    school_year: schoolYear,
    description: '',
    is_required: true,
    is_active: true,
});

const mapFeeToForm = (fee: FeeStructureItem): FeeStructureFormData => ({
    grade_level_id: fee.grade_level_id.toString(),
    fee_type: fee.fee_type,
    amount: fee.amount.toString(),
    school_year: fee.school_year,
    description: fee.description ?? '',
    is_required: fee.is_required,
    is_active: fee.is_active,
});

export function FeeStructureDialog({ state, close, gradeLevels, defaultSchoolYear }: FeeStructureDialogProps) {
    const firstGradeLevel = gradeLevels[0]?.id.toString() ?? '';
    const fallbackSchoolYear = defaultSchoolYear ?? '';

    const { data, setData, clearErrors, post, put, processing, errors, transform } = useForm<FeeStructureFormData>(
        blankForm(firstGradeLevel, fallbackSchoolYear),
    );

    const applyForm = useCallback(
        (next: FeeStructureFormData) => {
            setData('grade_level_id', next.grade_level_id);
            setData('fee_type', next.fee_type);
            setData('amount', next.amount);
            setData('school_year', next.school_year);
            setData('description', next.description);
            setData('is_required', next.is_required);
            setData('is_active', next.is_active);
        },
        [setData],
    );

    useEffect(() => {
        if (!state) {
            applyForm(blankForm(firstGradeLevel, fallbackSchoolYear));
            clearErrors();
            return;
        }

        clearErrors();

        if (state.mode === 'edit') {
            const next = mapFeeToForm(state.feeStructure);
            applyForm(next);
            return;
        }

        const gradeLevelId = state.gradeLevelId ? state.gradeLevelId.toString() : firstGradeLevel;
        applyForm(blankForm(gradeLevelId, fallbackSchoolYear));
    }, [state, clearErrors, firstGradeLevel, fallbackSchoolYear, applyForm]);

    const submit = (event: React.FormEvent<HTMLFormElement>) => {
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
                applyForm(blankForm(firstGradeLevel, fallbackSchoolYear));
                clearErrors();
                close();
            },
        } as const;

        if (state?.mode === 'edit' && 'feeStructure' in state) {
            put(FeeStructureController.update.url({ feeStructure: state.feeStructure.id }), options);
            return;
        }

        post(FeeStructureController.store.url(), options);
    };

    return (
        <Dialog open={state !== null} onOpenChange={(open) => !open && close()}>
            <DialogContent className="max-w-lg">
                <DialogHeader>
                    <DialogTitle>{state?.mode === 'edit' ? `Edit ${state.feeStructure.fee_type}` : 'Create fee'}</DialogTitle>
                    <DialogDescription>
                        {state?.mode === 'edit' ? 'Update the details for this fee structure.' : 'Add a new fee that will appear on student ledgers.'}
                    </DialogDescription>
                </DialogHeader>

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
                        <Label htmlFor="fee-name">Fee name</Label>
                        <Input
                            id="fee-name"
                            value={data.fee_type}
                            onChange={(event) => setData('fee_type', event.target.value)}
                            placeholder="e.g. Tuition"
                            required
                            autoFocus
                        />
                        <InputError message={errors.fee_type} />
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="fee-amount">Amount</Label>
                            <Input
                                id="fee-amount"
                                type="number"
                                min={0}
                                step="0.01"
                                value={data.amount}
                                onChange={(event) => setData('amount', event.target.value)}
                                placeholder="0.00"
                                required
                            />
                            <InputError message={errors.amount} />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="fee-school-year">School year</Label>
                            <Input
                                id="fee-school-year"
                                value={data.school_year}
                                onChange={(event) => setData('school_year', event.target.value)}
                                placeholder="2025-2026"
                                required
                            />
                            <InputError message={errors.school_year} />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="fee-description">Description</Label>
                        <Textarea
                            id="fee-description"
                            value={data.description}
                            onChange={(event) => setData('description', event.target.value)}
                            rows={4}
                            placeholder="Optional context or notes"
                        />
                        <InputError message={errors.description} />
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                        <div className="flex items-center gap-3">
                            <Checkbox
                                id="fee-required"
                                checked={data.is_required}
                                onCheckedChange={(checked) => setData('is_required', Boolean(checked))}
                            />
                            <Label htmlFor="fee-required">Required fee</Label>
                        </div>
                        <div className="flex items-center gap-3">
                            <Checkbox
                                id="fee-active"
                                checked={data.is_active}
                                onCheckedChange={(checked) => setData('is_active', Boolean(checked))}
                            />
                            <Label htmlFor="fee-active">Active fee</Label>
                        </div>
                    </div>

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={close} disabled={processing}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={processing}>
                            {processing ? 'Saving...' : state?.mode === 'edit' ? 'Save changes' : 'Create'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
