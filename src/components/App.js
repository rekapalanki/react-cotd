import React from 'react';
import Header from './Header';
import Order from './Order';
import Inventory from './Inventory';

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

  render() {
    return(
      <div className="catch-of-the-day">
        <div className="menu">
          <Header tagline="Fresh Seafood Market" age={1100} />
        </div>
        <Order />
        <Inventory addFish={this.addFish} />
      </div>
    );
  };
};

export default App;
