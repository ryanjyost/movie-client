import React from "react";

const withStyles = Comp => {
  class ComponentWithStyles extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        windowWidth: 0,
        windowHeight: 0
      };
    }

    componentDidMount() {
      this.updateDimensions();
      window.addEventListener("resize", this.updateDimensions.bind(this));
    }

    componentWillUnmount() {
      window.removeEventListener("resize", this.updateDimensions.bind(this));
    }

    updateDimensions() {
      let windowWidth = typeof window !== "undefined" ? window.innerWidth : 0;
      let windowHeight = typeof window !== "undefined" ? window.innerHeight : 0;

      this.setState({ windowWidth, windowHeight });
    }

    render() {
      const { windowWidth } = this.state;

      const styles = {
        windowWidth,
        isWide: windowWidth > 768,
        predictionMenuHeight: 26,
        appHeaderHeight: 40,
        white: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
        black: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
        primary: (opacity = 1) => `rgba(85, 88, 255, ${opacity})`,
        secondary: (opacity = 1) => `rgba(255, 99, 99, ${opacity})`
      };

      return <Comp styles={styles} {...this.props} />;
    }
  }

  return ComponentWithStyles;
};

export default withStyles;
