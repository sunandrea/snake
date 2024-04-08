import React from "react";

const Leaderboard = ({ results }) => {
  return (
    <div className="leaderboard">
      <h2>Leaderboard</h2>
      <ul>
        {results &&
          results.map((result, index) => (
            <li key={index}>
              {index + 1}. {result.name}: {result.score}
            </li>
          ))}
      </ul>
    </div>
  );
};

export default Leaderboard;
