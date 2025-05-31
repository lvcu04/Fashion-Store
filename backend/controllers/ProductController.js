    const {Product, ProductHot} = require('../models/Product');
    const { cloudinary } = require('../config/cloudinary');

    const productController = {
        getAllProducts: async (req, res) => {
            try {
                const products = await Product.find();
                res.status(200).json(products);
            } catch (error) {
                res.status(500).json({ error: 'Error fetching products' });
            }
        },
        getAllProductsHot: async (req, res) => {
            try {
                const productsHots = await ProductHot.find();
                res.status(200).json(productsHots);
            } catch (error) {
                res.status(500).json({ error: 'Error fetching productsHots' });
            }
        },
        getProductById: async (req, res) => {
            const { product_id } = req.params;
            try {
                const product = await Product.findOne({ product_id });
                if (!product) {     
                    return res.status(404).json({ message: 'Product not found' });
                }
                res.status(200).json(product);
            } catch (error) {
                res.status(500).json({ error: 'Error fetching product' });
            }
        },
        // createProduct, updateProduct, deleteProduct...

        // addProduct
        
        addProduct: async (req, res) => {
            try {
                // Ưu tiên file nếu có, nếu không thì dùng image từ body
                const image = req.file?.path || req.body.image || '';

                const {
                product_id, productName, description, price,
                size, condition, location, sellerName, category_id, status, quantity
                } = req.body;
                 console.log("Dữ liệu gửi lên:", req.body);

                if (!product_id || !productName || !price || !category_id) {
                return res.status(400).json({ message: 'Thiếu thông tin bắt buộc' });
                }
               


                const exists = await Product.findOne({ product_id });
                if (exists) {
                return res.status(409).json({ message: 'Mã sản phẩm đã tồn tại' });
                }

                const newProduct = new Product({
                product_id,
                productName,
                image,
                description,
                price,
                size,
                condition,
                location,
                sellerName,
                category_id,
                status,
                quantity
                });

                await newProduct.save();
                res.status(201).json(newProduct);
            } catch (error) {
                console.error(error);
                res.status(500).json({ error: 'Error creating product' });
            }
            },


        // editProduct
            editProduct: async (req, res) => {
            // Lấy product_id từ params 
            const { product_id } = req.params;
            const {
                productName,
                description,
                price,
                size,
                condition,
                location,
                sellerName,
                category_id,
                status,
                image,  
                quantity
            } = req.body;
            try {
                const updateFields = {
                    productName,
                    description,
                    price,
                    size,
                    condition,
                    location,
                    sellerName,
                    status,
                    category_id,
                    quantity
                };
                // Nếu có file upload, ưu tiên dùng file
                // if (req.file && req.file.path) {
                if (req.file?.path) {
                updateFields.image = req.file.path;
                } else if (image) {
                updateFields.image = image; // Nếu không có file, dùng ảnh từ body
                }
                // Cập nhật sản phẩm
                const updatedProduct = await Product.findOneAndUpdate(
                    { product_id },
                    updateFields,
                    { new: true }
                );
                if (!updatedProduct) {
                    return res.status(404).json({ message: 'Product not found' });
                }
                res.status(200).json(updatedProduct);
            } catch (error) {
                console.error(error);
                res.status(500).json({ error: 'Error updating product' });
            }
        },
        //deleteProduct
        deleteProduct: async (req, res) => {
            const { product_id } = req.params;
            try {
                const deletedProduct = await Product.findOneAndDelete({ product_id });
                if (!deletedProduct) {
                    return res.status(404).json({ message: 'Product not found' });
                }   
                res.status(200).json({ message: 'Product deleted successfully' });
            } catch (error) {
                res.status(500).json({ error: 'Error deleting product' });
            }
        },
    }
    module.exports = productController;

    // {
    //   "product_id": "pi10",
    //   "productName": "Áo Sweater Nam2",
    //   "image": "/images/products/Ao/AoSwiter.png",
    //   "description": "Áo Sweater second-hand, giữ ấm tốt.",
    //   "price": 140000,
    //   "size": "L",
    //   "condition": "Used - Good",
    //   "location": "Hồ Chí Minh",
    //   "sellerName": "Nguyễn Văn A",
    //   "category_id": "ci1"
    // }