import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Cursor from './Cursor';

export default class TypingEffect extends Component {
  constructor(props) {
    super(props);
    this.state = {
      index: 0,
      displayText: props.text[0]
    };
    this.getRawText = this.getRawText.bind(this);
    this.type = this.type.bind(this);
    this.erase = this.erase.bind(this);
    this.startTyping = this.startTyping.bind(this);
  }

  componentDidMount() {
    this.startTyping();
  }

  componentWillUnmount() {
    this._timeout && clearTimeout(this._timeout);
  }

  startTyping() {
    this._timeout = setTimeout(() => {
      console.log('startTypingCallback');
      this.props.startTypingCallback ? this.props.startTypingCallback(this.state.index) : null;
      this.type();
    }, this.props.typingDelay);
  }

  getRawText() {
    const { text } = this.props;
    return typeof text === "string" ? [text] : [...text];
  }

  type() {
    let { index, displayText } = this.state;
    let text = this.getRawText()[index];
    if(text.length > displayText.length) {
      displayText = text.substr(0, displayText.length+1);
      this.setState({ displayText }, () => {
        this._timeout = setTimeout(() => {
          this.type();
        }, this.props.speed);
      });
    } else {
      this._timeout = setTimeout(() => {
        console.log('startErasingCallback');
        this.props.startErasingCallback ? this.props.startErasingCallback(this.state.index) : null;
        this.erase();
      }, this.props.eraseDelay);
    }
  }

  erase() {
    let { index, displayText } = this.state;
    if (displayText.length === 0) {
      const textArray = this.getRawText();
      index = (index+1) === textArray.length ? 0 : index+1;
      this.setState({ index }, () => {
        this.startTyping();
      });
    } else {
      displayText = displayText.substr(-displayText.length, (displayText.length-1));
      this.setState({ displayText }, () => {
        this._timeout = setTimeout(() => {
          this.erase();
        }, this.props.eraseSpeed);
      });
    }
  }

  render() {
    const {
      staticText,
      cursor,
      displayTextRenderer,
      cursorClassName,
      cursorRenderer
    } = this.props;
    const { displayText, index } = this.state;

    return (
      <span>
        {staticText ?
          <span>
            {staticText}&nbsp;
          </span> : null}

        <div
          style={{ display: 'inline-block' }}
        >{displayTextRenderer ? displayTextRenderer(displayText, index) : displayText}</div>

        <Cursor
          cursor={cursor}
          cursorRenderer={cursorRenderer}
          className={cursorClassName}
        />
      </span>
    );
  }
}

TypingEffect.defaultProps = {
  speed: 200,
  eraseSpeed: 200,
  eraseDelay: 5000,
  typingDelay: 2500,
  startTypingCallback: null,
  startErasingCallback: null,
};

TypingEffect.propTypes = {
  speed: PropTypes.number.isRequired,
  eraseSpeed: PropTypes.number.isRequired,
  typingDelay: PropTypes.number.isRequired,
  eraseDelay: PropTypes.number.isRequired,
  staticText: PropTypes.string,
  text: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.string), PropTypes.string]).isRequired,
  cursor: PropTypes.string,
  cursorClassName: PropTypes.string,
  displayTextRenderer: PropTypes.func,
  cursorRenderer: PropTypes.func,
  startTypingCallback: PropTypes.func,
  startErasingCallback: PropTypes.func,
};
