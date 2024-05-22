"use client"

import { ColumnDef } from "@tanstack/react-table"
import { CellAction } from "./cell-action"


export type CategoryColumn = {
  id: string
  name: string
  billboardLabel: string
  createdAt: string;

}

export const columns: ColumnDef<CategoryColumn>[] = [
 
  {
    accessorKey: "name",
    header: "Nom",
  },
  {
    id: "createdAt",
    accessorKey: "createdAt",
    header: "Date",
    cell: ({ row }) => {
      return (
        <div key={row.original.id}> 
          {row.original.createdAt}
        </div>
      )
    }
  },
   
  {
    id : "actions",
    cell:({row}) => <CellAction data = {row.original} />
  }
 
]