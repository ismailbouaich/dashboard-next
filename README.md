# RideHaven - Car Rental Platform

RideHaven is a complete car rental solution with a Next.js admin dashboard and a React Native mobile app for clients.

## Project Structure

The project is organized into two main components:

1. **Admin Dashboard** (Next.js)
2. **Client Mobile App** (React Native)

## Admin Dashboard

The admin dashboard allows rental company staff to:

- Manage vehicle inventory
- Process bookings
- Track customer information
- Generate reports
- Monitor business performance

### Tech Stack

- **Frontend**: Next.js, React, Tailwind CSS
- **UI Components**: Shadcn UI
- **Database & Auth**: Supabase
- **State Management**: React Hooks

### Setup Instructions

1. Clone the repository
   ```bash
   git clone https://github.com/your-username/ridehaven.git
   cd ridehaven
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Create a `.env.local` file in the root directory with the following variables:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
   ```

4. Run the development server
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

### Database Setup

The project uses Supabase as the backend. Run the following SQL commands in your Supabase SQL editor to set up the database schema:

```sql
-- Create tables (users are handled by Supabase Auth)
CREATE TABLE profiles (
  id UUID REFERENCES auth.users PRIMARY KEY,
  first_name TEXT,
  last_name TEXT,
  phone TEXT,
  is_admin BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Vehicles/Cars table
CREATE TABLE cars (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  make TEXT NOT NULL,
  model TEXT NOT NULL,
  year INTEGER NOT NULL,
  license_plate TEXT NOT NULL UNIQUE,
  daily_rate DECIMAL(10, 2) NOT NULL,
  is_available BOOLEAN DEFAULT TRUE,
  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Bookings table
CREATE TABLE bookings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users NOT NULL,
  car_id UUID REFERENCES cars(id) NOT NULL,
  start_date TIMESTAMPTZ NOT NULL,
  end_date TIMESTAMPTZ NOT NULL,
  total_amount DECIMAL(10, 2) NOT NULL,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Reviews table
CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  booking_id UUID REFERENCES bookings(id),
  user_id UUID REFERENCES auth.users NOT NULL,
  car_id UUID REFERENCES cars(id) NOT NULL,
  rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Set up RLS (Row Level Security) policies
-- Enable RLS on tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE cars ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- Create basic policies (customize as needed)
CREATE POLICY "Public profiles are viewable by everyone."
  ON profiles FOR SELECT USING (true);

CREATE POLICY "Users can update their own profiles."
  ON profiles FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Cars are viewable by everyone."
  ON cars FOR SELECT USING (true);

CREATE POLICY "Bookings are viewable by the user who created them or admins."
  ON bookings FOR SELECT USING (
    auth.uid() = user_id OR 
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = TRUE)
  );

CREATE POLICY "Reviews are viewable by everyone."
  ON reviews FOR SELECT USING (true);
```

## Client Mobile App (React Native)

The mobile app allows clients to:

- Browse available cars
- Make bookings
- Manage their bookings
- View booking history
- Leave reviews

### Tech Stack

- React Native
- Expo
- Supabase (shared with admin dashboard)
- React Navigation

### Setup Instructions

1. Navigate to the mobile app directory
   ```bash
   cd client-app
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Create a `.env` file with your Supabase credentials
   ```
   SUPABASE_URL=your-supabase-url
   SUPABASE_ANON_KEY=your-supabase-anon-key
   ```

4. Start the Expo development server
   ```bash
   npm start
   ```

5. Use the Expo Go app on your device to scan the QR code or run in a simulator

## Deployment

### Admin Dashboard

The Next.js admin dashboard can be deployed to platforms like Vercel or Netlify.

```bash
npm run build
```

### Mobile App

For the React Native mobile app, you can build using Expo EAS:

```bash
eas build --platform ios
eas build --platform android
```

## License

This project is licensed under the MIT License - see the LICENSE file for details.