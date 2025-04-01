// src/app/dashboard/bookings/create/page.jsx
'use client';

import BookingForm from '@/components/bookings/booking-form';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function CreateBookingPage() {
  const router = useRouter();
  
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
      
      <BookingForm />
    </div>
  );
}