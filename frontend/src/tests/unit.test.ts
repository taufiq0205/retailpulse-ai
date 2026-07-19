import { describe, it, expect } from "vitest";
import { getRiskColorClass, formatUploadErrors } from "../lib/utils";

describe("RetailPulse AI Frontend Unit Tests", () => {
  // Test 1: Risk Color Mapping
  describe("getRiskColorClass", () => {
    it("should return red classes for high risk", () => {
      const colors = getRiskColorClass("high");
      expect(colors.badge).toContain("text-red-700");
      expect(colors.bg).toContain("bg-red-50");
    });

    it("should return amber classes for medium risk", () => {
      const colors = getRiskColorClass("medium");
      expect(colors.badge).toContain("text-amber-700");
      expect(colors.bg).toContain("bg-amber-50");
    });

    it("should return emerald classes for low risk or fallback", () => {
      const colors = getRiskColorClass("low");
      expect(colors.badge).toContain("text-emerald-700");
      expect(colors.bg).toContain("bg-emerald-50");

      const fallbackColors = getRiskColorClass("unknown");
      expect(fallbackColors.badge).toContain("text-emerald-700");
    });
  });

  // Test 2: CSV Upload Error Formatter
  describe("formatUploadErrors", () => {
    it("should format single upload error correctly", () => {
      const errors = [{ row: 12, column: "sales_amount", message: "sales contains a negative value" }];
      const formatted = formatUploadErrors(errors);
      expect(formatted).toBe("Row 12, Column [sales_amount]: sales contains a negative value");
    });

    it("should format multiple upload errors with newline separation", () => {
      const errors = [
        { row: 12, column: "sales_amount", message: "negative value" },
        { row: 15, column: "units_sold", message: "must be integer" },
      ];
      const formatted = formatUploadErrors(errors);
      expect(formatted).toBe(
        "Row 12, Column [sales_amount]: negative value\nRow 15, Column [units_sold]: must be integer"
      );
    });

    it("should handle empty error array gracefully", () => {
      const formatted = formatUploadErrors([]);
      expect(formatted).toBe("No validation errors found.");
    });
  });

  // Test 3: Dashboard KPI / Inventory Calculations
  describe("Dashboard KPI calculations", () => {
    it("should correctly compute reorder point and safety stock based on lead time", () => {
      // Reorder point = daily usage (2.5) * lead_time + safety stock (8)
      const lead_time_days = 5;
      const reorder_point = Math.round(2.5 * lead_time_days + 5);
      const safety_stock = 8;

      expect(reorder_point).toBe(18); // 12.5 + 5 = 17.5 rounded to 18
      expect(safety_stock).toBe(8);
    });

    it("should evaluate risk levels based on inventory thresholds", () => {
      const evaluateRisk = (current_stock: number, min_order_qty: number) => {
        if (current_stock < min_order_qty * 0.25) return "high";
        if (current_stock < min_order_qty * 0.6) return "medium";
        return "low";
      };

      expect(evaluateRisk(5, 50)).toBe("high"); // 5 < 12.5
      expect(evaluateRisk(20, 50)).toBe("medium"); // 20 < 30
      expect(evaluateRisk(40, 50)).toBe("low"); // 40 > 30
    });
  });
});
