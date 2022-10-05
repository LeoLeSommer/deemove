import React, {useState} from 'react';
import {Button, IconButton, Searchbar} from 'react-native-paper';
import {ScrollView, StyleSheet} from 'react-native';
import locales from '../../../locales';
import SearchResult from './SearchResult';
import style from '../../../constants/style';
import SearchPreview from './SearchPreview';

export type SearchBarProps = {
  searchQuery: string;
  setSearchQuery: (value: string) => void;
};

export default function SearchBar({
  searchQuery,
  setSearchQuery,
}: SearchBarProps) {
  const [filter, setFilter] = useState<
    'album' | 'artist' | 'playlist' | 'track' | null
  >(null);

  return (
    <>
      <Searchbar
        placeholder={locales.home.search}
        onChangeText={setSearchQuery}
        value={searchQuery}
      />
      {searchQuery.length > 0 && (
        <>
          <ScrollView
            style={styles.filters}
            horizontal
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}>
            {filter !== null && (
              <IconButton
                icon="close"
                onPress={() => setFilter(null)}
                style={styles.filterButton}
                size={18}
              />
            )}
            <Button
              mode={filter === 'track' ? 'contained' : 'outlined'}
              onPress={() => setFilter('track')}
              style={styles.filterButton}
              compact>
              {locales.home.tracks}
            </Button>
            <Button
              mode={filter === 'artist' ? 'contained' : 'outlined'}
              onPress={() => setFilter('artist')}
              style={styles.filterButton}
              compact>
              {locales.home.artists}
            </Button>
            <Button
              mode={filter === 'album' ? 'contained' : 'outlined'}
              onPress={() => setFilter('album')}
              style={styles.filterButton}
              compact>
              {locales.home.albums}
            </Button>
            <Button
              mode={filter === 'playlist' ? 'contained' : 'outlined'}
              onPress={() => setFilter('playlist')}
              style={styles.filterButton}
              compact>
              {locales.home.playlists}
            </Button>
          </ScrollView>
          {filter ? (
            <SearchResult type={filter} searchQuery={searchQuery} />
          ) : (
            <SearchPreview searchQuery={searchQuery} setFilter={setFilter} />
          )}
        </>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  filters: {
    flexDirection: 'row',
    height: 54,
    marginTop: style.margeSmall,
  },
  filterButton: {
    borderRadius: 30,
    marginLeft: style.margeSmall,
  },
});
