import { ScrollView, View } from 'react-native';
import { Text } from 'react-native-paper';

const fakeUsers = [
  { id: 'U001', name: 'Nguyễn Văn A', email: 'a@gmail.com' },
  { id: 'U002', name: 'Trần Thị B', email: 'b@gmail.com' },
];

export default function UsersPage() {
  return (
    <ScrollView className="p-4">
      <Text className="text-xl font-bold mb-4">Người dùng</Text>
      {fakeUsers.map((user) => (
        <View key={user.id} className="bg-white rounded-xl p-4 mb-3 shadow">
          <Text className="font-semibold">{user.name}</Text>
          <Text>{user.email}</Text>
        </View>
      ))}
    </ScrollView>
  );
}
