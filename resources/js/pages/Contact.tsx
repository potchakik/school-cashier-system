import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import MainLayout from '@/layouts/MainLayout';
import { admissions } from '@/routes';
import { Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { Mail, MapPin, Phone, Send, UserCheck } from 'lucide-react';

const offices = [
    {
        title: 'Registrar & Records',
        contact: 'registrar@deigratia.edu.ph',
        schedule: 'Mon-Fri • 8:00 AM - 4:30 PM',
        description: 'Enrollment documents, student records, and credential requests.',
    },
    {
        title: 'Guidance & Wellness',
        contact: 'guidance@deigratia.edu.ph',
        schedule: 'Mon-Fri • 8:00 AM - 4:00 PM',
        description: 'Counseling appointments, referrals, and parent conferences.',
    },
    {
        title: 'Finance Office',
        contact: 'finance@deigratia.edu.ph',
        schedule: 'Mon-Fri • 8:00 AM - 5:00 PM',
        description: 'Payment schedules, scholarship queries, and official receipts.',
    },
];

const socialLinks = [
    { label: 'Facebook', href: 'https://www.facebook.com/DeiGratiaSchool/' },
    // { label: 'Instagram', href: 'https://www.instagram.com/deigratiaschool' },
    // { label: 'YouTube', href: 'https://www.youtube.com/@DeiGratiaSchool' },
];

const fadeInUp = {
    hidden: { opacity: 0, y: 24 },
    visible: { opacity: 1, y: 0 },
};

const popIn = {
    hidden: { opacity: 0, scale: 0.97 },
    visible: { opacity: 1, scale: 1 },
};

const stagger = {
    hidden: {},
    visible: {
        transition: {
            staggerChildren: 0.12,
            delayChildren: 0.15,
        },
    },
};

export default function Contact() {
    return (
        <MainLayout title="Contact | Ipil Shepherd Montessori." className="bg-white">
            <motion.section
                className="mx-auto w-full max-w-6xl px-4 py-16"
                variants={fadeInUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
            >
                <div className="grid gap-10 lg:grid-cols-[1.15fr,0.85fr]">
                    <div className="space-y-6">
                        <motion.div className="relative overflow-hidden rounded-4xl border border-blue-200 bg-blue-50/70 p-8" variants={popIn}>
                            <div className="absolute inset-0">
                                <img
                                    src="/images/marketing/contact-support.jpg"
                                    alt="Admissions counselors supporting a family"
                                    className="h-full w-full object-cover"
                                    loading="lazy"
                                />
                                <div className="absolute inset-0 bg-gradient-to-br from-blue-950/90 via-blue-900/70 to-sky-500/70" />
                            </div>
                            <div className="relative space-y-4 text-white">
                                <p className="text-sm font-semibold tracking-[0.4em] text-sky-200 uppercase">Contact</p>
                                <h1 className="text-4xl font-semibold">We are here to serve your family.</h1>
                                <p className="text-base leading-relaxed text-white/80">
                                    Call, message, or visit us for enrollment assistance, campus tours, and student support. We respond within the
                                    same business day for inquiries sent before 4 PM.
                                </p>
                                <motion.div variants={fadeInUp}>
                                    <Link
                                        href={admissions()}
                                        className="inline-flex items-center gap-2 rounded-full bg-white/15 px-5 py-3 text-base font-semibold text-white backdrop-blur transition hover:bg-white/30"
                                    >
                                        <UserCheck className="h-5 w-5" />
                                        Connect with Admissions
                                    </Link>
                                </motion.div>
                            </div>
                        </motion.div>
                        <motion.div className="grid gap-4 sm:grid-cols-2" variants={stagger}>
                            <motion.div variants={popIn}>
                                <Card className="border-slate-200/60 bg-white/95 shadow-sm transition hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl">
                                    <CardContent className="space-y-2 px-6 py-6">
                                        <p className="text-sm font-semibold tracking-wide text-slate-500 uppercase">Call Us</p>
                                        <div className="flex items-center gap-2 text-lg font-semibold text-slate-900">
                                            <Phone className="h-4 w-4 text-blue-600" />
                                            <a href="tel:+63468630045">(046) 863 0045</a>
                                        </div>
                                        <p className="text-sm text-slate-500">Mon-Fri • 7:30 AM - 5:00 PM</p>
                                    </CardContent>
                                </Card>
                            </motion.div>
                            <motion.div variants={popIn}>
                                <Card className="border-slate-200/60 bg-white/95 shadow-sm transition hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl">
                                    <CardContent className="space-y-2 px-6 py-6">
                                        <p className="text-sm font-semibold tracking-wide text-slate-500 uppercase">Email Us</p>
                                        <div className="flex items-center gap-2 text-lg font-semibold text-slate-900">
                                            <Mail className="h-4 w-4 text-blue-600" />
                                            <a href="mailto:info@deigratia.edu.ph">info@deigratia.edu.ph</a>
                                        </div>
                                        <p className="text-sm text-slate-500">We reply within the day.</p>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        </motion.div>
                    </div>
                    <motion.div className="rounded-4xl border border-slate-200/70 bg-white/95 p-6 shadow-xl" variants={popIn}>
                        <p className="text-sm font-semibold tracking-wide text-blue-600 uppercase">Visit Us</p>
                        <h2 className="mt-2 text-2xl font-semibold text-slate-900">Blk 18&19, Ph1B Carissa Homes, Bagtas, Ipil, Zamboanga Sibugay</h2>
                        <p className="mt-3 text-sm text-slate-600">
                            Guarded campus with secure drop-off and ample parking. Please bring a valid ID when entering the school grounds.
                        </p>
                        <div className="mt-6 overflow-hidden rounded-2xl">
                            <div className="relative w-full overflow-hidden pb-[65%]">
                                <iframe
                                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2973.864668659064!2d122.58224515878953!3d7.773140182687281!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3253d862a3f7ada5%3A0x987c018dca2b6646!2sQHFJ%2B7W2%2C%20Ipil%2C%207001%20Zamboanga%20Sibugay!5e1!3m2!1sen!2sph!4v1768282380559!5m2!1sen!2sph"
                                    className="absolute inset-0 h-full w-full border-0"
                                    allowFullScreen
                                    referrerPolicy="no-referrer-when-downgrade"
                                    title="School Location Map"
                                /> 
                            </div>
                        </div>
                    </motion.div>
                </div>
            </motion.section>

            <motion.section
                className="mx-auto w-full max-w-6xl px-4 pb-16"
                variants={fadeInUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
            >
                <p className="text-sm font-semibold tracking-wide text-blue-600 uppercase">Key Offices</p>
                <motion.div className="mt-6 grid gap-6 md:grid-cols-3" variants={stagger}>
                    {offices.map((office) => (
                        <motion.div key={office.title} variants={popIn}>
                            <Card className="border-slate-200/60 bg-white/95 shadow-sm transition hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl">
                                <CardContent className="space-y-3 px-6 py-6">
                                    <p className="text-sm font-semibold tracking-wide text-slate-500 uppercase">{office.title}</p>
                                    <p className="text-sm text-slate-600">{office.description}</p>
                                    <p className="text-sm font-semibold text-slate-900">{office.schedule}</p>
                                    <a href={`mailto:${office.contact}`} className="text-sm font-semibold text-blue-700 hover:underline">
                                        {office.contact}
                                    </a>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </motion.div>
            </motion.section>

            <motion.section
                className="mx-auto w-full max-w-6xl px-4 pb-24"
                variants={fadeInUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
            >
                <motion.div
                    className="rounded-4xl border border-slate-200/70 bg-gradient-to-br from-white via-blue-50 to-blue-100 p-8 shadow-xl"
                    variants={popIn}
                >
                    <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                        <div>
                            <p className="text-sm font-semibold tracking-wide text-blue-600 uppercase">Stay Connected</p>
                            <h2 className="mt-2 text-3xl font-semibold text-slate-900">Follow campus stories and announcements.</h2>
                        </div>
                        <motion.div className="flex flex-wrap gap-3" variants={stagger}>
                            {socialLinks.map((link) => (
                                <motion.a
                                    key={link.label}
                                    href={link.href}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="inline-flex items-center gap-2 rounded-full border border-white/70 bg-white/30 px-4 py-2 text-sm font-semibold text-slate-700 backdrop-blur transition hover:border-blue-500 hover:bg-white/60 hover:text-blue-600"
                                    variants={popIn}
                                >
                                    <Send className="h-4 w-4" />
                                    {link.label}
                                </motion.a>
                            ))}
                        </motion.div>
                    </div>
                    <Separator className="my-8" />
                    <motion.div className="grid gap-4 md:grid-cols-2" variants={stagger}>
                        <motion.div className="flex items-center gap-3 text-sm text-slate-600" variants={fadeInUp}>
                            <MapPin className="h-4 w-4 text-blue-600" />
                            Monday to Friday • 7:30 AM - 5:30 PM | Saturday (Office Only) • 8:00 AM - 12:00 NN
                        </motion.div>
                        <motion.div className="flex items-center gap-3 text-sm text-slate-600" variants={fadeInUp}>
                            <Phone className="h-4 w-4 text-blue-600" />
                            Emergency hotline:{' '}
                            <a href="tel:+639178880045" className="font-semibold text-blue-700">
                                +63 917 888 0045
                            </a>
                        </motion.div>
                    </motion.div>
                </motion.div>
            </motion.section>
        </MainLayout>
    );
}
