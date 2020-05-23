const APR = 3.5; //interest rate
const initLoanBal = 12794.87; //balance
const logFrequency = 'dayly'; //log for every dayly,weekly, monthly, bimonthly, quaterly, yearly
const monthlyPayment = 800; //dollars
const initInterestBal = 40.18; //
const paymentDate = 26; //day of the month
const initTermDate= new Date(); //when to start counting


const caculatePayOff = function(){
const initDate = new Date(initTermDate.getFullYear()+'-'+(initTermDate.getMonth()+1)+'-'+initTermDate.getDate());
const singleDayInterest = Math.round(initLoanBal * APR / 365)/100;
let iAccumulator = initInterestBal||0; //interest accumulated over the course of a month
let curBalance = initLoanBal; //at the beggining of the month
let curDate = initDate;

while (curBalance>0){
    //increment date
    curDate = new Date(curDate.getTime() + 1000*60*60*24);
    //accumulate interest
    iAccumulator+=singleDayInterest;
    //if payday add monthly interest and remove payment ammount. Set interest accumulator to 0
    if(curDate.getDate()===paymentDate){
        curBalance = curBalance + iAccumulator - monthlyPayment;
        console.log(curDate.getMonth()+'-'+curDate.getDate()+'-'+curDate.getFullYear(),'interest acc',Math.round(iAccumulator*100)/100,'monthly bal',Math.round(curBalance*100)/100);
        iAccumulator=0;        
    }    
}
return curDate;
}
let payoffDate = caculatePayOff();
console.log('pay off date:',payoffDate.getMonth()+'-'+payoffDate.getDate()+'-'+payoffDate.getFullYear());