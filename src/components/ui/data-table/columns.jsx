import { Button } from "@/components/ui/button"
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

// Car columns
export const carColumns = [
 
]

// Booking columns
export const bookingColumns = [
  {
    accessorKey: "booking_id",
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Booking ID
          <CaretSortIcon className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => <div className="font-medium">{row.getValue("booking_id")}</div>,
  },
  {
    accessorKey: "customer_name",
    header: "Customer",
    cell: ({ row }) => <div>{row.getValue("customer_name")}</div>,
  },
  {
    accessorKey: "car_details",
    header: "Car",
    cell: ({ row }) => {
      const car = row.getValue("car_details")
      return (
        <div className="flex items-center gap-2">
          <img src={car.image || "/placeholder.svg"} alt={car.name} className="w-10 h-10 rounded-md object-cover" />
          <div>
            <div className="font-medium">{car.name}</div>
            <div className="text-xs text-muted-foreground">{car.license}</div>
          </div>
        </div>
      )
    },
  },
  {
    accessorKey: "start_date",
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Start Date
          <CaretSortIcon className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => format(new Date(row.getValue("start_date")), "MMM d, yyyy"),
  },
  {
    accessorKey: "end_date",
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          End Date
          <CaretSortIcon className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => format(new Date(row.getValue("end_date")), "MMM d, yyyy"),
  },
  {
    accessorKey: "total_amount",
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Amount
          <CaretSortIcon className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => <div className="text-right">${row.getValue("total_amount").toFixed(2)}</div>,
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status")

      return (
        <div className="flex justify-center">
          {status === "active" && (
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
              Active
            </Badge>
          )}
          {status === "completed" && (
            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
              Completed
            </Badge>
          )}
          {status === "cancelled" && (
            <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
              Cancelled
            </Badge>
          )}
          {status === "pending" && (
            <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
              Pending
            </Badge>
          )}
        </div>
      )
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const booking = row.original

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
            <DropdownMenuItem>View details</DropdownMenuItem>
            <DropdownMenuItem>Edit booking</DropdownMenuItem>
            {booking.status === "active" && <DropdownMenuItem>Mark as completed</DropdownMenuItem>}
            {booking.status === "pending" && <DropdownMenuItem>Confirm booking</DropdownMenuItem>}
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-red-600">Cancel booking</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]

// User columns
export const userColumns = [
  {
    accessorKey: "avatar",
    header: "Avatar",
    cell: ({ row }) => (
      <div className="w-10 h-10 rounded-full overflow-hidden">
        <img
          src={row.getValue("avatar") || "/placeholder.svg"}
          alt={`${row.getValue("name")}'s avatar`}
          className="w-full h-full object-cover"
        />
      </div>
    ),
  },
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Name
          <CaretSortIcon className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => <div className="font-medium">{row.getValue("name")}</div>,
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => <div>{row.getValue("email")}</div>,
  },
  {
    accessorKey: "phone",
    header: "Phone",
    cell: ({ row }) => <div>{row.getValue("phone")}</div>,
  },
  {
    accessorKey: "license_number",
    header: "License Number",
    cell: ({ row }) => <div>{row.getValue("license_number")}</div>,
  },
  {
    accessorKey: "total_bookings",
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Bookings
          <CaretSortIcon className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => <div className="text-center">{row.getValue("total_bookings")}</div>,
  },
  {
    accessorKey: "joined_date",
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Joined
          <CaretSortIcon className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => format(new Date(row.getValue("joined_date")), "MMM d, yyyy"),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status")

      return (
        <div className="flex justify-center">
          {status === "active" && (
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
              Active
            </Badge>
          )}
          {status === "inactive" && (
            <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
              Inactive
            </Badge>
          )}
          {status === "suspended" && (
            <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
              Suspended
            </Badge>
          )}
        </div>
      )
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const user = row.original

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
            <DropdownMenuItem>View profile</DropdownMenuItem>
            <DropdownMenuItem>Edit user</DropdownMenuItem>
            <DropdownMenuItem>View bookings</DropdownMenuItem>
            <DropdownMenuSeparator />
            {user.status === "active" ? (
              <DropdownMenuItem className="text-amber-600">Suspend user</DropdownMenuItem>
            ) : (
              <DropdownMenuItem className="text-green-600">Activate user</DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]

