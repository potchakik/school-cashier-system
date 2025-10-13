import { ChangeEvent, FormEventHandler, useEffect, useMemo, useRef, useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { create as createPayments, index as indexPayments, store as storePayment } from '@/routes/payments';
import { create as createStudent, show as showStudent } from '@/routes/students';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import { ArrowLeft, ArrowRight, CheckCircle2, Loader2 } from 'lucide-react';

import { cn } from '@/lib/utils';

interface StudentSummary {
    id: number;
    student_number: string;
    full_name: string;
    grade_level_id?: number | null;
    grade_level: string | null;
    section: string | null;
    balance: number;
    total_paid?: number;
    expected_fees?: number;
}

interface FeeStructureOption {
    id: number;
    fee_type: string;
    amount: number;
    description: string | null;
    is_required: boolean;
    school_year?: string | null;
}

interface PaymentCreationProps extends Record<string, unknown> {
    student: StudentSummary | null;
    paymentPurposes: string[];
    students: StudentSummary[];
    search: string;
    paymentMethods: { value: string; label: string }[];
    gradeLevelFees: FeeStructureOption[];
    auth: {
        user?: {
            can?: {
                createPayments?: boolean;
            };
        };
    };
}

interface PaymentFormData {
    student_id: number | null;
    amount: string;
    payment_date: string;
    payment_purpose: string;
    payment_method: 'cash' | 'check' | 'online';
    notes: string;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Payments',
        href: indexPayments().url,
    },
    {
        title: 'Record payment',
        href: createPayments().url,
    },
];

const steps = [
    {
        id: 1,
        title: 'Select student',
        description: 'Find the payer and confirm their details.',
    },
    {
        id: 2,
        title: 'Payment details',
        description: 'Choose fees, confirm totals, and submit.',
    },
];

const formatCurrency = (value: number | string | null | undefined): string => {
    const numeric = typeof value === 'string' ? Number(value) : (value ?? 0);

    if (!Number.isFinite(numeric)) {
        return '₱0.00';
    }

    const sign = numeric < 0 ? '-' : '';
    const absolute = Math.abs(numeric);

    return `${sign}₱${absolute.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    })}`;
};

const arraysEqual = (a: number[], b: number[]) => a.length === b.length && a.every((value, index) => value === b[index]);

function Stepper({ currentStep }: { currentStep: number }) {
    return (
        <div className="space-y-4">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6">
                {steps.map((step) => {
                    const isComplete = currentStep > step.id;
                    const isActive = currentStep === step.id;

                    return (
                        <div key={step.id} className="flex items-start gap-3">
                            <div
                                className={cn(
                                    'flex h-10 w-10 items-center justify-center rounded-full border text-sm font-semibold transition',
                                    isComplete
                                        ? 'border-primary bg-primary text-primary-foreground'
                                        : isActive
                                          ? 'border-primary text-primary'
                                          : 'border-border text-muted-foreground',
                                )}
                            >
                                {isComplete ? <CheckCircle2 className="h-5 w-5" /> : step.id}
                            </div>
                            <div className="space-y-1">
                                <p className={cn('text-sm font-medium', isActive || isComplete ? 'text-foreground' : 'text-muted-foreground')}>
                                    {step.title}
                                </p>
                                <p className="text-xs text-muted-foreground">{step.description}</p>
                            </div>
                        </div>
                    );
                })}
            </div>
            <Separator />
        </div>
    );
}

export default function CreatePayment() {
    const { student, paymentPurposes, students, search, paymentMethods, gradeLevelFees, auth } = usePage<PaymentCreationProps>().props;

    const today = useMemo(() => new Date().toISOString().slice(0, 10), []);
    const defaultMethod = (paymentMethods[0]?.value ?? 'cash') as PaymentFormData['payment_method'];

    const { data, setData, post, processing, errors, reset } = useForm<PaymentFormData>({
        student_id: student?.id ?? null,
        amount: '',
        payment_date: today,
        payment_purpose: paymentPurposes[0] ?? 'Tuition Fee',
        payment_method: defaultMethod,
        notes: '',
    });

    const [selectedStudent, setSelectedStudent] = useState<StudentSummary | null>(student);
    const [searchQuery, setSearchQuery] = useState(search ?? '');
    const [step, setStep] = useState<number>(student ? 2 : 1);
    const [selectedFeeIds, setSelectedFeeIds] = useState<number[]>([]);
    const [amountManuallyEdited, setAmountManuallyEdited] = useState(false);
    const [isFetchingStudent, setIsFetchingStudent] = useState(false);

    const searchInitializedRef = useRef(false);
    const lastStudentIdRef = useRef<number | null>(student?.id ?? null);

    useEffect(() => {
        setSelectedStudent(student);
        setData('student_id', student?.id ?? null);
        setStep(student ? 2 : 1);
    }, [student, setData]);

    useEffect(() => {
        setSearchQuery(search ?? '');
    }, [search]);

    useEffect(() => {
        if (!searchInitializedRef.current) {
            searchInitializedRef.current = true;
            return;
        }

        setIsFetchingStudent(true);

        const timeout = setTimeout(() => {
            router.get(
                createPayments({
                    query: {
                        search: searchQuery || undefined,
                        student_id: data.student_id ?? undefined,
                    },
                }).url,
                {},
                {
                    preserveScroll: true,
                    preserveState: true,
                    replace: true,
                    only: ['students', 'search', 'student', 'gradeLevelFees'],
                    onFinish: () => setIsFetchingStudent(false),
                },
            );
        }, 250);

        return () => {
            clearTimeout(timeout);
        };
    }, [searchQuery, data.student_id]);

    useEffect(() => {
        if (!selectedStudent) {
            lastStudentIdRef.current = null;
            setSelectedFeeIds([]);
            return;
        }

        const nextFeeIds = gradeLevelFees.map((fee) => fee.id);

        if (lastStudentIdRef.current !== selectedStudent.id) {
            lastStudentIdRef.current = selectedStudent.id;
            setSelectedFeeIds(nextFeeIds);
            setAmountManuallyEdited(false);
            return;
        }

        setSelectedFeeIds((current) => {
            const requiredIds = gradeLevelFees.filter((fee) => fee.is_required).map((fee) => fee.id);
            const filtered = current.filter((id) => nextFeeIds.includes(id));
            const mergedSet = new Set([...filtered, ...requiredIds]);
            const ordered = nextFeeIds.filter((id) => mergedSet.has(id));

            if (arraysEqual(ordered, current)) {
                return current;
            }

            return ordered;
        });
    }, [selectedStudent, gradeLevelFees]);

    const selectedFees = useMemo(() => gradeLevelFees.filter((fee) => selectedFeeIds.includes(fee.id)), [gradeLevelFees, selectedFeeIds]);

    const calculatedTotal = useMemo(() => selectedFees.reduce((sum, fee) => sum + Number(fee.amount), 0), [selectedFees]);

    const currentAmount = data.amount;

    useEffect(() => {
        if (!selectedStudent) {
            if (currentAmount !== '') {
                setData('amount', '');
            }
            setAmountManuallyEdited(false);
            return;
        }

        if (amountManuallyEdited) {
            return;
        }

        const nextAmount = calculatedTotal > 0 ? calculatedTotal.toFixed(2) : '';

        if (currentAmount !== nextAmount) {
            setData('amount', nextAmount);
        }
    }, [selectedStudent, calculatedTotal, amountManuallyEdited, currentAmount, setData]);

    const handleSelectStudent = (studentOption: StudentSummary) => {
        if (selectedStudent?.id === studentOption.id) {
            setStep(2);
            return;
        }

        setSelectedStudent(studentOption);
        setData('student_id', studentOption.id);
        setIsFetchingStudent(true);

        router.get(
            createPayments({
                query: {
                    student_id: studentOption.id,
                    search: searchQuery || undefined,
                },
            }).url,
            {},
            {
                preserveScroll: true,
                preserveState: true,
                replace: true,
                only: ['student', 'gradeLevelFees', 'students', 'search'],
                onSuccess: () => setStep(2),
                onFinish: () => setIsFetchingStudent(false),
            },
        );
    };

    const handleClearStudent = () => {
        setSelectedStudent(null);
        setData('student_id', null);
        setSelectedFeeIds([]);
        setAmountManuallyEdited(false);
        setStep(1);
        setIsFetchingStudent(true);

        router.get(
            createPayments({
                query: {
                    search: searchQuery || undefined,
                },
            }).url,
            {},
            {
                preserveScroll: true,
                preserveState: true,
                replace: true,
                only: ['student', 'gradeLevelFees', 'students', 'search'],
                onFinish: () => setIsFetchingStudent(false),
            },
        );
    };

    const toggleFee = (feeId: number, isRequired: boolean, nextState: boolean) => {
        if (isRequired) {
            return;
        }

        setSelectedFeeIds((current) => {
            if (nextState) {
                if (current.includes(feeId)) {
                    return current;
                }

                const merged = [...current, feeId];
                return gradeLevelFees.filter((fee) => merged.includes(fee.id)).map((fee) => fee.id);
            }

            return current.filter((id) => id !== feeId);
        });
    };

    const handleAmountInputChange = (event: ChangeEvent<HTMLInputElement>) => {
        setAmountManuallyEdited(true);
        setData('amount', event.target.value);
    };

    const handleApplyCalculatedTotal = () => {
        setAmountManuallyEdited(false);
    };

    const submit: FormEventHandler<HTMLFormElement> = (event) => {
        event.preventDefault();

        post(storePayment().url, {
            onSuccess: () => {
                reset('amount', 'notes');
                setAmountManuallyEdited(false);
            },
        });
    };

    const parsedAmount = Number(data.amount);
    const isSubmitDisabled = !data.student_id || !data.amount || Number.isNaN(parsedAmount) || parsedAmount <= 0 || processing;

    const outstandingBalance = selectedStudent?.balance ?? 0;
    const expectedFees = selectedStudent?.expected_fees ?? 0;
    const totalPaid = selectedStudent?.total_paid ?? 0;

    const balanceTone =
        outstandingBalance > 0
            ? 'text-red-600 dark:text-red-400'
            : outstandingBalance < 0
              ? 'text-emerald-600 dark:text-emerald-400'
              : 'text-slate-600 dark:text-slate-300';

    const canCreatePayments = auth?.user?.can?.createPayments ?? false;
    const showManualOverrideBadge = amountManuallyEdited && data.amount !== '';

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Record Payment" />

            <div className="p-4 md:p-8">
                <Card>
                    <CardHeader>
                        <div className="space-y-4">
                            <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                                <div>
                                    <CardTitle>Record payment</CardTitle>
                                    <CardDescription>Guided flow for accurate receipts and faster checkout.</CardDescription>
                                </div>

                                {canCreatePayments && selectedStudent && (
                                    <Button asChild variant="outline">
                                        <Link href={showStudent({ student: selectedStudent.id }).url}>View student</Link>
                                    </Button>
                                )}
                            </div>

                            <Stepper currentStep={step} />
                        </div>
                    </CardHeader>

                    <CardContent className="space-y-8">
                        {step === 1 && (
                            <div className="grid gap-6 lg:grid-cols-[1.3fr,2fr]">
                                <Card className="border-border/60">
                                    <CardHeader>
                                        <CardTitle>Selected student</CardTitle>
                                        <CardDescription>Pick a student to move on to the payment step.</CardDescription>
                                    </CardHeader>
                                    <CardContent className="grid gap-4">
                                        {selectedStudent ? (
                                            <div className="flex flex-col gap-4 rounded-lg border border-border/50 bg-muted/40 p-4">
                                                <div className="flex items-start justify-between gap-4">
                                                    <div>
                                                        <p className="text-base font-semibold text-foreground">{selectedStudent.full_name}</p>
                                                        <p className="text-sm text-muted-foreground">{selectedStudent.student_number}</p>
                                                    </div>
                                                    <Badge variant="secondary">{selectedStudent.grade_level ?? 'Unassigned'}</Badge>
                                                </div>

                                                <div className="grid gap-3 rounded-lg border border-border/40 bg-card/60 p-3 text-sm">
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-muted-foreground">Balance</span>
                                                        <span className={cn('font-semibold', balanceTone)}>{formatCurrency(outstandingBalance)}</span>
                                                    </div>
                                                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                                                        <span>Expected fees</span>
                                                        <span className="font-medium text-foreground">{formatCurrency(expectedFees)}</span>
                                                    </div>
                                                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                                                        <span>Total paid</span>
                                                        <span className="font-medium text-foreground">{formatCurrency(totalPaid)}</span>
                                                    </div>
                                                </div>

                                                <div className="flex flex-wrap items-center justify-between gap-3">
                                                    <Button type="button" variant="ghost" onClick={handleClearStudent}>
                                                        Clear selection
                                                    </Button>
                                                    <Button type="button" onClick={() => setStep(2)}>
                                                        Continue to payment
                                                        <ArrowRight className="ml-2 h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="rounded-lg border border-dashed border-border/60 bg-muted/30 p-6 text-center text-sm text-muted-foreground">
                                                No student selected yet. Search the list to get started.
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>

                                <Card className="border-border/60">
                                    <CardHeader>
                                        <div className="flex items-center justify-between gap-3">
                                            <div>
                                                <CardTitle>Find a student</CardTitle>
                                                <CardDescription>Search by name, ID, or partial keywords.</CardDescription>
                                            </div>
                                            {isFetchingStudent && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
                                        </div>
                                    </CardHeader>
                                    <CardContent className="grid gap-4">
                                        <div className="flex flex-col gap-2">
                                            <Label htmlFor="student-search">Search</Label>
                                            <Input
                                                id="student-search"
                                                value={searchQuery}
                                                onChange={(event) => setSearchQuery(event.target.value)}
                                                placeholder="e.g. Juan Dela Cruz or STU-2025-0001"
                                                autoComplete="off"
                                            />
                                        </div>

                                        <div className="grid max-h-80 gap-2 overflow-auto pr-1">
                                            {students.length === 0 && (
                                                <div className="rounded-lg border border-dashed border-border/60 p-4 text-center text-sm text-muted-foreground">
                                                    No matches yet. Keep typing to narrow the list.
                                                </div>
                                            )}

                                            {students.map((studentOption) => {
                                                const isActive = selectedStudent?.id === studentOption.id;

                                                return (
                                                    <button
                                                        key={studentOption.id}
                                                        type="button"
                                                        onClick={() => handleSelectStudent(studentOption)}
                                                        className={cn(
                                                            'flex flex-col rounded-lg border border-border/40 bg-card/60 px-4 py-3 text-left transition hover:border-primary/40 hover:bg-primary/5',
                                                            isActive && 'border-primary bg-primary/10 shadow-sm',
                                                        )}
                                                    >
                                                        <div className="flex items-center justify-between gap-3">
                                                            <div>
                                                                <p className="text-sm font-medium text-foreground">{studentOption.full_name}</p>
                                                                <p className="text-xs text-muted-foreground">{studentOption.student_number}</p>
                                                            </div>
                                                            <Badge variant="outline">{studentOption.grade_level ?? 'Unassigned'}</Badge>
                                                        </div>
                                                        <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
                                                            <span>Section {studentOption.section ?? '—'}</span>
                                                            <span>Balance: {formatCurrency(studentOption.balance)}</span>
                                                        </div>
                                                    </button>
                                                );
                                            })}
                                        </div>

                                        <div className="flex flex-col gap-2 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
                                            <span>
                                                Need to add a new student?{' '}
                                                <Link href={createStudent().url} className="font-medium text-primary">
                                                    Create student
                                                </Link>
                                            </span>
                                            <Button
                                                type="button"
                                                variant="outline"
                                                size="sm"
                                                onClick={() => setStep(2)}
                                                disabled={!selectedStudent || isFetchingStudent}
                                            >
                                                Continue
                                                <ArrowRight className="ml-2 h-3 w-3" />
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        )}

                        {step === 2 && selectedStudent && (
                            <div className="grid gap-6 lg:grid-cols-[1.3fr,2fr]">
                                <div className="grid gap-6">
                                    <Card className="border-border/60">
                                        <CardHeader>
                                            <CardTitle>Payment context</CardTitle>
                                            <CardDescription>Cross-check balances before submitting the payment.</CardDescription>
                                        </CardHeader>
                                        <CardContent className="grid gap-4">
                                            <div className="flex items-start justify-between gap-4">
                                                <div>
                                                    <p className="text-base font-semibold text-foreground">{selectedStudent.full_name}</p>
                                                    <p className="text-sm text-muted-foreground">{selectedStudent.student_number}</p>
                                                    <p className="text-xs text-muted-foreground">Section {selectedStudent.section ?? '—'}</p>
                                                </div>
                                                <Badge variant="secondary">{selectedStudent.grade_level ?? 'Unassigned'}</Badge>
                                            </div>

                                            <div className="grid gap-3 rounded-lg border border-border/40 bg-muted/30 p-4 text-sm">
                                                <div className="flex items-center justify-between">
                                                    <span className="text-muted-foreground">Outstanding balance</span>
                                                    <span className={cn('font-semibold', balanceTone)}>{formatCurrency(outstandingBalance)}</span>
                                                </div>
                                                <div className="flex items-center justify-between text-xs text-muted-foreground">
                                                    <span>Total expected this year</span>
                                                    <span className="font-medium text-foreground">{formatCurrency(expectedFees)}</span>
                                                </div>
                                                <div className="flex items-center justify-between text-xs text-muted-foreground">
                                                    <span>Total paid so far</span>
                                                    <span className="font-medium text-foreground">{formatCurrency(totalPaid)}</span>
                                                </div>
                                            </div>

                                            <div className="flex flex-wrap gap-3">
                                                <Button type="button" variant="ghost" onClick={() => setStep(1)}>
                                                    <ArrowLeft className="mr-2 h-4 w-4" />
                                                    Change student
                                                </Button>
                                                <Button type="button" variant="outline" onClick={handleClearStudent}>
                                                    Clear selection
                                                </Button>
                                            </div>
                                        </CardContent>
                                    </Card>

                                    <Card className="border-border/60">
                                        <CardHeader>
                                            <CardTitle>Billing plan</CardTitle>
                                            <CardDescription>
                                                Prefill from the grade-level fee catalog. Required fees stay selected; optional fees can be toggled.
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent className="grid gap-4">
                                            {gradeLevelFees.length === 0 ? (
                                                <div className="rounded-lg border border-dashed border-border/60 bg-muted/30 p-6 text-center text-sm text-muted-foreground">
                                                    No fee structures configured for this student’s grade level. Enter the amount manually below.
                                                </div>
                                            ) : (
                                                <div className="space-y-3">
                                                    {gradeLevelFees.map((fee) => {
                                                        const isSelected = selectedFeeIds.includes(fee.id);

                                                        return (
                                                            <label
                                                                key={fee.id}
                                                                className={cn(
                                                                    'flex items-start gap-3 rounded-lg border border-border/40 bg-card/60 p-4 transition hover:border-primary/40 hover:bg-primary/5',
                                                                    isSelected && 'border-primary bg-primary/10',
                                                                )}
                                                            >
                                                                <Checkbox
                                                                    checked={isSelected}
                                                                    disabled={fee.is_required}
                                                                    onCheckedChange={(checked) =>
                                                                        toggleFee(fee.id, fee.is_required, Boolean(checked))
                                                                    }
                                                                    className="mt-1"
                                                                />
                                                                <div className="flex-1 space-y-1">
                                                                    <div className="flex items-start justify-between gap-3">
                                                                        <p className="text-sm font-medium text-foreground">{fee.fee_type}</p>
                                                                        <span className="text-sm font-semibold text-foreground">
                                                                            {formatCurrency(fee.amount)}
                                                                        </span>
                                                                    </div>
                                                                    {fee.description && (
                                                                        <p className="text-xs text-muted-foreground">{fee.description}</p>
                                                                    )}
                                                                    <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                                                                        <Badge variant={fee.is_required ? 'secondary' : 'outline'}>
                                                                            {fee.is_required ? 'Required' : 'Optional'}
                                                                        </Badge>
                                                                        {fee.school_year && <Badge variant="outline">SY {fee.school_year}</Badge>}
                                                                    </div>
                                                                </div>
                                                            </label>
                                                        );
                                                    })}
                                                </div>
                                            )}

                                            <div className="rounded-lg border border-border/50 bg-muted/30 p-4 text-sm">
                                                <div className="flex items-center justify-between">
                                                    <span className="text-muted-foreground">Selected fees ({selectedFees.length})</span>
                                                    <span className="font-semibold text-foreground">{formatCurrency(calculatedTotal)}</span>
                                                </div>
                                                {selectedFees.length > 0 ? (
                                                    <div className="mt-3 flex flex-wrap gap-2">
                                                        {selectedFees.map((fee) => (
                                                            <Badge key={fee.id} variant="outline">
                                                                {fee.fee_type}
                                                            </Badge>
                                                        ))}
                                                    </div>
                                                ) : (
                                                    <p className="mt-2 text-xs text-muted-foreground">
                                                        No fees selected. You can still record a payment by entering a custom amount.
                                                    </p>
                                                )}
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>

                                <form onSubmit={submit} className="grid gap-6">
                                    <div className="rounded-lg border border-border/60 bg-muted/20 p-4">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-sm text-muted-foreground">Amount to collect</p>
                                                <p className="text-2xl font-semibold text-foreground">{formatCurrency(data.amount)}</p>
                                            </div>
                                            <div className="text-right text-xs text-muted-foreground">
                                                <p>Balance after payment</p>
                                                <p className="font-medium text-foreground">
                                                    {formatCurrency(outstandingBalance - (Number(data.amount) || 0))}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-6">
                                        <div className="flex flex-col gap-2">
                                            <div className="flex items-center gap-3">
                                                <Label htmlFor="amount">
                                                    Amount <span className="text-red-500">*</span>
                                                </Label>
                                                {showManualOverrideBadge && (
                                                    <Badge
                                                        variant="outline"
                                                        className="bg-amber-100 text-amber-700 dark:bg-amber-400/10 dark:text-amber-300"
                                                    >
                                                        Manual override
                                                    </Badge>
                                                )}
                                            </div>
                                            <Input
                                                id="amount"
                                                type="number"
                                                min="0.01"
                                                step="0.01"
                                                value={data.amount}
                                                onChange={handleAmountInputChange}
                                                placeholder="0.00"
                                                required
                                            />
                                            {errors.amount && <p className="text-sm text-red-500">{errors.amount}</p>}
                                            <div className="flex items-center justify-between text-xs text-muted-foreground">
                                                <span>You can adjust this amount for partial payments.</span>
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={handleApplyCalculatedTotal}
                                                    disabled={calculatedTotal <= 0}
                                                >
                                                    Reset to {formatCurrency(calculatedTotal)}
                                                </Button>
                                            </div>
                                        </div>

                                        <div className="grid gap-4 sm:grid-cols-2">
                                            <div className="flex flex-col gap-2">
                                                <Label htmlFor="payment_date">
                                                    Payment date <span className="text-red-500">*</span>
                                                </Label>
                                                <Input
                                                    id="payment_date"
                                                    type="date"
                                                    value={data.payment_date}
                                                    onChange={(event) => setData('payment_date', event.target.value)}
                                                    required
                                                />
                                                {errors.payment_date && <p className="text-sm text-red-500">{errors.payment_date}</p>}
                                            </div>

                                            <div className="flex flex-col gap-2">
                                                <Label htmlFor="payment_purpose">
                                                    Purpose <span className="text-red-500">*</span>
                                                </Label>
                                                <Select value={data.payment_purpose} onValueChange={(value) => setData('payment_purpose', value)}>
                                                    <SelectTrigger id="payment_purpose">
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {paymentPurposes.map((purposeOption) => (
                                                            <SelectItem key={purposeOption} value={purposeOption}>
                                                                {purposeOption}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                                {errors.payment_purpose && <p className="text-sm text-red-500">{errors.payment_purpose}</p>}
                                            </div>

                                            <div className="flex flex-col gap-2">
                                                <Label htmlFor="payment_method">Method</Label>
                                                <Select
                                                    value={data.payment_method}
                                                    onValueChange={(value) => setData('payment_method', value as PaymentFormData['payment_method'])}
                                                >
                                                    <SelectTrigger id="payment_method">
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {paymentMethods.map((method) => (
                                                            <SelectItem key={method.value} value={method.value}>
                                                                {method.label}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                                {errors.payment_method && <p className="text-sm text-red-500">{errors.payment_method}</p>}
                                            </div>
                                        </div>

                                        <div className="flex flex-col gap-2">
                                            <Label htmlFor="notes">Notes</Label>
                                            <Textarea
                                                id="notes"
                                                value={data.notes}
                                                onChange={(event) => setData('notes', event.target.value)}
                                                rows={4}
                                                placeholder="Optional details, reference numbers, or special instructions"
                                            />
                                            {errors.notes && <p className="text-sm text-red-500">{errors.notes}</p>}
                                        </div>

                                        {!data.student_id && (
                                            <p className="rounded-lg border border-red-500/30 bg-red-500/5 p-4 text-sm text-red-600 dark:text-red-400">
                                                Select a student before recording the payment.
                                            </p>
                                        )}
                                        {errors.student_id && <p className="text-sm text-red-500">{errors.student_id}</p>}
                                    </div>

                                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                        <div className="flex flex-wrap gap-3">
                                            <Button type="button" variant="ghost" onClick={() => setStep(1)}>
                                                <ArrowLeft className="mr-2 h-4 w-4" />
                                                Back to student list
                                            </Button>
                                            <Button type="button" variant="outline" asChild>
                                                <Link href={indexPayments().url}>Cancel</Link>
                                            </Button>
                                        </div>
                                        <Button type="submit" disabled={isSubmitDisabled} className="min-w-[160px]">
                                            {processing ? 'Saving...' : 'Save payment'}
                                        </Button>
                                    </div>
                                </form>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
