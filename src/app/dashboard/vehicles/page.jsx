// src/app/(dashboard)/vehicles/page.js
"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { PlusIcon } from 'lucide-react';
import { useVehicles } from '@/hooks/useVehicles';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DataTable } from '@/components/ui/data-table/data-table';


import { Badge } from "@/components/ui/badge"
import { CaretSortIcon, CheckCircledIcon, CrossCircledIcon, DotsHorizontalIcon } from "@radix-ui/react-icons"
import { format } from "date-fns"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"


// Define columns for the vehicles data table
const columns = [
   {
      accessorKey: "image_url",
      header: "Image",
      cell: ({ row }) => (
        <div className="w-[80px]">
<img
  src={row.getValue("image_url") || "https://placehold.co/80x60"}
  alt={`${row.getValue("make")} ${row.getValue("model")}`}
  className="rounded-md object-cover"
  width={80}
  height={60}
/>
        </div>
      ),
    },
    {
      accessorKey: "make",
      header: ({ column }) => {
        return (
          <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            Make
            <CaretSortIcon className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => <div className="font-medium">{row.getValue("make")}</div>,
    },
    {
      accessorKey: "model",
      header: ({ column }) => {
        return (
          <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            Model
            <CaretSortIcon className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => <div>{row.getValue("model")}</div>,
    },
    {
      accessorKey: "year",
      header: ({ column }) => {
        return (
          <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            Year
            <CaretSortIcon className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => <div className="text-center">{row.getValue("year")}</div>,
    },
    {
      accessorKey: "license_plate",
      header: "License Plate",
      cell: ({ row }) => <div>{row.getValue("license_plate")}</div>,
    },
    {
      accessorKey: "daily_rate",
      header: ({ column }) => {
        return (
          <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            Daily Rate
            <CaretSortIcon className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => <div className="text-right">${row.getValue("daily_rate").toFixed(2)}</div>,
    },
    {
      accessorKey: "is_available",
      header: "Status",
      cell: ({ row }) => {
        const isAvailable = row.getValue("is_available")
  
        return (
          <div className="flex justify-center">
            {isAvailable ? (
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 flex items-center gap-1">
                <CheckCircledIcon className="h-3.5 w-3.5" />
                Available
              </Badge>
            ) : (
              <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200 flex items-center gap-1">
                <CrossCircledIcon className="h-3.5 w-3.5" />
                Rented
              </Badge>
            )}
          </div>
        )
      },
    },
    {
      accessorKey: "created_at",
      header: "Added On",
      cell: ({ row }) => {
        return (
          <div className="text-sm text-muted-foreground">
            {format(new Date(row.getValue("created_at")), "MMM d, yyyy")}
          </div>
        )
      },
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const car = row.original
  
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <DotsHorizontalIcon className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => navigator.clipboard.writeText(car.id)}>Copy car ID</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>View details</DropdownMenuItem>
              <DropdownMenuItem>Edit car</DropdownMenuItem>
              <DropdownMenuItem className="text-red-600">Delete car</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    },
];

export default function VehiclesPage() {
  const { vehicles, getVehicles, loading } = useVehicles();
  const router = useRouter();
  
  useEffect(() => {
    getVehicles();
  }, []);
  
  return (
    <div className="container mx-auto px-4 py-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Vehicles</h1>
        <Button onClick={() => router.push('/dashboard/vehicles/create')}>
          <PlusIcon className="mr-2 h-4 w-4" /> 
          Add Vehicle
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Vehicle Inventory</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-4">Loading vehicles...</div>
          ) : (
            <DataTable 
              columns={columns} 
              data={vehicles} 
              searchColumn="make"
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}