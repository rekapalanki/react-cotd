import React from 'react';
import Header from './Header';
import Order from './Order';
import Inventory from './Inventory';
import sampleFishes from '../sample-fishes';
import Fish from './Fish';

class App extends React.Component {
  state = {
    fishes: {},
    order: {}
  };

  addFish = fish => {
    // 1. Take a copy of the existing state for immutation purposes
    const fishes = { ...this.state.fishes };
    // 2. Add our new fish to the fishes variable.
    // Add a timestamp for unique identification
    fishes[`fish${Date.now()}`] = fish;
    // 3. Set the new fishes object to state
    this.setState({ fishes }); // If the property and value are the same,
    // in ES6 we can just pass the word just once.
  };

  loadSampleFishes = () => {
    this.setState({ fishes: sampleFishes });
  }

  addToOrder = key => {
    // 0. addToOrder(key) custom method takes in a key argument.
    // Since this method needs to be accessed via Fish component,
    // key props is declared and passed down via props as the object key
    // in the JSX element in render. 
    // 1. Take a copy of state
    const order = { ...this.state.order };
    // 2. Either add it to order or increment quantity
    order[key] = order[key] + 1 || 1;
    // 3. Call setState to update our state object
    this.setState({ order });
  }

  render() {
    return(
      <div className="catch-of-the-day">
        <div className="menu">
          <Header tagline="Fresh Seafood Market" age={1100} />
          <ul className="fishes">
            {Object.keys(this.state.fishes).map(key =>
              <Fish
                key={key}
                index={key}
                details={this.state.fishes[key]}
                addToOrder={this.addToOrder}
              />
            )}
          </ul>
        </div>
        <Order />
        <Inventory
          addFish={this.addFish}
          loadSampleFishes={this.loadSampleFishes}
        />
      </div>
    );
  };
};

export default App;
