import React from 'react';
import './styles.css'; // Import your CSS file

const HamsterWheelLoader = () => {
  return (
    <div
      aria-label="Orange and tan hamster running in a metal wheel"
      role="img"
      className="wheel-and-hamster"
    >
      {/* Wheel */}
      <div className="wheel"></div>

      {/* Hamster */}
      <div className="hamster">
        <div className="hamster__body">
          {/* Hamster Head */}
          <div className="hamster__head">
            <div className="hamster__ear"></div>
            <div className="hamster__eye"></div>
            <div className="hamster__nose"></div>
          </div>

          {/* Hamster Limbs */}
          <div className="hamster__limb hamster__limb--fr"></div>
          <div className="hamster__limb hamster__limb--fl"></div>
          <div className="hamster__limb hamster__limb--br"></div>
          <div className="hamster__limb hamster__limb--bl"></div>

          {/* Hamster Tail */}
          <div className="hamster__tail"></div>
        </div>
      </div>

      {/* Spoke */}
      <div className="spoke"></div>
    </div>
  );
};

export default HamsterWheelLoader;
