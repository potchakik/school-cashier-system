import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { appearance } from '@/routes';
import feeStructureRoutes from '@/routes/academics/fee-structures';
import gradeLevelRoutes from '@/routes/academics/grade-levels';
import { edit as editPassword } from '@/routes/password';
import { edit } from '@/routes/profile';
import { type NavItem, type SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { type PropsWithChildren, useMemo } from 'react';

export default function SettingsLayout({ children }: PropsWithChildren) {
    const { auth } = usePage<SharedData>().props;
    const isAdmin = auth?.user?.role === 'admin';

    const accountNavItems: NavItem[] = useMemo(
        () => [
            {
                title: 'Profile',
                href: edit(),
                icon: null,
            },
            {
                title: 'Password',
                href: editPassword(),
                icon: null,
            },
            {
                title: 'Appearance',
                href: appearance(),
                icon: null,
            },
        ],
        [],
    );

    const academicNavItems: NavItem[] = useMemo(
        () =>
            isAdmin
                ? [
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
                  ]
                : [],
        [isAdmin],
    );

    // When server-side rendering, we only render the layout on the client...
    if (typeof window === 'undefined') {
        return null;
    }

    const currentPath = window.location.pathname;

    const isAcademicsRoute = currentPath.startsWith('/settings/academics');

    return (
        <div className="px-4 py-6">
            <Heading title="Settings" description="Manage your account, appearance, and school configuration" />

            <div className="flex flex-col lg:flex-row lg:space-x-12">
                <aside className="w-full max-w-xl lg:w-48">
                    <nav className="flex flex-col space-y-1 space-x-0">
                        {accountNavItems.map((item, index) => (
                            <Button
                                key={`${typeof item.href === 'string' ? item.href : item.href.url}-${index}`}
                                size="sm"
                                variant="ghost"
                                asChild
                                className={cn('w-full justify-start', {
                                    'bg-muted': currentPath === (typeof item.href === 'string' ? item.href : item.href.url),
                                })}
                            >
                                <Link href={item.href} prefetch>
                                    {item.icon && <item.icon className="h-4 w-4" />}
                                    {item.title}
                                </Link>
                            </Button>
                        ))}

                        {academicNavItems.length > 0 && (
                            <>
                                <Separator className="my-4" />
                                <p className="px-2 text-xs font-medium tracking-wide text-muted-foreground uppercase">Academics</p>
                                {academicNavItems.map((item, index) => (
                                    <Button
                                        key={`${typeof item.href === 'string' ? item.href : item.href.url}-academics-${index}`}
                                        size="sm"
                                        variant="ghost"
                                        asChild
                                        className={cn('w-full justify-start', {
                                            'bg-muted': currentPath === (typeof item.href === 'string' ? item.href : item.href.url),
                                        })}
                                    >
                                        <Link href={item.href} prefetch>
                                            {item.icon && <item.icon className="h-4 w-4" />}
                                            {item.title}
                                        </Link>
                                    </Button>
                                ))}
                            </>
                        )}
                    </nav>
                </aside>

                <Separator className="my-6 lg:hidden" />

                <div className={cn('flex-1 md:max-w-2xl', { 'md:max-w-none': isAcademicsRoute })}>
                    <section className={cn('max-w-xl space-y-12', { 'max-w-none': isAcademicsRoute })}>{children}</section>
                </div>
            </div>
        </div>
    );
}
