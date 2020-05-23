import React from 'react';
import ReactDOM from 'react-dom';
import {caculatePayOff} from './datePayOffCalc.js';
import './app.css';

let fieldTitles={
    initLoanBal: 'Initial Loan Balance (in $) :',
    APR: 'A.P.R.:',
    monthlyPayment: 'Monthly Payment value (in $) :',
    initInterestBal : 'Current Interest Balance (in $) :',
    paymentDate : 'Monthly Payment Day :'
}

class App extends React.Component{
    constructor(props){
        super(props);
        this.state={
            formData:{
            initLoanBal: null,
            APR:null,
            monthlyPayment:null,
            initInterestBal : 0,
            paymentDate :null
            },
            payOffDate:null,
            totalInterest:null,
            errorFeedback:''
        }
    }
    computePayOffDate(){
        let formData = this.state.formData;
        let {payoffDate,totalInterest} = caculatePayOff(formData);
      this.setState({payOffDate:payoffDate.getMonth()+1+'-'+payoffDate.getDate()+'-'+payoffDate.getFullYear(),totalInterest,errorFeedback:''});  
    }

    render(){

        return <div className="app-div">
            <span className="title">Loan Pay-off Date Calculator</span>
            <div className="table">
               {Object.keys(this.state.formData).map(k=>
                   <div className="tr" key={k}>
                       <span className="col-prompt">{fieldTitles[k]}</span>                      
                           <input type="text" val={this.state.formData[k]} 
                           onChange={(e)=>{
                               let formData = this.state.formData;
                               formData[k] = parseInt(e.target.value);
                               this.setState({formData});
                            }}
                            />
                       </div>
               )}
            </div>
            <div className="proccess">
                        <span className="error-feedback">{this.state.errorFeedback}</span>
                <input type="submit" value="Calculate Date" className="btn-submit"
                onClick={()=>{
                    let emptyField; 
                    for (let key in this.state.formData) if ( this.state.formData[key]===null) emptyField = key;
                     if(emptyField) return this.setState({errorFeedback:`${emptyField} needs a value in order to calculate date.`})  
                    this.computePayOffDate();
                }} 
                 />
            </div>
            {this.state.payOffDate!==null &&<div className="result-container">
                <span className="result"> Your Loan will be paid in full on: {this.state.payOffDate}</span><br/>
                <span className="result"> Total interest paid: {this.state.totalInterest}</span>
            </div>}

    </div>
    }
}

ReactDOM.render(<App/>,document.getElementById('root'));
