
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
      allOrders: `${BASE_URL}/api/order/getAllOrders`, // Admin
      allOrdersUid: `${BASE_URL}/api/order/getAllOrdersUid`,
      OrderByOrderId: (order_id) => `${BASE_URL}/api/order/getOrder/${order_id}`,
      editOrderStatus: (order_id) => `${BASE_URL}/api/order/editOrderStatus/${order_id}`,
      create: `${BASE_URL}/api/order/createOrder`,
      cancel: (order_id) => `${BASE_URL}/api/order/cancel/${order_id}`,
      orderSuccess: `${BASE_URL}/api/order/success`,
      orderDelivey: `${BASE_URL}/api/order/delivery`,
      orderCancel: `${BASE_URL}/api/order/cancel`,
      orderPaid: `${BASE_URL}/api/order/paid`,
    },

    momo: {
      create: `${BASE_URL}/api/momo/create`,        
      ipn: `${BASE_URL}/api/momo/ipn`,              
    },

  user: {
    role: `${BASE_URL}/api/user/role`,
    all: `${BASE_URL}/api/user/allUser`,
    getById: `${BASE_URL}/api/user/`,
    register:`${BASE_URL}/api/user/register`,
    //SHIPPING ADDRESS
    getAddress: `${BASE_URL}/api/user/getAddress`,
    createAddress: `${BASE_URL}/api/user/createAddress`,
    updateAddress: `${BASE_URL}/api/user/updateAddress`,
    removeAddress: `${BASE_URL}/api/user/removeAddress`,
    //PAYMENT METHOD
    getPaymentMethod: `${BASE_URL}/api/user/getPaymentMethod`,
    getPaymentMethodSetTrue: `${BASE_URL}/api/user/getPaymentMethodSetTrue`,
    addPaymentMethod: `${BASE_URL}/api/user/addPaymentMethod`,
    updatePaymentMethod: `${BASE_URL}/api/user/updatePaymentMethod`,
  },
   cart: {
    getCartByUser: `${BASE_URL}/api/cart/`,
    update: `${BASE_URL}/api/cart/updateCart`,
    removeFromCart: (product_id) => `${BASE_URL}/api/cart/remove/${product_id}`,
    removeAll: `${BASE_URL}/api/cart/removeAll`,
    addToCart: `${BASE_URL}/api/cart/addCart`,
  },


};
