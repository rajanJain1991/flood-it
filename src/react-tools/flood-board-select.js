import React, { Component } from 'react';
import Select from 'react-select';
import 'react-select/dist/react-select.css';

export default class FloodSelect extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedOption: ''
    };
  }

  handleChange = selectedOption => {
    this.setState({ selectedOption });
    this.props.onSelect
      ? this.props.onSelect(this.props.name, selectedOption)
      : null;
  };

  render() {
    return (
      <div>
        <Select
          name={this.props.name}
          value={this.props.value}
          onChange={this.handleChange}
          options={this.props.options}
          searchable={this.props.searchable || false}
          clearable={false}
        />
      </div>
    );
  }
}
