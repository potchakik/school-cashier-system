import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import MainLayout from '@/layouts/MainLayout';
import { admissions, contact } from '@/routes';
import { Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { BookOpenCheck, GraduationCap, HeartHandshake, UsersRound } from 'lucide-react';

const milestones = [
    {
        year: 1998,
        title: 'School Founded',
        description: 'Dei Gratia School Inc. opened its first preschool and elementary classes with two classrooms and 60 pioneering learners.',
    },
    {
        year: 2005,
        title: 'Junior High Expansion',
        description: 'Expanded to include Grades 7-10, integrating laboratory sciences and campus ministry programs.',
    },
    {
        year: 2016,
        title: 'Senior High Launch',
        description: 'Introduced the General Academic Strand (GAS) with career bridges and industry mentorships.',
    },
    {
        year: 2024,
        title: 'Campus Modernization',
        description: 'Completed the Learning Innovation Center with modern science labs, e-library, and collaboration studios.',
    },
];

const coreValues = [
    {
        icon: GraduationCap,
        title: 'Academic Excellence',
        description: 'We couple rigorous instruction with formative assessments to help learners meet and exceed national standards.',
    },
    {
        icon: HeartHandshake,
        title: 'Servant Leadership',
        description: 'Every program nurtures empathy, stewardship, and faith-led community involvement.',
    },
    {
        icon: UsersRound,
        title: 'Inclusive Community',
        description: 'Partnering with families and barangay leaders ensures every child feels safe, seen, and celebrated.',
    },
    {
        icon: BookOpenCheck,
        title: 'Lifelong Formation',
        description: 'Character education and guidance counseling equip students for purposeful lives beyond graduation.',
    },
];

const fadeInUp = {
    hidden: { opacity: 0, y: 24 },
    visible: { opacity: 1, y: 0 },
};

const popIn = {
    hidden: { opacity: 0, scale: 0.96 },
    visible: { opacity: 1, scale: 1 },
};

const stagger = {
    hidden: {},
    visible: {
        transition: {
            staggerChildren: 0.15,
            delayChildren: 0.1,
        },
    },
};

export default function About() {
    return (
        <MainLayout title="About | Dei Gratia School Inc." className="bg-white">
            <motion.section
                className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-4 py-16 lg:flex-row lg:items-center"
                variants={stagger}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
            >
                <motion.div
                    className="flex-1 space-y-6 rounded-[2.5rem] bg-gradient-to-br from-blue-50 to-white px-6 py-8 text-slate-800 shadow-xl ring-1 ring-blue-100"
                    variants={fadeInUp}
                >
                    <p className="text-sm font-semibold tracking-[0.4em] text-blue-500 uppercase">About Us</p>
                    <h1 className="text-4xl font-semibold text-slate-900">Rooted in faith. Driven by excellence.</h1>
                    <p className="text-base leading-relaxed text-slate-600">
                        Dei Gratia School Inc. is a home-grown K-12 institution serving families in Tanza, Cavite. For more than two decades, we have
                        nurtured students to become confident communicators, compassionate leaders, and curious innovators who impact their
                        communities for the common good.
                    </p>
                    <div className="flex flex-col gap-4 sm:flex-row">
                        <Button asChild className="bg-yellow-400 text-blue-950 shadow-lg hover:bg-yellow-300">
                            <Link href={admissions()}>Explore Admissions</Link>
                        </Button>
                        <Button
                            variant="outline"
                            asChild
                            className="border-white/60 bg-white/10 text-white backdrop-blur transition hover:bg-white/30 hover:text-white"
                        >
                            <Link href={contact()}>Talk to Us</Link>
                        </Button>
                    </div>
                </motion.div>
                <motion.div className="flex-1 overflow-hidden rounded-3xl shadow-2xl ring-1 ring-slate-100" variants={popIn}>
                    <img
                        src="/images/marketing/about-collab.jpg"
                        alt="Students collaborating inside Dei Gratia School"
                        className="h-full w-full object-cover"
                        loading="lazy"
                    />
                </motion.div>
            </motion.section>

            <motion.section
                className="mx-auto w-full max-w-6xl px-4 py-16"
                variants={fadeInUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
            >
                <motion.div className="grid gap-8 md:grid-cols-2" variants={stagger}>
                    {[
                        {
                            title: 'Mission',
                            heading: 'Forming whole persons through Christ-centered education.',
                            copy: 'We partner with families to deliver nurturing learning experiences that integrate scholarship, service, and faith. Our classrooms are collaborative and responsive, ensuring that every learner is known, guided, and empowered.',
                        },
                        {
                            title: 'Vision',
                            heading: 'A thriving community of future-ready servant leaders.',
                            copy: 'We envision a campus where curiosity, creativity, and compassion flourish—where students graduate prepared for higher education, meaningful careers, and transformative citizenship.',
                        },
                    ].map((card) => (
                        <motion.div key={card.title} variants={popIn}>
                            <Card className="border-slate-200/60 bg-white/95 shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
                                <CardContent className="space-y-4 px-6 py-8">
                                    <p className="text-sm font-semibold tracking-wide text-blue-600 uppercase">{card.title}</p>
                                    <h2 className="text-2xl font-semibold text-slate-900">{card.heading}</h2>
                                    <p className="text-base text-slate-600">{card.copy}</p>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </motion.div>
            </motion.section>

            <section className="mx-auto w-full max-w-6xl px-4 pb-16">
                <p className="text-sm font-semibold tracking-wide text-blue-600 uppercase">Milestones</p>
                <h2 className="mt-3 text-3xl font-semibold text-slate-900">A legacy of community firsts.</h2>
                <div className="mt-10 space-y-6">
                    {milestones.map((milestone) => (
                        <div
                            key={milestone.year}
                            className="rounded-3xl border border-slate-200/70 bg-white/95 p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                        >
                            <p className="text-sm font-semibold tracking-[0.5em] text-slate-500 uppercase">{milestone.year}</p>
                            <h3 className="mt-2 text-2xl font-semibold text-slate-900">{milestone.title}</h3>
                            <p className="mt-2 text-base text-slate-600">{milestone.description}</p>
                        </div>
                    ))}
                </div>
            </section>

            <motion.section
                className="mx-auto w-full max-w-6xl px-4 pb-24"
                variants={fadeInUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.25 }}
            >
                <p className="text-sm font-semibold tracking-wide text-blue-600 uppercase">Core Values</p>
                <h2 className="mt-3 text-3xl font-semibold text-slate-900">What anchors everything we do.</h2>
                <motion.div className="mt-10 grid gap-6 md:grid-cols-2" variants={stagger}>
                    {coreValues.map((value) => (
                        <motion.div key={value.title} variants={popIn}>
                            <Card className="border-slate-200/60 bg-white/95 shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
                                <CardContent className="flex items-start gap-4 px-6 py-6">
                                    <div className="flex size-12 items-center justify-center rounded-full bg-blue-50 text-blue-700">
                                        <value.icon className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-semibold text-slate-900">{value.title}</h3>
                                        <p className="mt-2 text-sm text-slate-600">{value.description}</p>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </motion.div>
                <Separator className="mt-12" />
                <motion.div
                    className="mt-10 rounded-3xl bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-10 text-white shadow-xl"
                    variants={fadeInUp}
                >
                    <p className="text-lg font-semibold">
                        "Education is our shared mission—between families, teachers, and the God who calls us to serve."
                    </p>
                    <p className="mt-2 text-sm tracking-[0.4em] text-white/80 uppercase">Administrator, Dei Gratia School Inc.</p>
                </motion.div>
            </motion.section>
        </MainLayout>
    );
}
