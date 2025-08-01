// Mobile menu toggle
document.getElementById('mobile-menu-btn').addEventListener('click', function() {
    const menu = document.getElementById('mobile-menu');
    menu.classList.toggle('hidden');
});

// Smooth scrolling function
function scrollToSection(sectionId) {
    document.getElementById(sectionId).scrollIntoView({
        behavior: 'smooth'
    });
}

// AI Calculator Functions
function setAIQuery(query) {
    document.getElementById('ai-input').value = query;
    processAIQuery();
}

function processAIQuery() {
    const input = document.getElementById('ai-input').value.trim();
    if (!input) return;

    const resultsDiv = document.getElementById('ai-results');
    const answerDiv = document.getElementById('ai-answer');
    const explanationDiv = document.getElementById('ai-explanation');

    // Show loading state
    resultsDiv.classList.remove('hidden');
    answerDiv.innerHTML = 'Processing...';
    explanationDiv.innerHTML = '';

    // Simulate AI processing with actual calculation logic
    setTimeout(() => {
        const result = processNaturalLanguageQuery(input);
        answerDiv.innerHTML = result.answer;
        explanationDiv.innerHTML = result.explanation;
    }, 1500);
}

function processNaturalLanguageQuery(query) {
    const lowerQuery = query.toLowerCase();

    // Percentage calculations
    if (lowerQuery.includes('% of') || lowerQuery.includes('percent of')) {
        const match = lowerQuery.match(/(\d+(?:\.\d+)?)%?\s+(?:of|percent of)\s+(\d+(?:\.\d+)?)/);
        if (match) {
            const percentage = parseFloat(match[1]);
            const number = parseFloat(match[2]);
            const result = (percentage / 100) * number;
            return {
                answer: result.toFixed(2),
                explanation: `${percentage}% of ${number} = (${percentage} ÷ 100) × ${number} = ${result.toFixed(2)}`
            };
        }
    }

    // Square root
    if (lowerQuery.includes('square root')) {
        const match = lowerQuery.match(/square root of\s+(\d+(?:\.\d+)?)/);
        if (match) {
            const number = parseFloat(match[1]);
            const result = Math.sqrt(number);
            return {
                answer: result.toFixed(2),
                explanation: `√${number} = ${result.toFixed(2)}`
            };
        }
    }

    // Temperature conversion
    if (lowerQuery.includes('fahrenheit to celsius') || lowerQuery.includes('f to c')) {
        const match = lowerQuery.match(/(\d+(?:\.\d+)?)\s*(?:degrees?\s*)?(?:fahrenheit|f)/);
        if (match) {
            const fahrenheit = parseFloat(match[1]);
            const celsius = (fahrenheit - 32) * 5/9;
            return {
                answer: `${celsius.toFixed(1)}°C`,
                explanation: `${fahrenheit}°F to Celsius: (${fahrenheit} - 32) × 5/9 = ${celsius.toFixed(1)}°C`
            };
        }
    }

    // Basic arithmetic
    const mathMatch = lowerQuery.match(/(\d+(?:\.\d+)?)\s*([\+\-\*\/×÷])\s*(\d+(?:\.\d+)?)/);
    if (mathMatch) {
        const num1 = parseFloat(mathMatch[1]);
        const operator = mathMatch[2];
        const num2 = parseFloat(mathMatch[3]);
        let result;
        let opSymbol = operator;

        switch (operator) {
            case '+':
                result = num1 + num2;
                break;
            case '-':
                result = num1 - num2;
                break;
            case '*':
            case '×':
                result = num1 * num2;
                opSymbol = '×';
                break;
            case '/':
            case '÷':
                result = num1 / num2;
                opSymbol = '÷';
                break;
        }

        return {
            answer: result.toFixed(2),
            explanation: `${num1} ${opSymbol} ${num2} = ${result.toFixed(2)}`
        };
    }

    // Default response
    return {
        answer: "I couldn't understand that calculation. Please try rephrasing your question.",
        explanation: "Try asking something like '25% of 200' or 'What is 15 + 30?'"
    };
}

// Scientific Calculator Functions
let displays = {
    sci: '0'
};

// Use event delegation for scientific calculator buttons for cleaner code
document.addEventListener('click', function(event) {
    const target = event.target;
    if (target.matches('.calc-append')) {
        const calcType = target.dataset.calcType;
        const value = target.dataset.value;
        appendToDisplay(calcType, value);
    } else if (target.matches('.calc-clear')) {
        const calcType = target.dataset.calcType;
        clearDisplay(calcType);
    } else if (target.matches('.calc-delete')) {
        const calcType = target.dataset.calcType;
        deleteLast(calcType);
    } else if (target.matches('.calc-calculate')) {
        const calcType = target.dataset.calcType;
        calculate(calcType);
    }
});

function appendToDisplay(calcType, value) {
    if (displays[calcType] === '0' && value !== '.') { // Prevent multiple leading zeros, allow .
        displays[calcType] = value;
    } else {
        // Prevent multiple decimals
        if (value === '.' && displays[calcType].includes('.')) {
            return;
        }
        // Prevent operators right after another operator (basic check)
        const lastChar = displays[calcType].slice(-1);
        const operators = ['+', '-', '*', '/', '×', '÷'];
        if (operators.includes(lastChar) && operators.includes(value)) {
            displays[calcType] = displays[calcType].slice(0, -1) + value;
        } else {
            displays[calcType] += value;
        }
    }
    updateDisplay(calcType);
}

function clearDisplay(calcType) {
    displays[calcType] = '0';
    updateDisplay(calcType);
}

function deleteLast(calcType) {
    if (displays[calcType].length > 1) {
        displays[calcType] = displays[calcType].slice(0, -1);
    } else {
        displays[calcType] = '0';
    }
    updateDisplay(calcType);
}

function calculate(calcType) {
    try {
        // Replace display symbols with JavaScript operators
        let expression = displays[calcType]
            .replace(/×/g, '*')
            .replace(/÷/g, '/')
            .replace(/−/g, '-');

        const result = eval(expression); // Using eval for simplicity, but consider safer alternatives for production
        displays[calcType] = result.toString();
        updateDisplay(calcType);
    } catch (error) {
        displays[calcType] = 'Error';
        updateDisplay(calcType);
    }
}

function updateDisplay(calcType) {
    const displayElement = document.getElementById(calcType + '-display');
    displayElement.textContent = displays[calcType];
}

// BMI Calculator
document.getElementById('calculate-bmi-btn').addEventListener('click', calculateBMI);
function calculateBMI() {
    const height = parseFloat(document.getElementById('height').value);
    const weight = parseFloat(document.getElementById('weight').value);

    if (isNaN(height) || isNaN(weight) || height <= 0 || weight <= 0) {
        alert('Please enter valid positive height and weight values');
        return;
    }

    const heightInMeters = height / 100;
    const bmi = weight / (heightInMeters * heightInMeters);

    let category;
    let categoryClass;

    if (bmi < 18.5) {
        category = 'Underweight';
        categoryClass = 'text-blue-400';
    } else if (bmi < 25) {
        category = 'Normal weight';
        categoryClass = 'text-green-400';
    } else if (bmi < 30) {
        category = 'Overweight';
        categoryClass = 'text-yellow-400';
    } else {
        category = 'Obese';
        categoryClass = 'text-red-400';
    }

    document.getElementById('bmi-value').textContent = bmi.toFixed(1);
    document.getElementById('bmi-category').textContent = category;
    document.getElementById('bmi-category').className = `text-lg ${categoryClass}`; // Reset and apply class
    document.getElementById('bmi-result').classList.remove('hidden');
}

// EMI Calculator
document.getElementById('calculate-emi-btn').addEventListener('click', calculateEMI);
function calculateEMI() {
    const principal = parseFloat(document.getElementById('loan-amount').value);
    const annualRate = parseFloat(document.getElementById('interest-rate').value);
    const years = parseFloat(document.getElementById('loan-term').value);

    if (isNaN(principal) || isNaN(annualRate) || isNaN(years) || principal <= 0 || annualRate < 0 || years <= 0) {
        alert('Please enter valid positive loan details.');
        return;
    }

    const monthlyRate = annualRate / 100 / 12;
    const totalMonths = years * 12;

    let emi;
    if (monthlyRate === 0) { // Handle 0% interest rate
        emi = principal / totalMonths;
    } else {
        emi = (principal * monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) /
                    (Math.pow(1 + monthlyRate, totalMonths) - 1);
    }


    const totalAmount = emi * totalMonths;
    const totalInterest = totalAmount - principal;

    document.getElementById('emi-value').textContent = '$' + emi.toFixed(2);
    document.getElementById('total-interest').textContent = '$' + totalInterest.toFixed(2);
    document.getElementById('total-amount').textContent = '$' + totalAmount.toFixed(2);
    document.getElementById('emi-result').classList.remove('hidden');
}

// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth'
            });
        }

        // Close mobile menu if open
        document.getElementById('mobile-menu').classList.add('hidden');
    });
});

// Advanced Calculator Functions

// Mortgage Calculator
document.getElementById('calculate-mortgage-btn').addEventListener('click', calculateMortgage);
function calculateMortgage() {
    const homePrice = parseFloat(document.getElementById('home-price').value);
    const downPayment = parseFloat(document.getElementById('down-payment').value);
    const annualRate = parseFloat(document.getElementById('mortgage-rate').value);
    const years = parseFloat(document.getElementById('mortgage-term').value);
    const propertyTax = parseFloat(document.getElementById('property-tax').value) || 0;
    const insurance = parseFloat(document.getElementById('insurance').value) || 0;

    if (isNaN(homePrice) || isNaN(downPayment) || isNaN(annualRate) || isNaN(years) || homePrice <= 0 || downPayment < 0 || annualRate < 0 || years <= 0) {
        alert('Please enter valid positive numbers for home price, down payment, interest rate, and loan term.');
        return;
    }
    if (downPayment >= homePrice) {
        alert('Down payment must be less than home price.');
        return;
    }

    const loanAmount = homePrice - downPayment;
    const monthlyRate = annualRate / 100 / 12;
    const totalMonths = years * 12;

    let monthlyPI;
    if (monthlyRate === 0) { // Handle 0% interest rate
        monthlyPI = loanAmount / totalMonths;
    } else {
        monthlyPI = (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) /
                         (Math.pow(1 + monthlyRate, totalMonths) - 1);
    }


    const monthlyTax = propertyTax / 12;
    const monthlyInsurance = insurance / 12;
    const totalMonthlyPayment = monthlyPI + monthlyTax + monthlyInsurance;

    const totalInterest = (monthlyPI * totalMonths) - loanAmount;

    document.getElementById('mortgage-payment').textContent = '$' + totalMonthlyPayment.toFixed(2);
    document.getElementById('principal-interest').textContent = '$' + monthlyPI.toFixed(2);
    document.getElementById('monthly-tax').textContent = '$' + monthlyTax.toFixed(2);
    document.getElementById('monthly-insurance').textContent = '$' + monthlyInsurance.toFixed(2);
    document.getElementById('mortgage-total-interest').textContent = '$' + totalInterest.toFixed(2);
    document.getElementById('mortgage-result').classList.remove('hidden');
}

// Investment Calculator
document.getElementById('calculate-investment-btn').addEventListener('click', calculateInvestment);
function calculateInvestment() {
    const initialInvestment = parseFloat(document.getElementById('initial-investment').value) || 0;
    const monthlyContribution = parseFloat(document.getElementById('monthly-contribution').value) || 0;
    const annualReturn = parseFloat(document.getElementById('annual-return').value);
    const years = parseFloat(document.getElementById('investment-years').value);
    const compoundFrequency = parseFloat(document.getElementById('compound-frequency').value); // 1, 4, 12, 365

    if (isNaN(annualReturn) || isNaN(years) || years <= 0 || annualReturn < 0) {
        alert('Please enter valid positive numbers for annual return rate and investment period.');
        return;
    }

    const ratePerCompoundingPeriod = annualReturn / 100 / compoundFrequency;
    const totalCompoundingPeriods = years * compoundFrequency;
    const totalMonths = years * 12;

    // Future value of initial investment
    const fvInitial = initialInvestment * Math.pow(1 + ratePerCompoundingPeriod, totalCompoundingPeriods);

    // Future value of monthly contributions (adjusted for compounding frequency if different from monthly)
    // For simplicity, assuming monthly contributions are compounded monthly if selected, or aligned with 'Annually', etc.
    // A more complex model might need separate rates/periods for different contributions.
    let fvContributions = 0;
    if (monthlyContribution > 0) {
         // For simplicity, convert monthly contribution to an annual equivalent if compounding is annual
         // or assume monthly compounding for contributions for common use cases.
         // This simplification aligns with how most online calculators handle it.
         const monthlyRateForContributions = annualReturn / 100 / 12;
         fvContributions = monthlyContribution *
             ((Math.pow(1 + monthlyRateForContributions, totalMonths) - 1) / monthlyRateForContributions);
    }

    const finalValue = fvInitial + fvContributions;
    const totalInvested = initialInvestment + (monthlyContribution * totalMonths); // Total cash put in
    const totalGains = finalValue - totalInvested;
    let roi = 0;
    if (totalInvested > 0) {
        roi = ((totalGains / totalInvested) * 100);
    }


    document.getElementById('investment-final').textContent = '$' + finalValue.toFixed(2);
    document.getElementById('total-invested').textContent = '$' + totalInvested.toFixed(2);
    document.getElementById('total-gains').textContent = '$' + totalGains.toFixed(2);
    document.getElementById('roi-percentage').textContent = roi.toFixed(1) + '%';
    document.getElementById('investment-result').classList.remove('hidden');
}

// Tax Calculator
document.getElementById('calculate-tax-btn').addEventListener('click', calculateTax);
function calculateTax() {
    const annualIncome = parseFloat(document.getElementById('annual-income').value);
    const filingStatus = document.getElementById('filing-status').value;
    const deductions = parseFloat(document.getElementById('deductions').value) || 0;
    const stateTaxRate = parseFloat(document.getElementById('state-tax-rate').value) || 0;

    if (isNaN(annualIncome) || annualIncome < 0) {
        alert('Please enter a valid annual income.');
        return;
    }
    if (deductions < 0 || stateTaxRate < 0) {
        alert('Deductions and state tax rate cannot be negative.');
        return;
    }

    const taxableIncome = Math.max(0, annualIncome - deductions);

    // 2024 Federal Tax Brackets (simplified, example data)
    let federalTax = 0;
    const brackets = {
        single: [
            {min: 0, max: 11600, rate: 0.10}, // Updated 2024 example
            {min: 11600, max: 47150, rate: 0.12},
            {min: 47150, max: 100525, rate: 0.22},
            {min: 100525, max: 191950, rate: 0.24},
            {min: 191950, max: 243725, rate: 0.32},
            {min: 243725, max: 609350, rate: 0.35},
            {min: 609350, max: Infinity, rate: 0.37}
        ],
        'married-joint': [
            {min: 0, max: 23200, rate: 0.10}, // Updated 2024 example
            {min: 23200, max: 94300, rate: 0.12},
            {min: 94300, max: 201050, rate: 0.22},
            {min: 201050, max: 383900, rate: 0.24},
            {min: 383900, max: 487450, rate: 0.32},
            {min: 487450, max: 731200, rate: 0.35},
            {min: 731200, max: Infinity, rate: 0.37}
        ],
        // Simplified for married-separate and head, often half of married-joint or specific tables
        'married-separate': [ // Placeholder, typically half of married-joint
            {min: 0, max: 11600, rate: 0.10},
            {min: 11600, max: 47150, rate: 0.12},
            {min: 47150, max: 100525, rate: 0.22},
            {min: 100525, max: 191950, rate: 0.24},
            {min: 191950, max: 243725, rate: 0.32},
            {min: 243725, max: 365600, rate: 0.35},
            {min: 365600, max: Infinity, rate: 0.37}
        ],
        'head': [ // Placeholder, specific tables
            {min: 0, max: 16550, rate: 0.10},
            {min: 16550, max: 63100, rate: 0.12},
            {min: 63100, max: 100500, rate: 0.22},
            {min: 100500, max: 191950, rate: 0.24},
            {min: 191950, max: 243700, rate: 0.32},
            {min: 243700, max: 609350, rate: 0.35},
            {min: 609350, max: Infinity, rate: 0.37}
        ]
    };

    const taxBrackets = brackets[filingStatus] || brackets.single; // Default to single if status not found

    for (const bracket of taxBrackets) {
        if (taxableIncome > bracket.min) {
            const taxableAtThisBracket = Math.min(taxableIncome, bracket.max) - bracket.min;
            federalTax += taxableAtThisBracket * bracket.rate;
        }
    }

    const stateTax = taxableIncome * (stateTaxRate / 100);
    const totalTax = federalTax + stateTax;
    const afterTaxIncome = annualIncome - totalTax;
    let effectiveTaxRate = 0;
    if (annualIncome > 0) {
        effectiveTaxRate = (totalTax / annualIncome) * 100;
    }


    document.getElementById('total-tax').textContent = '$' + totalTax.toFixed(2);
    document.getElementById('taxable-income').textContent = '$' + taxableIncome.toFixed(2);
    document.getElementById('federal-tax').textContent = '$' + federalTax.toFixed(2);
    document.getElementById('state-tax').textContent = '$' + stateTax.toFixed(2);
    document.getElementById('after-tax-income').textContent = '$' + afterTaxIncome.toFixed(2);
    document.getElementById('effective-tax-rate').textContent = effectiveTaxRate.toFixed(1) + '%';
    document.getElementById('tax-result').classList.remove('hidden');
}

// Add some interactive effects
document.addEventListener('DOMContentLoaded', function() {
    // Animate elements on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animationDelay = '0.2s';
                entry.target.classList.add('animate-slide-up');
                observer.unobserve(entry.target); // Stop observing once animated
            }
        });
    }, observerOptions);

    // Observe calculator cards
    document.querySelectorAll('.glass-morphism').forEach(card => {
        observer.observe(card);
    });
});
