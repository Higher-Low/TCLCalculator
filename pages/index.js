import { useCallback, useEffect, useMemo, useState } from 'react';
import Layout from '../components/Layout';
import image from "../public/image.png";
import image2 from "../public/image2.png";

export default function Home() {
  // Consolidated state
  const [formData, setFormData] = useState({
    direction: 'long',
    accountSize: 1000,
    risk: 50,
    leverage: 50,
    high: 203.93,
    low: 200.45
  });

  // Constants
  const MANAGE_1 = 4;
  const MANAGE_2 = 6;

  // Memoized calculations
  const calculations = useMemo(() => {
    const { direction, accountSize, risk, leverage, high, low } = formData;

    const riskReward = risk * accountSize / 100;
    const range = high - low;

    // Entry points
    const autoEntry = (range * 0.618) + low;
    const autoL1Entry = (range * 0.382) + low;
    const autoL2Entry = (range * 0.17) + low;

    // Take profit and stop loss
    const autoTp = (range * 1.272) + low;
    const autoSl = (range * -0.05) + low;

    // Weighted averages
    const A11 = (autoEntry + (autoL1Entry * 3)) / 4;
    const A12 = (autoEntry + (autoL1Entry * 3) + (autoL2Entry * 5)) / 9;

    // Position sizing
    const D8 = direction === 'long'
      ? riskReward / (A12 - autoSl)
      : riskReward / (autoSl - A12);
    const E8 = direction === 'long'
      ? autoTp - autoEntry
      : autoEntry - autoTp;

    const I11 = (D8 / 9) * 4;
    const I12 = D8;

    // Quantities
    const autoQty = D8 / 9;
    const autoQtyPercentage = E8 / autoEntry * 100;
    const autoL1Qty = autoQty * 3;
    const autoL2Qty = autoQty * 5;

    // Take profit levels
    const autoL1Tp = direction === 'long'
      ? A11 + ((autoQtyPercentage / 100 / MANAGE_1) * A11)
      : A11 - ((autoQtyPercentage / 100 / MANAGE_1) * A11);

    const autoL2Tp = direction === 'long'
      ? A12 + ((autoQtyPercentage / 100 / MANAGE_2) * A12)
      : A12 - ((autoQtyPercentage / 100 / MANAGE_2) * A12);

    // Margin calculation
    const margin = ((A12 * I12) / ((accountSize * leverage) * 0.6)) * 100;

    // Profit calculations
    const calculateProfit = (entry, tp, qty) => {
      return direction === 'long'
        ? (tp * qty) - (entry * qty)
        : (entry * qty) - (tp * qty);
    };

    const entryProfit = calculateProfit(autoEntry, autoTp, autoQty);
    const L1Profit = calculateProfit(A11, autoL1Tp, I11);
    const L2Profit = calculateProfit(A12, autoL2Tp, I12);

    // Profit percentages
    const entryProfitPercentage = (entryProfit / accountSize) * 100;
    const L1ProfitPercentage = (L1Profit / accountSize) * 100;
    const L2ProfitPercentage = (L2Profit / accountSize) * 100;

    return {
      riskReward,
      autoEntry: autoEntry.toFixed(2),
      autoTp: autoTp.toFixed(2),
      autoSl: autoSl.toFixed(2),
      autoL1Entry: autoL1Entry.toFixed(2),
      autoL1Tp: autoL1Tp.toFixed(2),
      autoL2Entry: autoL2Entry.toFixed(2),
      autoL2Tp: autoL2Tp.toFixed(2),
      A11: A11.toFixed(2),
      A12: A12.toFixed(2),
      D8: D8.toFixed(2),
      E8: E8.toFixed(2),
      I11: I11.toFixed(2),
      I12: I12.toFixed(2),
      autoQty: autoQty.toFixed(2),
      autoQtyPercentage: autoQtyPercentage.toFixed(2),
      autoL1Qty: autoL1Qty.toFixed(2),
      autoL2Qty: autoL2Qty.toFixed(2),
      margin: margin.toFixed(2),
      entryProfit: entryProfit.toFixed(2),
      L1Profit: L1Profit.toFixed(2),
      L2Profit: L2Profit.toFixed(2),
      entryProfitPercentage: entryProfitPercentage.toFixed(2),
      L1ProfitPercentage: L1ProfitPercentage.toFixed(2),
      L2ProfitPercentage: L2ProfitPercentage.toFixed(2)
    };
  }, [formData]);

  // Optimized form handler
  const handleInputChange = useCallback((field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: typeof value === 'number' ? value : value
    }));
  }, []);

  // Form submission handler
  const handleSubmit = useCallback((e) => {
    e?.preventDefault();
  }, []);

  // Auto-calculate on form data changes
  useEffect(() => {
    // Calculations are automatically updated via useMemo
  }, [formData]);

  return (
    <Layout>
      <div className='main'>
        <form onSubmit={handleSubmit}>
          <div className='form-container'>
            <h2>Account</h2>
            <div className='form-element'>
              <input
                type="number"
                name="accountSize"
                value={formData.accountSize}
                onChange={(e) => handleInputChange('accountSize', parseFloat(e.target.value) || 0)}
                placeholder="Account Size"
              />
            </div>
            <div className='radio-group'>
              <label>
                <input
                  type="radio"
                  name="direction"
                  value="long"
                  checked={formData.direction === 'long'}
                  onChange={(e) => handleInputChange('direction', e.target.value)}
                /> Long
              </label>
              <label>
                <input
                  type="radio"
                  name="direction"
                  value="short"
                  checked={formData.direction === 'short'}
                  onChange={(e) => handleInputChange('direction', e.target.value)}
                /> Short
              </label>
            </div>
          </div>

          <div className='form-container'>
            <h2>High/Low</h2>
            <div className='form-element'>
              <input
                type="number"
                step="0.01"
                name="high"
                value={formData.high}
                onChange={(e) => handleInputChange('high', parseFloat(e.target.value) || 0)}
                placeholder="High"
              />
            </div>
            <div className='form-element'>
              <input
                type="number"
                step="0.01"
                name="low"
                value={formData.low}
                onChange={(e) => handleInputChange('low', parseFloat(e.target.value) || 0)}
                placeholder="Low"
              />
            </div>
          </div>

          <div className='form-container'>
            <h2>Risk/Leverage</h2>
            <div className='form-element'>
              <label>Risk (%)</label>
              <input
                type="number"
                name="risk"
                value={formData.risk}
                onChange={(e) => handleInputChange('risk', parseFloat(e.target.value) || 0)}
                placeholder="Risk"
              />
            </div>
            <div className='form-element'>
              <label>Leverage</label>
              <input
                type="number"
                name="leverage"
                value={formData.leverage}
                onChange={(e) => handleInputChange('leverage', parseFloat(e.target.value) || 0)}
                placeholder="Leverage"
              />
            </div>
          </div>
        </form>

        <div>
          <h1>Positions</h1>
          <div className='positions'>
            <div className='positions-header'>{formData.direction.toUpperCase()}</div>
            <div className='positions-header'>Price</div>
            <div className='positions-header'>Qty</div>
            <div className='positions-header'>TP</div>
            <div className='positions-header'>Profit</div>
            <div className='positions-header'>Profit %</div>

            <div className='positions-title'>Entry</div>
            <div>{calculations.autoEntry}</div>
            <div>{calculations.autoQty}</div>
            <div>{calculations.autoTp}</div>
            <div>{calculations.entryProfit}</div>
            <div>{calculations.entryProfitPercentage}%</div>

            <div className='positions-title'>L1</div>
            <div>{calculations.autoL1Entry}</div>
            <div>{calculations.autoL1Qty}</div>
            <div>{calculations.autoL1Tp}</div>
            <div>{calculations.L1Profit}</div>
            <div>{calculations.L1ProfitPercentage}%</div>

            <div className='positions-title'>L2</div>
            <div>{calculations.autoL2Entry}</div>
            <div>{calculations.autoL2Qty}</div>
            <div>{calculations.autoL2Tp}</div>
            <div>{calculations.L2Profit}</div>
            <div>{calculations.L2ProfitPercentage}%</div>

            <div className='positions-title'>SL</div>
            <div>{calculations.autoSl}</div>
            <div>{calculations.D8}</div>
            <div></div>
            <div>{-calculations.riskReward}</div>
            <div>{-formData.risk}%</div>

            <div className='positions-title'>Leverage</div>
            <div>{formData.leverage}</div>
            <div className='positions-title'>Margin</div>
            <div>{calculations.margin}%</div>
            <div className='positions-title'>Account</div>
            <div>{formData.accountSize}</div>
          </div>

          <hr />

          <img src={image.src} alt="Trading chart 1" />
          <img src={image2.src} alt="Trading chart 2" />

          <h1>Debug</h1>
          <h2>Results</h2>

          <h2>High/Low auto calculator</h2>
          <p>High: <span id="high">{formData.high}</span></p>
          <p>Low: <span id="low">{formData.low}</span></p>
          <hr />
          <p>auto entry: {calculations.autoEntry}</p>
          <p>auto tp: {calculations.autoTp}</p>
          <p>auto sl: {calculations.autoSl}</p>
          <p>Qty: {calculations.autoQty}</p>
          <p>Qty Percentage: {calculations.autoQtyPercentage}%</p>
          <hr />
          <p>auto l1 entry: {calculations.autoL1Entry}</p>
          <p>auto l1 tp: {calculations.autoL1Tp}</p>
          <p>auto l1 qty: {calculations.autoL1Qty}</p>
          <hr />
          <p>auto l2 entry: {calculations.autoL2Entry}</p>
          <p>auto l2 tp: {calculations.autoL2Tp}</p>
          <p>auto l2 qty: {calculations.autoL2Qty}</p>
          <hr />
          <p>Direction: <span id="direction">{formData.direction}</span></p>
          <p>Account Size: <span id="accountSize">{formData.accountSize}</span></p>
          <p>Risk: <span id="risk">{formData.risk}</span></p>
          <p>Risk Reward: <span id="riskReward">{calculations.riskReward}</span></p>
          <p>Leverage: <span id="leverage">{formData.leverage}</span></p>
          <hr />

          <div>
            A11: {calculations.A11} <br />
            A12: {calculations.A12} <br />
            D8: {calculations.D8} <br />
            E8: {calculations.E8} <br />
            I11: {calculations.I11} <br />
            I12: {calculations.I12} <br />
          </div>
        </div>
      </div>
    </Layout>
  );
}
