const path = require('path');
const { atomicWrite } = require('./write_file');

const args = process.argv.slice(2);
const verbose = args.includes('--verbose') || args.includes('-v');

function log(message) {
    if (verbose) {
        console.log(message);
    }
}

const experimentDir = path.join(__dirname, '..', '..', 'pinescript-experiment-stress');

const files = [
    { name: 'sma.pine', content: '//@version=5\nindicator("Simple Moving Average")\nlen = input(14, "Length")\nplot(ta.sma(close, len))' },
    { name: 'ema.pine', content: '//@version=5\nindicator("Exponential Moving Average")\nlen = input(14, "Length")\nplot(ta.ema(close, len))' },
    { name: 'rsi.pine', content: '//@version=5\nindicator("RSI")\nlen = input(14, "Length")\nplot(ta.rsi(close, len))' },
    { name: 'macd.pine', content: '//@version=5\nindicator("MACD")\nfast = input(12)\nslow = input(26)\nplot(ta.macd(close, fast, slow, 9))' },
    { name: 'bb.pine', content: '//@version=5\nindicator("Bollinger Bands")\nlen = input(20, "Length")\nplot(ta.sma(close, len))' },
    { name: 'stoch.pine', content: '//@version=5\nindicator("Stochastic")\nplot(ta.stoch(close, high, low, 14))' },
    { name: 'atr.pine', content: '//@version=5\nindicator("ATR")\nplot(ta.atr(14))' },
    { name: 'cci.pine', content: '//@version=5\nindicator("CCI")\nplot(ta.cci(close, 20))' },
    { name: 'sar.pine', content: '//@version=5\nindicator("Parabolic SAR")\nplot(ta.sar(0.02, 0.02, 0.2))' },
    { name: 'vwap.pine', content: '//@version=5\nindicator("VWAP")\nplot(ta.vwap(close))' }
];

const modifications = [
    { name: 'sma.pine', content: '//@version=5\nindicator("Simple Moving Average")\nlen = input(20, "Length")\nplot(ta.sma(close, len))' },
    { name: 'ema.pine', content: '//@version=5\nindicator("Exponential Moving Average")\nlen = input(50, "Length")\nplot(ta.ema(close, len))' },
    { name: 'rsi.pine', content: '//@version=5\nindicator("RSI")\nlen = input(7, "Length")\nplot(ta.rsi(close, len))' },
    { name: 'macd.pine', content: '//@version=5\nindicator("MACD")\nfast = input(10)\nslow = input(26)\nplot(ta.macd(close, fast, slow, 9))' },
    { name: 'bb.pine', content: '//@version=5\nindicator("Bollinger Bands")\nlen = input(21, "Length")\nplot(ta.sma(close, len))' }
];

async function runStressTest() {
    console.log('Starting Stress Test...');
    console.log(`Target Directory: ${experimentDir}`);

    // Phase 1: Creation
    console.log('\n--- Phase 1: Creating 10 Files ---');
    for (const file of files) {
        const targetPath = path.join(experimentDir, file.name);
        log(`Creating ${file.name}...`);
        try {
            atomicWrite(targetPath, Buffer.from(file.content), { verbose });
        } catch (e) {
            console.error(`Failed to create ${file.name}:`, e);
        }
        // Small delay to simulate human-like pacing if needed, but not strictly required by protocol
        // await new Promise(r => setTimeout(r, 100));
    }

    // Phase 2: Modification
    console.log('\n--- Phase 2: Modifying 5 Files ---');
    for (const mod of modifications) {
        const targetPath = path.join(experimentDir, mod.name);
        log(`Modifying ${mod.name}...`);
        try {
            atomicWrite(targetPath, Buffer.from(mod.content), { verbose });
        } catch (e) {
            console.error(`Failed to modify ${mod.name}:`, e);
        }
    }

    console.log('\nStress Test Complete.');
}

runStressTest();
