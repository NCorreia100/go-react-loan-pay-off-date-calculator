const logFrequency = 'dayly'; //log for every dayly,weekly, monthly, bimonthly, quaterly, yearly
// const initLoanBal = 12794.87; //balance
// const APR = 3.5; //interest rate
// const monthlyPayment = 800; //dollars
// const initInterestBal = 40.18; //
// const paymentDate = 26; //day of the month

const initTermDate= new Date(); //when to start counting

export const caculatePayOff = function(formData){
let {initLoanBal,APR,monthlyPayment,paymentDate,initInterestBal} = formData;


const initDate = new Date(initTermDate.getFullYear()+'-'+(initTermDate.getMonth()+1)+'-'+initTermDate.getDate());
const singleDayInterest = Math.round(initLoanBal * APR / 365)/100;
console.log('single day int',initLoanBal)
console.log('single day int',singleDayInterest)
let iAccumulator = initInterestBal||0; //interest accumulated over the course of a month
let totalIAccumulator = initInterestBal;
let curBalance = initLoanBal; //at the beggining of the month
let curDate = initDate;

while (curBalance>0){
    //increment date
    curDate = new Date(curDate.getTime() + 1000*60*60*24);
    //accumulate interest
    totalIAccumulator += singleDayInterest
    iAccumulator+=singleDayInterest;
    //if payday add monthly interest and remove payment ammount. Set interest accumulator to 0
    if(curDate.getDate()===paymentDate){
        curBalance = curBalance + iAccumulator - monthlyPayment;
        console.log(curDate.getMonth()+'-'+curDate.getDate()+'-'+curDate.getFullYear(),'interest acc',Math.round(iAccumulator*100)/100,'monthly bal',Math.round(curBalance*100)/100);
        iAccumulator=0;        
    }    
}
return {payoffDate:curDate,totalInterest:Math.round(totalIAccumulator*100)/100};
}

//  let exampleData = {
//     initLoanBal: 12794.87,
//     APR:3.5,
//     monthlyPayment:800,
//     initInterestBal : 40.18,
//     paymentDate :26
//  }

//  let exampleData2 = {
//     initLoanBal: 38518.66,
//     APR:4,
//     monthlyPayment:400,
//     initInterestBal : 0,
//     paymentDate :17
//  }

// let {payoffDate,totalInterest} = caculatePayOff(exampleData2);
// console.log('pay off date:',payoffDate.getMonth()+1+'-'+payoffDate.getDate()+'-'+payoffDate.getFullYear());
// console.log('total interest paid', totalInterest)+'$';