import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import MainLayout from '@/layouts/MainLayout';
import { admissions, contact } from '@/routes';
import { Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { BadgeCheck, BookOpenText, Microscope, Music4, Palette, Users, Utensils } from 'lucide-react';

const learningBands = [
    {
        title: 'Preschool (Nursery - Kinder)',
        description: 'Inquiry-rich centers that strengthen numeracy, literacy, and socio-emotional confidence through play.',
        highlights: ['Montessori-inspired centers', 'Daily music & movement', 'Parent coaching workshops'],
    },
    {
        title: 'Elementary (Grades 1-6)',
        description: 'Integrated STEM, Filipino, and Values Education anchored on project-based learning and formative assessment.',
        highlights: ['Guided reading studio', 'Math mastery blocks', 'Campus ministry & scouting'],
    },
    {
        title: 'Junior High (Grades 7-10)',
        description: 'Competency-based curriculum with technology integration, science lab rotations, and leadership pathways.',
        highlights: ['Career exploration modules', 'Student press & theater guild', 'Research capstone'],
    },
    {
        title: 'Senior High (GAS)',
        description: 'General Academic Strand with electives in entrepreneurship, media, and community innovation.',
        highlights: ['College coaching', 'Industry mentorships', 'Service immersion'],
    },
];

const signaturePrograms = [
    {
        icon: Microscope,
        title: 'Innovation Lab',
        description: 'Hands-on science and robotics labs guided by subject experts and industry partners.',
    },
    {
        icon: Palette,
        title: 'Creative Arts Collective',
        description: 'Visual arts, theater, and media literacy experiences culminating in annual showcases.',
    },
    {
        icon: Music4,
        title: 'Voices & Rhythm',
        description: 'Choir, rondalla, and percussion ensembles that build teamwork and national pride.',
    },
    {
        icon: Utensils,
        title: 'Wellness & Nutrition',
        description: 'Balanced meal plans, athletic training, and mindfulness sessions for holistic growth.',
    },
];

const supportServices = [
    {
        icon: BadgeCheck,
        title: 'Academic Support',
        description: 'After-school coaching, peer tutorials, and mastery checks keep learners on track.',
    },
    {
        icon: Users,
        title: 'Guidance & Counseling',
        description: 'Licensed counselors lead guidance classes, career talks, and parent consultations.',
    },
    {
        icon: BookOpenText,
        title: 'Learning Resource Center',
        description: 'Hybrid library with e-book subscriptions, research databases, and makerspace kits.',
    },
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

export default function Academics() {
    return (
        <MainLayout title="Academics | Ipil Shepherd Montessori." className="bg-white">
            <motion.section
                className="mx-auto w-full max-w-6xl px-4 py-16"
                variants={fadeInUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
            >
                <motion.div
                    className="rounded-3xl bg-gradient-to-r from-blue-700 via-indigo-600 to-purple-600 px-8 py-12 text-white shadow-2xl ring-1 ring-white/30"
                    variants={popIn}
                >
                    <div className="space-y-4">
                        <motion.p className="text-sm tracking-[0.4em] text-white/80 uppercase" variants={fadeInUp}>
                            Academics
                        </motion.p>
                        <motion.h1 className="text-4xl font-semibold" variants={fadeInUp}>
                            Programs that evolve with every learner.
                        </motion.h1>
                        <motion.p className="max-w-3xl text-base text-white/90" variants={fadeInUp}>
                            From preschool curiosity to senior high specialization, each learning band is designed to develop critical thinking,
                            collaboration, creativity, and a resilient sense of purpose.
                        </motion.p>
                    </div>
                    <motion.div className="mt-8 flex flex-col gap-4 sm:flex-row" variants={stagger}>
                        <motion.div variants={popIn}>
                            <Link
                                href={admissions()}
                                className="inline-flex items-center justify-center rounded-md bg-yellow-400 px-6 py-3 text-base font-semibold text-blue-950 shadow-lg transition hover:bg-yellow-300"
                            >
                                Start Enrollment Journey
                            </Link>
                        </motion.div>
                        <motion.div variants={popIn}>
                            <Link
                                href={contact()}
                                className="inline-flex items-center justify-center rounded-md border border-white/60 px-6 py-3 text-base font-semibold text-white transition hover:bg-white/10"
                            >
                                Visit the Campus
                            </Link>
                        </motion.div>
                    </motion.div>
                </motion.div>
            </motion.section>

            <motion.section
                className="mx-auto w-full max-w-6xl px-4 pb-16"
                variants={fadeInUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.25 }}
            >
                <p className="text-sm font-semibold tracking-wide text-blue-600 uppercase">Learning Bands</p>
                <h2 className="mt-3 text-3xl font-semibold text-slate-900">Distinct pathways for every stage.</h2>
                <motion.div className="mt-10 grid gap-6 md:grid-cols-2" variants={stagger}>
                    {learningBands.map((band) => (
                        <motion.div key={band.title} variants={popIn}>
                            <Card className="border-slate-200/60 bg-white/95 shadow-sm transition hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl">
                                <CardHeader>
                                    <CardTitle className="text-2xl text-slate-900">{band.title}</CardTitle>
                                    <p className="mt-2 text-base text-slate-600">{band.description}</p>
                                </CardHeader>
                                <CardContent className="space-y-2">
                                    {band.highlights.map((highlight) => (
                                        <div key={`${band.title}-${highlight}`} className="flex items-center gap-3 text-sm text-slate-600">
                                            <span className="size-2 rounded-full bg-blue-500" />
                                            {highlight}
                                        </div>
                                    ))}
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </motion.div>
            </motion.section>

            <motion.section
                className="mx-auto w-full max-w-6xl px-4 pb-16"
                variants={fadeInUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.25 }}
            >
                <p className="text-sm font-semibold tracking-wide text-blue-600 uppercase">Signature Programs</p>
                <h2 className="mt-3 text-3xl font-semibold text-slate-900">Learning beyond the classroom.</h2>
                <motion.div className="mt-10 grid gap-6 md:grid-cols-2" variants={stagger}>
                    {signaturePrograms.map((program) => (
                        <motion.div key={program.title} variants={popIn}>
                            <Card className="border-slate-200/60 bg-white/95 shadow-sm transition hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl">
                                <CardContent className="flex items-start gap-4 px-6 py-6">
                                    <div className="flex size-12 items-center justify-center rounded-full bg-blue-50 text-blue-700">
                                        <program.icon className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-semibold text-slate-900">{program.title}</h3>
                                        <p className="mt-2 text-sm text-slate-600">{program.description}</p>
                                    </div>
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
                <p className="text-sm font-semibold tracking-wide text-blue-600 uppercase">Support Services</p>
                <h2 className="mt-3 text-3xl font-semibold text-slate-900">Whole-child care.</h2>
                <motion.div className="mt-10 grid gap-6 md:grid-cols-3" variants={stagger}>
                    {supportServices.map((service) => (
                        <motion.div key={service.title} variants={popIn}>
                            <Card className="border-slate-200/60 bg-white/95 shadow-sm transition hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl">
                                <CardContent className="space-y-3 px-6 py-6 text-center">
                                    <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-blue-50 text-blue-700">
                                        <service.icon className="h-6 w-6" />
                                    </div>
                                    <h3 className="text-lg font-semibold text-slate-900">{service.title}</h3>
                                    <p className="text-sm text-slate-600">{service.description}</p>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </motion.div>
            </motion.section>
        </MainLayout>
    );
}
