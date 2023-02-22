import React, { useEffect, useState, useRef } from "react";
import "./App.css";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Draggable } from "gsap/Draggable";

function handleDragDirection(cards, setCount, rotateAnglesRef) {
  const direction = this.getDirection(); //drag direction

  gsap.to(this.target, {
    duration: 0.3,
    x: direction.includes("right") ? 1000 : -1000,
    ease: "Power0.easeInOut",
  });

  setCount((count) => count + 1); //track number of drags

  //update rotate values
  cards.forEach((card, index) => {
    gsap.to(card, {
      rotate: rotateAnglesRef.current[index] - 4,
    });

    rotateAnglesRef.current[index] = rotateAnglesRef.current[index] - 4;
  });
}

const App = () => {
  const [count, setCount] = useState(0);
  const rotateAnglesRef = useRef([20, 16, 12, 8, 4, 0]);

  gsap.registerPlugin(ScrollTrigger, Draggable);

  useEffect(() => {
    const cards = gsap.utils.toArray(".panel");

    gsap.set(cards, {
      autoAlpha: 0,
      scale: 0.04,
    });

    gsap.to(cards, {
      autoAlpha: 1,
      scale: 1,
      stagger: 0.08,
      force3D: true,
      ease: "Power4.easeInOut",
      scrollTrigger: {
        trigger: ".container",
        start: "top center",
        toggleActions: "play play reverse reverse",
        markers: true,
      },
    });

    Draggable.create(cards, {
      type: "x",
      force3D: true,
      onDragEnd: handleDragDirection,
      onDragEndParams: [cards, setCount, rotateAnglesRef],
    });
  }, []);

  useEffect(() => {
    const cards = gsap.utils.toArray(".panel");

    if (count === cards.length) {
      setCount(0); //Reset the count

      //Return cards to original position
      gsap.to(cards, {
        duration: 0.3,
        delay: 0.5,
        x: 0,
        stagger: 0.06,
        ease: "Power4.easeOut",
        force3D: true,
      });

      //Reset rotation and stacking order
      cards.forEach((card, index) => {
        gsap.to(card, {
          zIndex: index * 2,
          rotate: rotateAnglesRef.current[index],
        });
        rotateAnglesRef.current = [20, 16, 12, 8, 4, 0];
      });
    }
  }, [count]);

  return (
    <>
      <header>
        <h1>Flutterwave's Value Card Pile</h1>
        <p>Scroll Down</p>
      </header>

      <div className="container">
        <div className="panel box1"></div>
        <div className="panel box2"></div>
        <div className="panel box3"></div>
        <div className="panel box4"></div>
        <div className="panel box5"></div>
        <div className="panel box6"></div>
      </div>
    </>
  );
};

export default App;
