import { NextResponse } from "next/server";

const customers = [
  { id: 1, name: "John Doe", email: "john@example.com", phone: "+63 912 345 6789", orders: 12, total: 8450, status: "active" },
  { id: 2, name: "Jane Smith", email: "jane@example.com", phone: "+63 923 456 7890", orders: 8, total: 5320, status: "active" },
  { id: 3, name: "Bob Johnson", email: "bob@example.com", phone: "+63 934 567 8901", orders: 3, total: 1280, status: "inactive" },
];

export async function GET() {
  return NextResponse.json({ customers, total: customers.length });
}
