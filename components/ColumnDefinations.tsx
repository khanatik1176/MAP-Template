import React from "react";
import { ColumnDef } from "@tanstack/react-table";

// Temporary dummy type for Vulnerability
type Vulnerability = {
    id: string;
    name: string;
    severity: string;
    description: string;
};

interface ColumnDefinitionsProps {
    accessorKey: string;
    header: React.ReactNode;
    cell: (row: any) => React.ReactNode;
}

export const createColumns = (columnsProps: ColumnDefinitionsProps[]): ColumnDef<Vulnerability>[] => {
    return columnsProps.map((columnProps) => ({
        accessorKey: columnProps.accessorKey,
        header: () => <div className="text-bold">{columnProps.header}</div>,
        cell: ({ row }: { row: any }) => columnProps.cell(row),
    }));
};