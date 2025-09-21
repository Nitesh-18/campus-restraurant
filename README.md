# Campus Restaurant System

A full-stack campus restaurant ordering system built with Next.js, Tailwind CSS, and Supabase.

## Features

- 🍕 Product catalog with responsive grid
- 🛒 Shopping cart with localStorage persistence  
- 🔐 Supabase authentication with role-based access
- ⚡ Realtime order notifications for admins
- 📱 Mobile-first responsive design
- ♿ Accessible UI with keyboard navigation
- 🎨 Clean, modern interface

## Tech Stack

- **Frontend**: Next.js 13+ (App Router), React 18+, TypeScript
- **Styling**: Tailwind CSS with JIT compilation
- **Backend**: Supabase (Auth, Postgres, Realtime)
- **State Management**: React hooks + localStorage for cart
- **Deployment**: Vercel (recommended)

## Getting Started

### Prerequisites

- Node.js 18+
- Supabase account
- Git

### Environment Variables

Create a `.env.local` file:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

### Installation

1. Clone the repository
2. Install dependencies: `npm install`
3. Set up your Supabase project
4. Run the SQL migrations (see below)
5. Seed sample data
6. Start development server: `npm run dev`

## Supabase Schema

Run this SQL in your Supabase SQL editor:

```sql
-- Enable necessary extensions
create extension if not exists "uuid-ossp";

-- Profiles table for user roles
create table profiles (
  id uuid references auth.users on delete cascade primary key,
  full_name text,
  role text default 'customer' check (role in ('customer', 'admin')),
  created_at timestamptz default now()
);

-- Products table
create table products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  price numeric(10,2) not null check (price > 0),
  image_url text,
  category text default 'food',
  available boolean default true,
  created_at timestamptz default now()
);

-- Orders table
create table orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) not null,
  total numeric(10,2) not null check (total > 0),
  status text default 'new' check (status in ('new', 'accepted', 'preparing', 'completed', 'cancelled')),
  notes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Order items table
create table order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid references orders(id) on delete cascade not null,
  product_id uuid references products(id) not null,
  quantity int not null check (quantity > 0),
  unit_price numeric(10,2) not null check (unit_price > 0),
  created_at timestamptz default now()
);

-- Row Level Security (RLS)
alter table profiles enable row level security;
alter table products enable row level security;
alter table orders enable row level security;
alter table order_items enable row level security;

-- RLS Policies
-- Profiles: Users can read/update their own profile
create policy "Users can view own profile" on profiles
  for select using (auth.uid() = id);

create policy "Users can update own profile" on profiles
  for update using (auth.uid() = id);

-- Products: Everyone can read, only admins can modify
create policy "Everyone can view products" on products
  for select using (available = true);

create policy "Admins can manage products" on products
  for all using (
    exists (
      select 1 from profiles 
      where id = auth.uid() and role = 'admin'
    )
  );

-- Orders: Users can view their own orders, admins can view all
create policy "Users can view own orders" on orders
  for select using (user_id = auth.uid());

create policy "Users can create orders" on orders
  for insert with check (user_id = auth.uid());

create policy "Admins can view all orders" on orders
  for select using (
    exists (
      select 1 from profiles 
      where id = auth.uid() and role = 'admin'
    )
  );

create policy "Admins can update orders" on orders
  for update using (
    exists (
      select 1 from profiles 
      where id = auth.uid() and role = 'admin'
    )
  );

-- Order items: Users can view their own, admins can view all
create policy "Users can view own order items" on order_items
  for select using (
    exists (
      select 1 from orders 
      where id = order_id and user_id = auth.uid()
    )
  );

create policy "Users can create order items" on order_items
  for insert with check (
    exists (
      select 1 from orders 
      where id = order_id and user_id = auth.uid()
    )
  );

create policy "Admins can view all order items" on order_items
  for select using (
    exists (
      select 1 from profiles 
      where id = auth.uid() and role = 'admin'
    )
  );

-- Functions
create or replace function handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, new.raw_user_meta_data->>'full_name');
  return new;
end;
$$ language plpgsql security definer;

-- Trigger to create profile on user signup
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure handle_new_user();

-- Sample data
insert into products (name, description, price, image_url, category) values
('Classic Burger', 'Beef patty with lettuce, tomato, and cheese', 12.99, 'https://images.pexels.com/photos/1639557/pexels-photo-1639557.jpeg', 'mains'),
('Margherita Pizza', 'Fresh mozzarella, basil, and tomato sauce', 15.99, 'https://images.pexels.com/photos/315755/pexels-photo-315755.jpeg', 'mains'),
('Caesar Salad', 'Romaine lettuce with parmesan and croutons', 9.99, 'https://images.pexels.com/photos/1211887/pexels-photo-1211887.jpeg', 'salads'),
('Fish Tacos', 'Grilled fish with fresh salsa and lime', 13.99, 'https://images.pexels.com/photos/4958792/pexels-photo-4958792.jpeg', 'mains'),
('Chocolate Cake', 'Rich chocolate layer cake with frosting', 6.99, 'https://images.pexels.com/photos/291528/pexels-photo-291528.jpeg', 'desserts'),
('Iced Coffee', 'Cold brew with milk and sweetener', 4.99, 'https://images.pexels.com/photos/302899/pexels-photo-302899.jpeg', 'beverages');
```

## Realtime Setup

The app uses Supabase Realtime to notify admins of new orders instantly. Make sure Realtime is enabled for the `orders` table in your Supabase dashboard.

## Creating an Admin User

1. Sign up normally through the app
2. In Supabase SQL editor, run:
```sql
update profiles set role = 'admin' where id = 'your-user-id';
```

## Project Structure

```
├─ app/                 # Next.js App Router
│  ├─ (auth)/          # Auth pages
│  ├─ admin/           # Admin dashboard
│  ├─ api/             # API routes
│  └─ page.tsx         # Homepage
├─ components/         # React components
│  ├─ auth/           # Authentication components
│  ├─ cart/           # Shopping cart components
│  ├─ admin/          # Admin components
│  └─ ui/             # Reusable UI components
├─ hooks/             # Custom React hooks
├─ lib/               # Utilities and configs
├─ types/             # TypeScript definitions
└─ supabase/          # Database migrations
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint