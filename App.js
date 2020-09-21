/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, { Component } from 'react';

import {
  SafeAreaView, ImageBackground, StyleSheet,
  Text, Image, View, StatusBar, Dimensions, TextInput,
  TouchableOpacity, ScrollView, RefreshControl, onButtonPress,Modal,
  FlatList, ActivityIndicator
} from 'react-native';
const DEVICE_WIDTH = Dimensions.get('window').width;
import {
  Header,
  LearnMoreLinks,
  Colors,
  DebugInstructions,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

export default class App extends React.Component {

  constructor(props, context) {
    super(props, context);
    this.state = {
      username: '',
      list: [],
      refreshering: false,
      page: 0,
      nbPages: '',
      isShow: false,
      detail: ''

    }
  }


  componentDidMount = () => {


    let url = `https://hn.algolia.com/api/v1/search_by_date?tags=story&page=${this.state.page}`
    console.log("ffff", url)
    fetch(url).then((response) => response.json()).then((res) => {
      console.log("ffff", res)
      this.setState({ list: res.hits, nbPages: res.nbPages });
    })


  }



  handleLoadMore = () => {
    this.state.page = this.state.page + 1
    if (this.state.page < this.state.nbPages) {
      let url = `https://hn.algolia.com/api/v1/search_by_date?tags=story&page=${this.state.page}`
      console.log("ffff", url)
      fetch(url).then((response) => response.json()).then((res) => {
        console.log("ffff", res.hits)
        this.setState({ list: this.state.list.concat(res.hits), refreshering: true });
      })
    }
  }




  renderRow = ({ item, index }) => {
    return (
      <View style={styles.schedule_box} >
        <TouchableOpacity style={{ flexDirection: 'row', padding: 10, }} onPress={() => { this.setState({ isShow: true, detail: item }) }}>
          <View style={{ width: '100%', alignItems: 'flex-start' }}>
            <Text style={[styles.textContent, { textAlign: 'left', fontSize: 16, fontStyle: 'normal', fontWeight: 'bold' }]}>{item.title}</Text>
            <Text style={[styles.textContent, { textAlign: 'left', fontSize: 14, fontStyle: 'normal', fontWeight: 'bold', color: '#525252' }]}>{item.author}</Text>
            <Text style={[styles.textContent, { textAlign: 'left', fontSize: 12, fontWeight: 'bold', color: 'blue' }]}>{item.url}</Text>
            <Text style={[styles.textContent, { textAlign: 'left', fontSize: 11, fontWeight: 'bold', color: 'gray' }]}>{item.created_at}</Text>
          </View>
        </TouchableOpacity>

      </View>
    )
  }

  renderFooter = () => {
    if (!this.state.refreshering) return null;
    return (
      <View style={{
        width: '100%',
        marginBottom: 20
      }}><ActivityIndicator size="large" color="#d24f9a" /></View>
    );
  };


  render() {
    return (
      <SafeAreaView>
        <ScrollView
          contentInsetAdjustmentBehavior="automatic"
          style={styles.scrollView}>
          <Header />

          <View style={styles.body}>
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>Blog Post</Text>
              {this.state.list.length > 0 ?
                <View style={styles.listContainer}>

                  <FlatList
                    data={this.state.list}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={this.renderRow}
                    showsVerticalScrollIndicator={false}
                    ListFooterComponent={this.renderFooter.bind(this)}
                    onEndReachedThreshold={0}
                    onEndReached={this.handleLoadMore.bind(this)}
                  />

                </View>
                :
                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                  <Text style={{ textAlign: 'center', color: '#000', fontSize: 16, fontWeight: '500' }}>{this.state.hrError}</Text>
                </View>


              }
            </View>

          </View>
        </ScrollView>
        <Modal isVisible={this.state.isShow} onBackButtonPress={() => this.setState({ isMsgBox: false, msg: '' })}>
          <View style={{ flex: 1, backgroundColor: '#fff', width: '100%', marginLeft: 'auto', marginRight: 'auto' }}>
            <TouchableOpacity style={{ top: 0, right: 0, width: 30, height: 30, justifyContent: 'flex-start', alignItems: 'flex-start' }} onPress={() => { this.setState({ isShow: false }) }}>
              <Text><Icon name="close" color="red" size={30} /></Text>
            </TouchableOpacity>
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
              <View style={{ width: '100%', justifyContent: 'center', alignItems: 'flex-start', padding: 5 }}>
                <Text style={{ textAlign: 'left', padding: 5 }}>{this.state.detail}</Text>
              </View>
            </View>
          </View>
        </Modal>
      </SafeAreaView>
    )

  }

}
const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: Colors.lighter,
  },
  engine: {
    position: 'absolute',
    right: 0,
  },
  body: {
    backgroundColor: Colors.white,
  },
  sectionContainer: {
    marginVertical: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: Colors.black,
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
    color: Colors.dark,
  },
  highlight: {
    fontWeight: '700',
  },
  footer: {
    color: Colors.dark,
    fontSize: 12,
    fontWeight: '600',
    padding: 4,
    paddingRight: 12,
    textAlign: 'right',
  },
  listContainer: {
    flex: 1,
    marginTop: 10,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    marginRight: 'auto',
    marginLeft: 'auto',
    backgroundColor: '#eee',

  },

  schedule_box: {
    justifyContent: 'flex-start',
    alignItems: 'center',
    //borderRadius: 5,
    width: '95%',
    backgroundColor: '#fff',
    marginRight: 'auto',
    marginLeft: 'auto',
    marginVertical: 20,
    marginBottom: 20

  },
  textContent: {
    color: '#000',
    fontSize: 16,
    paddingTop: 5,
    fontWeight: 'normal',

  },
  btnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  }
});


