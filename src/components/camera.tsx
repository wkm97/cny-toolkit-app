import { css } from "../../styled-system/css"
import { button } from "./atomic/button"

interface CameraInfo {
  source: string
  file: File,
  target: EventTarget & HTMLInputElement
}

interface CameraProps {
  onCapture: (data: CameraInfo) => void
}

export const Camera = ({ onCapture }: CameraProps) => {

  const handleCapture: React.ChangeEventHandler<HTMLInputElement> = (event) => {
    const { target } = event
    if (target.files) {
      if (target.files.length !== 0) {
        const file = target.files[0];
        const newUrl = URL.createObjectURL(file);
        onCapture({ source: newUrl, file: file, target })
      }
    }
  }

  return (
      <div className={css({ position: 'fixed', bottom: 0, py: 2 })}>
        <button
          className={button({ visual: 'solid', size: 'lg', borderRadius: 'full' })}
          aria-label="upload picture"
        >
          <input
            className={css({ display: 'none' })}
            accept="image/*"
            id="icon-button-file"
            type="file"
            capture="environment"
            onChange={(e) => handleCapture(e)}
          />
          <label htmlFor="icon-button-file">
            Capture
          </label>
        </button>
      </div>
  )
}