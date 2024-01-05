import { useState } from 'react'
import './App.css'

function App() {
  const [source, setSource] = useState("")

  const handleCapture: React.ChangeEventHandler<HTMLInputElement> = (event) => {
    const {target} = event
    if (target.files) {
      if (target.files.length !== 0) {
        const file = target.files[0];
        const newUrl = URL.createObjectURL(file);
        setSource(newUrl);
      }
    }
  }

  return (
    <>
      <h1>Vite + React</h1>
      <div className="card">
        {source &&
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <img src={source} alt="snap"></img>
          </div>}
        <input
          accept="image/*"
          id="icon-button-file"
          type="file"
          capture="environment"
          style={{ display: 'none' }}
          onChange={(e) => handleCapture(e)}
        />
        <button
          color="primary"
          aria-label="upload picture"
        >
          <label htmlFor="icon-button-file">
            Capture
          </label>
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}

export default App
