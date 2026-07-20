import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().min(1, "Name is required").max(255),
  email: z.string().email("Invalid email address").max(255),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const createProductSchema = z.object({
  name: z.string().min(1, "Name is required").max(255),
  slug: z.string().min(1, "Slug is required").max(255).regex(/^[a-z0-9-]+$/, "Slug must be lowercase alphanumeric with hyphens"),
  description: z.string().max(2000).optional(),
  price: z.number().positive("Price must be positive"),
  category_id: z.number().int().positive().optional().nullable(),
  image: z.string().url("Must be a valid URL").max(2000).optional().nullable(),
  stock: z.number().int().min(0).optional(),
  is_available: z.boolean().optional(),
  is_featured: z.boolean().optional(),
  weight: z.string().max(50).optional().nullable(),
  origin: z.string().max(255).optional().nullable(),
  roast_level: z.string().max(50).optional().nullable(),
});

export const updateProductSchema = z.object({
  id: z.number().int().positive(),
}).merge(createProductSchema.partial());

export const createOrderSchema = z.object({
  customer_name: z.string().min(1, "Name is required").max(255),
  customer_email: z.string().email("Invalid email address").max(255),
  customer_phone: z.string().max(20).optional().nullable(),
  shipping_address: z.string().min(1, "Address is required"),
  notes: z.string().max(1000).optional().nullable(),
  items: z.array(z.object({
    id: z.number().optional(),
    productId: z.number().optional(),
    name: z.string().min(1),
    price: z.number().positive(),
    quantity: z.number().int().positive(),
    image: z.string().optional(),
  })).min(1, "At least one item is required"),
  total: z.number().positive("Total must be positive"),
});

export const createCategorySchema = z.object({
  name: z.string().min(1, "Name is required").max(255),
  slug: z.string().min(1, "Slug is required").max(255).regex(/^[a-z0-9-]+$/, "Slug must be lowercase alphanumeric with hyphens"),
  description: z.string().max(1000).optional().nullable(),
  image: z.string().url("Must be a valid URL").max(2000).optional().nullable(),
  sort_order: z.number().int().optional(),
  is_active: z.boolean().optional(),
});

export const updateCategorySchema = z.object({
  id: z.number().int().positive(),
}).merge(createCategorySchema.partial());

export const paymentSchema = z.object({
  amount: z.number().positive("Amount must be positive"),
  description: z.string().max(500).optional(),
  items: z.array(z.object({
    name: z.string(),
    quantity: z.number().int().positive(),
    amount: z.number().positive(),
  })).optional(),
  order_id: z.number().int().positive().optional(),
  customer_email: z.string().email().optional(),
});
