// const BASE_URL = "http://192.168.1.29:5000";

// const BASE_URL = "http://192.168.217.1:5000";

const BASE_URL = "http://192.168.218.1:5000";
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
};
