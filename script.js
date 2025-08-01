// Global Variables
let currentCalculator = 'ai';
let currentInput = '';
let previousInput = '';
let operator = null;
let waitingForOperand = false;

// DOM Elements
const calculatorCards = document.querySelectorAll('.calculator-card');
const calculatorInterfaces = document.querySelectorAll('.calculator-interface');
const mobileMenuBtn = document.getElementById('mobile-menu-btn');
const mobileMenu = document.getElementById('mobile-menu');

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    attachEventListeners();
    showCalculator('ai');
});

// Initialize Application
function initializeApp() {
    // Set up smooth scrolling
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Initialize FAQ toggles
    const faqQuestions = document.querySelectorAll('.faq-question');
    faqQuestions.forEach(question => {
        question.addEventListener('click', toggleFAQ);
    });
}

// Attach Event Listeners
function attachEventListeners() {
    // Mobile menu toggle
    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', toggleMobileMenu);
    }

    // Calculator card selection
    calculatorCards.forEach(card => {
        card.addEventListener('click', () => {
            const calculatorType = card.dataset.calculator;
            showCalculator(calculatorType);
        });
    });

    // Scientific calculator buttons
    const calcButtons = document.querySelectorAll('.calc-button');
    calcButtons.forEach(button => {
        button.addEventListener('click', () => handleCalculatorInput(button.textContent));
    });

    // Form submissions
    setupFormHandlers();
}

// Mobile Menu Toggle
function toggleMobileMenu() {
    mobileMenu.classList.toggle('active');
}

// FAQ Toggle
function toggleFAQ(e) {
    const answer = e.target.closest('.faq-item').querySelector('.faq-answer');
    const isActive = answer.classList.contains('active');
    
    // Close all FAQ answers
    document.querySelectorAll('.faq-answer').forEach(ans => {
        ans.classList.remove('active');
    });
    
    // Open clicked answer if it wasn't active
    if (!isActive) {
        answer.classList.add('active');
    }
}

// Show Calculator
function showCalculator(type) {
    currentCalculator = type;
    
    // Update active card
    calculatorCards.forEach(card => {
        card.classList.remove('active');
        if (card.dataset.calculator === type) {
            card.classList.add('active');
        }
    });
    
    // Show corresponding interface
    calculatorInterfaces.forEach(interface => {
        interface.classList.remove('active');
        if (interface.id === `${type}-interface`) {
            interface.classList.add('active');
        }
    });
    
    // Reset calculator display if switching to scientific
    if (type === 'scientific') {
        resetCalculator();
    }
}

// Scroll to Section
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// AI Calculator Functions
function askAI() {
    const question = document.getElementById('ai-question').value;
    const responseDiv = document.getElementById('ai-response');
    
    if (!question.trim()) {
        responseDiv.innerHTML = '<p style="color: #ef4444;">Please enter a question.</p>';
        return;
    }
    
    // Show loading state
    responseDiv.innerHTML = '<p style="color: #00d9ff;">Processing your question...</p>';
    
    // Simulate AI processing
    setTimeout(() => {
        const response = processAIQuestion(question);
        responseDiv.innerHTML = response;
    }, 1500);
}

function processAIQuestion(question) {
    const q = question.toLowerCase();
    
    // Basic math patterns
    if (q.includes('what is') || q.includes('calculate')) {
        // Extract numbers and operations
        const mathExpression = extractMathExpression(question);
        if (mathExpression) {
            try {
                const result = evaluateExpression(mathExpression);
                return `
                    <div class="ai-response">
                        <h3 style="color: #00d9ff; margin-bottom: 1rem;">AI Calculation Result</h3>
                        <p><strong>Question:</strong> ${question}</p>
                        <p><strong>Expression:</strong> ${mathExpression}</p>
                        <p><strong>Answer:</strong> <span style="color: #00ff00; font-size: 1.5rem; font-weight: bold;">${result}</span></p>
                        <p style="margin-top: 1rem; color: #cbd5e1;"><em>Calculation performed using advanced mathematical processing.</em></p>
                    </div>
                `;
            } catch (error) {
                return `<p style="color: #ef4444;">I couldn't calculate that expression. Please check your math and try again.</p>`;
            }
        }
    }
    
    // Percentage calculations
    if (q.includes('percent') || q.includes('%')) {
        const percentResult = handlePercentageQuestion(question);
        if (percentResult) return percentResult;
    }
    
    // Unit conversions
    if (q.includes('convert') || q.includes('to')) {
        const conversionResult = handleConversionQuestion(question);
        if (conversionResult) return conversionResult;
    }
    
    // BMI questions
    if (q.includes('bmi') || q.includes('body mass')) {
        return `
            <div class="ai-response">
                <h3 style="color: #00d9ff; margin-bottom: 1rem;">BMI Information</h3>
                <p>To calculate your BMI, I need your height and weight. Please use the BMI Calculator tool above, or ask: "Calculate BMI for height X and weight Y"</p>
                <p style="margin-top: 1rem;"><strong>BMI Categories:</strong></p>
                <ul style="margin-left: 1rem; color: #cbd5e1;">
                    <li>Underweight: Less than 18.5</li>
                    <li>Normal weight: 18.5-24.9</li>
                    <li>Overweight: 25-29.9</li>
                    <li>Obese: 30 or greater</li>
                </ul>
            </div>
        `;
    }
    
    // Default helpful response
    return `
        <div class="ai-response">
            <h3 style="color: #00d9ff; margin-bottom: 1rem;">AI Assistant</h3>
            <p>I can help you with:</p>
            <ul style="margin: 1rem 0 1rem 1rem; color: #cbd5e1;">
                <li>Basic math: "What is 15 * 23?"</li>
                <li>Percentages: "What is 20% of 150?"</li>
                <li>Unit conversions: "Convert 5 feet to meters"</li>
                <li>BMI calculations: "Calculate BMI for 170cm and 70kg"</li>
                <li>Financial calculations: "Calculate loan payment for $200,000"</li>
            </ul>
            <p style="color: #00ff00;">Try asking a specific calculation question!</p>
        </div>
    `;
}

function extractMathExpression(question) {
    // Remove common words and extract mathematical expression
    let expression = question
        .replace(/what\s+is\s+/gi, '')
        .replace(/calculate\s+/gi, '')
        .replace(/plus/gi, '+')
        .replace(/minus/gi, '-')
        .replace(/times/gi, '*')
        .replace(/multiplied\s+by/gi, '*')
        .replace(/divided\s+by/gi, '/')
        .replace(/\s+/g, '');
    
    // Validate that it contains only numbers and basic operators
    if (/^[0-9+\-*/.() ]+$/.test(expression)) {
        return expression;
    }
    
    return null;
}

function evaluateExpression(expression) {
    // Simple and safe expression evaluation
    try {
        // Replace any potential dangerous functions
        const safeExpression = expression.replace(/[^0-9+\-*/.() ]/g, '');
        return Function('"use strict"; return (' + safeExpression + ')')();
    } catch (error) {
        throw new Error('Invalid expression');
    }
}

function handlePercentageQuestion(question) {
    const percentMatch = question.match(/(\d+(?:\.\d+)?)\s*%\s*of\s*(\d+(?:\.\d+)?)/i);
    if (percentMatch) {
        const percentage = parseFloat(percentMatch[1]);
        const number = parseFloat(percentMatch[2]);
        const result = (percentage / 100) * number;
        
        return `
            <div class="ai-response">
                <h3 style="color: #00d9ff; margin-bottom: 1rem;">Percentage Calculation</h3>
                <p><strong>Question:</strong> ${question}</p>
                <p><strong>Calculation:</strong> ${percentage}% of ${number}</p>
                <p><strong>Answer:</strong> <span style="color: #00ff00; font-size: 1.5rem; font-weight: bold;">${result}</span></p>
            </div>
        `;
    }
    return null;
}

function handleConversionQuestion(question) {
    const conversions = {
        'feet to meters': { factor: 0.3048, from: 'feet', to: 'meters' },
        'meters to feet': { factor: 3.28084, from: 'meters', to: 'feet' },
        'pounds to kg': { factor: 0.453592, from: 'pounds', to: 'kg' },
        'kg to pounds': { factor: 2.20462, from: 'kg', to: 'pounds' },
        'celsius to fahrenheit': { formula: (c) => (c * 9/5) + 32, from: 'celsius', to: 'fahrenheit' },
        'fahrenheit to celsius': { formula: (f) => (f - 32) * 5/9, from: 'fahrenheit', to: 'celsius' }
    };
    
    for (const [key, conversion] of Object.entries(conversions)) {
        if (question.toLowerCase().includes(key)) {
            const numberMatch = question.match(/(\d+(?:\.\d+)?)/);
            if (numberMatch) {
                const number = parseFloat(numberMatch[1]);
                let result;
                
                if (conversion.formula) {
                    result = conversion.formula(number);
                } else {
                    result = number * conversion.factor;
                }
                
                return `
                    <div class="ai-response">
                        <h3 style="color: #00d9ff; margin-bottom: 1rem;">Unit Conversion</h3>
                        <p><strong>Converting:</strong> ${number} ${conversion.from} to ${conversion.to}</p>
                        <p><strong>Result:</strong> <span style="color: #00ff00; font-size: 1.5rem; font-weight: bold;">${result.toFixed(2)} ${conversion.to}</span></p>
                    </div>
                `;
            }
        }
    }
    return null;
}

// Scientific Calculator Functions
function handleCalculatorInput(input) {
    const display = document.getElementById('calc-display');
    
    if (input === 'C') {
        resetCalculator();
        return;
    }
    
    if (input === '=') {
        calculate();
        return;
    }
    
    if (['+', '-', '*', '/'].includes(input)) {
        handleOperator(input);
        return;
    }
    
    if (input === '.') {
        if (currentInput.indexOf('.') === -1) {
            currentInput += input;
        }
    } else {
        if (waitingForOperand) {
            currentInput = input;
            waitingForOperand = false;
        } else {
            currentInput = currentInput === '0' ? input : currentInput + input;
        }
    }
    
    display.textContent = currentInput;
}

function handleOperator(nextOperator) {
    const inputValue = parseFloat(currentInput);
    
    if (previousInput === null) {
        previousInput = inputValue;
    } else if (operator) {
        const currentValue = previousInput || 0;
        const newValue = calculate(currentValue, inputValue, operator);
        
        currentInput = String(newValue);
        previousInput = newValue;
        
        document.getElementById('calc-display').textContent = currentInput;
    }
    
    waitingForOperand = true;
    operator = nextOperator;
}

function calculate(firstOperand, secondOperand, operator) {
    if (arguments.length === 0) {
        const inputValue = parseFloat(currentInput);
        
        if (previousInput === null || operator === null) {
            return;
        }
        
        const newValue = calculate(previousInput, inputValue, operator);
        currentInput = String(newValue);
        previousInput = null;
        operator = null;
        waitingForOperand = true;
        
        document.getElementById('calc-display').textContent = currentInput;
        return;
    }
    
    switch (operator) {
        case '+': return firstOperand + secondOperand;
        case '-': return firstOperand - secondOperand;
        case '*': return firstOperand * secondOperand;
        case '/': return firstOperand / secondOperand;
        default: return secondOperand;
    }
}

function resetCalculator() {
    currentInput = '0';
    previousInput = null;
    operator = null;
    waitingForOperand = false;
    document.getElementById('calc-display').textContent = currentInput;
}

// Form Handlers Setup
function setupFormHandlers() {
    // BMI Calculator
    const bmiForm = document.getElementById('bmi-form');
    if (bmiForm) {
        bmiForm.addEventListener('submit', function(e) {
            e.preventDefault();
            calculateBMI();
        });
    }
    
    // Loan EMI Calculator
    const loanForm = document.getElementById('loan-form');
    if (loanForm) {
        loanForm.addEventListener('submit', function(e) {
            e.preventDefault();
            calculateLoanEMI();
        });
    }
    
    // Mortgage Calculator
    const mortgageForm = document.getElementById('mortgage-form');
    if (mortgageForm) {
        mortgageForm.addEventListener('submit', function(e) {
            e.preventDefault();
            calculateMortgage();
        });
    }
    
    // Investment Calculator
    const investmentForm = document.getElementById('investment-form');
    if (investmentForm) {
        investmentForm.addEventListener('submit', function(e) {
            e.preventDefault();
            calculateInvestment();
        });
    }
    
    // Tax Calculator
    const taxForm = document.getElementById('tax-form');
    if (taxForm) {
        taxForm.addEventListener('submit', function(e) {
            e.preventDefault();
            calculateTax();
        });
    }
}

// BMI Calculator
function calculateBMI() {
    const height = parseFloat(document.getElementById('height').value);
    const weight = parseFloat(document.getElementById('weight').value);
    const unit = document.getElementById('unit').value;
    
    if (!height || !weight) {
        alert('Please enter both height and weight');
        return;
    }
    
    let bmi;
    if (unit === 'metric') {
        bmi = weight / ((height / 100) * (height / 100));
    } else {
        bmi = (weight / (height * height)) * 703;
    }
    
    let category, color;
    if (bmi < 18.5) {
        category = 'Underweight';
        color = '#60a5fa';
    } else if (bmi < 25) {
        category = 'Normal weight';
        color = '#00ff00';
    } else if (bmi < 30) {
        category = 'Overweight';
        color = '#fbbf24';
    } else {
        category = 'Obese';
        color = '#ef4444';
    }
    
    const resultHTML = `
        <div class="result-section">
            <h3 class="result-title">BMI Calculation Results</h3>
            <div class="result-item">
                <span class="result-label">BMI Value:</span>
                <span class="result-value" style="color: ${color}; font-size: 1.5rem;">${bmi.toFixed(1)}</span>
            </div>
            <div class="result-item">
                <span class="result-label">Category:</span>
                <span class="result-value" style="color: ${color};">${category}</span>
            </div>
            <div style="margin-top: 1rem; padding: 1rem; background: rgba(255,255,255,0.05); border-radius: 8px;">
                <h4 style="margin-bottom: 0.5rem; color: #00d9ff;">BMI Categories:</h4>
                <ul style="margin-left: 1rem; color: #cbd5e1;">
                    <li>Underweight: Less than 18.5</li>
                    <li>Normal weight: 18.5-24.9</li>
                    <li>Overweight: 25-29.9</li>
                    <li>Obese: 30 or greater</li>
                </ul>
            </div>
        </div>
    `;
    
    document.getElementById('bmi-result').innerHTML = resultHTML;
}

// Loan EMI Calculator
function calculateLoanEMI() {
    const principal = parseFloat(document.getElementById('loan-amount').value);
    const rate = parseFloat(document.getElementById('interest-rate').value) / 100 / 12;
    const time = parseFloat(document.getElementById('loan-tenure').value) * 12;
    
    if (!principal || !rate || !time) {
        alert('Please fill in all fields');
        return;
    }
    
    const emi = (principal * rate * Math.pow(1 + rate, time)) / (Math.pow(1 + rate, time) - 1);
    const totalAmount = emi * time;
    const totalInterest = totalAmount - principal;
    
    const resultHTML = `
        <div class="result-section">
            <h3 class="result-title">Loan EMI Calculation Results</h3>
            <div class="result-item">
                <span class="result-label">Monthly EMI:</span>
                <span class="result-value">$${emi.toFixed(2)}</span>
            </div>
            <div class="result-item">
                <span class="result-label">Total Amount Payable:</span>
                <span class="result-value">$${totalAmount.toFixed(2)}</span>
            </div>
            <div class="result-item">
                <span class="result-label">Total Interest:</span>
                <span class="result-value">$${totalInterest.toFixed(2)}</span>
            </div>
            <div class="result-item">
                <span class="result-label">Principal Amount:</span>
                <span class="result-value">$${principal.toFixed(2)}</span>
            </div>
        </div>
    `;
    
    document.getElementById('loan-result').innerHTML = resultHTML;
}

// Mortgage Calculator
function calculateMortgage() {
    const homePrice = parseFloat(document.getElementById('home-price').value);
    const downPayment = parseFloat(document.getElementById('down-payment').value);
    const loanTerm = parseFloat(document.getElementById('loan-term').value);
    const interestRate = parseFloat(document.getElementById('mortgage-rate').value);
    const propertyTax = parseFloat(document.getElementById('property-tax').value) || 0;
    const homeInsurance = parseFloat(document.getElementById('home-insurance').value) || 0;
    const pmi = parseFloat(document.getElementById('pmi').value) || 0;
    
    if (!homePrice || !downPayment || !loanTerm || !interestRate) {
        alert('Please fill in all required fields');
        return;
    }
    
    const loanAmount = homePrice - downPayment;
    const monthlyRate = interestRate / 100 / 12;
    const numberOfPayments = loanTerm * 12;
    
    const monthlyPayment = (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) / 
                          (Math.pow(1 + monthlyRate, numberOfPayments) - 1);
    
    const monthlyTax = propertyTax / 12;
    const monthlyInsurance = homeInsurance / 12;
    const monthlyPMI = pmi / 12;
    const totalMonthlyPayment = monthlyPayment + monthlyTax + monthlyInsurance + monthlyPMI;
    
    const resultHTML = `
        <div class="result-section">
            <h3 class="result-title">Mortgage Calculation Results</h3>
            <div class="result-item">
                <span class="result-label">Principal & Interest:</span>
                <span class="result-value">$${monthlyPayment.toFixed(2)}</span>
            </div>
            <div class="result-item">
                <span class="result-label">Property Tax (Monthly):</span>
                <span class="result-value">$${monthlyTax.toFixed(2)}</span>
            </div>
            <div class="result-item">
                <span class="result-label">Home Insurance (Monthly):</span>
                <span class="result-value">$${monthlyInsurance.toFixed(2)}</span>
            </div>
            <div class="result-item">
                <span class="result-label">PMI (Monthly):</span>
                <span class="result-value">$${monthlyPMI.toFixed(2)}</span>
            </div>
            <div class="result-item" style="border-top: 2px solid #00d9ff; padding-top: 1rem; margin-top: 1rem;">
                <span class="result-label"><strong>Total Monthly Payment:</strong></span>
                <span class="result-value" style="color: #00ff00; font-size: 1.5rem; font-weight: bold;">$${totalMonthlyPayment.toFixed(2)}</span>
            </div>
            <div class="result-item">
                <span class="result-label">Loan Amount:</span>
                <span class="result-value">$${loanAmount.toFixed(2)}</span>
            </div>
        </div>
    `;
    
    document.getElementById('mortgage-result').innerHTML = resultHTML;
}

// Investment Calculator
function calculateInvestment() {
    const initialAmount = parseFloat(document.getElementById('initial-investment').value);
    const monthlyContribution = parseFloat(document.getElementById('monthly-contribution').value) || 0;
    const annualReturn = parseFloat(document.getElementById('annual-return').value) / 100;
    const years = parseFloat(document.getElementById('investment-years').value);
    
    if (!initialAmount || !annualReturn || !years) {
        alert('Please fill in all required fields');
        return;
    }
    
    const monthlyRate = annualReturn / 12;
    const months = years * 12;
    
    // Calculate compound interest with monthly contributions
    let futureValue = initialAmount;
    let totalContributions = initialAmount;
    
    for (let i = 0; i < months; i++) {
        futureValue = futureValue * (1 + monthlyRate) + monthlyContribution;
        totalContributions += monthlyContribution;
    }
    
    const totalEarnings = futureValue - totalContributions;
    
    const resultHTML = `
        <div class="result-section">
            <h3 class="result-title">Investment Calculation Results</h3>
            <div class="result-item">
                <span class="result-label">Final Amount:</span>
                <span class="result-value" style="color: #00ff00; font-size: 1.5rem; font-weight: bold;">$${futureValue.toFixed(2)}</span>
            </div>
            <div class="result-item">
                <span class="result-label">Total Contributions:</span>
                <span class="result-value">$${totalContributions.toFixed(2)}</span>
            </div>
            <div class="result-item">
                <span class="result-label">Total Earnings:</span>
                <span class="result-value" style="color: #00d9ff;">$${totalEarnings.toFixed(2)}</span>
            </div>
            <div class="result-item">
                <span class="result-label">Return on Investment:</span>
                <span class="result-value">${((totalEarnings / totalContributions) * 100).toFixed(1)}%</span>
            </div>
        </div>
    `;
    
    document.getElementById('investment-result').innerHTML = resultHTML;
}

// Tax Calculator
function calculateTax() {
    const income = parseFloat(document.getElementById('annual-income').value);
    const filingStatus = document.getElementById('filing-status').value;
    
    if (!income) {
        alert('Please enter your annual income');
        return;
    }
    
    // Simplified tax brackets for demonstration (2023 tax year)
    const taxBrackets = {
        single: [
            { min: 0, max: 11000, rate: 0.10 },
            { min: 11000, max: 44725, rate: 0.12 },
            { min: 44725, max: 95375, rate: 0.22 },
            { min: 95375, max: 182050, rate: 0.24 },
            { min: 182050, max: 231250, rate: 0.32 },
            { min: 231250, max: 578125, rate: 0.35 },
            { min: 578125, max: Infinity, rate: 0.37 }
        ],
        married: [
            { min: 0, max: 22000, rate: 0.10 },
            { min: 22000, max: 89450, rate: 0.12 },
            { min: 89450, max: 190750, rate: 0.22 },
            { min: 190750, max: 364200, rate: 0.24 },
            { min: 364200, max: 462500, rate: 0.32 },
            { min: 462500, max: 693750, rate: 0.35 },
            { min: 693750, max: Infinity, rate: 0.37 }
        ]
    };
    
    const brackets = taxBrackets[filingStatus];
    let totalTax = 0;
    let remainingIncome = income;
    
    for (const bracket of brackets) {
        if (remainingIncome <= 0) break;
        
        const taxableInThisBracket = Math.min(remainingIncome, bracket.max - bracket.min);
        totalTax += taxableInThisBracket * bracket.rate;
        remainingIncome -= taxableInThisBracket;
    }
    
    const effectiveRate = (totalTax / income) * 100;
    const afterTaxIncome = income - totalTax;
    
    const resultHTML = `
        <div class="result-section">
            <h3 class="result-title">Tax Calculation Results</h3>
            <div class="result-item">
                <span class="result-label">Annual Income:</span>
                <span class="result-value">$${income.toFixed(2)}</span>
            </div>
            <div class="result-item">
                <span class="result-label">Federal Tax Owed:</span>
                <span class="result-value" style="color: #ef4444;">$${totalTax.toFixed(2)}</span>
            </div>
            <div class="result-item">
                <span class="result-label">Effective Tax Rate:</span>
                <span class="result-value">${effectiveRate.toFixed(2)}%</span>
            </div>
            <div class="result-item">
                <span class="result-label">After-Tax Income:</span>
                <span class="result-value" style="color: #00ff00; font-size: 1.2rem; font-weight: bold;">$${afterTaxIncome.toFixed(2)}</span>
            </div>
            <div style="margin-top: 1rem; padding: 1rem; background: rgba(255,255,255,0.05); border-radius: 8px;">
                <p style="color: #cbd5e1; font-size: 0.9rem;"><em>Note: This is a simplified calculation for federal taxes only. Consult a tax professional for accurate tax planning.</em></p>
            </div>
        </div>
    `;
    
    document.getElementById('tax-result').innerHTML = resultHTML;
}
