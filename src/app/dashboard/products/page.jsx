import ProductsComponent from "@/src/ui/dashboard/products/ProductsComponent";

const Products = ({ searchParams }) => {
  const q = searchParams?.q || "";
  const page = searchParams?.page || 1;

  return (
    <ProductsComponent q={q} page={page} />
  );
};

export default Products;