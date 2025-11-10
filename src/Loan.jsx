function Loan() {
    return (
        <div className="page-container">
            <div className="card">
                <h2>M-Shwari</h2>
                <p className="muted">loan @9% incl. of excise duty for 30 days</p>
                <div className="grid-actions">
                    <button className="btn primary" onClick={() => alert("You will receive a message with the loan offers you're qualified for.")}>Request Loan</button>
                    <button className="btn" onClick={() => alert("Payment initiated. Follow instructions sent to your phone to complete paying the loan.")}>Pay Loan</button>
                    <button className="btn" onClick={() => alert("Your current loan limit is KES 15,000. Visit profile to request an increase.")}>Check Loan Limit</button>
                    <button className="btn" onClick={() => alert("Loan balance: KES 1,250. Next due date: 2025-10-30")}>Loan Balance</button>
                </div>
                <div style={{ marginTop: 12 }}>
                    <a className="link" href="/Dashboard">Back</a>
                </div>
            </div>
        </div>
    );
}

export default Loan;