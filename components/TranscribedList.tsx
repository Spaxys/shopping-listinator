import React, { useRef } from 'react';
import { View, Text, TouchableOpacity, FlatList } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import styles from '../styles/TranscribedList.styles';

type Props = {
  items: string[];
  onRemove: (index: number) => void;
};

export default function TranscribedList({ items, onRemove }: Props) {
  const flatListRef = useRef<FlatList<string>>(null);

  return (
    <View style={styles.listContainer}>
      <Text style={styles.text}>Accepted Items:</Text>
      <FlatList
        ref={flatListRef}
        data={items}
        keyExtractor={(_, idx) => idx.toString()}
        renderItem={({ item, index }) => (
          <View style={styles.listItem}>
            <Text style={styles.listItemText}>{item}</Text>
            <TouchableOpacity onPress={() => onRemove(index)} style={{ marginLeft: 12 }}>
              <MaterialIcons name="delete" size={24} color="red" />
            </TouchableOpacity>
          </View>
        )}
        ListEmptyComponent={<Text style={styles.emptyListText}>No items yet.</Text>}
        onContentSizeChange={() => {
          if (flatListRef.current && items.length > 0) {
            flatListRef.current.scrollToEnd({ animated: true });
          }
        }}
      />
    </View>
  );
}