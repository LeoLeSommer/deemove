import React from 'react';
import Spinner from 'react-native-loading-spinner-overlay/lib';
import ScrollView from '../../../components/display/ScrollView';
import {useSearch} from '../../../api/search';
import SearchResultListItem from '../SearchResultListItem';

export type SearchResultProps = {
  type: 'album' | 'artist' | 'playlist' | 'track';
  searchQuery: string;
};

export default function SearchResult({type, searchQuery}: SearchResultProps) {
  const {isLoading, data, fetchNext} = useSearch(type || 'track', searchQuery);

  return (
    <>
      <Spinner visible={isLoading} />
      <ScrollView onEndReached={fetchNext}>
        {data.map(elem => (
          <SearchResultListItem key={elem.id} item={elem} />
        ))}
      </ScrollView>
    </>
  );
}
