import React, { Component } from 'react';
import { SafeAreaView, View, FlatList, StyleSheet, Text } from 'react-native';

import { NavigationEvents } from "react-navigation";

import { getActivitiesByDayId } from '../server/DaysAPI';

import firebase from '@react-native-firebase/app';
import "@react-native-firebase/auth";
import "@react-native-firebase/firestore";

import { TouchableOpacity, ScrollView } from 'react-native-gesture-handler';

import 'moment/locale/es'
var moment = require('moment');

function Item({ tripID, dayID, name, note, time, navigation }) {

    moment.locale('es');
    var actTime = moment(time).locale('es').format("hh:mm A");

    return (
        <View style={styles.item}>
            <TouchableOpacity onPress={() =>
                navigation.navigate('ActivitiesList', { tripID: tripID, dayID: dayID })}>
                <Text style={styles.activityText}>{name} </Text>
                <Text style={styles.activityText}>{note} </Text>
                <Text style={styles.activityText}>{actTime} </Text>
            </TouchableOpacity>
        </View>
    );
}

export default class ActivitiesList extends React.Component {

    state = {
        activitiesList: [],
        tripID: '',
        dayID: '',
        trip: ''
    }

    onActivitiesReceived = (activitiesList
    ) => {
        this.setState(prevState => ({
            activitiesList: prevState.activitiesList = activitiesList
        }));
    }

    componentDidMount() {
        const tripID = this.props.navigation.state.params.tripID
        const dayID = this.props.navigation.state.params.dayID
        this.setState({ tripID: tripID });
        this.setState({ dayID: dayID });

        getActivitiesByDayId(tripID, dayID, this.onActivitiesReceived)
    }


    render() {

        return (
            <SafeAreaView style={styles.container}>
                <NavigationEvents onWillFocus={() => this.componentDidMount()} />
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>Actividades</Text>
                </View>
                <ScrollView>
                    <FlatList
                        data={this.state.activitiesList}
                        renderItem={({ item }) => <Item style={styles.item}
                            tripID={this.state.tripID}
                            dayID={item.dayID}
                            name={item.name}
                            note={item.note}
                            time={item.time}
                            navigation={this.props.navigation} />}
                        keyExtractor={item => item.id}
                    />
                </ScrollView>
            </SafeAreaView>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
    },
    header: {
        paddingTop: 16,
        paddingBottom: 16,
        backgroundColor: 'white',
        alignItems: 'center',
        justifyContent: 'center',
        borderBottomWidth: 1,
        borderBottomColor: 'blue',
        zIndex: 10
    },
    headerTitle: {
        fontSize: 32,
        fontWeight: '500'
    },
    item: {
        backgroundColor: '#FFF',
        padding: 6,
        marginVertical: 8,
        marginHorizontal: 16,
    },
    activityText: {
        fontSize: 20,
        paddingVertical: 8
    }
});