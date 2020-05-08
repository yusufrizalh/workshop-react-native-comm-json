import React from "react";
import {
  FlatList, View, ActivityIndicator, TouchableOpacity,
} from "react-native";
import { ApplicationProvider, Text, Avatar, Input } from "@ui-kitten/components";
import filter from "lodash.filter";
import { mapping, light as lightTheme } from "@eva-design/eva";

class HalamanMuka extends React.Component {
  state = {
    loading: false,
    data: [],
    page: 1,
    seed: 1,
    error: null,
    query: "",
    fullData: [],
    refreshing: false,
  };

  componentDidMount() {
    this.makeRemoteRequest();
  }

  makeRemoteRequest = () => {
    const { page, seed } = this.state;
    const url = `https://randomuser.me/api/?seed=${seed}&page=${page}&results=20`;
    this.setState({ loading: true });

    fetch(url)
      .then((response) => response.json())
      .then((response) => {
        this.setState({
          data:
            page === 1
              ? response.results
              : [...this.state.data, ...response.results],
          error: response.error || null,
          loading: false,
          fullData: response.results,
          refreshing: false,
        });
      })
      .catch((error) => {
        this.setState({ error, loading: false, refreshing: false });
      });
  };

  contains = ({ name, email }, query) => {
    const { first, last } = name;
    if (
      first.includes(query) ||
      last.includes(query) ||
      email.includes(query)
    ) {
      return true;
    }
    return false;
  };

  handleSearch = (text) => {
    const formattedQuery = text.toLowerCase();
    const data = filter(this.state.fullData, (user) => {
      return this.contains(user, formattedQuery);
    });
    this.setState({ data, query: text });
  };

  handleRefresh = () => {
    this.setState(
      {
        page: 1,
        seed: this.state.seed + 1,
        refreshing: true,
      },
      () => {
        this.makeRemoteRequest();
      }
    );
  };

  handleLoadMore = () => {
      this.setState({
          page: this.state.page + 1
      },
      () => {
          this.makeRemoteRequest();
      });
  };

  renderHeader = () => (
    <View
      style={{
        backgroundColor: "#fff",
        padding: 10,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Input
        autoCapitalize="none"
        autoCorrect={false}
        onChangeText={this.handleSearch}
        status="info"
        placeholder="Pencarian nama"
        style={{
          borderRadius: 15,
          borderColor: "#333",
          backgroundColor: "#fff",
        }}
        textStyle={{ color: "#000" }}
        clearButtonMode="always"
      />
    </View>
  );

  renderSeparator = () => {
    return (
      <View
        style={{
          height: 1,
          width: "100%",
          backgroundColor: "#CED0CE",
          marginLeft: "5%",
        }}
      />
    );
  };

  renderFooter = () => {
    if (!this.state.loading) return null;
    return (
      <View
        style={{
          paddingVertical: 20,
          borderTopWidth: 1,
          borderColor: "#CED0CE",
        }}
      >
        <ActivityIndicator animating size="large" />
      </View>
    );
  };

  render() {
    return (
      <View
        style={{
          flex: 1,
          paddingHorizontal: 5,
          paddingVertical: 5,
          marginTop: 50,
        }}
      >
        <FlatList
          data={this.state.data}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => alert("Item ditekan!")}>
              <View
                style={{
                  flexDirection: "row",
                  padding: 8,
                  alignItems: "center",
                }}
              >
                <Avatar
                  source={{ uri: item.picture.thumbnail }}
                  size="giant"
                  style={{ marginRight: 8 }}
                />
                <View
                  style={{
                    flexDirection: "column",
                    padding: 8,
                    alignItems: "flex-start",
                  }}
                >
                  <Text
                    category="s1"
                    style={{
                      color: "#000",
                    }}
                  >{`${item.name.first} ${item.name.last}`}</Text>
                  <Text>{`${item.cell}`}</Text>
                  <Text>{`${item.email}`}</Text>
                </View>
              </View>
            </TouchableOpacity>
          )}
          keyExtractor={(item) => item.email}
          ItemSeparatorComponent={this.renderSeparator}
          ListHeaderComponent={this.renderHeader}
          ListFooterComponent={this.renderFooter}
          refreshing={this.state.refreshing}
          onRefresh={this.handleRefresh}
          onEndReached={this.handleLoadMore}
          onEndThreshold={0}
        />
      </View>
    );
  }
}

const App = () => (
  <ApplicationProvider mapping={mapping} theme={lightTheme}>
    <HalamanMuka />
  </ApplicationProvider>
);

export default App;
