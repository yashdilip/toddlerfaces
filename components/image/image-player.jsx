import { HiPause, HiOutlinePlay, HiOutlineChevronLeft, HiOutlineChevronRight, HiOutlineXMark } from "react-icons/hi2";
import { HiOutlineCloudDownload } from "react-icons/hi";

export default function ImagePlayer({ onPlayPause, onPrev, onNext, onDownload, onClose, isPlaying }) {
  const buttons = [
    {
      id: 'hiOutlineChevronLeft',
      label: <HiOutlineChevronLeft/>,
      onClick: onPrev,
      className: 'mr-2'
    },
    {
      id: 'faPlayPause',
      label: isPlaying ? <HiPause/> : <HiOutlinePlay/>,
      onClick: onPlayPause,
      className: 'mr-2'
    },
    {
      id: 'hiOutlineChevronRight',
      label: <HiOutlineChevronRight/>,
      onClick: onNext,
      className: 'mr-2'
    },
    {
      id: 'hiOutlineCloudDownload',
      label: <HiOutlineCloudDownload/>,
      onClick: onDownload,
      className: 'mr-2'
    },
    {
      id: 'hiOutlineXMark',
      label: <HiOutlineXMark/>,
      onClick: onClose
    },
  ]

  return (
    <div className="flex flex-row ml-auto mt-4">
      {
        buttons.map((button) => (
          <button
            key={button.id}
            className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ${button.className}`}
            onClick={button.onClick}
            >
            {button.label}
          </button>
        ))
      }
    </div>
  )
}