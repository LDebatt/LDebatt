import { HttpClient } from '@angular/common/http';
import { Component, Injectable } from '@angular/core';
import math from 'mathjs-expression-parser';
import _clone from 'lodash/clone';
import _escapeRegExp from 'lodash/escapeRegExp';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
@Injectable({
  providedIn:  'root'
})

export class AppComponent {
  url = 'https://www.random.org/integers/?num=1&min=1&max=100&col=1&base=10&format=plain&rnd=new';
  title = 'Valid Math Expressions';
  state: { expression: string; result: string; validity: string; };
  historyList = [];
  randomNumber: any;

  constructor(private http: HttpClient) {
    this.state = {expression: '', result: '', validity: ''};
  }

  getValidityColor = () => {
    if (this.state.validity === 'Good') {
      return 1;
    } else if (this.state.validity === 'Not valid') {
      return 0;
    } else {
      return -1;
    }
  }

  getResult = (mathString) => {
    let result;
    try {
      result = math.eval(mathString);
      if (this.state.validity !== 'Good') {
        this.setState('validity', 'Good' );
      }
    }
    catch (err){
      console.log(err);
      result = '';
      if (this.state.validity !== 'Not valid') {
        this.setState( 'validity', 'Not valid');
      }
    }
    return result;
  }

  getRandomNumberFromURL = () => {
    this.http.get(this.url).subscribe(data => {
      this.randomNumber = data;
    });
  }

  setState = (key: string, value: any) => {
    switch (key) {
      case 'validity':
        this.state.validity = value;
        break;
      case 'expression':
        this.state.expression = value;
        break;
      case 'result':
        this.state.result = value;
        break;
      default:
        break;
    }
  }

  subFields = (expression) => {
    let swappedExpression = _clone(expression);
    const variables = swappedExpression.match(/\{[^\{\}]+\}/gi) || [];
    const variablesArray = variables.map(myVariableWithBrackets => {
      return myVariableWithBrackets.slice(1, -1);
    });
    variablesArray.map(myVariable => {
      swappedExpression = swappedExpression.replace(
        new RegExp( '{' + _escapeRegExp(myVariable) + '}', 'gi'), '1' );
    });
    return swappedExpression;
  }

  checkExpression = () => {
    const expression = this.subFields(this.state.expression);
    const theResultOutcome = this.getResult(expression);
    this.setState('result', theResultOutcome);
    this.historyList.push({expr: expression, res: theResultOutcome});
  }

  handleChange = (e) => {
    this.setState('expression', e.target.value);
    this.checkExpression();
  }
}
