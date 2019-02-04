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
        white: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
        black: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
        red: (opacity = 1) => `rgba(250, 50, 10, ${opacity})`
      };

      return <Comp styles={styles} {...this.props} />;
    }
  }

  return ComponentWithStyles;
};

export default withStyles;
