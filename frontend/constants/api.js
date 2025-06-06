
import Constants from 'expo-constants';

// Lấy IP của máy backend từ địa chỉ Expo debugger
const getLocalBackendIP = () => {
  const debuggerHost = Constants.expoConfig?.hostUri || Constants.manifest?.debuggerHost;
  const ip = debuggerHost?.split(':')[0] || '192.168.1.10'; // fallback IP
  return ip;
};


// Tự động tạo BASE_URL
export const BASE_URL = `http://${getLocalBackendIP()}:5000`;

export const API = {
  product: {
    all: `${BASE_URL}/api/product/allProduct`,
    hot: `${BASE_URL}/api/product/allProductHot`,
    getById: (id) => `${BASE_URL}/api/product/${id}`,
    add: `${BASE_URL}/api/product/addProduct`,
    edit: (id) => `${BASE_URL}/api/product/editProduct/${id}`,
    delete: (id) => `${BASE_URL}/api/product/deleteProduct/${id}`,
  },
  category: {
    all: `${BASE_URL}/api/category/allCategory`,
    getById: (category_id) => `${BASE_URL}/api/category/${category_id}`,
    add: `${BASE_URL}/api/category/addCategory`,
    edit: (category_id) => `${BASE_URL}/api/category/editCategory/${category_id}`,
    delete: (category_id) => `${BASE_URL}/api/category/deleteCategory/${category_id}`,
  },
  order: {
    all: `${BASE_URL}/api/order/allOrder`,
    getById: (id) => `${BASE_URL}/api/order/${id}`,
    add: `${BASE_URL}/api/order/addOrder`,
    edit: (id) => `${BASE_URL}/api/order/editOrder/${id}`,
    delete: (id) => `${BASE_URL}/api/order/deleteOrder/${id}`,
  },
  user: {
    role: `${BASE_URL}/api/user/role`,
    all: `${BASE_URL}/api/user/allUser`,
    getById: `${BASE_URL}/api/user/`,
  },
  cart: {
    getCartByUser: `${BASE_URL}/api/cart/`,
    update: `${BASE_URL}/api/cart/updateCart`,
    removeFromCart: (product_id) => `${BASE_URL}/api/cart/remove/${product_id}`,
    removeAll: `${BASE_URL}/api/cart/removeAll`,
    addToCart: `${BASE_URL}/api/cart/addCart`,
  },

};
