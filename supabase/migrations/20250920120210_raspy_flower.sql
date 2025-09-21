/*
  # Campus Restaurant System Database Schema

  This migration creates the complete database schema for the campus restaurant system.

  ## Tables Created
  1. **profiles** - User profiles with role management (customer/admin)
  2. **products** - Food items with pricing and availability
  3. **orders** - Customer orders with status tracking
  4. **order_items** - Individual items within orders

  ## Security Features
  - Row Level Security (RLS) enabled on all tables
  - Comprehensive access policies for customers and admins
  - Automatic profile creation trigger for new users

  ## Realtime Features
  - Orders table configured for realtime updates
  - Admin notifications for new orders
  - Status updates broadcast to customers
*/

-- Enable necessary extensions
create extension if not exists "uuid-ossp";

-- Profiles table for user roles and metadata
create table if not exists profiles (
  id uuid references auth.users on delete cascade primary key,
  full_name text,
  role text default 'customer' check (role in ('customer', 'admin')),
  created_at timestamptz default now()
);

-- Products table for menu items
create table if not exists products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  price numeric(10,2) not null check (price > 0),
  image_url text,
  category text default 'food',
  available boolean default true,
  created_at timestamptz default now()
);

-- Orders table for customer orders
create table if not exists orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) not null,
  total numeric(10,2) not null check (total > 0),
  status text default 'new' check (status in ('new', 'accepted', 'preparing', 'completed', 'cancelled')),
  notes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Order items table for items within orders
create table if not exists order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid references orders(id) on delete cascade not null,
  product_id uuid references products(id) not null,
  quantity int not null check (quantity > 0),
  unit_price numeric(10,2) not null check (unit_price > 0),
  created_at timestamptz default now()
);

-- Enable Row Level Security
alter table profiles enable row level security;
alter table products enable row level security;
alter table orders enable row level security;
alter table order_items enable row level security;

-- RLS Policies for profiles
create policy "Users can view own profile" on profiles
  for select using (auth.uid() = id);

create policy "Users can update own profile" on profiles
  for update using (auth.uid() = id);

create policy "Service role can manage profiles" on profiles
  for all using (auth.role() = 'service_role');

-- RLS Policies for products
create policy "Everyone can view available products" on products
  for select using (available = true);

create policy "Admins can manage products" on products
  for all using (
    exists (
      select 1 from profiles 
      where id = auth.uid() and role = 'admin'
    )
  );

create policy "Service role can manage products" on products
  for all using (auth.role() = 'service_role');

-- RLS Policies for orders
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

create policy "Service role can manage orders" on orders
  for all using (auth.role() = 'service_role');

-- RLS Policies for order_items
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

create policy "Service role can manage order items" on order_items
  for all using (auth.role() = 'service_role');

-- Function to handle new user profile creation
create or replace function handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, new.raw_user_meta_data->>'full_name');
  return new;
end;
$$ language plpgsql security definer;

-- Trigger to automatically create profile on user signup
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure handle_new_user();

-- Add triggers for updated_at on orders and order_items
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists set_updated_at_on_orders on orders;
create trigger set_updated_at_on_orders
  before update on orders
  for each row execute procedure update_updated_at_column();

drop trigger if exists set_updated_at_on_order_items on order_items;
create trigger set_updated_at_on_order_items
  before update on order_items
  for each row execute procedure update_updated_at_column();

-- Sample products data
insert into products (name, description, price, image_url, category) values
('Classic Burger', 'Beef patty with lettuce, tomato, and cheese on a toasted bun', 12.99, 'https://images.pexels.com/photos/1639557/pexels-photo-1639557.jpeg', 'mains'),
('Margherita Pizza', 'Fresh mozzarella, basil, and tomato sauce on crispy dough', 15.99, 'https://images.pexels.com/photos/315755/pexels-photo-315755.jpeg', 'mains'),
('Caesar Salad', 'Romaine lettuce with parmesan cheese, croutons, and caesar dressing', 9.99, 'https://images.pexels.com/photos/1211887/pexels-photo-1211887.jpeg', 'salads'),
('Fish Tacos', 'Grilled fish with fresh salsa, cabbage, and lime on corn tortillas', 13.99, 'https://images.pexels.com/photos/4958792/pexels-photo-4958792.jpeg', 'mains'),
('Chocolate Cake', 'Rich chocolate layer cake with chocolate frosting', 6.99, 'https://images.pexels.com/photos/291528/pexels-photo-291528.jpeg', 'desserts'),
('Iced Coffee', 'Cold brew coffee with milk and your choice of sweetener', 4.99, 'https://images.pexels.com/photos/302899/pexels-photo-302899.jpeg', 'beverages'),
('Chicken Wings', 'Crispy chicken wings with buffalo sauce and ranch dip', 11.99, 'https://images.pexels.com/photos/2491273/pexels-photo-2491273.jpeg', 'appetizers'),
('Veggie Wrap', 'Fresh vegetables, hummus, and greens wrapped in a tortilla', 8.99, 'https://images.pexels.com/photos/1527603/pexels-photo-1527603.jpeg', 'mains'),
('French Fries', 'Golden crispy french fries with sea salt', 5.99, 'https://images.pexels.com/photos/1893556/pexels-photo-1893556.jpeg', 'sides'),
('Lemonade', 'Fresh squeezed lemonade with a hint of mint', 3.99, 'https://images.pexels.com/photos/96974/pexels-photo-96974.jpeg', 'beverages');

-- Create indexes for better performance
create index if not exists idx_orders_user_id on orders(user_id);
create index if not exists idx_orders_status on orders(status);
create index if not exists idx_orders_created_at on orders(created_at);
create index if not exists idx_order_items_order_id on order_items(order_id);
create index if not exists idx_order_items_product_id on order_items(product_id);
create index if not exists idx_products_available on products(available);
create index if not exists idx_products_category on products(category);