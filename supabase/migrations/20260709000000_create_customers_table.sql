-- Migration: Create customers table with B2B/B2C constraints
-- Description: Sets up the customers table, constraints, indexes, and RLS policies.

-- Drop the table if it already exists to ensure a clean setup
DROP TABLE IF EXISTS public.customers CASCADE;

-- Create the customers table
CREATE TABLE public.customers (
    -- Unique Identifier
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Seller Reference (Authenticated User)
    seller_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,

    -- Mandatory Core Fields
    customer_name TEXT NOT NULL CHECK (char_length(TRIM(customer_name)) > 0),
    billing_email TEXT NOT NULL CHECK (billing_email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
    customer_type TEXT NOT NULL CHECK (customer_type IN ('B2B', 'B2C')),

    -- Address Block Fields
    street TEXT,
    city TEXT,
    state TEXT,
    postal_code TEXT,
    country TEXT,

    -- CRM Fields
    customer_account_number TEXT NOT NULL CHECK (char_length(TRIM(customer_account_number)) > 0),
    contact_phone TEXT,
    payment_terms_default TEXT NOT NULL DEFAULT 'Due on Receipt',
    currency TEXT NOT NULL DEFAULT 'USD' CHECK (char_length(currency) = 3),

    -- Conditional Business Fields
    tax_registration_number TEXT,
    po_reference TEXT,

    -- Invoicing Totals (maintained by database triggers/application logic)
    total_purchases NUMERIC(15, 2) NOT NULL DEFAULT 0.00 CHECK (total_purchases >= 0),
    invoice_count INTEGER NOT NULL DEFAULT 0 CHECK (invoice_count >= 0),

    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT timezone('utc'::text, now()),

    -- Database Level Constraints
    -- 1. Ensure customer_account_number is unique per seller
    CONSTRAINT unique_customer_account_number_per_seller UNIQUE (seller_id, customer_account_number),
    
    -- 2. Ensure billing_email is unique per seller (or globally, according to requirement 'unique')
    CONSTRAINT unique_billing_email_per_seller UNIQUE (seller_id, billing_email),

    -- 3. Conditional constraints:
    --   - If B2B: tax_registration_number is strictly required
    --   - If B2C: tax_registration_number and po_reference must be NULL
    CONSTRAINT check_b2b_b2c_conditional_fields CHECK (
        (customer_type = 'B2B' AND tax_registration_number IS NOT NULL AND char_length(TRIM(tax_registration_number)) > 0) OR
        (customer_type = 'B2C' AND tax_registration_number IS NULL AND po_reference IS NULL)
    )
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;

-- Set up RLS Policies
-- 1. Select Policy
CREATE POLICY "Sellers can view their own customers" 
    ON public.customers 
    FOR SELECT 
    USING (auth.uid() = seller_id);

-- 2. Insert Policy
CREATE POLICY "Sellers can insert their own customers" 
    ON public.customers 
    FOR INSERT 
    WITH CHECK (auth.uid() = seller_id);

-- 3. Update Policy
CREATE POLICY "Sellers can update their own customers" 
    ON public.customers 
    FOR UPDATE 
    USING (auth.uid() = seller_id) 
    WITH CHECK (auth.uid() = seller_id);

-- 4. Delete Policy
CREATE POLICY "Sellers can delete their own customers" 
    ON public.customers 
    FOR DELETE 
    USING (auth.uid() = seller_id);

-- Create performance indexes
CREATE INDEX IF NOT EXISTS idx_customers_seller_id ON public.customers(seller_id);
CREATE INDEX IF NOT EXISTS idx_customers_customer_type ON public.customers(customer_type);
CREATE INDEX IF NOT EXISTS idx_customers_account_number ON public.customers(seller_id, customer_account_number);
CREATE INDEX IF NOT EXISTS idx_customers_billing_email ON public.customers(seller_id, billing_email);

-- Optional: Automated trigger to update updated_at
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_customers_timestamp
    BEFORE UPDATE ON public.customers
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();
