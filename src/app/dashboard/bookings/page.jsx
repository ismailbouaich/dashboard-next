// src/app/dashboard/bookings/page.jsx
"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useBookings } from '@/hooks/useBookings';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DataTable } from '@/components/ui/data-table/data-table';
import { format, parseISO } from 'date-fns';
import { PlusIcon, FileIcon, Calendar, CheckCircle, AlertCircle, XCircle } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';

export default function BookingsPage() {
  const { bookings, getBookings, loading } = useBookings();
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [activeTab, setActiveTab] = useState('all');
  const router = useRouter();
  
  useEffect(() => {
    getBookings();
  }, []);
  
  useEffect(() => {
    if (bookings?.length) {
      filterBookings(activeTab);
    }
  }, [bookings, activeTab]);
  
  const filterBookings = (status) => {
    if (status === 'all') {
      setFilteredBookings(bookings);
    } else {
      setFilteredBookings(bookings.filter(booking => booking.status === status));
    }
  };
  
  const handleTabChange = (value) => {
    setActiveTab(value);
  };
  
  // Calculate stats
  const stats = {
    total: bookings.length || 0,
    pending: bookings.filter(b => b.status === 'pending').length || 0,
    active: bookings.filter(b => b.status === 'active').length || 0,
    completed: bookings.filter(b => b.status === 'completed').length || 0,
    cancelled: bookings.filter(b => b.status === 'cancelled').length || 0,
  };
  
  // Format booking data for the table
  const formattedBookings = filteredBookings.map(booking => ({
    booking_id: booking.id,
    customer_name: booking.user ? `${booking.user.first_name} ${booking.user.last_name}` : 'Unknown',
    car_details: {
      name: booking.car ? `${booking.car.make} ${booking.car.model}` : 'Unknown',
      license: booking.car ? booking.car.license_plate : '',
      image: booking.car ? booking.car.image_url : '/placeholder.svg'
    },
    start_date: format(parseISO(booking.start_date), 'MMM d, yyyy'),
    end_date: format(parseISO(booking.end_date), 'MMM d, yyyy'),
    total_amount: booking.total_amount,
    status: booking.status,
    created_at: booking.created_at
  }));
  
  // Define columns for the bookings table
  const columns = [
    {
      accessorKey: "booking_id",
      header: "Booking ID",
      cell: ({ row }) => {
        const id = row.getValue("booking_id");
        return <div className="font-medium">{id.substring(0, 8)}...</div>;
      }
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
        const car = row.getValue("car_details");
        return (
          <div className="flex items-center gap-2">
            <img src={car.image} alt={car.name} className="w-10 h-10 rounded-md object-cover" />
            <div>
              <div className="font-medium">{car.name}</div>
              <div className="text-xs text-muted-foreground">{car.license}</div>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "start_date",
      header: "Start Date",
      cell: ({ row }) => row.getValue("start_date"),
    },
    {
      accessorKey: "end_date",
      header: "End Date",
      cell: ({ row }) => row.getValue("end_date"),
    },
    {
      accessorKey: "total_amount",
      header: "Amount",
      cell: ({ row }) => <div className="text-right">${parseFloat(row.getValue("total_amount")).toFixed(2)}</div>,
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("status");
        return (
          <div className="flex justify-center">
            {status === "active" && (
              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                Active
              </Badge>
            )}
            {status === "completed" && (
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
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
        );
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const booking = row.original;
        return (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => router.push(`/dashboard/bookings/${booking.booking_id}`)}
          >
            View
          </Button>
        );
      },
    },
  ];
  
  return (
    <div className="container mx-auto py-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Bookings</h1>
        <Button onClick={() => router.push('/dashboard/bookings/create')}>
          <PlusIcon className="mr-2 h-4 w-4" /> 
          New Booking
        </Button>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        <Card>
          <CardContent className="p-4 flex flex-col items-center justify-center">
            <FileIcon className="h-8 w-8 text-primary mb-2" />
            <p className="text-sm text-muted-foreground">Total Bookings</p>
            <h3 className="text-2xl font-bold">{stats.total}</h3>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 flex flex-col items-center justify-center">
            <AlertCircle className="h-8 w-8 text-amber-500 mb-2" />
            <p className="text-sm text-muted-foreground">Pending</p>
            <h3 className="text-2xl font-bold">{stats.pending}</h3>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 flex flex-col items-center justify-center">
            <Calendar className="h-8 w-8 text-blue-500 mb-2" />
            <p className="text-sm text-muted-foreground">Active</p>
            <h3 className="text-2xl font-bold">{stats.active}</h3>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 flex flex-col items-center justify-center">
            <CheckCircle className="h-8 w-8 text-green-500 mb-2" />
            <p className="text-sm text-muted-foreground">Completed</p>
            <h3 className="text-2xl font-bold">{stats.completed}</h3>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 flex flex-col items-center justify-center">
            <XCircle className="h-8 w-8 text-red-500 mb-2" />
            <p className="text-sm text-muted-foreground">Cancelled</p>
            <h3 className="text-2xl font-bold">{stats.cancelled}</h3>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Booking Management</CardTitle>
            <Tabs defaultValue="all" onValueChange={handleTabChange}>
              <TabsList>
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="pending">Pending</TabsTrigger>
                <TabsTrigger value="active">Active</TabsTrigger>
                <TabsTrigger value="completed">Completed</TabsTrigger>
                <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-4">Loading bookings...</div>
          ) : (
            <DataTable 
              columns={columns} 
              data={formattedBookings} 
              filterColumn="customer_name"
              filterPlaceholder="Filter by customer name..."
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}