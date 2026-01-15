import React from 'react';
import { Dialog } from '@/components/ui/dialog';
import { ClipboardList, X } from 'lucide-react';

// Tuition highlights and their detailed fee breakdowns
const tuitionHighlights: {
    label: string;
    detail: string;
    fees: { name: string; amount: string }[];
}[] = [
        {
            label: 'Nursery to Grade 3',
            detail: 'Starts at ₱3,960 / year',
            fees: [
                { name: 'Registration Fee', amount: '₱300.00' },
                { name: 'School Paper Fee', amount: '₱300.00' },
                { name: 'Student Affaires Fee', amount: '₱200.00' },
                { name: 'Athletic Fee', amount: '₱250.00' },
                { name: 'Guidance Counseling', amount: '₱300.00' },
                { name: 'Security and Safety Fee', amount: '₱400.00' },
                { name: 'Library Fee', amount: '₱250.00' },
                { name: 'Development Fee', amount: '₱360.00' },
                { name: 'Test Paper Fee', amount: '₱600.00' },
                { name: 'Card & other forms ', amount: '₱700.00' },
                { name: 'Utility & Maintenance ', amount: '₱300.00' }
            ],
        },
        {
            label: 'Grade 4 to Grade 6',
            detail: 'Starts at ₱4,500 / year',
            fees: [
                { name: 'Registration Fee', amount: '₱300.00' },
                { name: 'School Paper Fee', amount: '₱300.00' },
                { name: 'Student Affaires Fee', amount: '₱200.00' },
                { name: 'Athletic Fee', amount: '₱250.00' },
                { name: 'Guidance Counseling', amount: '₱300.00' },
                { name: 'Security and Safety Fee', amount: '₱400.00' },
                { name: 'Library Fee', amount: '₱250.00' },
                { name: 'Development Fee', amount: '₱360.00' },
                { name: 'Test Paper Fee', amount: '₱600.00' },
                { name: 'Card & other forms ', amount: '₱700.00' },
                { name: 'Utility & Maintenance ', amount: '₱300.00' },
                { name: 'Computer Lab', amount: '₱540.00' },
            ],
        },
        {
            label: 'JHS and SHS',
            detail: 'Starts at ₱1,250 / year',
            fees: [
                { name: 'Registration Fee', amount: '₱50.00' },
                { name: 'Athletic Fee', amount: '₱200.00' },
                { name: 'Journalism', amount: '₱100.00' },
                { name: 'Insurance', amount: '₱80.00' },
                { name: 'Laboratory ', amount: '₱150.00' },
                { name: 'ID', amount: '₱150.00' },
                { name: 'Guidance Counseling ', amount: '₱150.00' },
                { name: 'Security', amount: '₱70.00' },
                { name: 'Maintenance Fee ', amount: '₱50.00' },
                { name: 'Instructional/Test Paper', amount: '₱250.00' },
            ],
        },
    ];

type TuitionMatrixModalProps = {
    readonly selected: number | null;
    readonly setSelected: React.Dispatch<React.SetStateAction<number | null>>;
};

export default function TuitionMatrixModal({ selected, setSelected }: TuitionMatrixModalProps) {
    const open = selected !== null;
    const highlight = selected !== null ? tuitionHighlights[selected] : null;
    return (
        <Dialog open={open} onOpenChange={() => setSelected(null)}>
            {open && highlight && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
                    <div className="relative w-full max-w-md rounded-2xl bg-white shadow-xl pb-4">
                        <button
                            className="absolute right-4 top-4 text-slate-400 hover:text-slate-600"
                            onClick={() => setSelected(null)}
                            aria-label="Close"
                        >
                            <X className="h-5 w-5" />
                        </button>
                        <div className="p-6 pb-2">
                            <h2 className="mb-4 text-xl font-semibold text-blue-900 flex items-center gap-2">
                                <ClipboardList className="h-5 w-5" /> {highlight.label} Tuition Details
                            </h2>
                            <p className="mb-4 text-base text-slate-700 font-medium">{highlight.detail}</p>
                            <div className="overflow-x-auto">
                                <table className="min-w-full border text-sm text-slate-800">
                                    <thead>
                                        <tr className="bg-blue-50">
                                            <th className="px-4 py-2 text-left font-semibold">Fee</th>
                                            <th className="px-4 py-2 text-right font-semibold">Amount</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {highlight.fees.map((fee) => (
                                            <tr key={fee.name}>
                                                <td className="px-4 py-2 border-b">{fee.name}</td>
                                                <td className="px-4 py-2 border-b text-right">{fee.amount}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </Dialog>
    );
}