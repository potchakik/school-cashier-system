import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { dashboard } from '@/routes';
import feeStructureRoutes from '@/routes/academics/fee-structures';
import gradeLevelRoutes from '@/routes/academics/grade-levels';
import { index as paymentsIndex } from '@/routes/payments';
import { index as studentsIndex } from '@/routes/students';
import { type NavGroup, type NavItem, type SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { BookOpen, CreditCard, Folder, GraduationCap, LayoutGrid, Receipt, Users } from 'lucide-react';
import { useMemo } from 'react';
import AppLogo from './app-logo';

const footerNavItems: NavItem[] = [
    {
        title: 'Repository',
        href: 'https://github.com/laravel/react-starter-kit',
        icon: Folder,
    },
    {
        title: 'Documentation',
        href: 'https://laravel.com/docs/starter-kits#react',
        icon: BookOpen,
    },
];

export function AppSidebar() {
    const { auth } = usePage<SharedData>().props;
    const isAdmin = auth?.user?.role === 'admin';

    const mainNavGroups = useMemo<NavGroup[]>(() => {
        const platformItems: NavItem[] = [
            {
                title: 'Dashboard',
                href: dashboard(),
                icon: LayoutGrid,
            },
            {
                title: 'Students',
                href: studentsIndex(),
                icon: Users,
            },
            {
                title: 'Payments',
                href: paymentsIndex(),
                icon: CreditCard,
            },
        ];

        const groups: NavGroup[] = [
            {
                title: 'Platform',
                items: platformItems,
            },
        ];

        if (isAdmin) {
            groups.push({
                title: 'Academics',
                items: [
                    {
                        title: 'Grade levels',
                        href: gradeLevelRoutes.index(),
                        icon: GraduationCap,
                    },
                    {
                        title: 'Fee structures',
                        href: feeStructureRoutes.index(),
                        icon: Receipt,
                    },
                ],
            });
        }

        return groups;
    }, [isAdmin]);

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboard()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain groups={mainNavGroups} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
