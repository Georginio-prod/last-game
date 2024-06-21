"use client"

import { ColumnDef } from "@tanstack/react-table"
import { CellAction } from "./cell-action"


export type ProductColumn = {
  id: string
  name: string
  price: string
  category: string
  color: string
  isFeatured: boolean
  isArchived: boolean
  createdAt: string;

}

export const columns: ColumnDef<ProductColumn>[] = [
  {
    accessorKey: "name",
    header: "Nom",
  },
  {
    accessorKey: "isArchived",
    header: "Archivés"
  },
  {
    accessorKey: "isFeatured",
    header: "Vedettes"
  },
  {
    accessorKey: "price",
    header: "Prix"
  },
  {
    accessorKey: "category",
    header: "Catégories"
  },
  {
    accessorKey: "size",
    header: "Types"
  },
  {
    accessorKey: "color",
    header: "Couleurs",
    cell: ({ row }) => {
      return (
        <div className="flex items-center gap-x-2">
          {row.original.color}
          <div 
            className="h-6 w-6 rounded-full border"
            style={{ backgroundColor: row.original.color }}
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