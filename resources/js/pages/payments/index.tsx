import { useEffect, useRef, useState } from 'react';

import { Pagination } from '@/components/pagination';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { create as createPayment, index as indexPayments } from '@/routes/payments';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router, usePage } from '@inertiajs/react';

interface StudentOption {
    id: number;
    full_name: string;
    student_number: string;
}

interface AcademicYearOption {
    id: number;
    name: string;
}

interface PaymentSummary {
    id: number;
    amount: number;
    currency: string;
    status: string;
    purpose: string | null;
    paid_at: string | null;
    receipt_number: string | null;
    student: {
        id: number;
        full_name: string;
        student_number: string;
    };
    enrollment: {
        grade_level: { id: number; name: string } | null;
        section: { id: number; name: string } | null;
        academic_year: { id: number; name: string } | null;
    } | null;
    cashier: { id: number; name: string } | null;
}

interface PaginatedPayments {
    data: PaymentSummary[];
    links: { url: string | null; label: string; active: boolean }[];
    from?: number;
    to?: number;
    total?: number;
}

interface PageProps extends Record<string, unknown> {
    payments: PaginatedPayments;
    filters: {
        status?: string | null;
        student_id?: number | null;
        academic_year_id?: number | null;
        date_from?: string | null;
        date_to?: string | null;
    };
    students: StudentOption[];
    academicYears: AcademicYearOption[];
    statuses: string[];
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Payments',
        href: indexPayments().url,
    },
];

export default function PaymentsIndex() {
    const { payments, filters, students, academicYears, statuses } = usePage<PageProps>().props;

    const [status, setStatus] = useState<string>(filters.status ?? '');
    const [studentId, setStudentId] = useState<string>(filters.student_id ? String(filters.student_id) : '');
    const [academicYearId, setAcademicYearId] = useState<string>(filters.academic_year_id ? String(filters.academic_year_id) : '');
    const [dateFrom, setDateFrom] = useState<string>(filters.date_from ?? '');
    const [dateTo, setDateTo] = useState<string>(filters.date_to ?? '');

    const isFirstRender = useRef(true);

    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }

        const timeout = setTimeout(() => {
            router.get(
                indexPayments({
                    query: {
                        status: status || undefined,
                        student_id: studentId || undefined,
                        academic_year_id: academicYearId || undefined,
                        date_from: dateFrom || undefined,
                        date_to: dateTo || undefined,
                    },
                }).url,
                {},
                {
                    preserveScroll: true,
                    preserveState: true,
                    replace: true,
                },
            );
        }, 250);

        return () => clearTimeout(timeout);
    }, [status, studentId, academicYearId, dateFrom, dateTo]);

    const clearFilters = () => {
        setStatus('');
        setStudentId('');
        setAcademicYearId('');
        setDateFrom('');
        setDateTo('');
        router.get(indexPayments().url, {}, { preserveScroll: true, replace: true });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Payments" />

            <div className="flex flex-col gap-6">
                <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                    <div>
                        <h1 className="text-2xl font-semibold">Payments</h1>
                        <p className="text-sm text-muted-foreground">Review all recorded transactions and track outstanding balances.</p>
                    </div>

                    <Button asChild>
                        <Link href={createPayment().url}>Record payment</Link>
                    </Button>
                </div>

                <div className="grid gap-4 rounded-xl border border-border/60 bg-card p-4 shadow-sm">
                    <div className="grid gap-3 md:grid-cols-5">
                        <div className="flex flex-col gap-2">
                            <Label>Status</Label>
                            <Select value={status} onValueChange={setStatus}>
                                <SelectTrigger>
                                    <SelectValue placeholder="All statuses" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="">All statuses</SelectItem>
                                    {statuses.map((item) => (
                                        <SelectItem key={item} value={item}>
                                            {item.charAt(0).toUpperCase() + item.slice(1)}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="flex flex-col gap-2">
                            <Label>Student</Label>
                            <Select value={studentId} onValueChange={setStudentId}>
                                <SelectTrigger>
                                    <SelectValue placeholder="All students" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="">All students</SelectItem>
                                    {students.map((student) => (
                                        <SelectItem key={student.id} value={String(student.id)}>
                                            {student.full_name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="flex flex-col gap-2">
                            <Label>Academic year</Label>
                            <Select value={academicYearId} onValueChange={setAcademicYearId}>
                                <SelectTrigger>
                                    <SelectValue placeholder="All years" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="">All years</SelectItem>
                                    {academicYears.map((year) => (
                                        <SelectItem key={year.id} value={String(year.id)}>
                                            {year.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="flex flex-col gap-2">
                            <Label htmlFor="date_from">Date from</Label>
                            <Input id="date_from" type="date" value={dateFrom} onChange={(event) => setDateFrom(event.target.value)} />
                        </div>

                        <div className="flex flex-col gap-2">
                            <Label htmlFor="date_to">Date to</Label>
                            <Input id="date_to" type="date" value={dateTo} onChange={(event) => setDateTo(event.target.value)} />
                        </div>
                    </div>

                    <div className="flex justify-end">
                        <Button variant="outline" onClick={clearFilters}>
                            Reset filters
                        </Button>
                    </div>
                </div>

                <div className="overflow-hidden rounded-xl border border-border/60 bg-card shadow-sm">
                    <table className="min-w-full divide-y divide-border/70 text-left text-sm">
                        <thead className="bg-muted/40 text-muted-foreground">
                            <tr>
                                <th className="px-4 py-3 font-medium">Date</th>
                                <th className="px-4 py-3 font-medium">Student</th>
                                <th className="px-4 py-3 font-medium">Grade &amp; Section</th>
                                <th className="px-4 py-3 font-medium">Status</th>
                                <th className="px-4 py-3 font-medium">Cashier</th>
                                <th className="px-4 py-3 text-right font-medium">Amount</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border/60">
                            {payments.data.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="px-4 py-12 text-center text-sm text-muted-foreground">
                                        No payments found. Adjust the filters or record a new payment.
                                    </td>
                                </tr>
                            )}

                            {payments.data.map((payment) => (
                                <tr key={payment.id} className="hover:bg-muted/40">
                                    <td className="px-4 py-3 text-sm text-muted-foreground">
                                        {payment.paid_at ? formatDateTime(payment.paid_at) : '—'}
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex flex-col">
                                            <span className="font-medium text-foreground">{payment.student.full_name}</span>
                                            <span className="text-xs text-muted-foreground">{payment.student.student_number}</span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 text-sm text-muted-foreground">
                                        {payment.enrollment?.grade_level?.name ?? '—'}
                                        {payment.enrollment?.section ? ` · Section ${payment.enrollment.section.name}` : ''}
                                    </td>
                                    <td className="px-4 py-3">
                                        <Badge variant={payment.status === 'paid' ? 'default' : 'secondary'} className="capitalize">
                                            {payment.status}
                                        </Badge>
                                    </td>
                                    <td className="px-4 py-3 text-sm text-muted-foreground">{payment.cashier?.name ?? '—'}</td>
                                    <td className="px-4 py-3 text-right font-medium">{formatCurrency(payment.amount, payment.currency)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
                    <div className="text-sm text-muted-foreground">
                        Showing <span className="font-medium text-foreground">{payments.from ?? 0}</span> to{' '}
                        <span className="font-medium text-foreground">{payments.to ?? 0}</span> of{' '}
                        <span className="font-medium text-foreground">{payments.total ?? 0}</span> payments
                    </div>

                    <Pagination links={payments.links} />
                </div>
            </div>
        </AppLayout>
    );
}

function formatDateTime(isoDate: string) {
    return new Intl.DateTimeFormat('en-PH', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
    }).format(new Date(isoDate));
}

function formatCurrency(amount: number, currency: string) {
    return new Intl.NumberFormat('en-PH', {
        style: 'currency',
        currency,
        minimumFractionDigits: 2,
    }).format(amount);
}
