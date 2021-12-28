import React, { useState } from 'react';
import { SafeAreaView, View, TextInput, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/Ionicons';
import Card from '../components/Card';
import { searchMovieTv } from '../services/services';
import Error from '../components/Error';

const Search = ({ navigation }) => {
    const [text, onChangeText] = useState();
    const [searchResults, setSearchResult] = useState();
    const [Error, setError] = useState(false);

    const onSubmit = (query) => {
        Promise.all([
            searchMovieTv(query, 'movie'),
            searchMovieTv(query, 'tv')
        ])
            .then(([movies, tv]) => {
                const data = [...movies, ...tv];
                setSearchResult(data);
            })
            .catch(() => {
                setError(true);
            });
    };

    return (
        <React.Fragment>
            <SafeAreaView>
                <View style={styles.container}>
                    <View style={styles.form}>
                        <TextInput
                            style={styles.input}
                            placeholder={'Search Movie or TV Show'}
                            onChangeText={onChangeText}
                            value={text}
                        />
                    </View>
                    <TouchableOpacity
                        onPress={() => {
                            onSubmit(text)
                        }}>
                        <Icon name={'search-outline'} size={30} />
                    </TouchableOpacity>
                </View>
                <View style={styles.searchItems}>
                    {/* Searched items results */}
                    {searchResults && searchResults.length > 0 && (
                        <FlatList
                            numColumns={3}
                            data={searchResults}
                            renderItem={({ item }) => (
                                <Card navigation={navigation} item={item} />
                            )}
                            keyExtractor={item => item.id}
                        />
                    )}

                    {/* When Searched no results */}
                    {searchResults && searchResults.length == 0 && (
                        <View style={[styles.empty, { paddingTop: 20 }]}>
                            <Text>No Results Matching your criteria</Text>
                            <Text>Try different keywords.</Text>
                        </View>
                    )}
                    {/* When nothing is searched */}
                    {!searchResults && (
                        <View style={styles.empty}>
                            <Text>Type something to start searching</Text>
                        </View>
                    )}

                    {/* error */}
                    {Error && <Error />}
                </View>
            </SafeAreaView>
        </React.Fragment >
    );
}

const styles = StyleSheet.create({
    input: {
        borderRadius: 15,
        borderWidth: 0.5,
        height: 50,
        padding: 8,
    },
    container: {
        padding: 10,
        paddingTop: 50,
        flexDirection: 'row',
        alignItems: 'center',
    },
    form: {
        flexBasis: 'auto',
        flexGrow: 1,
        paddingRight: 8,
    },
    searchItems: {
        padding: 5,
    }
});

export default Search;