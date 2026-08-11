const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');

const replacements = [
    {
        file: 'App.tsx',
        replacements: [
            ['./components/Header', './components/layout/Header/Header']
        ]
    },
    {
        file: 'components/items/ExpenseItem/ExpenseItem.tsx',
        replacements: [
            ['../types/Expense', '../../../types/Expense'],
            ['../utils/formatters', '../../../utils/formatters']
        ]
    },
    {
        file: 'components/items/IncomeItem/IncomeItem.tsx',
        replacements: [
            ['../types/Income', '../../../types/Income'],
            ['../utils/formatters', '../../../utils/formatters']
        ]
    },
    {
        file: 'components/items/WalletItem/WalletItem.tsx',
        replacements: [
            ['../types/Wallet', '../../../types/Wallet'],
            ['../utils/formatters', '../../../utils/formatters']
        ]
    },
    {
        file: 'components/ui/MonthSlider/MonthSlider.tsx',
        replacements: [
            ['../utils/monthUtils', '../../../utils/monthUtils'],
            ['../stores/monthStore', '../../../stores/monthStore']
        ]
    },
    {
        file: 'pages/Dashboard.tsx',
        replacements: [
            ['../components/InfoCard', '../components/ui/InfoCard/InfoCard']
        ]
    },
    {
        file: 'pages/Expenses.tsx',
        replacements: [
            ['../components/PrimaryButton', '../components/ui/PrimaryButton/PrimaryButton'],
            ['../components/DynamicModal', '../components/ui/DynamicModal/DynamicModal'],
            ['../components/ExpenseForm', '../components/forms/ExpenseForm/ExpenseForm'],
            ['../components/ExpenseItem', '../components/items/ExpenseItem/ExpenseItem']
        ]
    },
    {
        file: 'pages/Goals.tsx',
        replacements: [
            ['../components/PrimaryButton', '../components/ui/PrimaryButton/PrimaryButton']
        ]
    },
    {
        file: 'pages/Incomes.tsx',
        replacements: [
            ['../components/PrimaryButton', '../components/ui/PrimaryButton/PrimaryButton'],
            ['../components/DynamicModal', '../components/ui/DynamicModal/DynamicModal'],
            ['../components/IncomeForm', '../components/forms/IncomeForm/IncomeForm'],
            ['../components/IncomeItem', '../components/items/IncomeItem/IncomeItem']
        ]
    },
    {
        file: 'pages/Wallets.tsx',
        replacements: [
            ['../components/PrimaryButton', '../components/ui/PrimaryButton/PrimaryButton'],
            ['../components/DynamicModal', '../components/ui/DynamicModal/DynamicModal'],
            ['../components/WalletForm', '../components/forms/WalletForm/WalletForm'],
            ['../components/WalletItem', '../components/items/WalletItem/WalletItem']
        ]
    }
];

for (const item of replacements) {
    const filePath = path.join(srcDir, item.file);
    if (!fs.existsSync(filePath)) {
        console.warn(`File not found: ${filePath}`);
        continue;
    }
    let content = fs.readFileSync(filePath, 'utf8');
    for (const [from, to] of item.replacements) {
        content = content.replace(from, to);
    }
    fs.writeFileSync(filePath, content);
    console.log(`Updated ${item.file}`);
}
