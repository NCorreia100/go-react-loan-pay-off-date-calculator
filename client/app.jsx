import React from 'react';
import ReactDOM from 'react-dom';
import {caculatePayOff} from './datePayOffCalc.js';
import './app.css';

let fieldTitles={
    initLoanBal: ['Initial Loan Balance', '(in $)','Enter a dollar amount','Loan Balance'],
    APR: ['A.P.R.','','Enter a rate','APR'],
    monthlyPayment: ['Monthly Payment value', '(in $)','Enter a value < Loan Balance','Monthly Payment'],
    initInterestBal : ['Current Interest Balance','(in $)','0','Curent Interest'],
    paymentDate : ['Monthly Payment Day','',new Date().getDate().toString(),'Payment Day']
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
            paymentsQty:null,
            errorFeedback:''
        }
    }
    computePayOffDate(){
        let formData = this.state.formData;
        let {payoffDate,totalInterest,paymentsQty} = caculatePayOff(formData);
      this.setState({payOffDate:payoffDate.getMonth()+1+'-'+payoffDate.getDate()+'-'+payoffDate.getFullYear(),totalInterest,paymentsQty,errorFeedback:''});  
    }

    render(){

        return <div className="app-div">
            <span className="title">Loan Pay-off Date Calculator</span>
            <div className="table">
               {Object.keys(this.state.formData).map(k=>
                   <div className="tr" key={k}>
                       <span className="col-prompt">{fieldTitles[k][0]} {fieldTitles[k][1]} :</span>                      
                           <input type="text" val={this.state.formData[k]} placeholder={fieldTitles[k][2]}
                           onChange={(e)=>{
                               let formData = this.state.formData;
                               let invalidInput = !/^[0-9|.]+$/.test(e.target.value);
                               if(invalidInput) return this.setState({errorFeedback:`${fieldTitles[k][3]} must be a number.`});
                               formData[k] = parseInt(e.target.value);
                               let updateFeedback=this.state.errorFeedback.search(fieldTitles[k][3])>-1;
                               this.setState(updateFeedback?{formData,errorFeedback:''}:{formData});
                            }}
                            />
                       </div>
               )}
            </div>
            {this.state.payOffDate!==null &&<div className="result-container">
                <div className="result"> Your Pay-off Date: <strong>{this.state.payOffDate}</strong></div>
                <div className="result"> Total Interest Paid: <strong>{this.state.totalInterest}$</strong></div>
                <div className="result"> Number of Payments: <strong>{this.state.paymentsQty}</strong></div>
            </div>}

            <div className="proccess">
                        <span className="error-feedback">{this.state.errorFeedback}</span>
                <input type="submit" value={this.state.payOffDate===null?'CALCULATE DATE':'RECALCULATE'} className="btn btn-submit"
                onClick={()=>{
                    let emptyField; 
                    for (let key in this.state.formData) if ( this.state.formData[key]===null) emptyField = key;
                     if(emptyField) return this.setState({errorFeedback:`${fieldTitles[emptyField][3]} needs a value in order to calculate date.`})  
                    this.computePayOffDate();
                }} 
                 />
            </div>
    </div>
    }
}

ReactDOM.render(<App/>,document.getElementById('root'));
