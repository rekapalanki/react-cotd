import React from 'react';
import { getFunName } from '../helpers.js'

class StorePicker extends React.Component {
  myInput = React.createRef();

  goToStore = event => {
    // 1. Stop the form from submitting
    event.preventDefault();
    // 2. Get the text from that input
    const storeName = this.myInput.current.value;
    // 3. Change the page to /store/input
    // StorePicker is a child of Router.
    // If you investigate the StorePicker props there is a history.push()
    //  method we want to access.
    // This results to faster loading because we're not reloading the page,
    // just tell Router to load another component instead of StorePicker.
    this.props.history.push(`/store/${storeName}`)
  }

  render() {
    return (
      <form className="store-selector" onSubmit={this.goToStore}>
        <h2>Plese Enter A Store</h2>
        <input
          type="text"
          ref={this.myInput}
          required
          placeholder="Store Name"
          defaultValue={getFunName()}
        />
        <button type="submit">Visit Store ➜</button>
      </form>
    )
  }
}

export default StorePicker;
