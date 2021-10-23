import { Component, OnInit, HostListener } from '@angular/core';

// import * as math from 'mathjs';

import Big from 'big.js';

import { rpn } from './rpn';
import { yard } from './yard';
import { format } from './format';
import { Operator, isOperator } from './model';

@Component({
  selector: 'app-calculator',
  templateUrl: './calculator.component.html',
  styleUrls: ['./calculator.component.scss']
})
export class CalculatorComponent implements OnInit {
    constructor() { }

    ngOnInit(): void {
      const calculator = {
        displayValue: '0',
        firstOperand: null,
        waitingForSecondOperand: false,
        operator: null
      };

      function updateDisplay(): void {
        const display: any = document.querySelector('.screen-calc');
        display.value = calculator.displayValue;
      }

      function resetCalculator(): void {
        calculator.displayValue = '0';
        calculator.firstOperand = null;
        calculator.waitingForSecondOperand = false;
        calculator.operator = null;
      }

      updateDisplay();

      const keys: any = document.querySelector('.btn-calc');
      keys.addEventListener('click', event => {
        const target = event.target;
        if (!target.matches('button')) {
          return;
        }

        if (target.classList.contains('operator')) {
          handleOperator(target.value);
          updateDisplay();
          return;
        }

        if (target.classList.contains('decimal')) {
          inputDecimal(target.value);
          updateDisplay();
          return;
        }

        if (target.classList.contains('clear')) {
          resetCalculator();
          updateDisplay();
        }

        inputDigit(target.value);
        updateDisplay();
        return;
      });

      function inputDigit(digit): void {
        const { displayValue, waitingForSecondOperand } = calculator;

        if (waitingForSecondOperand === true) {
          calculator.displayValue = digit;
          calculator.waitingForSecondOperand = false;
        } else {
          calculator.displayValue =
            displayValue === '0' ? digit : displayValue + digit;
        }
      }

      function inputDecimal(dot): void {
        if (calculator.waitingForSecondOperand === true) {
          return;
        }
        if (!calculator.displayValue.includes(dot)) {
          calculator.displayValue += dot;
        }
      }
      const performCalculation = {
        '/': (firstOperand, secondOperand) => firstOperand / secondOperand,
        '*': (firstOperand, secondOperand) => firstOperand * secondOperand,
        '+': (firstOperand, secondOperand) => firstOperand + secondOperand,
        '-': (firstOperand, secondOperand) => firstOperand - secondOperand,
        '=': (firstOperand, secondOperand) => secondOperand
      };

      function handleOperator(nextOperator): void {
        const { firstOperand, displayValue, operator } = calculator;
        const inputValue = parseFloat(displayValue);

        if (operator && calculator.waitingForSecondOperand) {
          calculator.operator = nextOperator;
          return;
        }

        if (firstOperand == null) {
          calculator.firstOperand = inputValue;
        } else if (operator) {
          const currentValue = firstOperand || 0;
          const result = performCalculation[operator](currentValue, inputValue);
          calculator.displayValue = String(result);
          calculator.firstOperand = result;
        }
        calculator.waitingForSecondOperand = true;
        calculator.operator = nextOperator;
      }
    }
  }
