'use client'
import React, { useEffect, useState } from 'react';
import axios from 'axios';
// import Image from 'next/image';

const LowStockProducts = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchLowStockProducts = async () => {
            try {
                const response = await axios.get('http://localhost:4000/topfive/lowstock/products');
                if (response.data.success) {
                    setProducts(response.data.products);
                } else {
                    setError(response.data.message);
                }
            } catch (error) {
                setError('Fetch error: ' + error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchLowStockProducts();
    }, []);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div>
            <h1>Top 5 Low Stock Products</h1>
            <table border={2}>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Image</th>
                        <th>Price</th>
                        <th>Stock</th>
                    </tr>
                </thead>
                <tbody>
                    {products.map(product => (
                        <tr key={product._id}>
                            <td>{product.name}</td>
                            <td>
                                <img
                                    src={product.image}
                                    alt={product.name}
                                   height={50}
                                   width={50}
                                />

                            </td>
                            <td>${product.price}</td>
                            <td>{product.stock}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};



export default LowStockProducts;

