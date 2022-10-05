import React, {useState} from 'react';
import {SafeAreaView} from 'react-native';
import {useTheme} from 'react-native-paper';
import Recommendations from '../components/molecules/Recommendations';
import SearchBar from '../components/molecules/SearchBar/SearchBar';

export default function HomeScreen() {
  const theme = useTheme();
  const [searchQuery, setSearchQuery] = useState('');

  const containerStyle = {
    backgroundColor: theme.colors.background,
    width: '100%',
    height: '100%',
  };

  return (
    <SafeAreaView style={containerStyle}>
      <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      {searchQuery.length === 0 && <Recommendations />}
    </SafeAreaView>
  );
}
