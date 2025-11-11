import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import axios from '../config/axios';
import { CartContext } from '../context/CartContext';
import Swal from 'sweetalert2';

const ProductDetails = () => {
  const { id } = useParams();
  const { addToCart } = useContext(CartContext);
  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [showDescription, setShowDescription] = useState(false);
  const [showSizeChart, setShowSizeChart] = useState(false);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      await fetchProduct();
      await fetchRelatedProducts();
    };
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/products?id=${id}`);
      const productData = response.data;
      
      // Ensure images array exists
      if (!productData.images || productData.images.length === 0) {
        productData.images = ['data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjIwMCIgaGVpZ2h0PSIyMDAiIGZpbGw9IiMzMzMzMzMiLz48dGV4dCB4PSIxMDAiIHk9IjEwMCIgZmlsbD0id2hpdGUiIGZvbnQtc2l6ZT0iMTQiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGRvbWluYW50LWJhc2VsaW5lPSJtaWRkbGUiPlNVUEVSSU9SPC90ZXh0Pjwvc3ZnPg=='];
      }
      
      setProduct(productData);
      
      if (productData.colors && productData.colors.length > 0) {
        setSelectedColor(productData.colors[0]);
      }
      if (productData.sizes && productData.sizes.length > 0) {
        setSelectedSize(productData.sizes[0]);
      }
    } catch (error) {
      console.error('Error fetching product:', error);
      Swal.fire({
        title: 'Error',
        text: 'Failed to load product. Please try again.',
        icon: 'error',
        confirmButtonText: 'OK',
        background: '#1f1f1f',
        color: '#ffffff'
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchRelatedProducts = async () => {
    try {
      const response = await axios.get('/api/products');
      const filtered = response.data.filter(p => p._id !== id).slice(0, 4);
      setRelatedProducts(filtered);
    } catch (error) {
      console.error('Error fetching related products:', error);
      // Set empty array if fails
      setRelatedProducts([]);
    }
  };

  const handleAddToCart = () => {
    if (!selectedColor || !selectedSize) {
      Swal.fire({
        title: 'Missing Selection',
        text: 'Please select color and size',
        icon: 'warning',
        confirmButtonText: 'OK',
        background: '#1f1f1f',
        color: '#ffffff'
      });
      return;
    }

    addToCart(product, selectedColor, selectedSize, quantity);
    Swal.fire({
      title: 'Added to Cart!',
      text: 'Product has been added to your cart',
      icon: 'success',
      confirmButtonText: 'OK',
      background: '#1f1f1f',
      color: '#ffffff'
    });
  };

  const handleBuyNow = () => {
    if (!selectedColor || !selectedSize) {
      Swal.fire({
        title: 'Missing Selection',
        text: 'Please select color and size',
        icon: 'warning',
        confirmButtonText: 'OK',
        background: '#1f1f1f',
        color: '#ffffff'
      });
      return;
    }

    addToCart(product, selectedColor, selectedSize, quantity);
    window.location.href = '/checkout';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-xl">Product not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Product Details */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Images */}
          <div>
            <div className="mb-4">
              <img
                src={product.images?.[selectedImage] || product.images?.[0] || ''}
                alt={product.name}
                className="w-full h-96 object-cover rounded-lg"
              />
            </div>
            <div className="flex space-x-2">
              {product.images?.map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt={`${product.name} ${index + 1}`}
                  className={`w-20 h-20 object-cover rounded cursor-pointer border-2 ${
                    selectedImage === index ? 'border-white' : 'border-gray-600'
                  }`}
                  onClick={() => setSelectedImage(index)}
                />
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div>
            <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
            <p className="text-2xl font-bold mb-6">{product.price} EGP</p>

            {/* Color Selection */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Color</label>
              <select
                value={selectedColor}
                onChange={(e) => setSelectedColor(e.target.value)}
                className="w-full bg-gray-900 text-white px-3 py-2 rounded border border-gray-700 focus:outline-none focus:border-white"
              >
                {product.colors?.map(color => (
                  <option key={color} value={color}>{color}</option>
                ))}
              </select>
            </div>

            {/* Size Selection */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Size</label>
              <select
                value={selectedSize}
                onChange={(e) => setSelectedSize(e.target.value)}
                className="w-full bg-gray-900 text-white px-3 py-2 rounded border border-gray-700 focus:outline-none focus:border-white"
              >
                {product.sizes?.map(size => (
                  <option key={size} value={size}>{size}</option>
                ))}
              </select>
            </div>

            {/* Quantity */}
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">Quantity</label>
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="bg-gray-800 text-white px-3 py-1 rounded hover:bg-gray-700"
                >
                  -
                </button>
                <span className="px-4 py-1 bg-gray-900 rounded">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="bg-gray-800 text-white px-3 py-1 rounded hover:bg-gray-700"
                >
                  +
                </button>
              </div>
            </div>

            {/* Buttons */}
            <div className="space-y-3 mb-6">
              {product.soldOut ? (
                <button
                  disabled
                  className="w-full bg-gray-600 text-white py-3 rounded font-medium cursor-not-allowed"
                >
                  SOLD OUT
                </button>
              ) : (
                <>
                  <button
                    onClick={handleAddToCart}
                    className="w-full bg-white text-black py-3 rounded font-medium hover:bg-gray-200 transition-colors"
                  >
                    ADD TO CART
                  </button>
                  <button
                    onClick={handleBuyNow}
                    className="w-full bg-gray-800 text-white py-3 rounded font-medium hover:bg-gray-700 transition-colors"
                  >
                    BUY NOW
                  </button>
                </>
              )}
            </div>

            {/* Description Dropdown */}
            <div className="mb-4">
              <button
                onClick={() => setShowDescription(!showDescription)}
                className="w-full text-left bg-gray-900 px-4 py-3 rounded flex justify-between items-center"
              >
                <span>Description</span>
                <span>{showDescription ? '−' : '+'}</span>
              </button>
              {showDescription && (
                <div className="bg-gray-800 px-4 py-3 rounded-b">
                  <p>{product.description}</p>
                </div>
              )}
            </div>

            {/* Size Chart Dropdown */}
            <div className="mb-4">
              <button
                onClick={() => setShowSizeChart(!showSizeChart)}
                className="w-full text-left bg-gray-900 px-4 py-3 rounded flex justify-between items-center"
              >
                <span>Size Chart</span>
                <span>{showSizeChart ? '−' : '+'}</span>
              </button>
              {showSizeChart && (
                <div className="bg-gray-800 px-4 py-3 rounded-b">
                  <img
                    src={product.category === 'T-SHIRTS' ? '/size-chart.jpg' : product.category === 'PANTS' ? '/size-chart-pants.jpg' : '/size-chart.jpg'}
                    alt="Size Chart"
                    className="w-full max-w-md mx-auto"
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold mb-6">Related Products</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {relatedProducts.map(product => (
                <a key={product._id} href={`/product/${product._id}`} className="bg-black rounded-lg overflow-hidden hover:bg-gray-900 transition-colors block">
                  <img
                    src={product.images?.[0] || ''}
                    alt={product.name}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4">
                    <h3 className="text-white font-medium text-sm mb-2">{product.name}</h3>
                    <p className="text-white font-bold">{product.price} EGP</p>
                  </div>
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetails;