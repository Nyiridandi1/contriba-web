import "./LoadingScreen.css";

function LoadingScreen() {
  return (
    <div className="loading-screen">
      <div className="loading-grid"></div>
      <div className="loading-orb loading-orb-one"></div>
      <div className="loading-orb loading-orb-two"></div>

      <div className="loading-card">
        <div className="loading-logo">
          <span></span>
          <span></span>
        </div>

        <h1>Contriba</h1>

        <p>Preparing your celebration experience...</p>

        <div className="loading-bar">
          <div></div>
        </div>
      </div>
    </div>
  );
}

export default LoadingScreen;