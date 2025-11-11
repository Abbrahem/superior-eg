import React, { useState, useEffect } from 'react';
import axios from '../config/axios';
import ProductCard from '../components/ProductCard';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredProducts(products);
    } else {
      const filtered = products.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredProducts(filtered);
    }
  }, [searchQuery, products]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/products');
      setProducts(response.data);
      setFilteredProducts(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching products:', error);
      
      // Show user-friendly error message
      if (error.code === 'ECONNABORTED') {
        console.warn('Request timeout - Server might be slow or not running');
      } else if (error.code === 'ERR_NETWORK') {
        console.warn('Network error - Cannot connect to server');
      }
      
      // Dummy products for display when server is unavailable
      const dummyProducts = [
        {
          _id: '1',
          name: 'SUPERIOR Black Hoodie',
          price: 899,
          images: ['data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjIwMCIgaGVpZ2h0PSIyMDAiIGZpbGw9IiMxMTExMTEiLz48dGV4dCB4PSIxMDAiIHk9IjEwMCIgZmlsbD0id2hpdGUiIGZvbnQtc2l6ZT0iMTQiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGRvbWluYW50LWJhc2VsaW5lPSJtaWRkbGUiPkJsYWNrIEhvb2RpZTwvdGV4dD48L3N2Zz4='],
          category: 'HOODIES',
          colors: ['Black', 'White'],
          sizes: ['S', 'M', 'L', 'XL'],
          soldOut: false
        },
        {
          _id: '2',
          name: 'SUPERIOR White T-Shirt',
          price: 499,
          images: ['data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjIwMCIgaGVpZ2h0PSIyMDAiIGZpbGw9IiNGRkZGRkYiLz48dGV4dCB4PSIxMDAiIHk9IjEwMCIgZmlsbD0iYmxhY2siIGZvbnQtc2l6ZT0iMTQiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGRvbWluYW50LWJhc2VsaW5lPSJtaWRkbGUiPldoaXRlIFQtU2hpcnQ8L3RleHQ+PC9zdmc+'],
          category: 'T-SHIRTS',
          colors: ['White', 'Black', 'Gray'],
          sizes: ['XS', 'S', 'M', 'L', 'XL'],
          soldOut: false
        },
        {
          _id: '3',
          name: 'SUPERIOR Pink Hoodie',
          price: 949,
          images: ['data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjIwMCIgaGVpZ2h0PSIyMDAiIGZpbGw9IiNGRjY5QjQiLz48dGV4dCB4PSIxMDAiIHk9IjEwMCIgZmlsbD0id2hpdGUiIGZvbnQtc2l6ZT0iMTQiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGRvbWluYW50LWJhc2VsaW5lPSJtaWRkbGUiPlBpbmsgSG9vZGllPC90ZXh0Pjwvc3ZnPg=='],
          category: 'HOODIES',
          colors: ['Pink', 'Rose', 'White'],
          sizes: ['S', 'M', 'L', 'XL', 'XXL'],
          soldOut: false
        },
        {
          _id: '4',
          name: 'SUPERIOR Beige Hoodie',
          price: 899,
          images: ['data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjIwMCIgaGVpZ2h0PSIyMDAiIGZpbGw9IiNGNUY1REMiLz48dGV4dCB4PSIxMDAiIHk9IjEwMCIgZmlsbD0iYmxhY2siIGZvbnQtc2l6ZT0iMTQiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGRvbWluYW50LWJhc2VsaW5lPSJtaWRkbGUiPkJlaWdlIEhvb2RpZTwvdGV4dD48L3N2Zz4='],
          category: 'HOODIES',
          colors: ['Beige', 'Stone', 'White'],
          sizes: ['S', 'M', 'L', 'XL'],
          soldOut: false
        },
        {
          _id: '5',
          name: 'SUPERIOR Gray T-Shirt',
          price: 549,
          images: ['data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjIwMCIgaGVpZ2h0PSIyMDAiIGZpbGw9IiM4ODg4ODgiLz48dGV4dCB4PSIxMDAiIHk9IjEwMCIgZmlsbD0id2hpdGUiIGZvbnQtc2l6ZT0iMTQiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGRvbWluYW50LWJhc2VsaW5lPSJtaWRkbGUiPkdyYXkgVC1TaGlydDwvdGV4dD48L3N2Zz4='],
          category: 'T-SHIRTS',
          colors: ['Gray', 'Black', 'White'],
          sizes: ['S', 'M', 'L', 'XL'],
          soldOut: false
        }
      ];
      
      setProducts(dummyProducts);
      setFilteredProducts(dummyProducts);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Search Bar */}
        <div className="mb-8">
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full max-w-md mx-auto block bg-gray-900 text-white px-4 py-3 rounded-lg border border-gray-700 focus:outline-none focus:border-white transition-colors"
          />
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {filteredProducts.map(product => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center text-gray-400 mt-12">
            <p className="text-xl">No products found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;