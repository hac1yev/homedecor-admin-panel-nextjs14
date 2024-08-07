"use client";

import Search from "../search/search";
import Link from "next/link";
import styles from "../../../ui/dashboard/products/products.module.css";
import Pagination from "../pagination/pagination";
import Image from "next/image";
import customLoader from "@/src/ui/custom-loader";
import { useEffect, useState } from "react";
import useAxiosPrivate from "@/src/hooks/useAxiosPrivate";

const ProductsComponent = ({ q, page }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [count, setCount] = useState(0);
  const axiosPrivate = useAxiosPrivate();

  useEffect(() => {
    (async function () {
      setIsLoading(true);
      try {
        const response = await axiosPrivate.get(`/api/product`, {
          params: { q, page },
        });

        setProducts(response.data.products);
        setCount(response.data.count);
      } catch (error) {
        console.log(error);
      }
      setIsLoading(false);
    })();
  }, [axiosPrivate, page, q]);

  const handleDelete = async (id) => {
    try {
      await axiosPrivate.delete(`/api/product?id=${id}`);

      const filteredProducts = products.filter((product) => product._id !== id);

      setProducts(filteredProducts);
      
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.top}>
        <Search placeholder="Search for a user..." />
        <Link href="/dashboard/products/add">
          <button className={styles.addButton}>Add New</button>
        </Link>
      </div>
      <table className={styles.table}>
        <thead>
          <tr>
            <td>
              <b>Title</b>
            </td>
            <td>
              <b>Description</b>
            </td>
            <td>
              <b>Price</b>
            </td>
            <td>
              <b>Created at</b>
            </td>
            <td>
              <b>Views</b>
            </td>
            <td>
              <b>Action</b>
            </td>
          </tr>
        </thead>
        {!isLoading && (
          <tbody>
            {products.map((product) => (
              <tr key={product._id}>
                <td>
                  <div className={styles.product}>
                    <Image
                      className={styles.productImage}
                      src={product.image || "/noproduct.jpg"}
                      loader={customLoader}
                      priority
                      alt=""
                      width={40}
                      height={40}
                    />
                    {product.title}
                  </div>
                </td>
                <td>{product.description.slice(0, 10)}</td>
                <td>{product.price}</td>
                <td>{product.createdAt.toString().slice(0, 10)}</td>
                <td>{product.views}</td>
                <td style={{ display: "flex" }}>
                  <button 
                    className={`${styles.button} ${styles.delete}`}
                    onClick={() => handleDelete(product._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        )}
      </table>
      {isLoading && (
        <div className="flex-center" style={{ margin: "20px 0" }}>
          Loading...
        </div>
      )}
      {!isLoading && products.length === 0 && (
        <div className="flex-center" style={{ margin: "20px 0" }}>
          There is no product!
        </div>
      )}
      <Pagination count={count} />
    </div>
  );
};

export default ProductsComponent;
