/* eslint-disable indent */
import { FILES_TYPES } from '@/constants/index'

function isSupportedVideo(type: string) {
  const videoElement = document.createElement('video')

  return !!videoElement.canPlayType(type).replace(/no/, '')
}

function isSupportedAudio(type: string) {
  const audioElement = document.createElement('audio')

  return !!audioElement.canPlayType(type).replace(/no/, '')
}

export function getFileType(fileType: string) {
  let type
  const isVideoSupported = isSupportedVideo(fileType)
  const isAudioSupported = isSupportedAudio(fileType)
  switch (true) {
    case fileType.startsWith('image'):
      type = FILES_TYPES.image
      break
    case fileType.startsWith('video'):
      type = isVideoSupported ? FILES_TYPES.video : FILES_TYPES.other
      break
    case fileType.startsWith('audio'):
      type = isAudioSupported ? FILES_TYPES.audio : FILES_TYPES.other
      break
    case fileType === 'application/pdf':
      type = FILES_TYPES.pdf
      break
    case fileType === 'text/plain':
      type = FILES_TYPES.text
      break
    case fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
    case fileType === 'application/msword':
      type = FILES_TYPES.word
      break
    case fileType === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':
    case fileType === 'application/vnd.ms-excel':
      type = FILES_TYPES.excel
      break
    case fileType === 'application/x-zip-compressed':
      type = FILES_TYPES.zip
      break
    default:
      type = FILES_TYPES.other
      break
  }

  return type
}
