export interface GradeLevelOption {
    id: number;
    name: string;
}

export interface FeeStructureItem {
    id: number;
    grade_level_id: number;
    grade_level_name: string | null;
    fee_type: string;
    amount: number;
    school_year: string;
    is_required: boolean;
    is_active: boolean;
    description: string | null;
}

export interface FeeStructureFilters {
    grade_level_id?: string | number | null;
    school_year?: string | null;
    status?: string | null;
}

export type FeeStructureDialogState =
    | { mode: 'create'; gradeLevelId?: number }
    | {
          mode: 'edit';
          feeStructure: FeeStructureItem;
      };

export type FeeStructureFormData = {
    grade_level_id: string;
    fee_type: string;
    amount: string;
    school_year: string;
    description: string;
    is_required: boolean;
    is_active: boolean;
};
