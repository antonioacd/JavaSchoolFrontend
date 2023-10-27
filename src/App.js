import './App.css';

import Header from './Header';
import AppContent from './AppContent';

function App() {
  return (
    <div className="App">
      <Header pageTitle="Frontend authenticated with JWT"/>
      <div className="container-fluid">
        <div className="row">
          <div className="col">
            <AppContent />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
