import { ColumnDef } from '@tanstack/react-table';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DataTableColumnHeader } from '@/components/ui/data-table-column-header';

import { FeeStructureItem } from './types';

const formatCurrency = (amount: number): string => `₱${amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

type CreateColumnsParams = {
    onEdit: (feeStructure: FeeStructureItem) => void;
    onDelete: (feeStructure: FeeStructureItem) => void;
};

export const createFeeStructureColumns = ({ onEdit, onDelete }: CreateColumnsParams): ColumnDef<FeeStructureItem>[] => [
    {
        accessorKey: 'grade_level_name',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Grade level" />,
        cell: ({ row }) => <span className="font-medium text-foreground">{row.original.grade_level_name ?? '—'}</span>,
        enableSorting: true,
    },
    {
        accessorKey: 'fee_type',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Fee" />,
        cell: ({ row }) => (
            <div className="space-y-1">
                <p className="text-sm font-medium text-foreground">{row.original.fee_type}</p>
                {row.original.description && <p className="text-xs text-muted-foreground">{row.original.description}</p>}
            </div>
        ),
        enableSorting: true,
    },
    {
        accessorKey: 'amount',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Amount" className="text-right" />,
        cell: ({ row }) => <div className="text-right font-semibold text-foreground">{formatCurrency(row.original.amount)}</div>,
        enableSorting: true,
    },
    {
        accessorKey: 'school_year',
        header: ({ column }) => <DataTableColumnHeader column={column} title="School year" />,
        cell: ({ row }) => <span className="text-sm text-muted-foreground">{row.original.school_year}</span>,
        enableSorting: true,
    },
    {
        id: 'tags',
        header: 'Tags',
        cell: ({ row }) => (
            <div className="flex flex-wrap gap-2">
                <Badge variant={row.original.is_required ? 'secondary' : 'outline'}>{row.original.is_required ? 'Required' : 'Optional'}</Badge>
                <Badge variant={row.original.is_active ? 'secondary' : 'outline'}>{row.original.is_active ? 'Active' : 'Inactive'}</Badge>
            </div>
        ),
    },
    {
        id: 'actions',
        header: '',
        cell: ({ row }) => (
            <div className="flex justify-end gap-2">
                <Button size="sm" variant="outline" onClick={() => onEdit(row.original)}>
                    Edit
                </Button>
                <Button size="sm" variant="ghost" className="text-destructive hover:text-destructive" onClick={() => onDelete(row.original)}>
                    Delete
                </Button>
            </div>
        ),
    },
];
