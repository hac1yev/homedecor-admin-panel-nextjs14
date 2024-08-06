"use client";

import Search from "../search/search";
import Link from "next/link";
import styles from '../../../ui/dashboard/products/products.module.css';
import Pagination from "../pagination/pagination";
import Image from "next/image";
import customLoader from "@/src/ui/custom-loader";
import { useEffect, useState } from "react";
import useAxiosPrivate from "@/src/hooks/useAxiosPrivate";

const ProductsComponent = ({ q, page }) => { 
  const [products,setProducts] = useState([]); 
  const [count,setCount] = useState(0); 
  const axiosPrivate = useAxiosPrivate();

  useEffect(() => {
    (async function() {
      try {
        const response = await axiosPrivate.get(`/api/product`, {
          params: {q,page}
        });

        setProducts(response.data.products);
        setCount(response.data.count);
        
      } catch (error) {
        console.log(error);
      }
    })()
  }, [axiosPrivate, page, q]);

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
                <td>{product.description.slice(0,10)}</td>
                <td>{product.price}</td>
                <td>{product.createdAt.toString().slice(0, 10)}</td>
                <td>{product.views}</td>
                <td style={{ display: 'flex' }}>
                    <form>
                      <input type="hidden" name="id" value={product.id} />
                      <button className={`${styles.button} ${styles.delete}`}>
                        Delete
                      </button>
                    </form>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
      <Pagination count={count} />
    </div>
  );
};

export default ProductsComponent;