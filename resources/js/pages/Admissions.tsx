import { Card, CardContent } from '@/components/ui/card';
import MainLayout from '@/layouts/MainLayout';
import { admissions, contact } from '@/routes';
import { Link } from '@inertiajs/react';
import { ClipboardList, FileCheck2, PhoneCall } from 'lucide-react';

const steps = [
    {
        title: '1. Inquiry & Campus Tour',
        description: 'Book a campus visit or virtual consultation. Our admissions team will walk you through programs, fees, and schedules.',
    },
    {
        title: '2. Application Submission',
        description: 'Complete the online form and submit requirements (PSA birth certificate, latest report card, good moral certificate).',
    },
    {
        title: '3. Readiness Assessment',
        description: 'Students take a short diagnostic and interview so we understand learning styles, goals, and support needs.',
    },
    {
        title: '4. Enrollment & Orientation',
        description: 'Secure reservation, finalize fees, and join our Bridging Week to get to know teachers and classmates.',
    },
];

const requirements = [
    'PSA Birth Certificate (photocopy)',
    'Report Card / Form 138 (latest)',
    'Certificate of Good Moral Character',
    '2 pcs 2x2 ID photo (white background)',
    'For transferees: Form 137 / SF10',
];

const tuitionHighlights = [
    { label: 'Preschool', detail: 'Starts at ₱35,000 / year' },
    { label: 'Elementary', detail: 'Starts at ₱42,000 / year' },
    { label: 'Junior High', detail: 'Starts at ₱48,000 / year' },
    { label: 'Senior High (GAS)', detail: 'Starts at ₱52,000 / year' },
];

export default function Admissions() {
    return (
        <MainLayout title="Admissions | Dei Gratia School Inc." className="bg-white">
            <section className="mx-auto w-full max-w-6xl px-4 py-16">
                <div className="rounded-3xl bg-gradient-to-r from-yellow-400 to-amber-300 px-8 py-12 text-blue-950 shadow-xl">
                    <p className="text-sm font-semibold tracking-[0.4em] text-blue-700 uppercase">Admissions</p>
                    <h1 className="mt-4 text-4xl font-semibold">Enrollment designed around families.</h1>
                    <p className="mt-4 max-w-3xl text-base text-blue-900/80">
                        We keep the process clear, compassionate, and responsive. Whether you are a returning family or a transferee, our team is
                        ready to guide you every step of the way.
                    </p>
                    <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                        <Link
                            href={contact()}
                            className="inline-flex items-center justify-center rounded-md bg-blue-900 px-6 py-3 text-base font-semibold text-white shadow-lg transition hover:bg-blue-800"
                        >
                            Schedule a Visit
                        </Link>
                        <a
                            href="https://forms.gle/DeiGratiaEnrollment"
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center justify-center rounded-md border border-blue-900 px-6 py-3 text-base font-semibold text-blue-900 transition hover:bg-blue-900/10"
                        >
                            Apply Online
                        </a>
                    </div>
                </div>
            </section>

            <section className="mx-auto w-full max-w-6xl px-4 pb-16">
                <p className="text-sm font-semibold tracking-wide text-blue-600 uppercase">Enrollment Steps</p>
                <h2 className="mt-3 text-3xl font-semibold text-slate-900">Simple, guided process.</h2>
                <div className="mt-10 grid gap-6 md:grid-cols-2">
                    {steps.map((step) => (
                        <Card key={step.title} className="border-slate-200/60 bg-white/90 shadow-sm">
                            <CardContent className="space-y-3 px-6 py-6">
                                <h3 className="text-xl font-semibold text-slate-900">{step.title}</h3>
                                <p className="text-sm text-slate-600">{step.description}</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </section>

            <section className="mx-auto w-full max-w-6xl px-4 pb-16">
                <div className="grid gap-8 lg:grid-cols-[2fr,1fr]">
                    <Card className="border-slate-200/60 bg-white/90 shadow-sm">
                        <CardContent className="space-y-4 px-6 py-8">
                            <h2 className="text-2xl font-semibold text-slate-900">Requirements</h2>
                            <div className="space-y-2 text-sm text-slate-600">
                                {requirements.map((item) => (
                                    <div key={item} className="flex items-start gap-3">
                                        <FileCheck2 className="mt-0.5 h-4 w-4 text-blue-600" />
                                        <span>{item}</span>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="border-blue-100 bg-blue-50/70 shadow-sm">
                        <CardContent className="space-y-4 px-6 py-8">
                            <h2 className="text-2xl font-semibold text-blue-900">FAPE-ESC & Discounts</h2>
                            <p className="text-sm text-blue-900/80">
                                Preschool to JHS learners may avail of sibling discounts. Junior High and Senior High students can apply for FAPE-ESC
                                and SHS vouchers during enrollment.
                            </p>
                            <Link
                                href={admissions()}
                                className="inline-flex items-center gap-2 rounded-md bg-blue-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-800"
                            >
                                <ClipboardList className="h-4 w-4" />
                                View Tuition Matrix
                            </Link>
                        </CardContent>
                    </Card>
                </div>
            </section>

            <section className="mx-auto w-full max-w-6xl px-4 pb-24">
                <p className="text-sm font-semibold tracking-wide text-blue-600 uppercase">Tuition Highlights</p>
                <div className="mt-6 grid gap-6 md:grid-cols-4">
                    {tuitionHighlights.map((item) => (
                        <Card key={item.label} className="border-slate-200/60 bg-white/90 text-center shadow-sm">
                            <CardContent className="space-y-2 px-6 py-6">
                                <p className="text-sm font-semibold tracking-wide text-slate-500 uppercase">{item.label}</p>
                                <p className="text-xl font-semibold text-slate-900">{item.detail}</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
                <div className="mt-12 flex flex-col items-center gap-4 rounded-3xl border border-slate-200/80 bg-white/90 px-8 py-10 text-center shadow-sm">
                    <PhoneCall className="h-10 w-10 text-blue-600" />
                    <p className="text-lg font-semibold text-slate-900">Need assistance with requirements or scholarships?</p>
                    <p className="text-sm text-slate-600">Call us at (046) 863 0045 or email admissions@deigratia.edu.ph</p>
                </div>
            </section>
        </MainLayout>
    );
}
