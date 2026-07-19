import { z } from "zod";
import {
  Product,
  ProductSchema,
  CreateProduct,
  Inventory,
  InventorySchema,
  UploadResponse,
  UploadResponseSchema,
  SalesSummary,
  SalesSummarySchema,
  ForecastResponse,
  ForecastResponseSchema,
  Recommendation,
  RecommendationSchema,
  ModelPerformanceResponse,
  ModelPerformanceResponseSchema,
  UploadHistory,
  UploadHistorySchema,
  ModelRun,
} from "../schemas";

const API_BASE_URL = (import.meta as any).env.NEXT_PUBLIC_API_BASE_URL || "";

// Helpers for localStorage persistence of our local state
const getStoredData = (key: string, fallback: any) => {
  const data = localStorage.getItem(key);
  if (!data) {
    localStorage.setItem(key, JSON.stringify(fallback));
    return fallback;
  }
  try {
    return JSON.parse(data);
  } catch {
    return fallback;
  }
};

const setStoredData = (key: string, data: any) => {
  localStorage.setItem(key, JSON.stringify(data));
};

// Initial Malaysian SME dataset
const initialProducts: Product[] = [
  { id: "p-1", sku: "MY-RAMB-10K", name: "Beras Cap Rambutan 10kg", category: "Rice & Grains", price: 38.50, cost: 30.00 },
  { id: "p-2", sku: "MY-MILO-1KG", name: "Milo Soft Pack 1kg", category: "Beverages", price: 21.90, cost: 17.50 },
  { id: "p-3", sku: "MY-MAGG-KAR", name: "Maggi Kari 5-Pack", category: "Instant Noodles", price: 5.50, cost: 4.20 },
  { id: "p-4", sku: "MY-ADAB-KUT", name: "Serbuk Kari Daging Adabi 250g", category: "Spices & Condiments", price: 3.20, cost: 2.20 },
  { id: "p-5", sku: "MY-Saji-5KG", name: "Minyak Masak Saji 5kg", category: "Cooking Oil", price: 33.50, cost: 28.00 },
  { id: "p-6", sku: "MY-NESC-200", name: "Nescafe Classic Refill 200g", category: "Beverages", price: 18.90, cost: 14.80 },
  { id: "p-7", sku: "MY-FAIZ-BAS", name: "Beras Basmathi Faiza 5kg", category: "Rice & Grains", price: 42.00, cost: 34.00 },
  { id: "p-8", sku: "MY-YAKU-ACE", name: "Yakult Ace 5x80ml", category: "Dairy & Chilled", price: 4.90, cost: 3.80 },
];

const initialInventory: Inventory[] = [
  { product_id: "p-1", sku: "MY-RAMB-10K", name: "Beras Cap Rambutan 10kg", current_stock: 12, lead_time_days: 5, minimum_order_quantity: 50 },
  { product_id: "p-2", sku: "MY-MILO-1KG", name: "Milo Soft Pack 1kg", current_stock: 45, lead_time_days: 3, minimum_order_quantity: 30 },
  { product_id: "p-3", sku: "MY-MAGG-KAR", name: "Maggi Kari 5-Pack", current_stock: 120, lead_time_days: 2, minimum_order_quantity: 100 },
  { product_id: "p-4", sku: "MY-ADAB-KUT", name: "Serbuk Kari Daging Adabi 250g", current_stock: 4, lead_time_days: 7, minimum_order_quantity: 40 },
  { product_id: "p-5", sku: "MY-Saji-5KG", name: "Minyak Masak Saji 5kg", current_stock: 2, lead_time_days: 4, minimum_order_quantity: 20 },
  { product_id: "p-6", sku: "MY-NESC-200", name: "Nescafe Classic Refill 200g", current_stock: 28, lead_time_days: 3, minimum_order_quantity: 24 },
  { product_id: "p-7", sku: "MY-FAIZ-BAS", name: "Beras Basmathi Faiza 5kg", current_stock: 15, lead_time_days: 6, minimum_order_quantity: 30 },
  { product_id: "p-8", sku: "MY-YAKU-ACE", name: "Yakult Ace 5x80ml", current_stock: 8, lead_time_days: 2, minimum_order_quantity: 15 },
];

const initialUploadHistory: UploadHistory[] = [
  { id: "u-1", filename: "sales_june_2026.csv", uploaded_at: "2026-06-15T10:30:00Z", status: "success", row_count: 350, error_count: 0 },
  { id: "u-2", filename: "sales_july_early_errors.csv", uploaded_at: "2026-07-02T14:15:00Z", status: "failed", row_count: 45, error_count: 3 },
];

const initialModelRuns = [
  { version: "v2.1.0", trained_at: "2026-07-15T02:00:00Z", wmape: 0.084, mae: 4.2, rmse: 5.6, bias: -0.15 },
  { version: "v2.0.1", trained_at: "2026-07-01T02:00:00Z", wmape: 0.095, mae: 4.8, rmse: 6.3, bias: 0.22 },
  { version: "v1.9.0", trained_at: "2026-06-15T01:30:00Z", wmape: 0.112, mae: 5.5, rmse: 7.1, bias: -0.4 },
];

// Seed historical sales for sales trend chart (last 28 days)
const generateSalesTrend = () => {
  const trend = [];
  const baseDate = new Date();
  baseDate.setDate(baseDate.getDate() - 28);
  for (let i = 0; i < 28; i++) {
    const d = new Date(baseDate);
    d.setDate(baseDate.getDate() + i);
    const dateStr = d.toISOString().split("T")[0];
    // Saji Oil, Rice and Milo daily variation
    const dayOfWeek = d.getDay();
    const multiplier = dayOfWeek === 0 || dayOfWeek === 6 ? 1.4 : 1.0; // Weekend boost
    trend.push({
      date: dateStr,
      sales_amount: Math.round((1200 + Math.random() * 400) * multiplier * 100) / 100,
      units_sold: Math.round((70 + Math.random() * 30) * multiplier),
    });
  }
  return trend;
};

// Seed forecast for top product
const generateForecastPoints = (productId: string, name: string) => {
  const forecast = [];
  const baseDate = new Date();
  // 14 days historical actuals, 28 days predicted
  baseDate.setDate(baseDate.getDate() - 14);

  let seedVal = productId === "p-1" ? 15 : productId === "p-5" ? 8 : 22;

  for (let i = 0; i < 42; i++) {
    const d = new Date(baseDate);
    d.setDate(baseDate.getDate() + i);
    const dateStr = d.toISOString().split("T")[0];
    const isHistorical = i < 14;

    const baseDemand = seedVal + Math.sin(i / 3) * 4 + (d.getDay() === 0 || d.getDay() === 6 ? 5 : 0);
    const predicted = Math.max(1, Math.round(baseDemand + (Math.random() * 4 - 2)));
    const actual = isHistorical ? Math.max(1, Math.round(baseDemand + (Math.random() * 6 - 3))) : null;

    forecast.push({
      date: dateStr,
      actual,
      predicted,
      lower_bound: !isHistorical ? Math.max(0, Math.round(predicted * 0.85)) : null,
      upper_bound: !isHistorical ? Math.round(predicted * 1.15) : null,
    });
  }
  return forecast;
};

class APIClient {
  private useMock: boolean = false;

  constructor() {
    this.useMock = !API_BASE_URL;
  }

  // Check backend server status
  async checkServer(): Promise<boolean> {
    if (!API_BASE_URL) return false;
    try {
      const res = await fetch(`${API_BASE_URL}/api/health`, { signal: AbortSignal.timeout(1500) });
      return res.ok;
    } catch {
      return false;
    }
  }

  // Local helper database get/set
  private getDB() {
    const products = getStoredData("rp_products", initialProducts);
    const inventory = getStoredData("rp_inventory", initialInventory);
    const uploadHistory = getStoredData("rp_upload_history", initialUploadHistory);
    return { products, inventory, uploadHistory };
  }

  private saveDB(db: { products: Product[]; inventory: Inventory[]; uploadHistory: UploadHistory[] }) {
    setStoredData("rp_products", db.products);
    setStoredData("rp_inventory", db.inventory);
    setStoredData("rp_upload_history", db.uploadHistory);
  }

  // --- PRODUCTS ---
  async getProducts(search?: string, category?: string, page: number = 1, limit: number = 10): Promise<{ data: Product[]; total: number }> {
    if (!this.useMock) {
      try {
        const queryParams = new URLSearchParams({
          search: search || "",
          category: category || "",
          page: String(page),
          limit: String(limit),
        });
        const res = await fetch(`${API_BASE_URL}/products?${queryParams}`);
        if (res.ok) {
          const json = await res.json();
          return json;
        }
      } catch (e) {
        console.warn("FastAPI offline, using mock frontend API fallback", e);
      }
    }

    // Mock Implementation
    const db = this.getDB();
    let filtered = db.products;

    if (search) {
      const lower = search.toLowerCase();
      filtered = filtered.filter((p) => p.name.toLowerCase().includes(lower) || p.sku.toLowerCase().includes(lower));
    }
    if (category && category !== "all") {
      filtered = filtered.filter((p) => p.category === category);
    }

    const startIndex = (page - 1) * limit;
    const paginated = filtered.slice(startIndex, startIndex + limit);

    return {
      data: paginated,
      total: filtered.length,
    };
  }

  async createProduct(data: CreateProduct): Promise<Product> {
    if (!this.useMock) {
      try {
        const res = await fetch(`${API_BASE_URL}/products`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
        if (res.ok) {
          return ProductSchema.parse(await res.json());
        }
      } catch (e) {
        console.warn("FastAPI offline, using mock frontend API fallback", e);
      }
    }

    const db = this.getDB();
    const newProduct: Product = {
      id: "p-" + (db.products.length + 1),
      ...data,
    };
    db.products.push(newProduct);

    const newInventory: Inventory = {
      product_id: newProduct.id,
      sku: newProduct.sku,
      name: newProduct.name,
      current_stock: 0,
      lead_time_days: 5,
      minimum_order_quantity: 20,
    };
    db.inventory.push(newInventory);

    this.saveDB(db);
    return newProduct;
  }

  // --- INVENTORY ---
  async getInventory(): Promise<Inventory[]> {
    if (!this.useMock) {
      try {
        const res = await fetch(`${API_BASE_URL}/inventory`);
        if (res.ok) {
          return z.array(InventorySchema).parse(await res.json());
        }
      } catch (e) {
        console.warn("FastAPI offline, using mock frontend API fallback", e);
      }
    }

    const db = this.getDB();
    return db.inventory;
  }

  async updateInventory(productId: string, leadTimeDays: number, minOrderQty: number): Promise<Inventory> {
    if (!this.useMock) {
      try {
        const res = await fetch(`${API_BASE_URL}/inventory/${productId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ lead_time_days: leadTimeDays, minimum_order_quantity: minOrderQty }),
        });
        if (res.ok) {
          return InventorySchema.parse(await res.json());
        }
      } catch (e) {
        console.warn("FastAPI offline, using mock frontend API fallback", e);
      }
    }

    const db = this.getDB();
    const index = db.inventory.findIndex((inv) => inv.product_id === productId);
    if (index === -1) {
      throw new Error("Product inventory not found");
    }

    db.inventory[index] = {
      ...db.inventory[index],
      lead_time_days: leadTimeDays,
      minimum_order_quantity: minOrderQty,
    };

    this.saveDB(db);
    return db.inventory[index];
  }

  // --- SALES UPLOAD ---
  async uploadSalesCSV(file: File): Promise<UploadResponse> {
    if (!this.useMock) {
      try {
        const formData = new FormData();
        formData.append("file", file);
        const res = await fetch(`${API_BASE_URL}/sales/upload`, {
          method: "POST",
          body: formData,
        });
        if (res.ok) {
          return UploadResponseSchema.parse(await res.json());
        }
      } catch (e) {
        console.warn("FastAPI offline, using mock frontend API fallback", e);
      }
    }

    // Standard Mock Verification: If name contains 'error' or file is larger than certain lines, we trigger structured errors
    const isErrorTriggerFile = file.name.includes("error") || file.name.includes("invalid");

    const db = this.getDB();

    if (isErrorTriggerFile) {
      const uploadErrorResponse: UploadResponse = {
        success: false,
        errors: [
          { row: 12, column: "sales_amount", message: "sales contains a negative value." },
          { row: 27, column: "units_sold", message: "units_sold cannot be a non-integer or negative value." },
          { row: 31, column: "sku", message: "SKU 'MY-UNKNOWN-SKU' not found in product database." },
        ],
      };

      const newHistory: UploadHistory = {
        id: "u-" + (db.uploadHistory.length + 1),
        filename: file.name,
        uploaded_at: new Date().toISOString(),
        status: "failed",
        row_count: 50,
        error_count: 3,
      };
      db.uploadHistory.unshift(newHistory);
      this.saveDB(db);

      return uploadErrorResponse;
    }

    const successResponse: UploadResponse = {
      success: true,
      processed_rows: 184,
    };

    const newHistory: UploadHistory = {
      id: "u-" + (db.uploadHistory.length + 1),
      filename: file.name,
      uploaded_at: new Date().toISOString(),
      status: "success",
      row_count: 184,
      error_count: 0,
    };
    db.uploadHistory.unshift(newHistory);
    this.saveDB(db);

    return successResponse;
  }

  async getUploadHistory(): Promise<UploadHistory[]> {
    const db = this.getDB();
    return db.uploadHistory;
  }

  // --- SALES SUMMARY (OVERVIEW) ---
  async getSalesSummary(): Promise<SalesSummary> {
    if (!this.useMock) {
      try {
        const res = await fetch(`${API_BASE_URL}/sales/summary`);
        if (res.ok) {
          return SalesSummarySchema.parse(await res.json());
        }
      } catch (e) {
        console.warn("FastAPI offline, using mock frontend API fallback", e);
      }
    }

    // Generate responsive dashboard statistics
    const db = this.getDB();
    const totalProducts = db.products.length;

    // High risk computation based on inventory current stock vs reorder points
    // Let's count inventory with low stock
    const highRiskCount = db.inventory.filter((inv) => inv.current_stock < inv.minimum_order_quantity * 0.2).length;

    // Avg coverage computation
    const avgStockCoverageDays = Math.round(
      db.inventory.reduce((acc, inv) => acc + (inv.current_stock * 2.5), 0) / Math.max(1, totalProducts)
    );

    const recentAlerts = db.inventory
      .filter((inv) => inv.current_stock < inv.minimum_order_quantity * 0.2)
      .slice(0, 5)
      .map((inv) => {
        const stockoutDays = Math.max(1, Math.round(inv.current_stock * 0.8));
        const date = new Date();
        date.setDate(date.getDate() + stockoutDays);
        return {
          product_id: inv.product_id,
          name: inv.name,
          sku: inv.sku,
          risk_level: "high" as const,
          estimated_stockout_date: date.toISOString().split("T")[0],
          recommended_quantity: inv.minimum_order_quantity,
        };
      });

    return {
      total_products: totalProducts,
      high_risk_count: highRiskCount,
      avg_stock_coverage_days: avgStockCoverageDays,
      recent_alerts: recentAlerts,
      sales_trend: generateSalesTrend(),
      top_product_forecast: {
        product_id: "p-1",
        name: "Beras Cap Rambutan 10kg",
        data: generateForecastPoints("p-1", "Beras Cap Rambutan 10kg").map((pt) => ({
          date: pt.date,
          actual: pt.actual,
          predicted: pt.predicted,
        })),
      },
    };
  }

  // --- FORECASTS ---
  async getForecast(productId: string): Promise<ForecastResponse> {
    if (!this.useMock) {
      try {
        const res = await fetch(`${API_BASE_URL}/forecasts/${productId}`);
        if (res.ok) {
          return ForecastResponseSchema.parse(await res.json());
        }
      } catch (e) {
        console.warn("FastAPI offline, using mock frontend API fallback", e);
      }
    }

    const db = this.getDB();
    const prod = db.products.find((p) => p.id === productId) || db.products[0];

    // Determine performance metrics
    const metricsMap: Record<string, any> = {
      "p-1": { wmape: 0.082, mae: 4.1, rmse: 5.2, bias: -0.12 },
      "p-2": { wmape: 0.091, mae: 3.8, rmse: 4.9, bias: 0.18 },
      "p-3": { wmape: 0.114, mae: 6.2, rmse: 8.4, bias: -0.32 },
      "p-4": { wmape: 0.076, mae: 2.1, rmse: 2.9, bias: 0.05 },
      "p-5": { wmape: 0.065, mae: 1.8, rmse: 2.4, bias: -0.09 },
    };

    const metrics = metricsMap[productId] || { wmape: 0.10, mae: 4.5, rmse: 5.8, bias: 0.10 };

    return {
      product_id: prod.id,
      name: prod.name,
      horizon_days: 28,
      forecast: generateForecastPoints(prod.id, prod.name),
      metrics,
    };
  }

  async generateForecasts(): Promise<{ success: boolean; message: string }> {
    if (!this.useMock) {
      try {
        const res = await fetch(`${API_BASE_URL}/forecasts/generate`, { method: "POST" });
        if (res.ok) {
          return await res.json();
        }
      } catch (e) {
        console.warn("FastAPI offline, using mock frontend API fallback", e);
      }
    }
    return { success: true, message: "Forecast generation triggered successfully" };
  }

  // --- MODEL PERFORMANCE ---
  async getModelPerformance(): Promise<ModelPerformanceResponse> {
    if (!this.useMock) {
      try {
        const res = await fetch(`${API_BASE_URL}/model/performance`);
        if (res.ok) {
          return ModelPerformanceResponseSchema.parse(await res.json());
        }
      } catch (e) {
        console.warn("FastAPI offline, using mock frontend API fallback", e);
      }
    }

    // Create custom historical comparison actuals vs predicted
    const comparison_data = [];
    const baseDate = new Date();
    baseDate.setDate(baseDate.getDate() - 30);
    for (let i = 0; i < 30; i++) {
      const d = new Date(baseDate);
      d.setDate(baseDate.getDate() + i);
      const baseVal = 45 + Math.sin(i / 2) * 8;
      comparison_data.push({
        date: d.toISOString().split("T")[0],
        actual: Math.round(baseVal + (Math.random() * 8 - 4)),
        predicted: Math.round(baseVal),
      });
    }

    return {
      model_runs: initialModelRuns,
      comparison_data,
    };
  }

  // --- RECOMMENDATIONS & ALERTS ---
  async generateRecommendations(): Promise<{ success: boolean; message: string }> {
    if (!this.useMock) {
      try {
        const res = await fetch(`${API_BASE_URL}/recommendations/generate`, { method: "POST" });
        if (res.ok) {
          return await res.json();
        }
      } catch (e) {
        console.warn("FastAPI offline, using mock frontend API fallback", e);
      }
    }
    return { success: true, message: "Recommendations triggered successfully" };
  }

  async getRecommendations(riskLevel?: string): Promise<Recommendation[]> {
    if (!this.useMock) {
      try {
        const queryParams = new URLSearchParams(riskLevel ? { risk_level: riskLevel } : {});
        const res = await fetch(`${API_BASE_URL}/recommendations?${queryParams}`);
        if (res.ok) {
          return z.array(RecommendationSchema).parse(await res.json());
        }
      } catch (e) {
        console.warn("FastAPI offline, using mock frontend API fallback", e);
      }
    }

    // Calculated recommendations based on inventory state
    const db = this.getDB();
    const recommendations: Recommendation[] = db.inventory.map((inv) => {
      const prod = db.products.find((p) => p.id === inv.product_id) || { category: "General" };

      // High risk if stock < 20% of min order qty, medium if < 50%, low otherwise
      let risk_level: "high" | "medium" | "low" = "low";
      if (inv.current_stock < inv.minimum_order_quantity * 0.25) {
        risk_level = "high";
      } else if (inv.current_stock < inv.minimum_order_quantity * 0.6) {
        risk_level = "medium";
      }

      // Reorder point = average daily usage (assumed 3) * lead time + safety stock (assumed 5)
      const avgDailyUsage = 2.5;
      const reorder_point = Math.round(avgDailyUsage * inv.lead_time_days + 5);
      const safety_stock = 8;

      // Recommended order quantity = min order qty if stockout imminent
      let recommended_quantity = 0;
      if (inv.current_stock < reorder_point) {
        recommended_quantity = Math.max(inv.minimum_order_quantity, reorder_point * 2 - inv.current_stock);
      }

      const daysToStockout = Math.max(1, Math.round(inv.current_stock / avgDailyUsage));
      const stockoutDate = new Date();
      stockoutDate.setDate(stockoutDate.getDate() + daysToStockout);

      return {
        product_id: inv.product_id,
        product_name: inv.name,
        sku: inv.sku,
        category: prod.category,
        risk_level,
        reorder_point,
        safety_stock,
        recommended_quantity,
        estimated_stockout_date: stockoutDate.toISOString().split("T")[0],
        current_stock: inv.current_stock,
      };
    });

    if (riskLevel && riskLevel !== "all") {
      return recommendations.filter((r) => r.risk_level === riskLevel);
    }

    return recommendations;
  }

  async getAlerts(): Promise<Recommendation[]> {
    if (!this.useMock) {
      try {
        const res = await fetch(`${API_BASE_URL}/alerts`);
        if (res.ok) {
          return z.array(RecommendationSchema).parse(await res.json());
        }
      } catch (e) {
        console.warn("FastAPI offline, using mock frontend API fallback", e);
      }
    }

    const recommendations = await this.getRecommendations();
    // High-risk products only, sorted by soonest stockout date
    return recommendations
      .filter((r) => r.risk_level === "high")
      .sort((a, b) => new Date(a.estimated_stockout_date).getTime() - new Date(b.estimated_stockout_date).getTime());
  }
}

export const api = new APIClient();
export type { Product, Inventory, UploadResponse, SalesSummary, ForecastResponse, Recommendation, ModelRun, ModelPerformanceResponse, UploadHistory };
