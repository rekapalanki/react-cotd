import React from "react";
import PropTypes from "prop-types";
import firebase from "firebase";
import AddFishForm from "./AddFishForm";
import EditFishForm from "./EditFishForm";
import Login from "./Login";
// importing a default and a named export
import base, { firebaseApp } from "../base";

class Inventory extends React.Component {
  static propTypes = {
    fishes: PropTypes.object,
    updateFish: PropTypes.func,
    deleteFish: PropTypes.func,
    addFish: PropTypes.func,
    loadSampleFishes: PropTypes.func,
  };

  authHandler = async (authData) => {
    // 1. Look up the current store in the firebase database
    // The fetch() method returns a promise. If we want to return the store
    // and not the promise, we have to put an await in front of it.
    const store = await base.fetch(this.props.storeId, { context: this });
    console.log(store)
    // 2. Claim it if ther is no owner ie. if we are the first owner
    if (!store.owner) {
      // save it as our own
      await base.post(`${this.props.storeId}/owner`, {
        data: authData.user.uid
      });
    }
    // 3. Set the state of the inventory component to reflect the current user
  };

  // We created an authProvider const to dynamically handle which authProvider
  // they want to sign in with. Then we use firebaseApp auth, signInWithPopup
  // methods. After login is proceed, the then() method will pass down the
  // login data to the authHandler custom method.
  authenticate = (provider) => {
    const authProvider = new firebase.auth[`${provider}AuthProvider`]();
    firebaseApp
      .auth()
      .signInWithPopup(authProvider)
      .then(this.authHandler);
  };

  render() {
    return <Login authenticate={this.authenticate} />;
    return (
      <div className="Inventory">
        {Object.keys(this.props.fishes).map((key) => (
          <EditFishForm
            key={key}
            index={key}
            fish={this.props.fishes[key]}
            updateFish={this.props.updateFish}
            deleteFish={this.props.deleteFish}
          />
        ))}
        <h2>Inventory</h2>
        <AddFishForm addFish={this.props.addFish} />
        <button onClick={this.props.loadSampleFishes}>
          Load Sample Fishes
        </button>
      </div>
    );
  }
}

export default Inventory;
