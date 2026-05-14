import { HiPause, HiOutlinePlay, HiOutlineChevronLeft, HiOutlineChevronRight, HiOutlineXMark } from "react-icons/hi2";
import { HiOutlineCloudDownload } from "react-icons/hi";

export default function ImagePlayer({ onPlayPause, onPrev, onNext, onDownload, onClose, isPlaying }) {
  const buttons = [
    {
      id: 'hiOutlineChevronLeft',
      label: <HiOutlineChevronLeft/>,
      onClick: onPrev,
      className: ''
    },
    {
      id: 'faPlayPause',
      label: isPlaying ? <HiPause/> : <HiOutlinePlay/>,
      onClick: onPlayPause,
      className: ''
    },
    {
      id: 'hiOutlineChevronRight',
      label: <HiOutlineChevronRight/>,
      onClick: onNext,
      className: ''
    },
    {
      id: 'hiOutlineCloudDownload',
      label: <HiOutlineCloudDownload/>,
      onClick: onDownload,
      className: ''
    },
    {
      id: 'hiOutlineXMark',
      label: <HiOutlineXMark/>,
      onClick: onClose
    },
  ]

  return (
    <div className="ml-auto mt-4 flex flex-row gap-2 rounded-full border border-white/15 bg-black/55 p-2 shadow-2xl backdrop-blur">
      {
        buttons.map((button) => (
          <button
            key={button.id}
            className={`inline-flex h-10 w-10 items-center justify-center rounded-full bg-white text-lg text-gray-950 transition hover:bg-gray-200 ${button.className}`}
            onClick={button.onClick}
            type="button"
            aria-label={button.id}
            >
            {button.label}
          </button>
        ))
      }
    </div>
  )
}
