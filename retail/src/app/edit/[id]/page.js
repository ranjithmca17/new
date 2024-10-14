'use client';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import UploadArea from '@/app/Assets/upload_area.svg';
import Image from 'next/image';

export default function App({ params }) {
  const [image, setImage] = useState(null);
  const [productDetails, setProductDetails] = useState({
    name: '',
    category: '',
    price: '',
    stock: '',
    ventorId: '',
    godown: 'covai',
    sku: '',
    gst: '',
    description: '',
    image: '' // Added to store the existing image URL
  });

  const changeHandler = (e) => {
    const { name, value } = e.target;
    setProductDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  const imageHandler = (e) => {
    setImage(e.target.files[0]);
  };

  const fetchSingleProduct = async () => {
    try {
      const response = await axios.get(`http://localhost:4000/getsingleproduct/${params.id}`);
      const product = response.data.findProduct;
      
      setProductDetails({
        name: product.name,
        category: product.category,
        price: product.price,
        stock: product.stock,
        ventorId: product.ventorId,
        godown: product.godown,
        sku: product.sku,
        gst: product.gst,
        description: product.description,
        image: product.image, // Set the existing image URL
      });
      setImage(null); // Reset image state to avoid confusion
    } catch (error) {
      console.error("Error fetching product:", error);
    }
  };

  const updateProduct = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      if (image) {
        formData.append('product', image);
      }

      const product = {
        ...productDetails,
        image: image ? null : productDetails.image, // Keep existing image if no new image is uploaded
      };

      // Upload image if a new image is selected
      let imageResponse;
      if (image) {
        imageResponse = await axios.post('http://localhost:4000/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        if (imageResponse.data.success) {
          product.image = imageResponse.data.image_url;
        } else {
          alert(`Failed to upload image: ${imageResponse.data.message || 'Unknown error'}`);
          return;
        }
      } else {
        product.image = productDetails.image; // Keep existing image if no new upload
      }

      const productResponse = await axios.put(`http://localhost:4000/allproduct/${params.id}`, product, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (productResponse.data.success) {
        alert(`Product updated successfully.`);
        fetchSingleProduct(); // Refresh the product details
        setImage(null); // Clear image preview
      } else {
        alert(`Failed to update product: ${productResponse.data.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error occurred during product update:', error.response ? error.response.data : error.message);
      alert(error.response.data.message);
    }
  };

  useEffect(() => {
    fetchSingleProduct();
  }, []);

  return (
    <div className="add-product">
      <form onSubmit={updateProduct}>
        <div className="addproduct-itemfield">
          <p>Product Title</p>
          <input
            value={productDetails.name}
            onChange={changeHandler}
            type="text"
            name="name"
            placeholder="Type here"
            required
          />
        </div>

        <div className="addproduct-itemfield">
          <p>Product Category</p>
          <input
            value={productDetails.category}
            onChange={changeHandler}
            type="text"
            name="category"
            placeholder="Type here"
            required
          />
        </div>

        <div className="addproduct-itemfield">
          <p>Product Price</p>
          <input
            value={productDetails.price}
            onChange={changeHandler}
            type="number"
            name="price"
            placeholder="Type here"
            required
          />
        </div>

        <div className="addproduct-itemfield">
          <p>Product SKU</p>
          <input
            value={productDetails.sku}
            onChange={changeHandler}
            type="text"
            name="sku"
            placeholder="Type here"
            required
          />
        </div>

        <div className="addproduct-itemfield">
          <p>Product Description</p>
          <textarea
            name="description"
            value={productDetails.description}
            onChange={changeHandler}
            placeholder="Enter Description"
            required
          />
        </div>

        <div className="addproduct-itemfield">
          <p>Product Stock</p>
          <input
            value={productDetails.stock}
            onChange={changeHandler}
            type="number"
            name="stock"
            placeholder="Type here"
            required
          />
        </div>

        <div className="addproduct-itemfield">
          <p>Ventor Id:</p>
          <input
            value={productDetails.ventorId}
            onChange={changeHandler}
            type="number"
            name="ventorId"
            placeholder="Type here"
            required
          />
        </div>

        <div className="addproduct-itemfield">
          <p>Select Product Added Godown</p>
          <select name="godown" value={productDetails.godown} onChange={changeHandler}>
            <option value="covai">Covai</option>
            <option value="ooty">Ooty</option>
            <option value="kerala">Kerala</option>
            <option value="chennai">Chennai</option>
            <option value="bangalore">Bangalore</option>
          </select>
        </div>

        <div className="addproduct-itemfield">
          <p>Product GST (%)</p>
          <input
            value={productDetails.gst}
            onChange={changeHandler}
            type="number"
            name="gst"
            placeholder="Enter GST"
            required
          />
        </div>

        <div className="addproduct-itemfield">
          <label htmlFor="file-input">
            <Image
              src={image ? URL.createObjectURL(image) : productDetails.image || UploadArea}
              alt="Upload Area"
              className="addproduct-thumbnail-image"
              height={150}
              width={150}
            />
          </label>
          <input
            type="file"
            onChange={imageHandler}
            name="image"
            id="file-input"
            hidden
          />
        </div>

        <button className="addproduct-btn" type="submit">
          Update Product
        </button>
      </form>
    </div>
  );
}









