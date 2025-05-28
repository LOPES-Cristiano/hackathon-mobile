import { View, Text, Image, StyleSheet } from 'react-native';

interface MovieCardProps {
  img: any;
  title: string;
}

export default function MovieCard({ img, title }: MovieCardProps) {
  return (
    <View style={styles.card}>
      <Image source={img} style={styles.image} />
      <Text style={styles.title} numberOfLines={2}>{title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 120,
    height: 200,
    backgroundColor: '#23242A',
    borderRadius: 14,
    marginRight: 16,
    overflow: 'hidden',
    elevation: 2,
    borderWidth: 1,
    borderColor: '#222',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: 150,
    resizeMode: 'cover',
    borderTopLeftRadius: 14,
    borderTopRightRadius: 14,
  },
  title: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 6,
    paddingHorizontal: 4,
    width: '100%',
    alignSelf: 'center',
    justifyContent: 'center',
  },
});
