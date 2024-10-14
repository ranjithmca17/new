'use client';

import { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";

const AppContext = createContext('Hello');

export function AppWrapper({ children }) {
   
    const [products, setProducts] = useState([]);
    const [cartItems, setCartItems] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [getAllOrders, setGetAllOrders] = useState('');
    // const [cartItems, setCartItems] = useState([]);


    // Fetch all products
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get('http://localhost:4000/allproducts');
                setProducts(response.data);
            } catch (error) {
                console.error('Error fetching products:', error.message);
            }
        };
        fetchProducts();
    }, []);

    // Filter products based on search term
    useEffect(() => {
        const filtered = searchTerm
            ? products.filter(product =>
                product.name.toLowerCase().includes(searchTerm.toLowerCase())
            )
            : products;
        setFilteredProducts(filtered);
    }, [searchTerm, products]);

    // Fetch cart items
    const fetchCartItems = async () => {
        try {
            const response = await axios.get('http://localhost:4000/getall/Cartproducts');
            setCartItems(response.data);
        } catch (error) {
            console.error('Error fetching cart items:', error.message);
        }
    };

    // Update cart items on component mount
    useEffect(() => {
        fetchCartItems();
    }, []);

    // Fetch all order details
    const getAllOrderDetails = async () => {
        try {
            const response = await axios.get('http://localhost:4000/fetch/graph');
            setGetAllOrders(response.data);
        } catch (error) {
            console.error("Fetching orders error:", error);
        }
    };

    useEffect(() => {
        getAllOrderDetails();
    }, []);

  

    // Handle search input change
    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    // Add product to the bill
    const billCart = async (productId, productName, productPrice, category, gst, reorderPoint, sku) => {
        try {
            const response = await axios.post('http://localhost:4000/addtobill', {
                productId,
                productName,
                productPrice,
                category,
                gst,
                reorderPoint,
                sku
            });
            console.log('Add to bill response:', response.data);
            fetchCartItems(); // Refresh cart items after adding
        } catch (error) {
            console.error('Error adding to bill:', error.message);
        }
    };
    

    return (
        <AppContext.Provider value={{
           
            products,
            setFilteredProducts,
            filteredProducts,
            searchTerm,
            handleSearchChange,
            billCart,
            cartItems,
            setCartItems,
            getAllOrders,
          
        }}>
            {children}
        </AppContext.Provider>
    );
}

export function useAppContext() {
    return useContext(AppContext);
}
