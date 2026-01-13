import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import MainLayout from '@/layouts/MainLayout';
import { about, admissions } from '@/routes';
import { Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { Award, BookOpen, Users } from 'lucide-react';

const academicPrograms = [
    {
        title: 'Preschool',
        description: 'Play-based learning with strong literacy and numeracy foundations.',
    },
    {
        title: 'Elementary',
        description: 'Integrated STEM and values education across key learning areas.',
    },
    {
        title: 'Junior High School',
        description: 'Competency-based instruction preparing learners for senior tracks.',
    },
    {
        title: 'Senior High School',
        description: 'General Academic Strand (GAS) with college and career coaching.',
    },
];

const differentiators = [
    {
        title: 'FAPE-ESC Certified',
        description: 'Scholarship-ready programs that meet the standards of the Education Service Contracting grant.',
        icon: Award,
    },
    {
        title: 'Experienced Faculty',
        description: 'Seasoned educators dedicated to holistic formation and student mentorship.',
        icon: Users,
    },
    {
        title: 'Community-Focused',
        description: 'Active partnerships with families and barangay leaders to build a safe, nurturing environment.',
        icon: BookOpen,
    },
];

const impactStats = [
    { label: 'Years of Service', value: '26+' },
    { label: 'Learners Served', value: '1,200+' },
    { label: 'Faculty Mentors', value: '80+' },
    { label: 'Average Class Size', value: '25' },
];

const fadeInUp = {
    hidden: { opacity: 0, y: 28 },
    visible: { opacity: 1, y: 0 },
};

const popIn = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1 },
};

const stagger = {
    hidden: {},
    visible: {
        transition: {
            staggerChildren: 0.12,
            delayChildren: 0.1,
        },
    },
};

export default function Home() {
    return (
        <MainLayout title="Ipil Shepherd Montessori. | Home" className="bg-gradient-to-b from-white via-slate-50 to-white">
            <section className="relative isolate flex min-h-[65vh] items-center overflow-hidden rounded-b-[3.5rem] bg-slate-900 shadow-[0_25px_60px_rgba(15,23,42,0.35)]">
                <img
                    src="/images/marketing/home-hero.jpg"
                    alt="Students of Ipil Shepherd Montessori."
                    className="absolute inset-0 h-full w-full object-cover"
                    loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-br from-slate-900/85 via-blue-900/70 to-slate-900/80" />
                <motion.div
                    className="relative z-10 mx-auto flex w-full max-w-5xl flex-col items-center gap-6 px-6 py-20 text-center text-white"
                    variants={stagger}
                    initial="hidden"
                    animate="visible"
                >
                    <motion.p className="text-xs tracking-[0.45em] text-slate-200 uppercase" variants={fadeInUp}>
                        Ipil Shepherd Montessori.
                    </motion.p>
                    <motion.h1 className="text-3xl leading-tight font-semibold sm:text-5xl sm:leading-tight" variants={fadeInUp}>
                        Nurturing Minds, Building Futures
                    </motion.h1>
                    <motion.p className="max-w-3xl text-base text-slate-100/90 sm:text-lg" variants={fadeInUp}>
                        Providing quality, community-focused K-12 education in Ipil, Zamboanga Sibugay since 1998.
                    </motion.p>
                    <motion.div className="flex flex-col gap-4 sm:flex-row" variants={fadeInUp}>
                        <Button asChild className="bg-yellow-400 text-blue-950 shadow-lg ring-1 ring-yellow-200/40 hover:bg-yellow-300">
                            <Link href={admissions()}>Apply Now</Link>
                        </Button>
                        <Button variant="outline" asChild className="border-white/30 bg-white/5 text-white shadow-inner hover:bg-white/15">
                            <Link href={about()}>Learn More</Link>
                        </Button>
                    </motion.div>
                </motion.div>
            </section>

            <motion.section
                className="mx-auto -mt-12 w-full max-w-5xl rounded-3xl border border-white/70 bg-white/90 px-6 py-8 shadow-2xl backdrop-blur"
                variants={fadeInUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
            >
                <motion.div className="grid gap-6 text-center sm:grid-cols-2 lg:grid-cols-4" variants={stagger} initial="hidden" animate="visible">
                    {impactStats.map((stat) => (
                        <motion.div key={stat.label} className="space-y-1" variants={fadeInUp}>
                            <p className="text-3xl font-semibold text-slate-900">{stat.value}</p>
                            <p className="text-xs font-semibold tracking-[0.4em] text-slate-500 uppercase">{stat.label}</p>
                        </motion.div>
                    ))}
                </motion.div>
            </motion.section>

            <motion.section
                id="about"
                className="mx-auto mt-16 w-full max-w-6xl px-4"
                variants={fadeInUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
            >
                <div className="grid gap-10 md:grid-cols-2 md:items-center">
                    <motion.div className="overflow-hidden rounded-3xl shadow-xl ring-1 ring-slate-100" variants={popIn}>
                        <img
                            src="/images/marketing/montessori-campus.jpg"
                            alt="Dei Gratia School campus"
                            className="h-full w-full object-cover"
                            loading="lazy"
                        />
                    </motion.div>
                    <motion.div className="space-y-4 text-slate-700" variants={fadeInUp}>
                        <p className="text-sm font-semibold tracking-wide text-blue-600 uppercase">About Us</p>
                        <h2 className="text-3xl font-semibold text-slate-900">Welcome to Ipil Shepherd Montessori.</h2>
                        <p className="text-base leading-relaxed text-slate-600">
                            Since 2018, Ipil Shepherd Montessori. has delivered faith-centered, learner-driven education that empowers students to grow
                            academically, socially, and spiritually. Our mission is to champion future-ready leaders through rigorous academics,
                            compassionate mentorship, and service to the local community.
                        </p>
                    </motion.div>
                </div>
            </motion.section>

            <section className="mx-auto mt-20 w-full max-w-6xl px-4">
                <div className="text-center">
                    <p className="text-sm font-semibold tracking-wide text-blue-600 uppercase">Programs</p>
                    <h2 className="mt-3 text-3xl font-semibold text-slate-900">Our Academic Programs</h2>
                    <p className="mt-2 text-base text-slate-600">
                        Comprehensive offerings from preschool to senior high that encourage curiosity and resilience.
                    </p>
                </div>
                <motion.div
                    className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-4"
                    variants={stagger}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.2 }}
                >
                    {academicPrograms.map((program) => (
                        <motion.div key={program.title} variants={popIn}>
                            <Card className="group border-slate-200/60 bg-white/95 shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-xl">
                                <CardContent className="space-y-3 px-6 py-8">
                                    <h3 className="text-xl font-semibold text-slate-900">{program.title}</h3>
                                    <p className="text-sm text-slate-600">{program.description}</p>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </motion.div>
            </section>

            <section className="mx-auto mt-20 w-full max-w-6xl px-4 pb-20">
                <div className="text-center">
                    <p className="text-sm font-semibold tracking-wide text-blue-600 uppercase">Why Choose Us</p>
                    <h2 className="mt-3 text-3xl font-semibold text-slate-900">Why Choose Ipil Shephered Montessori School?</h2>
                    <p className="mt-2 text-base text-slate-600">
                        A trusted partner for families who value excellence, character, and community care.
                    </p>
                </div>
                <motion.div
                    className="mt-10 grid gap-6 md:grid-cols-3"
                    variants={stagger}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.2 }}
                >
                    {differentiators.map((item) => (
                        <motion.div
                            key={item.title}
                            variants={popIn}
                            transition={{ duration: 0.35, ease: 'easeOut' }}
                            className="rounded-3xl border border-slate-200/70 bg-gradient-to-b from-white to-slate-50 p-8 text-center shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
                        >
                            <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-blue-50 text-blue-700 shadow-inner">
                                <item.icon className="h-6 w-6" />
                            </div>
                            <h3 className="mt-6 text-xl font-semibold text-slate-900">{item.title}</h3>
                            <p className="mt-3 text-sm text-slate-600">{item.description}</p>
                        </motion.div>
                    ))}
                </motion.div>
            </section>
        </MainLayout>
    );
}
