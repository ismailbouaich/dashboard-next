// src/app/dashboard/bookings/[id]/page.jsx
"use client";

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { format, parseISO } from 'date-fns';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useBookings } from '@/hooks/useBookings';
import { useAuth } from '@/hooks/useAuth';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { 
  ArrowLeft, 
  Calendar, 
  Car, 
  CreditCard, 
  Edit, 
  FileText, 
  Trash, 
  User,
  Check,
  X
} from 'lucide-react';

export default function BookingDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const { booking, getBooking, changeBookingStatus, deleteBooking, loading } = useBookings();
  const { isAdmin } = useAuth();
  const [confirmDelete, setConfirmDelete] = useState(false);
  
  useEffect(() => {
    if (id) {
      getBooking(id);
    }
  }, [id]);
  
  const handleStatusChange = async (newStatus) => {
    const result = await changeBookingStatus(id, newStatus);
    if (result) {
      getBooking(id); 
    }
  };
  
  const handleDelete = async () => {
    const result = await deleteBooking(id);
    if (result) {
      router.push('/dashboard/bookings');
    }
  };
  
  const startDate = booking?.start_date ? format(parseISO(booking.start_date), 'PPPP') : '';
  const endDate = booking?.end_date ? format(parseISO(booking.end_date), 'PPPP') : '';
  const createdAt = booking?.created_at ? format(parseISO(booking.created_at), 'PPP p') : '';
  
  const calculateDuration = () => {
    if (!booking?.start_date || !booking?.end_date) return '0 days';
    
    const start = new Date(booking.start_date);
    const end = new Date(booking.end_date);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return `${diffDays} day${diffDays !== 1 ? 's' : ''}`;
  };
  
  // Render status badge
  const getStatusBadge = (status) => {
    switch(status) {
      case 'active':
        return <Badge className="bg-blue-100 text-blue-700 border-blue-200 px-2 py-1">Active</Badge>;
      case 'completed':
        return <Badge className="bg-green-100 text-green-700 border-green-200 px-2 py-1">Completed</Badge>;
      case 'cancelled':
        return <Badge className="bg-red-100 text-red-700 border-red-200 px-2 py-1">Cancelled</Badge>;
      case 'pending':
      default:
        return <Badge className="bg-yellow-100 text-yellow-700 border-yellow-200 px-2 py-1">Pending</Badge>;
    }
  };
  
  if (loading) {
    return (
      <div className="container mx-auto py-8 flex items-center justify-center">
        <div className="text-center">
          <p>Loading booking details...</p>
        </div>
      </div>
    );
  }
  
  if (!booking) {
    return (
      <div className="container mx-auto py-8">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p>Booking not found</p>
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={() => router.push('/dashboard/bookings')}
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Bookings
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto py-4">
      <div className="mb-6">
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => router.push('/dashboard/bookings')}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Bookings
        </Button>
      </div>
      
      <div className="grid md:grid-cols-3 gap-6">
        {/* Main booking details */}
        <div className="md:col-span-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-2xl">Booking Details</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  Created on {createdAt}
                </p>
              </div>
              <div>{getStatusBadge(booking.status)}</div>
            </CardHeader>
            
            <CardContent>
              <div className="space-y-6">
                {/* Car Details */}
                <div className="flex items-start gap-4">
                  <div className="bg-primary/10 p-2 rounded-full">
                    <Car className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-lg">Vehicle Information</h3>
                    {booking.car && (
                      <div className="mt-2 flex items-start gap-4">
                        <img 
                          src={booking.car.image_url || '/placeholder.svg'} 
                          alt={`${booking.car.make} ${booking.car.model}`}
                          className="w-24 h-16 rounded-md object-cover"
                        />
                        <div>
                          <p className="font-medium">{booking.car.make} {booking.car.model} ({booking.car.year})</p>
                          <p className="text-sm text-muted-foreground">License: {booking.car.license_plate}</p>
                          <p className="text-sm text-muted-foreground">Daily Rate: ${booking.car.daily_rate}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Customer Details */}
                <div className="flex items-start gap-4">
                  <div className="bg-primary/10 p-2 rounded-full">
                    <User className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-lg">Customer Information</h3>
                    {booking.user && (
                      <div className="mt-2">
                        <p className="font-medium">{booking.user.first_name} {booking.user.last_name}</p>
                        <p className="text-sm text-muted-foreground">Email: {booking.user.email}</p>
                        <p className="text-sm text-muted-foreground">Phone: {booking.user.phone || 'N/A'}</p>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Booking Dates */}
                <div className="flex items-start gap-4">
                  <div className="bg-primary/10 p-2 rounded-full">
                    <Calendar className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-lg">Booking Period</h3>
                    <div className="mt-2 space-y-1">
                      <div className="flex justify-between">
                        <p className="text-sm text-muted-foreground">Start Date:</p>
                        <p className="text-sm">{startDate}</p>
                      </div>
                      <div className="flex justify-between">
                        <p className="text-sm text-muted-foreground">End Date:</p>
                        <p className="text-sm">{endDate}</p>
                      </div>
                      <div className="flex justify-between">
                        <p className="text-sm text-muted-foreground">Duration:</p>
                        <p className="text-sm">{calculateDuration()}</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Payment Information */}
                <div className="flex items-start gap-4">
                  <div className="bg-primary/10 p-2 rounded-full">
                    <CreditCard className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-lg">Payment Details</h3>
                    <div className="mt-2 space-y-1">
                      <div className="flex justify-between">
                        <p className="text-sm text-muted-foreground">Daily Rate:</p>
                        <p className="text-sm">${booking.car?.daily_rate || 0}</p>
                      </div>
                      <div className="flex justify-between">
                        <p className="text-sm text-muted-foreground">Duration:</p>
                        <p className="text-sm">{calculateDuration()}</p>
                      </div>
                      <Separator className="my-2" />
                      <div className="flex justify-between font-medium">
                        <p>Total Amount:</p>
                        <p>${parseFloat(booking.total_amount).toFixed(2)}</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Booking Notes (if any) */}
                {booking.notes && (
                  <div className="flex items-start gap-4">
                    <div className="bg-primary/10 p-2 rounded-full">
                      <FileText className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-lg">Notes</h3>
                      <p className="mt-2 text-sm">{booking.notes}</p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
            
            <CardFooter className="flex justify-between">
              <Button 
                variant="outline" 
                onClick={() => router.push('/dashboard/bookings')}
              >
                Back
              </Button>
              
              {isAdmin() && (
                <div className="flex gap-2">
                  <Button 
                    variant="outline"
                    onClick={() => router.push(`/dashboard/bookings/${id}/edit`)}
                  >
                    <Edit className="mr-2 h-4 w-4" />
                    Edit
                  </Button>
                  
                  <AlertDialog open={confirmDelete} onOpenChange={setConfirmDelete}>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive">
                        <Trash className="mr-2 h-4 w-4" />
                        Delete
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently delete the booking
                          and remove the data from our servers.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground">
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              )}
            </CardFooter>
          </Card>
        </div>
        
        {/* Status management sidebar */}
        {isAdmin() && (
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Booking Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-medium mb-2">Update Status</h3>
                  <div className="grid grid-cols-1 gap-2">
                    {booking.status !== 'pending' && (
                      <Button 
                        variant="outline" 
                        className="justify-start"
                        onClick={() => handleStatusChange('pending')}
                      >
                        <Badge className="bg-yellow-100 text-yellow-700 mr-2">Pending</Badge>
                        Mark as Pending
                      </Button>
                    )}
                    
                    {booking.status !== 'active' && (
                      <Button 
                        variant="outline" 
                        className="justify-start"
                        onClick={() => handleStatusChange('active')}
                      >
                        <Badge className="bg-blue-100 text-blue-700 mr-2">Active</Badge>
                        Mark as Active
                      </Button>
                    )}
                    
                    {booking.status !== 'completed' && (
                      <Button 
                        variant="outline" 
                        className="justify-start"
                        onClick={() => handleStatusChange('completed')}
                      >
                        <Check className="mr-2 h-4 w-4 text-green-600" />
                        Mark as Completed
                      </Button>
                    )}
                    
                    {booking.status !== 'cancelled' && (
                      <Button 
                        variant="outline" 
                        className="justify-start"
                        onClick={() => handleStatusChange('cancelled')}
                      >
                        <X className="mr-2 h-4 w-4 text-red-600" />
                        Mark as Cancelled
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}