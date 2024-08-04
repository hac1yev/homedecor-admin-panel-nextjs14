import { getProducts } from "@/src/lib/data";
import ProductsComponent from "@/src/ui/dashboard/products/ProductsComponent";

const Products = async ({ searchParams }) => {
  const q = searchParams?.q || "";
  const page = searchParams?.page || 1;

  const { products, count } = await getProducts(q, page);

  return (
    <ProductsComponent products={products} count={count} />
  );
};

export default Products;