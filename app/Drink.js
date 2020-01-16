import React, { Component } from 'react';
import { Text } from 'react-native';

class Drink extends Component {
    constructor(props) {
      super(props);
  
      this.state = {
        //favorite: !!this.props.favoriteId,
        //timeText: 'just about right now'//intervalToText(this.props.startTime),
      };
  
      this.remove = this.remove.bind(this);
      this.duplicate = this.duplicate.bind(this);
      //this.favorite = this.favorite.bind(this);
    }

    remove() {
        this.props.onRemove(this.props);
    }
    
    duplicate() {
        this.props.onDuplicate(this.props);
    }
    
    //   favorite() {
        
    //   }

    render() {
        return (
            <Text style={'color: rgb(100,0,100)'}> 
                Your drinks name: {this.props.name}, {this.props.percentage} 
            </Text>
        );
    }
}

export {Drink};