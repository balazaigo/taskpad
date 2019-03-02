import React, { Component } from 'react';
import CreatableSelect from 'react-select/lib/Creatable';
import {
  IoIosAddCircleOutline,
  IoIosRemoveCircleOutline
} from 'react-icons/io';

import httpApi from '../../utils/http-api';

class PieGroupRule extends Component {
  state = {
    filter: '',
    tags: [],
    usertags: []
  };

  async componentWillMount() {
    this.loadUserTags();
  }

  loadUserTags = async () => {
    const url = `/api/usertags`;
    const warning = 'Error while retrieving your tags';
    const data = await httpApi.getWithWarningHandled(url, warning);
    if (data) {
      this.setState({
        usertags: data.tags
      });
    }
  };

  onTagChange = selectedTags => {
    const tags = selectedTags.map(k => k.value);
    const rule = {
      operator: this.state.filter,
      tags: tags
    };
    this.state.tags = tags; //eslint-disable-line
    this.props.onRuleChanged(this.props.id, rule);
  };

  onLogicChange = event => {
    const filter = event.target.value;
    this.setState(
      {
        filter: filter
      },
      () => {
        const rule = {
          operator: this.state.filter,
          tags: this.state.tags
        };
        this.props.onRuleChanged(this.props.id, rule);
      }
    );
  };

  renderLogicOperation() {
    const { filter } = this.state;
    const { firstRule } = this.props;

    const options = firstRule ? ['', 'not'] : ['and not', 'or', 'and'];

    function renderOptions() {
      return options.map(o => <option value={o}>{o}</option>);
    }

    return (
      <span id="logic">
        <select onChange={this.onLogicChange} value={filter}>
          {renderOptions()}
        </select>
      </span>
    );
  }

  render() {
    const customStyles = {
      control: styles => {
        return {
          ...styles,
          minHeight: 0,
          padding: 0,
          borderRadius: 0
        };
      },
      container: styles => ({
        ...styles,
        minHeight: 0,
        padding: 0,

        borderRadius: 0
      }),
      valueContainer: styles => {
        return {
          ...styles,
          minHeight: 0,
          padding: 0,
          borderRadius: 0
        };
      },
      dropdownIndicator: styles => {
        return {
          ...styles,
          display: 'none'
        };
      },
      clearIndicator: styles => {
        return {
          ...styles,
          display: 'none'
        };
      },
      indicatorSeparator: styles => {
        return {
          ...styles,
          display: 'none'
        };
      },
      indicatorsContainer: styles => {
        return {
          ...styles,
          display: 'none'
        };
      },
      multiValueRemove: styles => {
        return {
          ...styles,
          display: 'none'
        };
      }
    };

    const tags = [];
    const { usertags } = this.state;

    const tagsSelectDefaultValues = tags.map(t => ({ value: t, label: t }));
    const alltags = usertags.map(t => ({ value: t, label: t }));

    const { onRuleAdd } = this.props;

    return (
      <div className="pie-group-rule">
        {this.renderLogicOperation()}
        <span id="tags">
          <CreatableSelect
            placeholder="enter tags whose tasks should be selected"
            styles={customStyles}
            defaultValue={tagsSelectDefaultValues}
            isMulti
            onChange={this.onTagChange}
            options={alltags}
          />
        </span>
        <span id="controls">
          {this.props.firstRule ? (
            <IoIosAddCircleOutline
              size={20}
              style={{ cursor: 'pointer' }}
              onClick={onRuleAdd}
            />
          ) : (
            <IoIosRemoveCircleOutline
              size={20}
              style={{ cursor: 'pointer' }}
              onClick={() => this.props.onRuleDelete(this.props.id)}
            />
          )}
        </span>
      </div>
    );
  }
}

export default PieGroupRule;
