"use client"

import { ColumnDef } from "@tanstack/react-table"



export type OrderColumn = {
  id: string
  phone: string
  address: string,
  isPaid: boolean;
  totalPrice: string;
  products: string;
  createdAt: string;

}

export const columns: ColumnDef<OrderColumn>[] = [
  {
    accessorKey: "products",
    header: "Produits",
  },
  {
    accessorKey: "phone ",
    header: "Numéro",
  },
  {
    accessorKey: "address ",
    header: "Address",
  },
  {
    accessorKey: "totalPrice ",
    header: "Prix total",
  },
  {
    accessorKey: "isPaid ",
    header: "Payer",
  },
 
]