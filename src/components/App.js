import React from "react";
import PropTypes from "prop-types";
import Header from "./Header";
import Order from "./Order";
import Inventory from "./Inventory";
import sampleFishes from "../sample-fishes";
import Fish from "./Fish";
import base from "../base";

class App extends React.Component {
  state = {
    fishes: {},
    order: {},
  };

  static propTypes = {
    match: PropTypes.object
  };

  componentDidMount() {
    const { params } = this.props.match;
    // 1. reinstate our localStorage
    const localStorageRef = localStorage.getItem(params.storeId);
    if (localStorageRef) {
      this.setState({ order: JSON.parse(localStorageRef) });
    }
    this.ref = base.syncState(`${params.storeID}/fishes`, {
      context: this,
      state: "fishes",
    });
  }

  componentDidUpdate() {
    localStorage.setItem(
      this.props.match.params.storeId,
      JSON.stringify(this.state.order)
    );
  }

  componentWillUnmount() {
    base.removeBinding(this.ref);
  }

  addFish = (fish) => {
    // 1. Take a copy of the existing state for immutation purposes
    const fishes = { ...this.state.fishes };
    // 2. Add our new fish to the fishes variable.
    // Add a timestamp for unique identification
    fishes[`fish${Date.now()}`] = fish;
    // 3. Set the new fishes object to state
    this.setState({ fishes }); // If the property and value are the same,
    // in ES6 we can just pass the word just once.
  };

  deleteFish = (key) => {
    // 1. Take a copy of state
    const fishes = { ...this.state.fish };
    // 2. update the state - remove an item
    fishes[key] = null;
    // 3. update state
    this.setState({ fishes });
  };

  updateFish = (key, updatedFish) => {
    // Update fish data from EditFishForm
    // Params: key: which fish is going to be updated?
    // updatedFish: const from the EditFishForm handleChange event handler
    // 1. Take a copy of the current state
    const fishes = { ...this.state.fishes };
    // 2. update that state
    fishes[key] = updatedFish;
    // 3. Set that to state
    this.setState({ fishes });
  };

  loadSampleFishes = () => {
    this.setState({ fishes: sampleFishes });
  };

  addToOrder = (key) => {
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
  };

  removeFromOrder = (key) => {
    // 1. Take a copy of state
    const order = { ...this.state.order };
    // 2. update the state - remove an item
    // Since we're not using Firebase, we can use "delete"
    delete order[key];
    // 3. update state
    this.setState({ order });
  };

  render() {
    return (
      <div className="catch-of-the-day">
        <div className="menu">
          <Header tagline="Fresh Seafood Market" age={1100} />
          <ul className="fishes">
            {Object.keys(this.state.fishes).map((key) => (
              <Fish
                key={key}
                index={key}
                details={this.state.fishes[key]}
                addToOrder={this.addToOrder}
              />
            ))}
          </ul>
        </div>
        <Order
          fishes={this.state.fishes}
          order={this.state.order}
          removeFromOrder={this.removeFromOrder}
          deleteFish={this.deleteFish}
        />
        <Inventory
          addFish={this.addFish}
          updateFish={this.updateFish}
          deleteFish={this.deleteFish}
          loadSampleFishes={this.loadSampleFishes}
          fishes={this.state.fishes}
          storeId={this.props.match.params.storeID}
        />
      </div>
    );
  }
}

export default App;
