"use client";

import customLoader from "@/src/ui/custom-loader";
import styles from "../../../../ui/dashboard/products/singleProduct/singleProduct.module.css";
import Image from "next/image";
import { useEffect, useState } from "react";
import useAxiosPrivate from "@/src/hooks/useAxiosPrivate";

const SingleProductPage = ({ params }) => {
  const { id } = params;
  const axiosPrivate = useAxiosPrivate();
  const [product,setProduct] = useState();

  useEffect(() => {
    (async function() {
      try {
        const response = await axiosPrivate.get(`/api/product/${id}`);
        setProduct(response.data.product);
      } catch (error) {
        console.log(error);   
      }
    })()
  }, [id,axiosPrivate]);

  if(!product) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '40px 0' }}>
        Loading...
      </div>
    )
  }

  return (
    <div className={styles.container}>
      <div className={styles.infoContainer}>
        <div className={styles.imgContainer}>
          <Image
            loader={customLoader}
            src={product.image || "/noavatar.png"}
            priority
            alt={product.title}
            fill
          />
        </div>
        {product.title}
      </div>
      <div className={styles.formContainer}>
        <form className={styles.form}>
          <select
            required
            name="furniture"
            id="furniture"
            defaultValue={product.furniture}
          >
            <option value="general1" disabled>
              Choose a Furniture
            </option>
            <option value="sofas">Sofa</option>
            <option value="chairs">Chair</option>
            <option value="beds">Bed</option>
            <option value="cushions">Cushion</option>
            <option value="rugs">Rug</option>
          </select>
          <select
            required
            name="collection"
            id="collection"
            defaultValue={product.f_collection}
          >
            <option value="general2" disabled>
              Choose a Collection
            </option>
            <option value="living room">Living Room</option>
            <option value="laundary room">Laundary Room</option>
            <option value="bedroom">Bedroom</option>
            <option value="library">Library</option>
            <option value="kitchen">Kitchen</option>
            <option value="family room">Family Room</option>
            <option value="guest room">Guest Room</option>
            <option value="office">Office</option>
          </select>
          <input type="text" placeholder="Title" value={product.title} name="title" required />
          <input type="number" placeholder="Price" value={product.price} name="price" required />
          <textarea
            required
            name="description"
            id="description"
            rows="16"
            placeholder="Description"
            value={product.description}
          ></textarea>
        </form>
      </div>
    </div>
  );
};

export default SingleProductPage;
