"use client"

import { useState } from 'react';
import styles from '../../../../ui/dashboard/products/addProduct/addProduct.module.css';
import useAxiosPrivate from '@/src/hooks/useAxiosPrivate';
import { useRouter } from 'next/navigation';

const AddProductPage = () => {
  const [pickedImage, setPickedImage] = useState("");
  const axiosPrivate = useAxiosPrivate();
  const navigation = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const data = {
      furniture: formData.get("furniture"),
      f_collection: formData.get("collection"),
      title: formData.get("title"),
      price: formData.get("price"),
      description: formData.get("description"),
      image: pickedImage,
    }

    try {
      const response = await axiosPrivate.post("/api/product/", JSON.stringify(data));

      if(response.status === 201) {
        navigation.push("/dashboard/products");
      }

    } catch (error) {
      console.log(error);
    }
  };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    const fileReader = new FileReader();

    if (!file) {
      setPickedImage(null);
      return;
    }

    fileReader.onload = () => {
      if (fileReader.result instanceof ArrayBuffer) {
        setPickedImage(null);
      } else if (typeof fileReader.result === "string") {
        setPickedImage(fileReader.result);
      }
    };

    fileReader.readAsDataURL(file);
  };    

  return (
    <div className={styles.container}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <select required name="furniture" id="furniture" defaultValue="general1">
          <option value="general1" disabled>Choose a Furniture</option>
          <option value="sofa">Sofa</option>
          <option value="chair">Chair</option>
          <option value="bed">Bed</option>
          <option value="cushion">Cushion</option>
          <option value="rug">Rug</option>
        </select>
        <select required name="collection" id="collection" defaultValue="general2">
          <option value="general2" disabled>Choose a Collection</option>
          <option value="living room">Living Room</option>
          <option value="laundary room">Laundary Room</option>
          <option value="bedroom">Bedroom</option>
          <option value="library">Library</option>
          <option value="kitchen">Kitchen</option>
          <option value="family room">Family Room</option>
          <option value="guest room">Guest Room</option>
          <option value="office">Office</option>
        </select>
        <input type="text" placeholder="Title" name="title" required />
        <input type="number" placeholder="Price" name="price" required />
        <input 
          accept='image/svg, image/png, image/jpeg' 
          onChange={handleFileChange} 
          style={{ width: '100%' }} 
          placeholder="Image" 
          name="image" 
          type="file" 
          required 
        />
        <textarea
          required
          name="description"
          id="description"
          rows="16"
          placeholder="Description"
        ></textarea>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default AddProductPage;