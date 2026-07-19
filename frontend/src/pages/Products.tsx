import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../lib/api";
import { CreateProduct } from "../schemas";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "../components/ui/Table";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Modal } from "../components/ui/Modal";
import { Skeleton } from "../components/ui/Skeleton";
import { ProductForm } from "../components/features/ProductForm";
import { formatMYR } from "../lib/utils";
import { Plus, Search, Filter, RefreshCw, ShoppingBag } from "lucide-react";

const CATEGORIES = [
  "all",
  "Rice & Grains",
  "Beverages",
  "Instant Noodles",
  "Spices & Condiments",
  "Cooking Oil",
  "Dairy & Chilled",
  "Snacks & Sweets",
  "Household Products",
];

export const Products: React.FC = () => {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [page, setPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const queryClient = useQueryClient();

  const {
    data,
    isLoading,
    isError,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: ["products", search, category, page],
    queryFn: () => api.getProducts(search, category, page, 8),
  });

  const createMutation = useMutation({
    mutationFn: (newProduct: CreateProduct) => api.createProduct(newProduct),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["salesSummary"] });
      queryClient.invalidateQueries({ queryKey: ["inventory"] });
      setIsModalOpen(false);
    },
  });

  const handleCreateProduct = async (values: CreateProduct) => {
    await createMutation.mutateAsync(values);
  };

  const totalPages = data ? Math.ceil(data.total / 8) : 1;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Products List</h1>
          <p className="text-xs text-slate-400 mt-1">
            Manage your store's items, prices, and catalogs
          </p>
        </div>

        <Button
          onClick={() => setIsModalOpen(true)}
          className="self-start sm:self-center flex items-center gap-1.5"
        >
          <Plus className="h-4.5 w-4.5" />
          Add New Product
        </Button>
      </div>

      {/* Filter and Search controls */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by product name or SKU..."
            className="flex h-10 w-full rounded-lg border border-slate-300 bg-white pl-9 pr-3 py-2 text-sm text-slate-800 transition-colors focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-slate-400 hidden sm:block" />
          <select
            value={category}
            onChange={(e) => {
              setCategory(e.target.value);
              setPage(1);
            }}
            className="flex h-10 w-full sm:w-48 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 transition-colors focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
          >
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat === "all" ? "All Categories" : cat}
              </option>
            ))}
          </select>
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      ) : isError ? (
        <div className="text-center p-8 bg-white border border-slate-200 rounded-xl">
          <p className="text-sm font-semibold text-slate-700">Error loading product data</p>
          <Button variant="outline" size="sm" onClick={() => refetch()} className="mt-3">
            Retry
          </Button>
        </div>
      ) : !data || data.data.length === 0 ? (
        <div className="p-12 text-center border border-slate-200 border-dashed rounded-xl bg-white space-y-3">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-50 text-slate-400">
            <ShoppingBag className="h-6 w-6" />
          </div>
          <div className="max-w-md mx-auto">
            <h3 className="text-sm font-bold text-slate-700">No Products Registered</h3>
            <p className="text-xs text-slate-400 mt-1">
              Your store does not have any products registered under this search category. Click "Add New Product" to start building your catalogue.
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>SKU Code</TableHead>
                <TableHead>Product Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead className="text-right">Cost Price</TableHead>
                <TableHead className="text-right">Retail Price</TableHead>
                <TableHead className="text-right">Markup</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.data.map((product) => {
                const markup = product.cost > 0 ? ((product.price - product.cost) / product.cost) * 100 : 0;
                return (
                  <TableRow key={product.id}>
                    <TableCell className="font-mono font-bold text-slate-500 uppercase tracking-wide text-xs">
                      {product.sku}
                    </TableCell>
                    <TableCell className="font-bold text-slate-800">
                      {product.name}
                    </TableCell>
                    <TableCell>
                      <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                        {product.category}
                      </span>
                    </TableCell>
                    <TableCell className="text-right font-mono font-medium text-slate-600">
                      {formatMYR(product.cost)}
                    </TableCell>
                    <TableCell className="text-right font-mono font-bold text-slate-800">
                      {formatMYR(product.price)}
                    </TableCell>
                    <TableCell className="text-right font-mono text-xs text-emerald-600 font-bold">
                      +{markup.toFixed(1)}%
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between pt-4 border-t border-slate-200/80">
              <span className="text-xs font-medium text-slate-400">
                Page {page} of {totalPages} ({data.total} products)
              </span>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page === 1}
                  onClick={() => setPage((p) => p - 1)}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page === totalPages}
                  onClick={() => setPage((p) => p + 1)}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Create Product Modal Overlay */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add New Product to Store Catalog"
      >
        <ProductForm
          onSubmit={handleCreateProduct}
          onCancel={() => setIsModalOpen(false)}
          isSubmitting={createMutation.isPending}
        />
      </Modal>
    </div>
  );
};
export default Products;
