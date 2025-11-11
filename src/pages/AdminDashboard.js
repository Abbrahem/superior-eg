import React, { useState, useEffect } from 'react';
import axios from '../config/axios';
import Swal from 'sweetalert2';

const AdminDashboard = () => {
  const [activeSection, setActiveSection] = useState('add-product');
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [promoCodes, setPromoCodes] = useState([]);

  // Add Product Form
  const [productForm, setProductForm] = useState({
    name: '',
    price: '',
    description: '',
    category: 'T-SHIRTS',
    colors: [],
    sizes: [],
    images: []
  });

  // Promo Code Form
  const [promoForm, setPromoForm] = useState({
    code: '',
    discount: '10',
    validDays: '1',
    maxUses: ''
  });

  const [editingProduct, setEditingProduct] = useState(null);
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    activePromoCodes: 0
  });

  const colors = ['White', 'Black', 'Pink', 'Rose', 'Baby-Blue', 'Beige', 'Stone', 'Gray'];
  const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
  const discountOptions = ['10', '15', '20', '30', '40', '50', '60', '70'];
  const validDaysOptions = ['1', '2', '3', '4', '5'];

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      window.location.href = '/admin/login';
      return;
    }

    fetchStats();

    // نجيب المنتجات دايماً عشان نستخدمها في الـ orders
    fetchProducts();

    if (activeSection === 'orders') {
      fetchOrders();
    } else if (activeSection === 'promocodes') {
      fetchPromoCodes();
    }
  }, [activeSection]);

  const fetchProducts = async () => {
    try {
      const response = await axios.get('/api/products');
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const fetchOrders = async () => {
    try {
      const response = await axios.get('/api/admin/orders');
      // الـ response بيرجع object فيه orders array
      setOrders(response.data.orders || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
      setOrders([]);
    }
  };

  const fetchPromoCodes = async () => {
    try {
      const response = await axios.get('/api/promocodes');
      setPromoCodes(response.data);
    } catch (error) {
      console.error('Error fetching promo codes:', error);
    }
  };

  const fetchStats = async () => {
    try {
      const [productsRes, ordersRes, promoCodesRes] = await Promise.all([
        axios.get('/api/products'),
        axios.get('/api/admin/orders'),
        axios.get('/api/promocodes')
      ]);

      const orders = Array.isArray(ordersRes.data) ? ordersRes.data : (ordersRes.data.orders || []);
      const totalRevenue = orders.reduce((sum, order) => sum + (order.total || 0), 0);
      const activePromoCodes = Array.isArray(promoCodesRes.data) ? promoCodesRes.data.filter(promo => promo.isActive).length : 0;

      setStats({
        totalProducts: productsRes.data.length || 0,
        totalOrders: orders.length || 0,
        totalRevenue: totalRevenue,
        activePromoCodes: activePromoCodes
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
      setStats({
        totalProducts: 0,
        totalOrders: 0,
        totalRevenue: 0,
        activePromoCodes: 0
      });
    }
  };

  const handleProductFormChange = (e) => {
    const { name, value } = e.target;
    setProductForm({
      ...productForm,
      [name]: value
    });
  };

  const handleColorChange = (color) => {
    const updatedColors = productForm.colors.includes(color)
      ? productForm.colors.filter(c => c !== color)
      : [...productForm.colors, color];

    setProductForm({
      ...productForm,
      colors: updatedColors
    });
  };

  const handleSizeChange = (size) => {
    const updatedSizes = productForm.sizes.includes(size)
      ? productForm.sizes.filter(s => s !== size)
      : [...productForm.sizes, size];

    setProductForm({
      ...productForm,
      sizes: updatedSizes
    });
  };

  const compressImage = (file, quality = 0.7) => {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

      img.onload = () => {
        // تحديد الحد الأقصى للأبعاد
        const maxWidth = 800;
        const maxHeight = 800;

        let { width, height } = img;

        // حساب الأبعاد الجديدة مع الحفاظ على النسبة
        if (width > height) {
          if (width > maxWidth) {
            height = (height * maxWidth) / width;
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = (width * maxHeight) / height;
            height = maxHeight;
          }
        }

        canvas.width = width;
        canvas.height = height;

        // رسم الصورة المضغوطة
        ctx.drawImage(img, 0, 0, width, height);

        // تحويل لـ base64 مع ضغط
        const compressedBase64 = canvas.toDataURL('image/jpeg', quality);
        resolve(compressedBase64);
      };

      img.src = URL.createObjectURL(file);
    });
  };

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    const compressedImages = [];

    for (const file of files) {
      try {
        const compressedImage = await compressImage(file, 0.8);
        compressedImages.push(compressedImage);
      } catch (error) {
        console.error('Error compressing image:', error);
      }
    }

    setProductForm({
      ...productForm,
      images: compressedImages
    });
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();

    if (productForm.colors.length === 0 || productForm.sizes.length === 0) {
      Swal.fire({
        title: 'Missing Selection',
        text: 'Please select at least one color and size',
        icon: 'warning',
        background: '#1f1f1f',
        color: '#ffffff'
      });
      return;
    }

    const productData = {
      name: productForm.name,
      price: productForm.price,
      description: productForm.description,
      category: productForm.category,
      colors: productForm.colors,
      sizes: productForm.sizes,
      images: productForm.images // الصور محولة لـ base64 بالفعل
    };

    try {
      await axios.post('/api/admin/products', productData, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      Swal.fire({
        title: 'Product Added!',
        text: 'Product has been added successfully',
        icon: 'success',
        background: '#1f1f1f',
        color: '#ffffff'
      });

      // Reset form
      setProductForm({
        name: '',
        price: '',
        description: '',
        category: 'T-SHIRTS',
        colors: [],
        sizes: [],
        images: []
      });

    } catch (error) {
      Swal.fire({
        title: 'Error',
        text: 'Failed to add product',
        icon: 'error',
        background: '#1f1f1f',
        color: '#ffffff'
      });
    }
  };

  const handleDeleteProduct = async (productId) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'This will permanently delete the product',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      background: '#1f1f1f',
      color: '#ffffff'
    });

    if (result.isConfirmed) {
      try {
        await axios.delete(`/api/admin/products/${productId}`);
        fetchProducts();
        Swal.fire({
          title: 'Deleted!',
          text: 'Product has been deleted',
          icon: 'success',
          background: '#1f1f1f',
          color: '#ffffff'
        });
      } catch (error) {
        Swal.fire({
          title: 'Error',
          text: 'Failed to delete product',
          icon: 'error',
          background: '#1f1f1f',
          color: '#ffffff'
        });
      }
    }
  };

  const handleToggleSoldOut = async (productId) => {
    try {
      await axios.patch(`/api/admin/products/${productId}/toggle-sold-out`);
      fetchProducts();
    } catch (error) {
      console.error('Error toggling sold out status:', error);
    }
  };

  const handleCreatePromoCode = async (e) => {
    e.preventDefault();

    try {
      await axios.post('/api/promocodes', promoForm);

      Swal.fire({
        title: 'Promo Code Created!',
        text: 'Promo code has been created successfully',
        icon: 'success',
        background: '#1f1f1f',
        color: '#ffffff'
      });

      setPromoForm({
        code: '',
        discount: '10',
        validDays: '1',
        maxUses: ''
      });

      fetchPromoCodes();
      fetchStats();

    } catch (error) {
      Swal.fire({
        title: 'Error',
        text: 'Failed to create promo code',
        icon: 'error',
        background: '#1f1f1f',
        color: '#ffffff'
      });
    }
  };



  const handleDeletePromoCode = async (promoId) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'This will permanently delete the promo code',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      background: '#1f1f1f',
      color: '#ffffff'
    });

    if (result.isConfirmed) {
      try {
        // إرسال الـ ID كـ query parameter لضمان التوافق مع Vercel
        await axios.delete(`/api/promocodes?id=${promoId}`);
        fetchPromoCodes();
        fetchStats();
        Swal.fire({
          title: 'Deleted!',
          text: 'Promo code has been deleted',
          icon: 'success',
          background: '#1f1f1f',
          color: '#ffffff'
        });
      } catch (error) {
        console.error('Delete error:', error);
        Swal.fire({
          title: 'Error',
          text: error.response?.data?.message || 'Failed to delete promo code',
          icon: 'error',
          background: '#1f1f1f',
          color: '#ffffff'
        });
      }
    }
  };

  const handleDeleteOrder = async (orderId) => {
    const result = await Swal.fire({
      title: 'هل أنت متأكد؟',
      text: 'سيتم حذف الطلب نهائياً',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'نعم، احذف!',
      cancelButtonText: 'إلغاء',
      background: '#1f1f1f',
      color: '#ffffff'
    });

    if (result.isConfirmed) {
      try {
        await axios.delete(`/api/admin/orders?id=${orderId}`);
        fetchOrders();
        fetchStats();
        Swal.fire({
          title: 'تم الحذف!',
          text: 'تم حذف الطلب بنجاح',
          icon: 'success',
          background: '#1f1f1f',
          color: '#ffffff'
        });
      } catch (error) {
        console.error('Delete order error:', error);
        Swal.fire({
          title: 'خطأ',
          text: error.response?.data?.message || 'فشل حذف الطلب',
          icon: 'error',
          background: '#1f1f1f',
          color: '#ffffff'
        });
      }
    }
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setProductForm({
      name: product.name,
      price: product.price,
      description: product.description,
      category: product.category,
      colors: product.colors,
      sizes: product.sizes,
      images: []
    });
    setActiveSection('add-product');
  };

  const handleUpdateProduct = async (e) => {
    e.preventDefault();

    const productData = {
      name: productForm.name,
      price: productForm.price,
      description: productForm.description,
      category: productForm.category,
      colors: productForm.colors,
      sizes: productForm.sizes,
      images: productForm.images
    };

    try {
      await axios.put(`/api/admin/products/${editingProduct._id}`, productData, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      Swal.fire({
        title: 'Product Updated!',
        text: 'Product has been updated successfully',
        icon: 'success',
        background: '#1f1f1f',
        color: '#ffffff'
      });

      setEditingProduct(null);
      setProductForm({
        name: '',
        price: '',
        description: '',
        category: 'T-SHIRTS',
        colors: [],
        sizes: [],
        images: []
      });

      fetchProducts();
      fetchStats();

    } catch (error) {
      Swal.fire({
        title: 'Error',
        text: 'Failed to update product',
        icon: 'error',
        background: '#1f1f1f',
        color: '#ffffff'
      });
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    window.location.href = '/admin/login';
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded"
          >
            Logout
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-8">
          <div className="bg-gray-900 rounded-lg p-4 lg:p-6">
            <h3 className="text-sm lg:text-lg font-semibold text-gray-400">Total Products</h3>
            <p className="text-2xl lg:text-3xl font-bold text-white">{stats.totalProducts || 0}</p>
          </div>
          <div className="bg-gray-900 rounded-lg p-4 lg:p-6">
            <h3 className="text-sm lg:text-lg font-semibold text-gray-400">Total Orders</h3>
            <p className="text-2xl lg:text-3xl font-bold text-white">{stats.totalOrders || 0}</p>
          </div>
          <div className="bg-gray-900 rounded-lg p-4 lg:p-6">
            <h3 className="text-sm lg:text-lg font-semibold text-gray-400">Total Revenue</h3>
            <p className="text-2xl lg:text-3xl font-bold text-green-400">${stats.totalRevenue || 0}</p>
          </div>
          <div className="bg-gray-900 rounded-lg p-4 lg:p-6">
            <h3 className="text-sm lg:text-lg font-semibold text-gray-400">Active Promos</h3>
            <p className="text-2xl lg:text-3xl font-bold text-blue-400">{stats.activePromoCodes || 0}</p>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex flex-wrap gap-4 mb-8">
          <button
            onClick={() => setActiveSection('add-product')}
            className={`px-6 py-2 rounded ${activeSection === 'add-product' ? 'bg-white text-black' : 'bg-gray-800 text-white'}`}
          >
            ADD PRODUCT
          </button>
          <button
            onClick={() => setActiveSection('manage-products')}
            className={`px-6 py-2 rounded ${activeSection === 'manage-products' ? 'bg-white text-black' : 'bg-gray-800 text-white'}`}
          >
            MANAGE PRODUCTS
          </button>
          <button
            onClick={() => setActiveSection('orders')}
            className={`px-6 py-2 rounded ${activeSection === 'orders' ? 'bg-white text-black' : 'bg-gray-800 text-white'}`}
          >
            ORDERS
          </button>
          <button
            onClick={() => setActiveSection('promocodes')}
            className={`px-6 py-2 rounded ${activeSection === 'promocodes' ? 'bg-white text-black' : 'bg-gray-800 text-white'}`}
          >
            PROMO CODES
          </button>
        </div>

        {/* Add Product Section */}
        {activeSection === 'add-product' && (
          <div className="bg-gray-900 rounded-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">
                {editingProduct ? 'Edit Product' : 'Add New Product'}
              </h2>
              {editingProduct && (
                <button
                  onClick={() => {
                    setEditingProduct(null);
                    setProductForm({
                      name: '',
                      price: '',
                      description: '',
                      category: 'T-SHIRTS',
                      colors: [],
                      sizes: [],
                      images: []
                    });
                  }}
                  className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded"
                >
                  Cancel Edit
                </button>
              )}
            </div>

            <form onSubmit={editingProduct ? handleUpdateProduct : handleAddProduct} className="space-y-6">
              <div>
                <input
                  type="text"
                  name="name"
                  placeholder="Product Name"
                  value={productForm.name}
                  onChange={handleProductFormChange}
                  required
                  className="w-full p-3 bg-gray-800 border border-gray-700 rounded text-white"
                />
              </div>

              <div>
                <input
                  type="number"
                  name="price"
                  placeholder="Price"
                  value={productForm.price}
                  onChange={handleProductFormChange}
                  required
                  className="w-full p-3 bg-gray-800 border border-gray-700 rounded text-white"
                />
              </div>

              <div>
                <textarea
                  name="description"
                  placeholder="Product Description"
                  value={productForm.description}
                  onChange={handleProductFormChange}
                  required
                  rows="4"
                  className="w-full p-3 bg-gray-800 border border-gray-700 rounded text-white"
                />
              </div>

              <div>
                <select
                  name="category"
                  value={productForm.category}
                  onChange={handleProductFormChange}
                  className="w-full p-3 bg-gray-800 border border-gray-700 rounded text-white"
                >
                  <option value="T-SHIRTS">T-SHIRTS</option>
                  <option value="PANTS">PANTS</option>
                </select>
              </div>

              {/* Colors Selection */}
              <div>
                <h3 className="text-lg font-semibold mb-3">Colors</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                  {colors.map(color => (
                    <label key={color} className="flex items-center space-x-2 cursor-pointer p-2 bg-gray-800 rounded hover:bg-gray-700">
                      <input
                        type="checkbox"
                        checked={productForm.colors.includes(color)}
                        onChange={() => handleColorChange(color)}
                        className="form-checkbox text-white"
                      />
                      <span className="text-sm">{color}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Sizes Selection */}
              <div>
                <h3 className="text-lg font-semibold mb-3">Sizes</h3>
                <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-3">
                  {sizes.map(size => (
                    <label key={size} className="flex items-center space-x-2 cursor-pointer p-2 bg-gray-800 rounded hover:bg-gray-700">
                      <input
                        type="checkbox"
                        checked={productForm.sizes.includes(size)}
                        onChange={() => handleSizeChange(size)}
                        className="form-checkbox text-white"
                      />
                      <span className="text-sm font-medium">{size}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Image Upload */}
              <div>
                <label className="block text-lg font-semibold mb-3">Product Images</label>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="w-full p-3 bg-gray-800 border border-gray-700 rounded text-white"
                />
                <p className="text-sm text-gray-400 mt-2">
                  الصور سيتم ضغطها وتحويلها لـ base64 تلقائياً
                </p>

                {/* معاينة الصور المحملة */}
                {productForm.images.length > 0 && (
                  <div className="mt-4">
                    <h4 className="text-md font-semibold mb-2">معاينة الصور:</h4>
                    <div className="grid grid-cols-4 gap-2">
                      {productForm.images.map((image, index) => (
                        <div key={index} className="relative">
                          <img
                            src={image}
                            alt={`Preview ${index + 1}`}
                            className="w-full h-20 object-cover rounded"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              const newImages = productForm.images.filter((_, i) => i !== index);
                              setProductForm({ ...productForm, images: newImages });
                            }}
                            className="absolute top-1 right-1 bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <button
                type="submit"
                className="w-full bg-white text-black py-3 rounded font-semibold hover:bg-gray-200 transition-colors"
              >
                {editingProduct ? 'UPDATE PRODUCT' : 'ADD PRODUCT'}
              </button>
            </form>
          </div>
        )}

        {/* Manage Products Section */}
        {activeSection === 'manage-products' && (
          <div className="bg-gray-900 rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-6">Manage Products</h2>

            <div className="grid gap-6">
              {products && products.length > 0 ? products.map(product => (
                <div key={product._id} className="bg-gray-800 rounded-lg p-4">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    {/* Product Info */}
                    <div className="flex items-center space-x-4 flex-1">
                      {product.images && product.images.length > 0 && (
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          className="w-16 h-16 object-contain rounded bg-gray-700 flex-shrink-0"
                          loading="lazy"
                        />
                      )}
                      <div className="min-w-0 flex-1">
                        <h3 className="text-lg font-semibold truncate">{product.name}</h3>
                        <p className="text-gray-400">${product.price}</p>
                        <p className="text-sm text-gray-500">{product.category}</p>
                        {product.soldOut && (
                          <span className="text-red-500 text-sm font-semibold">SOLD OUT</span>
                        )}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-wrap gap-2 lg:flex-nowrap">
                      <button
                        onClick={() => handleEditProduct(product)}
                        className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm flex-1 lg:flex-none"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleToggleSoldOut(product._id)}
                        className={`px-3 py-2 rounded text-sm flex-1 lg:flex-none ${product.soldOut
                          ? 'bg-green-600 hover:bg-green-700'
                          : 'bg-yellow-600 hover:bg-yellow-700'
                          } text-white`}
                      >
                        {product.soldOut ? 'Available' : 'Sold Out'}
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(product._id)}
                        className="px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded text-sm flex-1 lg:flex-none"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              )) : (
                <div className="text-center py-8 text-gray-400">
                  No products found
                </div>
              )}
            </div>
          </div>
        )}

        {/* Orders Section */}
        {activeSection === 'orders' && (
          <div className="bg-gray-900 rounded-lg p-4 lg:p-6">
            <h2 className="text-xl lg:text-2xl font-bold mb-4 lg:mb-6">الطلبات</h2>

            <div className="space-y-4 lg:space-y-6">
              {orders && orders.length > 0 ? orders.map(order => {
                // حساب الصورة من البيانات المحملة
                const getProductImage = (item) => {
                  // Check if item or productId is null/undefined
                  if (!item || !item.productId) {
                    return null;
                  }
                  
                  // أولاً نشوف لو الـ productId populated ومعاه صور
                  if (typeof item.productId === 'object' && item.productId.images && item.productId.images[0]) {
                    return item.productId.images[0];
                  }
                  
                  // لو مش populated، نبحث في قائمة المنتجات
                  const productId = typeof item.productId === 'object' && item.productId._id ? item.productId._id : item.productId;
                  if (!productId) {
                    return null;
                  }
                  
                  const product = products.find(p => p._id === productId);
                  if (product && product.images && product.images[0]) {
                    return product.images[0];
                  }
                  return null;
                };

                const subtotal = order.total + (order.discount || 0);
                const deliveryFee = 120;
                const finalTotal = order.total + deliveryFee;

                return (
                  <div key={order._id} className="bg-gray-800 rounded-lg p-4 lg:p-6 border border-gray-700">
                    {/* Header with Date and Status */}
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 space-y-2 sm:space-y-0 gap-2">
                      <div className="text-xs sm:text-sm text-gray-400">
                        طلب #{order._id.slice(-8)} • {new Date(order.createdAt).toLocaleDateString('ar-EG', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </div>
                      <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
                        <span className={`px-2 sm:px-3 py-1 rounded-full text-xs font-semibold ${order.status === 'pending' ? 'bg-yellow-600 text-yellow-100' :
                          order.status === 'processing' ? 'bg-blue-600 text-blue-100' :
                            order.status === 'shipped' ? 'bg-green-600 text-green-100' :
                              order.status === 'delivered' ? 'bg-purple-600 text-purple-100' :
                                'bg-gray-600 text-gray-100'
                          }`}>
                          {order.status === 'pending' ? 'في الانتظار' :
                            order.status === 'processing' ? 'قيد المعالجة' :
                              order.status === 'shipped' ? 'تم الشحن' :
                                order.status === 'delivered' ? 'تم التسليم' : 'ملغي'}
                        </span>
                        <button
                          onClick={() => handleDeleteOrder(order._id)}
                          className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-xs font-semibold transition-colors flex items-center gap-1"
                          title="حذف الطلب"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 sm:h-4 sm:w-4" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                          <span className="hidden sm:inline">حذف</span>
                        </button>
                      </div>
                    </div>

                    {/* Products Section */}
                    <div className="mb-4">
                      <h4 className="text-base lg:text-lg font-semibold mb-3 text-white">المنتجات</h4>
                      <div className="space-y-3">
                        {order.items.map((item, index) => {
                          const productImage = getProductImage(item);
                          return (
                            <div key={index} className="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-4 bg-gray-700 rounded-lg p-3">
                              {/* Product Image */}
                              <div className="flex-shrink-0 self-center sm:self-auto">
                                {productImage ? (
                                  <img
                                    src={productImage}
                                    alt={item.name}
                                    className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-lg bg-gray-600"
                                  />
                                ) : (
                                  <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-600 rounded-lg flex items-center justify-center">
                                    <span className="text-gray-400 text-xs">لا توجد صورة</span>
                                  </div>
                                )}
                              </div>

                              {/* Product Details */}
                              <div className="flex-1 text-center sm:text-right">
                                <h5 className="font-semibold text-white text-sm lg:text-base">{item.name}</h5>
                                <div className="flex flex-wrap justify-center sm:justify-start items-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-300 mt-1">
                                  <span>المقاس: {item.size}</span>
                                  <span>اللون: {item.color}</span>
                                  <span>الكمية: {item.quantity}</span>
                                </div>
                                <div className="text-xs sm:text-sm text-gray-400 mt-1">
                                  السعر: {item.price} جنيه × {item.quantity} = {(item.price * item.quantity)} جنيه
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Divider */}
                    <hr className="border-gray-600 my-4" />

                    {/* Customer Information */}
                    <div className="mb-4">
                      <h4 className="text-base lg:text-lg font-semibold mb-3 text-white">بيانات العميل</h4>
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 lg:gap-4">
                        <div className="space-y-2">
                          <div className="flex flex-col sm:flex-row sm:items-center">
                            <span className="text-gray-400 text-sm sm:w-20 mb-1 sm:mb-0">الاسم:</span>
                            <span className="text-white font-medium text-sm lg:text-base">{order.customerInfo.name}</span>
                          </div>
                          <div className="flex flex-col sm:flex-row sm:items-start">
                            <span className="text-gray-400 text-sm sm:w-20 mb-1 sm:mb-0 flex-shrink-0">العنوان:</span>
                            <span className="text-white text-sm lg:text-base break-words">{order.customerInfo.address}</span>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="flex flex-col sm:flex-row sm:items-center">
                            <span className="text-gray-400 text-sm sm:w-20 mb-1 sm:mb-0">التليفون:</span>
                            <span className="text-white text-sm lg:text-base" dir="ltr">{order.customerInfo.phone}</span>
                          </div>
                          <div className="flex flex-col sm:flex-row sm:items-center">
                            <span className="text-gray-400 text-sm sm:w-20 mb-1 sm:mb-0">تليفون 2:</span>
                            <span className="text-white text-sm lg:text-base" dir="ltr">
                              {order.customerInfo.phone2 || 'غير متوفر'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Divider */}
                    <hr className="border-gray-600 my-4" />

                    {/* Order Summary */}
                    <div className="bg-gray-700 rounded-lg p-3 lg:p-4">
                      <h4 className="text-base lg:text-lg font-semibold mb-3 text-white">ملخص الطلب</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm lg:text-base">
                          <span className="text-gray-300">سعر المنتجات:</span>
                          <span className="text-white">{subtotal.toFixed(2)} جنيه</span>
                        </div>
                        {order.discount > 0 && (
                          <div className="flex justify-between text-sm lg:text-base">
                            <span className="text-gray-300">الخصم:</span>
                            <span className="text-green-400">-{order.discount.toFixed(2)} جنيه</span>
                          </div>
                        )}
                        <div className="flex justify-between text-sm lg:text-base">
                          <span className="text-gray-300">رسوم التوصيل:</span>
                          <span className="text-white">{deliveryFee} جنيه</span>
                        </div>
                        <hr className="border-gray-600" />
                        <div className="flex justify-between text-base lg:text-lg font-semibold">
                          <span className="text-white">الإجمالي:</span>
                          <span className="text-green-400">{finalTotal.toFixed(2)} جنيه</span>
                        </div>
                        {order.promoCode && (
                          <div className="text-xs sm:text-sm text-blue-400 mt-2">
                            كود الخصم المستخدم: {order.promoCode}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              }) : (
                <div className="text-center py-8 lg:py-12 text-gray-400">
                  <div className="text-4xl lg:text-6xl mb-4">📦</div>
                  <h3 className="text-lg lg:text-xl font-semibold mb-2">لا توجد طلبات</h3>
                  <p className="text-sm lg:text-base">لم يتم إنشاء أي طلبات بعد</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Promo Codes Section */}
        {activeSection === 'promocodes' && (
          <div className="bg-gray-900 rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-6">Promo Codes</h2>

            {/* Create Promo Code Form */}
            <form onSubmit={handleCreatePromoCode} className="mb-8 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <input
                  type="text"
                  placeholder="Promo Code"
                  value={promoForm.code}
                  onChange={(e) => setPromoForm({ ...promoForm, code: e.target.value })}
                  required
                  className="p-3 bg-gray-800 border border-gray-700 rounded text-white"
                />

                <select
                  value={promoForm.discount}
                  onChange={(e) => setPromoForm({ ...promoForm, discount: e.target.value })}
                  className="p-3 bg-gray-800 border border-gray-700 rounded text-white"
                >
                  {discountOptions.map(discount => (
                    <option key={discount} value={discount}>{discount}% OFF</option>
                  ))}
                </select>

                <select
                  value={promoForm.validDays}
                  onChange={(e) => setPromoForm({ ...promoForm, validDays: e.target.value })}
                  className="p-3 bg-gray-800 border border-gray-700 rounded text-white"
                >
                  {validDaysOptions.map(days => (
                    <option key={days} value={days}>{days} Day{days > 1 ? 's' : ''}</option>
                  ))}
                </select>

                <input
                  type="number"
                  placeholder="Max Uses (optional)"
                  value={promoForm.maxUses}
                  onChange={(e) => setPromoForm({ ...promoForm, maxUses: e.target.value })}
                  className="p-3 bg-gray-800 border border-gray-700 rounded text-white"
                />
              </div>

              <button
                type="submit"
                className="bg-white text-black px-6 py-3 rounded font-semibold hover:bg-gray-200 transition-colors"
              >
                CREATE PROMO CODE
              </button>
            </form>

            {/* Existing Promo Codes */}
            <div className="grid gap-4">
              {promoCodes && promoCodes.length > 0 ? promoCodes.map(promo => (
                <div key={promo._id} className="bg-gray-800 rounded-lg p-4 flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold">{promo.code}</h3>
                    <p className="text-gray-400">{promo.discount}% OFF</p>
                    <p className="text-sm text-gray-500">
                      Valid until: {new Date(promo.expiresAt).toLocaleDateString()}
                    </p>
                    {promo.maxUses && (
                      <p className="text-sm text-gray-500">
                        Uses: {promo.usedCount || 0}/{promo.maxUses}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 rounded text-xs ${promo.isActive ? 'bg-green-600' : 'bg-red-600'
                      }`}>
                      {promo.isActive ? 'ACTIVE' : 'EXPIRED'}
                    </span>
                    <button
                      onClick={() => handleDeletePromoCode(promo._id)}
                      className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-xs"
                    >
                      حذف
                    </button>
                  </div>
                </div>
              )) : (
                <div className="text-center py-8 text-gray-400">
                  No promo codes found
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;