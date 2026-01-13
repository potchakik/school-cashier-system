import { Breadcrumbs } from '@/components/breadcrumbs';
import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import feeStructureRoutes from '@/routes/academics/fee-structures';
import gradeLevelRoutes from '@/routes/academics/grade-levels';
import { type BreadcrumbItem, type NavItem, type SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { type PropsWithChildren, type ReactNode, useMemo } from 'react';

interface AcademicsLayoutProps extends PropsWithChildren {
    title: string;
    description?: string;
    breadcrumbs?: BreadcrumbItem[];
    actions?: ReactNode;
}

const navItems: NavItem[] = [
    {
        title: 'Grade levels',
        href: gradeLevelRoutes.index(),
        icon: null,
    },
    {
        title: 'Fee structures',
        href: feeStructureRoutes.index(),
        icon: null,
    },
];

export default function AcademicsLayout({ title, description, breadcrumbs = [], actions, children }: AcademicsLayoutProps) {
    const { url } = usePage();
    const { auth } = usePage<SharedData>().props;
    const isAdmin = auth?.user?.role === 'admin';

    const filteredNavItems = useMemo(() => (isAdmin ? navItems : []), [isAdmin]);

    return (
        <div className="space-y-6 px-4 py-6">
            {breadcrumbs.length > 0 && <Breadcrumbs breadcrumbs={breadcrumbs} />}

            <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
                <aside className="w-full max-w-full rounded-xl border bg-card p-4 lg:max-w-xs">
                    <div className="space-y-4">
                        <div>
                            <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">Academics</p>
                            <p className="mt-1 text-sm text-muted-foreground">
                                Configure grade levels, sections, and financial structure for the current school year.
                            </p>
                        </div>

                        <Separator />

                        <nav className="flex flex-col gap-2">
                            {filteredNavItems.map((item) => {
                                const href = typeof item.href === 'string' ? item.href : item.href.url;
                                const isActive = url.startsWith(href);

                                return (
                                    <Button
                                        key={href}
                                        asChild
                                        variant={isActive ? 'secondary' : 'ghost'}
                                        className={cn(
                                            'justify-start text-sm font-medium',
                                            isActive ? 'shadow-sm' : 'text-muted-foreground hover:text-foreground',
                                        )}
                                    >
                                        <Link href={item.href} prefetch>
                                            {item.title}
                                        </Link>
                                    </Button>
                                );
                            })}
                        </nav>
                    </div>
                </aside>

                <main className="flex-1 space-y-6">
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        <Heading title={title} description={description} />
                        {actions}
                    </div>

                    {children}
                </main>
            </div>
        </div>
    );
}
