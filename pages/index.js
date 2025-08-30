import { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import image from "../public/image.png";
import image2 from "../public/image2.png";

export default function Home() {
  const [direction, setDirection] = useState('long');
  const [accountSize, setAccountSize] = useState(1000);

  console.log(image);


  const [risk, setRisk] = useState(50);
  const [leverage, setLeverage] = useState(50);
  const [riskReward, setRiskReward] = useState('');
  const [margin, setMargin] = useState('');

  const [A11, setA11] = useState('');
  const [A12, setA12] = useState('');
  const [D8, setD8] = useState('');
  const [E8, setE8] = useState('');
  const [I11, setI11] = useState('');
  const [I12, setI12] = useState('');

  const [high, setHigh] = useState(203.93);
  const [low, setLow] = useState(200.45);

  const [autoEntry, setAutoEntry] = useState('');
  const [autoTp, setAutoTp] = useState('');
  const [autoSl, setAutoSl] = useState('');
  const [autoQty, setAutoQty] = useState('');
  const [autoQtyPercentage, setAutoQtyPercentage] = useState('');

  const [autoL1Entry, setAutoL1Entry] = useState('');
  const [autoL1Tp, setAutoL1Tp] = useState('');
  const [autoL1Qty, setAutoL1Qty] = useState('');

  const [autoL2Entry, setAutoL2Entry] = useState('');
  const [autoL2Tp, setAutoL2Tp] = useState('');
  const [autoL2Qty, setAutoL2Qty] = useState('');

  const [entryProfit, setEntryProfit] = useState('');
  const [L1Profit, setL1Profit] = useState('');
  const [L2Profit, setL2Profit] = useState('');
  const [entryProfitPercentage, setEntryProfitPercentage] = useState('');
  const [L1ProfitPercentage, setL1ProfitPercentage] = useState('');
  const [L2ProfitPercentage, setL2ProfitPercentage] = useState('');

  const MANAGE_1 = 4
  const MANAGE_2 = 6

  const handleSubmit = (e) => {
    e?.preventDefault();
    const newDirection = e?.target?.direction?.value || direction;
    const newAccountSize = parseFloat(e?.target?.accountSize?.value) || accountSize;
    const newLeverage = parseFloat(e?.target?.leverage?.value) || leverage;
    const newRisk = parseFloat(e?.target?.risk?.value) || risk;
    const newHigh = parseFloat(e?.target?.high?.value) || high;
    const newLow = parseFloat(e?.target?.low?.value) || low;

    setDirection(newDirection);
    setAccountSize(newAccountSize);
    setLeverage(newLeverage);
    setRisk(newRisk);
    setHigh(newHigh);
    setLow(newLow);

    const newRiskReward = newRisk * newAccountSize / 100;
    setRiskReward(newRiskReward);

    const newAutoEntry = ((newHigh - newLow) * .618) + newLow;
    const newAutoTp = (newHigh - newLow) * 1.272 + newLow;
    const newAutoSl = (newHigh - newLow) * -0.05 + newLow;
    const newAutoL1Entry = ((newHigh - newLow) * .382) + newLow;
    const newAutoL2Entry = ((newHigh - newLow) * .17) + newLow;

    setAutoEntry(newAutoEntry.toFixed(2));
    setAutoTp(newAutoTp.toFixed(2));
    setAutoSl(newAutoSl.toFixed(2));
    setAutoL1Entry(newAutoL1Entry.toFixed(2));
    setAutoL2Entry(newAutoL2Entry.toFixed(2));

    const newA11 = (newAutoEntry + (newAutoL1Entry * 3)) / 4;
    const newA12 = (newAutoEntry + (newAutoL1Entry * 3) + (newAutoL2Entry * 5)) / 9;

    setA11(newA11.toFixed(2));
    setA12(newA12);

    const newD8 = newDirection === 'long' ?
      newRiskReward / (newA12 - newAutoSl) :
      newRiskReward / (newAutoSl - newA12);
    const newE8 = newDirection === 'long' ?
      newAutoTp - newAutoEntry :
      newAutoEntry - newAutoTp;

    setD8(newD8.toFixed(2));
    setE8(newE8.toFixed(2));

    const newI11 = (newD8 / 9) * 4;
    const newI12 = newD8;

    setI11(newI11.toFixed(2));
    setI12(newI12.toFixed(2));

    const newAutoQty = newD8 / 9;
    const newAutoQtyPercentage = newE8 / newAutoEntry * 100;

    setAutoQty(newAutoQty.toFixed(2));
    setAutoQtyPercentage(newAutoQtyPercentage);

    const newAutoL1Qty = newAutoQty * 3;
    setAutoL1Qty(newAutoL1Qty.toFixed(2));
    const newAutoL1Tp = newDirection === 'long' ?
      newA11 + ((newAutoQtyPercentage / 100 / MANAGE_1) * newA11) :
      newA11 - ((newAutoQtyPercentage / 100 / MANAGE_1) * newA11)
    setAutoL1Tp(newAutoL1Tp.toFixed(2));

    const newAutoL2Qty = newAutoQty * 5;
    setAutoL2Qty(newAutoL2Qty.toFixed(2));
    const newAutoL2Tp = newDirection === 'long' ?
      newA12 + ((newAutoQtyPercentage / 100 / MANAGE_2) * newA12) :
      newA12 - ((newAutoQtyPercentage / 100 / MANAGE_2) * newA12)
    setAutoL2Tp(newAutoL2Tp.toFixed(2));

    const newMargin = ((newA12 * I12) / ((newAccountSize * newLeverage) * 0.6)) * 100;
    setMargin(newMargin.toFixed(2));

    const entryProfit = newDirection === 'long' ?
      (newAutoTp * newAutoQty) - (newAutoEntry * newAutoQty) :
      (newAutoEntry * newAutoQty) - (newAutoTp * newAutoQty)
    setEntryProfit(entryProfit.toFixed(2));

    const entryProfitPercentage = entryProfit / accountSize * 100;
    setEntryProfitPercentage(entryProfitPercentage.toFixed(2));

    // =IF(B4="LONG",(E11*I11)-(A11*I11),(A11*I11)-(E11*I11))
    const L1Profit = newDirection === 'long' ?
      (newAutoL1Tp * newI11) - (newA11 * newI11) :
      (newA11 * newI11) - (newAutoL1Tp * newI11)
    setL1Profit(L1Profit.toFixed(2));

    const L1ProfitPercentage = L1Profit / accountSize * 100;
    setL1ProfitPercentage(L1ProfitPercentage.toFixed(2));
    // =IF(B4="LONG",(E12*I12)-(A12*I12),(A12*I12)-(E12*I12))
    const L2Profit = newDirection === 'long' ?
      (newAutoL2Tp * newI12) - (newA12 * newI12) :
      (newA12 * newI12) - (newAutoL2Tp * newI12)
    setL2Profit(L2Profit.toFixed(2));

    const L2ProfitPercentage = L2Profit / accountSize * 100;
    setL2ProfitPercentage(L2ProfitPercentage.toFixed(2));
  }

  useEffect(() => {
    handleSubmit();
  }, [direction, accountSize, leverage, risk, high, low]);

  return (
    <Layout>
      <div className='main'>
        <form>
          <div className='form-container'>
            <h2>Account</h2>
            <div className='form-element'>
              <input
                type="text"
                name="accountSize"
                value={accountSize}
                onChange={(e) => setAccountSize(parseFloat(e.target.value) || 0)}
                placeholder="Account Size"
              />
            </div>
            <label>
              <input
                type="radio"
                name="direction"
                value="long"
                checked={direction === 'long'}
                onChange={(e) => setDirection(e.target.value)}
              /> Long
            </label>
            <label>
              <input
                type="radio"
                name="direction"
                value="short"
                checked={direction === 'short'}
                onChange={(e) => setDirection(e.target.value)}
              /> Short
            </label>
          </div>

          <div className='form-container'>
            <h2>High/Low</h2>
            <div className='form-element'>
              <input
                type="text"
                name="high"
                value={high}
                onChange={(e) => setHigh(parseFloat(e.target.value) || 0)}
                placeholder="High"
              />
            </div>
            <div className='form-element'>
              <input
                type="text"
                name="low"
                value={low}
                onChange={(e) => setLow(parseFloat(e.target.value) || 0)}
                placeholder="Low"
              />
            </div>
          </div>

          <div className='form-container'>
            <h2>Risk/Leverage</h2>
            <div className='form-element'>
              <label>Risk</label>
              <input
                type="text"
                name="risk"
                value={risk}
                onChange={(e) => setRisk(parseFloat(e.target.value) || 0)}
                placeholder="Risk"
              />
            </div>
            <div className='form-element'>
              <label>Leverage</label>
              <input
                type="text"
                name="leverage"
                value={leverage}
                onChange={(e) => setLeverage(parseFloat(e.target.value) || 0)}
                placeholder="Leverage"
              />
            </div>
          </div>
        </form>

        <div>
          <h1>Positions</h1>
          <div className='positions'>
            <div className='positions-header'>{direction.toUpperCase()}</div>
            <div className='positions-header'>Price</div>
            <div className='positions-header'>Qty</div>
            <div className='positions-header' >TP</div>
            <div className='positions-header' >Profit</div>
            <div className='positions-header' >Profit %</div>

            <div className='positions-title'>Entry</div>
            <div>{autoEntry}</div>
            <div>{autoQty}</div>
            <div>{autoTp}</div>
            <div>{entryProfit}</div>
            <div>{entryProfitPercentage}</div>

            <div className='positions-title'>L1</div>
            <div>{autoL1Entry}</div>
            <div>{autoL1Qty}</div>
            <div>{autoL1Tp}</div>
            <div>{L1Profit}</div>
            <div>{L1ProfitPercentage}</div>

            <div className='positions-title'>L2</div>
            <div>{autoL2Entry}</div>
            <div>{autoL2Qty}</div>
            <div>{autoL2Tp}</div>
            <div>{L2Profit}</div>
            <div>{L2ProfitPercentage}</div>

            <div className='positions-title'>SL</div>
            <div>{autoSl}</div>
            <div>{D8}</div>
            <div></div>
            <div>{-riskReward}</div>
            <div>{-risk}</div>

            <div className='positions-title'>Leverage</div>
            <div>{leverage}</div>
            <div className='positions-title'>Margin</div>
            <div>{margin}</div>
            <div className='positions-title'>Account</div>
            <div>{accountSize}</div>
          </div>

          <hr />

          <img src={image.src} alt="image" />
          <img src={image2.src} alt="image2" />

          <h1>Debug</h1>
          <h2>Results</h2>

          <h2>High/Low auto calculator</h2>
          <p>High: <span id="high">{high}</span></p>
          <p>Low: <span id="low">{low}</span></p>
          <hr />
          <p>auto entry : {autoEntry}</p>
          <p>auto tp : {autoTp}</p>
          <p>auto sl : {autoSl}</p>
          <p>Qty : {autoQty}</p>
          <p>Qty Percentage : {autoQtyPercentage}</p>
          <hr />
          <p>auto l1 entry : {autoL1Entry}</p>
          <p>auto l1 tp : {autoL1Tp}</p>
          <p>auto l1 qty : {autoL1Qty}</p>
          <hr />
          <p>auto l2 entry : {autoL2Entry}</p>
          <p>auto l2 tp : {autoL2Tp}</p>
          <p>auto l2 qty : {autoL2Qty}</p>
          <hr />
          <p>Direction: <span id="direction">{direction}</span></p>
          <p>Account Size: <span id="accountSize">{accountSize}</span></p>
          <p>Risk: <span id="risk">{risk}</span></p>
          <p>Risk Reward: <span id="riskReward">{riskReward}</span></p>
          <p>Leverage: <span id="leverage">{leverage}</span></p>
          <hr />


          <hr />

          <div>
            A11 :  {A11} <br />
            A12 : {A12} <br />

            D8 : {D8} <br />
            E8 : {E8} <br />

            I11 : {I11} <br />
            I12 : {I12} <br />
          </div>
        </div>
      </div>
    </Layout>
  );
}
