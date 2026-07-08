import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

const filePath = path.join(process.cwd(), 'data', 'customers.json');

export async function GET() {
  try {
    const data = await fs.readFile(filePath, 'utf8');
    const customers = JSON.parse(data || '[]');
    return NextResponse.json(customers);
  } catch (error) {
    if (error.code === 'ENOENT') {
      return NextResponse.json([]);
    }
    return NextResponse.json({ error: 'Failed to read data' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    
    let customers = [];
    try {
      const data = await fs.readFile(filePath, 'utf8');
      customers = JSON.parse(data || '[]');
    } catch (error) {
      if (error.code !== 'ENOENT') {
        throw error;
      }
    }

    const newCustomer = {
      id: 'cust_' + Date.now(),
      name: body.name || '',
      gstin: body.gstin || '',
      email: body.email || '',
      phone: body.phone || '',
      address: body.address || '',
      city: body.city || '',
      state: body.state || '',
      totalPurchases: 0,
      invoiceCount: 0,
      createdAt: new Date().toISOString().split('T')[0],
    };

    customers.push(newCustomer);

    await fs.mkdir(path.dirname(filePath), { recursive: true });
    await fs.writeFile(filePath, JSON.stringify(customers, null, 2), 'utf8');

    return NextResponse.json(newCustomer, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to save data: ' + error.message }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const updatedCustomer = await request.json();

    const data = await fs.readFile(filePath, 'utf8');
    const customers = JSON.parse(data || '[]');

    const updatedCustomers = customers.map((customer) =>
      customer.id === updatedCustomer.id
        ? { ...customer, ...updatedCustomer }
        : customer
    );

    await fs.writeFile(
      filePath,
      JSON.stringify(updatedCustomers, null, 2),
      'utf8'
    );

    return NextResponse.json({
      message: 'Customer updated successfully',
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update customer' },
      { status: 500 }
    );
  }
}