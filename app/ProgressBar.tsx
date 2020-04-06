import React, {Component} from 'react';

interface ProgressBarProps {
  percentage: number;
}

class ProgressBar extends Component<ProgressBarProps, {}> {
  getClass(percentage: number): string {
    if (percentage < 25) {
      return 'bg-success';
    }

    if (percentage < 50) {
      return 'bg-info';
    }

    if (percentage < 75) {
      return 'bg-warning';
    }

    return 'bg-danger';
  }

  render() {
    let percentage = (0.2 - this.props.percentage) * 500;

    percentage = 100 - Math.max(percentage, 0);

    let style = {
      width: percentage + '%',
    };

    let htmlClass =
      'progress-bar progress-bar-striped progress-bar-animated ' +
      this.getClass(percentage);

    return (
      <div className="progress">
        <div
          className={htmlClass}
          role="progressbar"
          aria-valuenow={percentage}
          aria-valuemin={0}
          aria-valuemax={100}
          style={style}
        />
      </div>
    );
  }
}

export default ProgressBar;
