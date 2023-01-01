import Button from './components/Button/Button';
import Wrapper from './components/Wrapper/Wrapper';
import Screen from './components/Screen/Screen';
import ButtonBox from './components/ButtonBox/ButtonBox';
import React, { useState } from "react";

// The issue I had with this project was using brackets on single statement arrow functions like removeSpaces and valueFormaatter. toLocaleString and valueFormatter are the same
// I need to fix the main signs + - x / and = . Everything else works.

const btnValues = [

  ["C", "+-", "%", "/"],
  [7, 8, 9, "X"],
  [4, 5, 6, "-"],
  [1, 2, 3, "+"],
  [0, ".", "="],
  
];

const toLocaleString = (num) => String(num).replace(/(?<!\..*)(\d)(?=(?:\d{3})+(?:\.|$))/g, "$1 ");

const valueFormatter = (myValue) => String(myValue).replace(/(?<!\..*)(\d)(?=(?:\d{3})+(?:\.|$))/g, "$1 "); // Regex to take a value, format it into string format then create space separators for the thousand mark.


const removeSpaces = (myValue) => myValue.toString().replace(/\s/g,"");

const App = () => {

  const [calc, setCalc] = useState({

    sign: "",
    num: 0,
    res: 0,
  });

  

  const commaClickHandler = (myValue) => {
    myValue.preventDefault();
    const innerHtml = myValue.target.innerHTML;
    setCalc({
      ...calc,
      num: !calc.num.toString().includes(".") ? calc.num + innerHtml : calc.num,
    });
  };

  const signClickHandler = (myValue) => {

      myValue.preventDefault();
      const innerHtml = myValue.target.innerHTML;
      setCalc({

        ...calc, 
        sign: innerHtml,
        res: !calc.res && calc.num ? calc.num : calc.res,
        num: 0,
      });

  };

const numClickHandler = (e) => {
    e.preventDefault();
    const value = e.target.innerHTML;

    if (removeSpaces(calc.num).length < 16) {
      setCalc({
        ...calc,
        num:
          calc.num === 0 && value === "0"
            ? "0"
            : removeSpaces(calc.num) % 1 === 0
            ? toLocaleString(Number(removeSpaces(calc.num + value)))
            : toLocaleString(calc.num + value),
        res: !calc.sign ? 0 : calc.res,
      });
    }
  };

  const equalsClickHandler = () => {

    if(calc.sign && calc.num) {

      const math = (a, b, sign) => 
        sign === "+"
          ? a + b
          : sign === "-"
          ? a - b 
          : sign === "X"
          ? a * b
          : a / b;


        setCalc({

          ...calc,
          res: calc.num === "0" && calc.sign === "/"            // Checking to make sure no case divides by 0
                ? "Can't divide with 0" 
                : math(Number(removeSpaces(calc.res)), Number(removeSpaces(calc.num)), calc.sign),
                sign: "",
                num: 0,
        });
    }
  };

  const invertClickHandler = () => {

    setCalc({

      ...calc,
      num: calc.num ? valueFormatter(removeSpaces(calc.num) * -1) : 0,
      res: calc.res ? valueFormatter(removeSpaces(calc.res) * -1) : 0,
      sign: "",

    });
  };

  const percentClickHandler = () => {

    let num = calc.num ? parseFloat(removeSpaces(calc.num)) : 0;
    let res = calc.res ? parseFloat(removeSpaces(calc.res)) : 0;

    setCalc({
      ...calc,
      num: (num /= Math.pow(100, 1)),
      res: (res /= Math.pow(100, 1)),
      sign: "",
    });
  };

  const resetClickHandler = () => {

    setCalc({
      ...calc,
      sign: "",
      num: 0,
      res: 0,
    });
  };

  return (
    <Wrapper>
      <Screen value = {calc.num ? calc.num : calc.res} /> 
      <ButtonBox>
        {
          btnValues.flat().map((btn, i) => {
            return (
            <Button 
              key={i}
              className={btn === "=" ? "equals" : ""}
              value={btn} 
              onClick={
                btn === "C"  ? resetClickHandler : 
                btn === "+-" ? invertClickHandler : 
                btn ==="%" ? percentClickHandler :  
                btn === "=" ? equalsClickHandler :
                btn === "/" || btn === "X" || btn === "-" || btn === "+" ?
                signClickHandler :
                btn === "." ?
                commaClickHandler : numClickHandler
              }
            />
            );
          })
        }
      </ButtonBox>
    </Wrapper>
  );
};

export default App;
