const User = require('../models/User.js');
const admin = require('../firebase/firebaseAdmin.js');// Firebase Admin SDK đã cấu hình


const userController = {
  register: async (req, res) => {
  const { email, password, name, phone, address , paymentMethod } = req.body;

  if (!email || !password || !name) {
    return res.status(400).json({ message: 'Email, password và name là bắt buộc.' });
  }

  try {
    // Kiểm tra email đã tồn tại trên Firebase
    try {
      await admin.auth().getUserByEmail(email);
      return res.status(409).json({ message: 'Email đã tồn tại!' });
    } catch (error) {
      if (error.code !== 'auth/user-not-found') {
        return res.status(500).json({ message: 'Lỗi khi kiểm tra email.' });
      }
    }

    // Tạo tài khoản Firebase
    const userRecord = await admin.auth().createUser({
      email,
      password,
    });

    // Xử lý address (có thể không có)
      const addressList = [];
      if (address?.street && address?.city) {
        addressList.push({
          street: address.street,
          city: address.city,
          receiverName: address.receiverName || '',
        });
      }

      // Lưu MongoDB
      const newUser = new User({
        uid: userRecord.uid,
        email: userRecord.email,
        name,
        phone,
        address: addressList,
        paymentMethod: paymentMethod || [],
      });

    await newUser.save();
    return res.status(201).json({ message: 'Đăng ký thành công', user: newUser });

  } catch (error) {
    console.error('Error registering user:', error);
    if (error.code === 11000) {
      const duplicatedField = Object.keys(error.keyPattern)[0];
      return res.status(409).json({ message: `${duplicatedField} đã tồn tại trong hệ thống.` });
    }
    return res.status(500).json({ message: 'Đăng ký thất bại', error });
  }
},


   // Login nên được xử lý phía client (Firebase Client SDK) 
  // login không cần sử lý ở đây 
   getAllUser: async (req, res) => {
    try {
      const users = await User.find();
      res.status(200).json(users);
    } catch (error) {
      console.error('Error getting users:', error);
      res.status(500).json({ error: 'Error getting users' });
    }
  },
   getUser: async (req, res) => {
    const { uid } = req.user;
    if (!uid) {
      return res.status(400).json({ error: 'User ID is required' });
    }
    
    try {
        const user = await User.findOne({ uid });
        if (!user) {
        return res.status(404).json({ error: 'User not found' });
        }
        res.status(200).json(user);
    } catch (error) {
        console.error('Error getting user:', error);
        res.status(500).json({ error: 'Error getting user' });
    }
   },
   getRole: async (req, res) => {
    if (!req.user) {
      return res.status(401).json({ error: 'User not authenticated' });
    }
    res.status(200).json({ role: req.userRole });
  },
  // CRUD SHIPPING ADDRESS (dùng _id cho từng địa chỉ)
  getAllShippingAddressUid: async (req, res) => {
    const { uid } = req.user;
    if (!uid) {
      return res.status(400).json({ error: 'User ID is required' });
    }

    try {
      const user = await User.findOne({ uid });
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      res.status(200).json(user.address);
    } catch (error) {
      console.error('Error getting user:', error);
      res.status(500).json({ error: 'Error getting user' });
    }
  },

  // 2. Tạo địa chỉ mới (gán _id cho address)
   createShippingAddress: async (req, res) => {
    const { uid } = req.user;
    const { address } = req.body;

    if (!uid || !address) {
        return res.status(400).json({ error: "uid và address là bắt buộc" });
    }

    try {
      //tìm uid trước 
        const user = await User.findOne({ uid });
        if (!user) {
          return res.status(404).json({ error: "Không tìm thấy người dùng" });
        }
        // Kiểm tra trùng địa chỉ (street, city, receiverName), dùng some để kiểm tra xem có địa chỉ nào trùng không, address[0] là index đầu tiên trong mảng mình gửi từ client
        const isDuplicate = user.address.some(addr =>
          addr.street === address[0].street &&
          addr.city === address[0].city &&
          addr.receiverName === address[0].receiverName
        );
        console.log(address[0]);
        if (isDuplicate) {
          return res.status(400).json({ error: "Địa chỉ đã tồn tại" });
        }else{ // Nếu không trùng thì thêm địa chỉ mới
        const updatedUser = await User.findOneAndUpdate(
          { uid },
          {
            $push: { address: address[0] }
          },
          { new: true }
        );
        const userResult = updatedUser;
        res.status(200).json({ message: "Thêm địa chỉ thành công", userResult });}
       
    } catch (error) {
        console.error("❌ Lỗi khi tạo địa chỉ giao hàng:", error);
        res.status(500).json({ error: "Lỗi server khi tạo địa chỉ giao hàng" });
    }
},

  // 3. Cập nhật địa chỉ theo _id
  editAddress: async (req, res) => {
    const { uid } = req.user;
    const { address } = req.body;

    if (!uid || !address || !address[0] || !address[0]._id) {
      return res.status(400).json({ error: "Thiếu uid hoặc address._id" });
    }

    try {
      const updatedUser = await User.findOneAndUpdate(
        { uid, "address._id": address[0]._id },
        { $set: { "address.$": address[0] } },
        { new: true }
      );

      if (!updatedUser) {
        return res.status(404).json({ error: "Không tìm thấy địa chỉ để cập nhật" });
      }

      res.status(200).json({ message: "Cập nhật địa chỉ thành công", updatedUser });
    } catch (error) {
      console.error("❌ Lỗi khi cập nhật địa chỉ giao hàng:", error);
      res.status(500).json({ error: "Lỗi server khi cập nhật địa chỉ giao hàng" });
    }
  },
    // 4. Xoá địa chỉ theo _id
  removeAddress: async (req, res) => {
    const { uid } = req.user;
     const { address } = req.body;

    if (!uid || !address || !address[0] || !address[0]._id) {
      return res.status(400).json({ error: "Thiếu uid hoặc address._id" });
    }

    try {
      const updatedUser = await User.findOneAndUpdate(
        { uid },
        { $pull: { address: { _id: address[0]._id } } },
        { new: true }
      );

      if (!updatedUser) {
        return res.status(404).json({ error: "Không tìm thấy người dùng hoặc địa chỉ" });
      }

      res.status(200).json({ message: "Xoá địa chỉ thành công", updatedUser });
    } catch (error) {
      console.error("❌ Lỗi khi xoá địa chỉ giao hàng:", error);
      res.status(500).json({ error: "Lỗi server khi xoá địa chỉ giao hàng" });
    }
  },
  //PAYMENT METHOD
     getPaymentMethod: async (req, res) => {
      const { uid } = req.user;

      if (!uid) {
        return res.status(400).json({ error: 'Thiếu uid' });
      }

      try {
        const user = await User.findOne({ uid });

        if (!user) {
          return res.status(404).json({ error: 'Không tìm thấy người dùng' });
        }

        res.status(200).json({ paymentMethod: user.paymentMethod });
      } catch (error) {
        console.error('Lỗi khi lấy phương thức thanh toán:', error);
        res.status(500).json({ error: 'Lỗi server khi lấy phương thức thanh toán' });
      }
    },


    updatePaymentMethod: async (req, res) => {
      const { uid } = req.user;
      const { paymentMethod } = req.body;

      // Kiểm tra dữ liệu đầu vào
      if (!paymentMethod || !paymentMethod.type) {
        return res.status(400).json({ error: 'Thiếu uid hoặc phương thức thanh toán' });
      }
      // Kiểm tra phương thức thanh toán có hợp lệ không
      if (!['COD', 'MOMO'].includes(paymentMethod.type)) {
        return res.status(400).json({ error: 'Phương thức thanh toán không hợp lệ' });
      }

      try {
        const user = await User.findOne({ uid });

        if (!user) {
          return res.status(404).json({ error: 'Không tìm thấy người dùng' });
        }

        // set tất cả phương thức thanh toán là không mặc định khi có phương thức nào đó được chọn làm mặc định
        user.paymentMethod = user.paymentMethod.map(pm => ({
          ...pm.toObject(),
          isDefault: pm.type === paymentMethod.type
        }));

        await user.save();

        res.status(200).json({
          message: 'Cập nhật phương thức mặc định thành công',
          paymentMethod: user.paymentMethod
        });
      } catch (error) {
        console.error('Lỗi khi cập nhật phương thức thanh toán:', error);
        res.status(500).json({ error: 'Lỗi server khi cập nhật phương thức thanh toán' });
      }
    },
    //lấy phương thức thanh toán mặc định
    getPaymentMethodSetTrue: async (req, res) => {
      const { uid } = req.user;

      if (!uid) {
        return res.status(400).json({ error: 'Thiếu uid' });
      }

      try {
        const user = await User.findOne({ uid });

        if (!user) {
          return res.status(404).json({ error: 'Không tìm thấy người dùng' });
        }

        const defaultMethod = user.paymentMethod.find(pm => pm.isDefault === true);

        if (!defaultMethod) {
          return res.status(404).json({ error: 'Không có phương thức mặc định nào được chọn' });
        }

        res.status(200).json({ defaultPaymentMethod: defaultMethod });
      } catch (error) {
        console.error('Lỗi khi lấy phương thức mặc định:', error);
        res.status(500).json({ error: 'Lỗi server khi lấy phương thức mặc định' });
      }
    },



    //thêm phương thức thanh toán
    addPaymentMethod: async (req, res) => {
      const { uid } = req.user;
      const { paymentMethod } = req.body;

      if (!uid || !paymentMethod || !paymentMethod.type) {
        return res.status(400).json({ error: 'Thiếu uid hoặc method' });
      }
      //tạm thời kiểm tra 2 phương thức thanh toán có phải la COD hoặc MoMo không
      if (!['COD', 'MOMO'].includes(paymentMethod.type)) {
        return res.status(400).json({ error: 'Chỉ hỗ trợ COD và MOMO hiện tại' });
      }

      try {
        const user = await User.findOne({ uid });
        if (!user) return res.status(404).json({ error: 'Không tìm thấy người dùng' });

        // Tránh thêm trùng
        const isDuplicate = user.paymentMethod.some(pm => pm.type === paymentMethod.type);
          if (isDuplicate) {
            return res.status(400).json({ error: 'Phương thức đã tồn tại' });
          }

        user.paymentMethod.push(paymentMethod);
        await user.save();

        res.status(200).json({ message: 'Thêm phương thức thanh toán thành công', user });
      } catch (err) {
        res.status(500).json({ error: 'Lỗi server khi thêm phương thức thanh toán' });
      }
    },
   changePassword: async (req, res) => {
  try {
    const { uid, name } = req.user;
    const { newPassword } = req.body;

    if (!uid || !newPassword) {
      return res.status(400).json({ message: 'Thiếu uid hoặc mật khẩu mới!' });
    }

    await admin.auth().updateUser(uid, { password: newPassword });

    return res.status(200).json({
      message: `Đổi mật khẩu cho '${name}' thành công`,
    });
  } catch (error) {
    console.error("Lỗi khi đổi mật khẩu:", error);
    const errorMessage = error?.errorInfo?.message || error.message || 'Đổi mật khẩu thất bại';

    return res.status(500).json({
      message: 'Đổi mật khẩu thất bại',
      error: errorMessage,
    });
  }
}


   


};
module.exports = userController
//   {
//   "uid": "0NWUJds4aWQhj74k1WmEl2JYXY22",
//   "email": "levancu@gmail.com",
//   "name": "Lê Văn Cừ",
//   "phone": "124529892",
//   "address": [
//     {
//       "street": "Binh Tan",
//       "receiverName": "Le Van Cu",
//       "city": "HCM"
//     }
//   ]
// }