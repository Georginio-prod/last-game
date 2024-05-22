"use client"

import { ColumnDef } from "@tanstack/react-table"
import { CellAction } from "./cell-action"


export type ColorColunm = {
  id: string
  name: string
  value: string
  createdAt: string;

}

export const columns: ColumnDef<ColorColunm>[] = [
  {
    accessorKey: "name",
    header: "Nom",
  },
  {
    accessorKey: "value",
    header: "Valeur",
    cell: ({ row }) => {
      return (
        <div className="flex items-center gap-x-2">
          {row.original.value}
          <div 
            className="h-6 w-6 rounded-full border"
            style={{ backgroundColor: row.original.value }}
          />
        </div>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: "Date",
  },
  {
    id : "actions",
    cell:({row}) => <CellAction data = {row.original} />
  }
 
]