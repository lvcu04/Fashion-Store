import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { Alert } from "react-native";
import { API } from "@/constants/api";
import { useAuth } from "@/context/authContext";
import { router } from "expo-router";

// Kiểu dữ liệu
interface Address {
  _id: string;
  street: string;
  city: string;
  receiverName: string;
}

type PaymentMethodType = "COD" | "MOMO";

interface PaymentMethod {
  _id: string;
  type: PaymentMethodType;
  isDefault: boolean;
}

// Context type
interface CheckoutContextType {
  // Address
  addresses: Address[];
  selectedAddress: Address | null;
  handleSelectAddress: (address: Address) => void;
  fetchAddresses: () => Promise<void>;
  addAddress: (newAddress: Omit<Address, "_id">) => Promise<void>;
  updateAddress: (address: Address) => Promise<void>;
  removeAddress: (id: string) => Promise<void>;

  // Payment
  methods: PaymentMethod[];
  selectedPaymentMethod: PaymentMethodType | null;
  fetchPaymentMethods: () => Promise<void>;
  fetchDefaultPaymentMethod: () => Promise<void>;
  handleSelectMethod: (type: PaymentMethodType) => Promise<void>;
  resetCheckoutContext: () => void;
}

// Tạo context
const CheckoutContext = createContext<CheckoutContextType | undefined>(undefined);

// Provider
export const CheckoutProvider = ({ children }: { children: ReactNode }) => {
  const { firebaseUser } = useAuth();

  // State
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);

  const [methods, setMethods] = useState<PaymentMethod[]>([]);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethodType | null>(null);

  // 📌 ADDRESS
  const fetchAddresses = async () => {
    try {
      const token = await firebaseUser?.getIdToken();
      const res = await fetch(API.user.getAddress, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      const data: Address[] = await res.json();
      setAddresses(data);
    } catch (err) {
      console.error("❌ Lỗi tải địa chỉ:", err);
      Alert.alert("Lỗi", "Không thể tải danh sách địa chỉ.");
    }
  };

  const addAddress = async (newAddress: Omit<Address, "_id">) => {//dòng này khai báo newAddress là một đối tượng không có trường _id
    try {
      const token = await firebaseUser?.getIdToken();
      const res = await fetch(API.user.createAddress, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ address: newAddress }),//djch từ obj thành json để server hiểu
      });

      if (!res.ok) throw new Error("Thêm địa chỉ thất bại");

      await fetchAddresses(); // cập nhật lại danh sách
    } catch (err) {
      console.error("❌ Lỗi thêm địa chỉ:", err);
      Alert.alert("Lỗi", "Không thể thêm địa chỉ.");
    }
  };
  //cakap nhật địa chỉ
  const updateAddress = async (address: Address) => {
    try {
      const token = await firebaseUser?.getIdToken();
      const res = await fetch(API.user.updateAddress, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ address }),
      });

      if (!res.ok) throw new Error("Cập nhật địa chỉ thất bại");

      await fetchAddresses(); // cập nhật lại danh sách
    } catch (err) {
      console.error("❌ Lỗi cập nhật địa chỉ:", err);
      Alert.alert("Lỗi", "Không thể cập nhật địa chỉ.");
    }
  };

  const removeAddress = async (id: string) => {
    Alert.alert("Xác nhận xoá", "Bạn có chắc muốn xoá địa chỉ này?", [
      { text: "Huỷ", style: "cancel" },
      {
        text: "Xoá",
        style: "destructive",
        onPress: async () => {
          try {
            const token = await firebaseUser?.getIdToken();
            const res = await fetch(API.user.removeAddress, {
              method: "DELETE",
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ address: [{ _id: id }] }),
            });

            if (!res.ok) throw new Error("Xoá địa chỉ thất bại");

            setAddresses((prev) => prev.filter((a) => a._id !== id));
            if (selectedAddress?._id === id) setSelectedAddress(null);
          } catch (err) {
            console.error("❌ Lỗi xoá địa chỉ:", err);
            Alert.alert("Lỗi", "Không thể xoá địa chỉ.");
          }
        },
      },
    ]);
  };

  const handleSelectAddress = (address: Address) => {
    setSelectedAddress(address);
    router.push("/(checkout)/checkout");
  };

  // 📌 PAYMENT METHOD

 const fetchPaymentMethods = async () => {
  try {
    const token = await firebaseUser?.getIdToken();
    const res = await fetch(API.user.getPaymentMethod, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) throw new Error("Không lấy được danh sách phương thức");

    const data = await res.json();//đọc dữ liệu từ response
    const methods = data.paymentMethod;

    setMethods(methods);
  } catch (err) {
    console.error("❌ Lỗi lấy phương thức thanh toán:", err);
    Alert.alert("Lỗi", "Không thể lấy danh sách phương thức thanh toán.");
  }
};
// Lấy phương thức thanh toán mặc định
const fetchDefaultPaymentMethod = async () => {
  try {
    const token = await firebaseUser?.getIdToken();
    const res = await fetch(API.user.getPaymentMethodSetTrue, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) throw new Error("Không lấy được phương thức mặc định");

    const data = await res.json();
    const defaultMethod = data.defaultPaymentMethod;

    setSelectedPaymentMethod(defaultMethod?.type || null);
  } catch (err) {
    console.error("❌ Lỗi lấy phương thức mặc định:", err);
    Alert.alert("Lỗi", "Không thể lấy phương thức thanh toán mặc định.");
  }
};



  //hàm update phương thức thanh toán thong qua trường isDefault. Khi chọn thì sẽ set true
  const handleSelectMethod = async (type: PaymentMethodType) => {
    try {
      const token = await firebaseUser?.getIdToken();
      const selected = methods.find((m) => m.type === type);
      if (!selected) throw new Error("Không tìm thấy phương thức này");

      const res = await fetch(API.user.updatePaymentMethod, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          paymentMethod: {
            type: selected.type,
            isDefault: true,
          },
        }),
      });


      const data = await res.json();
      if (!res.ok) {
        console.error("❌ Lỗi chi tiết từ backend:", data);
        throw new Error(data.message || "Cập nhật phương thức thất bại");
      }


      const updated = data.paymentMethod;
      setMethods(updated);
      setSelectedPaymentMethod(type);
      router.push("/(checkout)/checkout");
    } catch (err: any) {
      console.error("❌ Error trong handleSelectMethod:", err);
      Alert.alert("Lỗi", err.message || "Đã xảy ra lỗi không xác định.");
    }
  };
  //hàm reset checkout context khi logout
  const resetCheckoutContext = () => {
    setAddresses([]);
    setSelectedAddress(null);
    setMethods([]);
    setSelectedPaymentMethod(null);
  };

  useEffect(() => {
    setSelectedAddress(null);
  }, []);

  return (
    <CheckoutContext.Provider
      value={{
        addresses,
        selectedAddress,
        fetchAddresses,
        addAddress,
        updateAddress,
        removeAddress,
        handleSelectAddress,

        methods,
        selectedPaymentMethod,
        fetchPaymentMethods,
        fetchDefaultPaymentMethod,
        handleSelectMethod,
        resetCheckoutContext
      }}
    >
      {children}
    </CheckoutContext.Provider>
  );
};

export const useCheckout = () => {
  const context = useContext(CheckoutContext);
  if (!context) throw new Error("useCheckout phải được dùng trong CheckoutProvider");
  return context;
};
