import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CreateProduct, CreateProductSchema } from "../../schemas";
import { Input } from "../ui/Input";
import { Button } from "../ui/Button";

interface ProductFormProps {
  initialValues?: CreateProduct;
  onSubmit: (values: CreateProduct) => Promise<void>;
  onCancel: () => void;
  isSubmitting?: boolean;
}

const CATEGORIES = [
  "Rice & Grains",
  "Beverages",
  "Instant Noodles",
  "Spices & Condiments",
  "Cooking Oil",
  "Dairy & Chilled",
  "Snacks & Sweets",
  "Household Products",
];

export const ProductForm: React.FC<ProductFormProps> = ({
  initialValues,
  onSubmit,
  onCancel,
  isSubmitting = false,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateProduct>({
    resolver: zodResolver(CreateProductSchema) as any,
    defaultValues: initialValues || {
      sku: "",
      name: "",
      category: CATEGORIES[0],
      price: 0,
      cost: 0,
    },
  });

  const handleFormSubmit = async (data: CreateProduct) => {
    await onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit as any)} className="space-y-5">
      <Input
        label="Product Name"
        placeholder="e.g. Milo Soft Pack 1kg"
        error={errors.name?.message}
        {...register("name")}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="SKU Code"
          placeholder="e.g. MY-MILO-1KG"
          error={errors.sku?.message}
          {...register("sku")}
        />

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-[#7A7169] uppercase tracking-wider">
            Category
          </label>
          <select
            className="flex h-10 w-full rounded-lg border border-[#E6E2DE] bg-white px-3 py-2 text-sm text-[#2C2926] transition-colors focus:border-[#5A5A40] focus:outline-none focus:ring-1 focus:ring-[#5A5A40]"
            {...register("category")}
          >
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
          {errors.category && (
            <span className="text-xs text-red-500 font-medium">{errors.category.message}</span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="Cost Price (RM)"
          type="number"
          step="0.01"
          placeholder="0.00"
          error={errors.cost?.message}
          {...register("cost")}
        />

        <Input
          label="Retail Price (RM)"
          type="number"
          step="0.01"
          placeholder="0.00"
          error={errors.price?.message}
          {...register("price")}
        />
      </div>

      <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          isLoading={isSubmitting}
        >
          {initialValues ? "Save Changes" : "Create Product"}
        </Button>
      </div>
    </form>
  );
};
