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

  // adding local state to Inventory component
  constructor(props) {
    super(props);
    this.state = {
      uid: null,
      owner: null,
    };
  }

  componentDidMount() {
    firebase.auth().onAuthStateChanged(user => {
      if(user) {
        this.authHandler({ user });
      }
    })
  }

  authHandler = async (authData) => {
    // 1. Look up the current store in the firebase database
    // The fetch() method returns a promise. If we want to return the store
    // and not the promise, we have to put an await in front of it.
    const store = await base.fetch(this.props.storeId, { context: this });
    // 2. Claim it if ther is no owner ie. if we are the first owner
    if (!store.owner) {
      // save it as our own
      await base.post(`${this.props.storeId}/owner`, {
        data: authData.user.uid,
      });
    }
    // 3. Set the state of the inventory component to reflect the current user
    this.setState({
      uid: authData.user.uid,
      owner: store.owner || authData.user.uid,
    });
  };

  // We created an authProvider const to dynamically handle which authProvider
  // they want to sign in with. Then we use firebaseApp auth, signInWithPopup
  // methods. After login is proceed, the then() method will pass down the
  // login data to the authHandler custom method.
  authenticate = (provider) => {
    const authProvider = new firebase.auth[`${provider}AuthProvider`]();
    firebaseApp.auth().signInWithPopup(authProvider).then(this.authHandler);
  };

  // The await async method delays the implementation of our logout event
  // handler until the users actually log out from their account.
  logout = async () => {
    console.log("Logging out.");
    await firebase.auth().signOut();
    this.setState({
      uid: null
    })
  }

  render() {
    const logout = <button onClick={this.logout}>Log out</button>

    // 1. Check if they are logged in
    if (!this.state.uid) {
      return <Login authenticate={this.authenticate} />;
    }

    // 2. Check if they are not the owner of the store
    if (this.state.uid !== this.state.owner) {
      return (
        <div>
          <p>Sorry, you are not the owner!</p>
          {logout}
        </div>
      );
    }

    // 3. They must be the owner, so render the inventory

      return (
        <div className="Inventory">
          <h2>Inventory</h2>
          {logout}
          {Object.keys(this.props.fishes).map((key) => (
            <EditFishForm
              key={key}
              index={key}
              fish={this.props.fishes[key]}
              updateFish={this.props.updateFish}
              deleteFish={this.props.deleteFish}
            />
          ))}
          <AddFishForm addFish={this.props.addFish} />
          <button onClick={this.props.loadSampleFishes}>
            Load Sample Fishes
          </button>
        </div>
      );
  }
}

export default Inventory;
