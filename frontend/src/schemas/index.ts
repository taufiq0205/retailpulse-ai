import { z } from "zod";

// Product schemas
export const ProductSchema = z.object({
  id: z.string(),
  sku: z.string(),
  name: z.string(),
  category: z.string(),
  price: z.coerce.number().min(0),
  cost: z.coerce.number().min(0),
});

export type Product = z.infer<typeof ProductSchema>;

export const CreateProductSchema = ProductSchema.omit({ id: true });
export type CreateProduct = z.infer<typeof CreateProductSchema>;

// Inventory schemas
export const InventorySchema = z.object({
  product_id: z.string(),
  sku: z.string(),
  name: z.string(),
  current_stock: z.coerce.number().int().nonnegative(),
  lead_time_days: z.coerce.number().int().min(1),
  minimum_order_quantity: z.coerce.number().int().min(1),
});

export type Inventory = z.infer<typeof InventorySchema>;

export const UpdateInventorySchema = z.object({
  lead_time_days: z.coerce.number().int().min(1),
  minimum_order_quantity: z.coerce.number().int().min(1),
});

// CSV Upload error schema
export const UploadErrorSchema = z.object({
  row: z.number(),
  column: z.string(),
  message: z.string(),
});

export type UploadError = z.infer<typeof UploadErrorSchema>;

export const UploadResponseSchema = z.object({
  success: z.boolean(),
  processed_rows: z.number().optional(),
  errors: z.array(UploadErrorSchema).optional(),
});

export type UploadResponse = z.infer<typeof UploadResponseSchema>;

// Sales / Summary schemas
export const SalesSummarySchema = z.object({
  total_products: z.number(),
  high_risk_count: z.number(),
  avg_stock_coverage_days: z.number(),
  recent_alerts: z.array(z.object({
    product_id: z.string(),
    name: z.string(),
    sku: z.string(),
    risk_level: z.enum(["high", "medium", "low"]),
    estimated_stockout_date: z.string(),
    recommended_quantity: z.number(),
  })),
  sales_trend: z.array(z.object({
    date: z.string(),
    sales_amount: z.number(),
    units_sold: z.number(),
  })),
  top_product_forecast: z.object({
    product_id: z.string(),
    name: z.string(),
    data: z.array(z.object({
      date: z.string(),
      actual: z.number().nullable(),
      predicted: z.number(),
    })),
  }).nullable(),
});

export type SalesSummary = z.infer<typeof SalesSummarySchema>;

// Forecast schemas
export const ForecastPointSchema = z.object({
  date: z.string(),
  actual: z.number().nullable(),
  predicted: z.number(),
  lower_bound: z.number().nullable().optional(),
  upper_bound: z.number().nullable().optional(),
});

export type ForecastPoint = z.infer<typeof ForecastPointSchema>;

export const ForecastResponseSchema = z.object({
  product_id: z.string(),
  name: z.string(),
  horizon_days: z.number(),
  forecast: z.array(ForecastPointSchema),
  metrics: z.object({
    wmape: z.number(),
    mae: z.number(),
    rmse: z.number(),
    bias: z.number(),
  }),
});

export type ForecastResponse = z.infer<typeof ForecastResponseSchema>;

// Recommendation schemas
export const RecommendationSchema = z.object({
  product_id: z.string(),
  product_name: z.string(),
  sku: z.string(),
  category: z.string(),
  risk_level: z.enum(["high", "medium", "low"]),
  reorder_point: z.number(),
  safety_stock: z.number(),
  recommended_quantity: z.number(),
  estimated_stockout_date: z.string(),
  current_stock: z.number(),
});

export type Recommendation = z.infer<typeof RecommendationSchema>;

// Model Performance schemas
export const ModelRunSchema = z.object({
  version: z.string(),
  trained_at: z.string(),
  wmape: z.number(),
  mae: z.number(),
  rmse: z.number(),
  bias: z.number(),
});

export type ModelRun = z.infer<typeof ModelRunSchema>;

export const ModelPerformanceResponseSchema = z.object({
  model_runs: z.array(ModelRunSchema),
  comparison_data: z.array(z.object({
    date: z.string(),
    actual: z.number(),
    predicted: z.number(),
  })),
});

export type ModelPerformanceResponse = z.infer<typeof ModelPerformanceResponseSchema>;

// Upload History schema
export const UploadHistorySchema = z.object({
  id: z.string(),
  filename: z.string(),
  uploaded_at: z.string(),
  status: z.enum(["success", "failed"]),
  row_count: z.number(),
  error_count: z.number(),
});

export type UploadHistory = z.infer<typeof UploadHistorySchema>;
