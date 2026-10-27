import React, { useEffect } from 'react';
import { View, Text, Button, ScrollView } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../store';
import { fetchProducts } from '../slices/productsSlice';
import {
  addToCart,
  increaseQuantity,
  decreaseQuantity,
  removeFromCart,
  clearCart,
  applyDiscount,
  setShippingCost,
} from '../slices/cartSlice';
import { selectCartSummary } from '../slices/cartSelectors';

export default function ShoppingCart() {
  const dispatch = useDispatch<AppDispatch>();
  const products = useSelector((state: RootState) => state.products.items);
  const productsStatus = useSelector((state: RootState) => state.products.status);
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const summary = useSelector(selectCartSummary);

  useEffect(() => {
    if (productsStatus === 'idle') {
      dispatch(fetchProducts());
    }
  }, [dispatch, productsStatus]);

  if (productsStatus === 'loading') return <Text>Đang tải...</Text>;
  if (productsStatus === 'failed') return <Text>Lỗi tải dữ liệu</Text>;

  return (
    <ScrollView>
      <Text>Cửa Hàng Trực Tuyến</Text>

      <Text style={{ marginTop: 10 }}>Sản Phẩm Có Sẵn:</Text>
      {products.map((product) => (
        <View key={product.id} style={{ marginVertical: 4 }}>
          <Text>{product.name} - ${product.price.toFixed(2)}</Text>
          <Button
            title="Thêm Vào Giỏ"
            onPress={() =>
              dispatch(addToCart({ id: product.id, name: product.name, price: product.price }))
            }
          />
        </View>
      ))}

      <Text style={{ marginTop: 10 }}>Giỏ Hàng ({summary.itemCount} sản phẩm):</Text>
      {cartItems.length === 0 ? (
        <Text>Giỏ hàng trống</Text>
      ) : (
        cartItems.map((item) => (
          <View key={item.id} style={{ marginVertical: 4 }}>
            <Text>
              {item.name} - ${item.price.toFixed(2)} x {item.quantity} = $
              {(item.price * item.quantity).toFixed(2)}
            </Text>
            <View style={{ flexDirection: 'row' }}>
              <Button title="-" onPress={() => dispatch(decreaseQuantity(item.id))} />
              <Button title="+" onPress={() => dispatch(increaseQuantity(item.id))} />
              <Button title="Xóa" onPress={() => dispatch(removeFromCart(item.id))} />
            </View>
          </View>
        ))
      )}

      <Text style={{ marginTop: 10 }}>Mã Giảm Giá:</Text>
      <View style={{ flexDirection: 'row' }}>
        <Button title="SUMMER10 (-10%)" onPress={() => dispatch(applyDiscount('SUMMER10'))} />
        <Button title="SPECIAL20 (-20%)" onPress={() => dispatch(applyDiscount('SPECIAL20'))} />
      </View>

      <Text style={{ marginTop: 10 }}>Phí Vận Chuyển:</Text>
      <View style={{ flexDirection: 'row' }}>
        <Button title="Miễn phí" onPress={() => dispatch(setShippingCost(0))} />
        <Button title="Tiêu chuẩn ($10)" onPress={() => dispatch(setShippingCost(10))} />
        <Button title="Nhanh ($25)" onPress={() => dispatch(setShippingCost(25))} />
      </View>

      <View style={{ marginVertical: 15 }}>
        <Text>Tóm Tắt Đơn Hàng</Text>
        <Text>Tổng cộng: ${summary.subtotal.toFixed(2)}</Text>
        {summary.discount > 0 && <Text>Giảm giá: -${summary.discount.toFixed(2)}</Text>}
        <Text>Thuế (10%): ${summary.tax.toFixed(2)}</Text>
        <Text>Vận chuyển: ${summary.shipping.toFixed(2)}</Text>
        <Text>Thành Tiền: ${summary.total.toFixed(2)}</Text>
        <Button title="Xóa Tất Cả" onPress={() => dispatch(clearCart())} />
      </View>
    </ScrollView>
  );
}