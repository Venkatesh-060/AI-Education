import { useEffect, useState } from "react";
import {
  getRaisedHands,
  approveHand,
  dismissHand,
} from "../services/raiseHandService";

export default function RaiseHandPanel({ sessionId }) {
  const [hands, setHands] = useState([]);

  const loadHands = async () => {
    try {
      const res = await getRaisedHands(sessionId);
      setHands(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (!sessionId) return;

    loadHands();

    const interval = setInterval(loadHands, 2000);

    return () => clearInterval(interval);
  }, [sessionId]);

  const handleApprove = async (id) => {
    try {
      await approveHand(id);
      loadHands();
    } catch (error) {
      console.error(error);
    }
  };

  const handleDismiss = async (id) => {
    try {
      await dismissHand(id);
      loadHands();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="raiseHandPanel">
      <div className="raiseHeader">
        <h3>✋ Raised Hands</h3>
        <span>{hands.length} Requests</span>
      </div>

      {hands.length === 0 ? (
        <div className="emptyRaise">
          <h4>No Raised Hands</h4>
          <p>Students who raise their hands will appear here.</p>
        </div>
      ) : (
        hands.map((hand) => (
          <div className="handCard" key={hand.id}>
            <div className="handTop">
              <div>
                <h4>{hand.studentName}</h4>

                <small>Student</small>
              </div>

              <span className={`handStatus ${hand.status.toLowerCase()}`}>
                {hand.status}
              </span>
            </div>

            {hand.status === "PENDING" && (
              <div className="handButtons">
                <button
                  className="approveBtn"
                  onClick={() => handleApprove(hand.id)}
                >
                  ✓ Approve
                </button>

                <button
                  className="dismissBtn"
                  onClick={() => handleDismiss(hand.id)}
                >
                  ✕ Dismiss
                </button>
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
}
