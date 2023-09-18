import { FileVideo, Upload } from "lucide-react";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Separator } from "./ui/separator";
import { ChangeEvent, FormEvent, useMemo, useRef, useState } from "react";
import { getFFmpeg } from "@/lib/ffmpeg";
import { fetchFile } from '@ffmpeg/util'
import { api } from "@/lib/axios";

type Status = 'waiting' | 'converting' | 'uploading' | 'generating' | 'success'

const statusMessagens = {
  converting: 'Convertendo...',
  generating: 'Transcrevendo...',
  uploading: 'Carregando...',
  success: 'Sucesso!'
}

interface VideoInputFormProps{
  onVideoUploaded: (videoId: string) => void
}

export function VideoInputForm({onVideoUploaded}: VideoInputFormProps){
  const [videoFile, setVideoFile] = useState<File | null>(null)
  const [ status, setStatus ] = useState<Status>('waiting')
  const promptInputRef = useRef<HTMLTextAreaElement>(null)

  function handleFilesSelected(event: ChangeEvent<HTMLInputElement>){
    const { files } = event.currentTarget

    if(!files) return

    const selected = files[0]

    setVideoFile(selected)
  }

  async function convertVideoToAudio(video: File){
    console.log('Convert started.')

    const ffmpeg = await getFFmpeg()

    await ffmpeg.writeFile('input.mp4', await fetchFile(video))

    ffmpeg.on('progress', progress => {
      console.log('Convert progress: ' + Math.round(progress.progress * 100))
    })

    await ffmpeg.exec([
      '-i',
      'input.mp4',
      '-map',
      '0:a',
      '-b:a',
      '20k',
      '-acodec',
      'libmp3lame',
      'output.mp3'
    ])

    const data = await ffmpeg.readFile('output.mp3')

    const audioFileBlob = new Blob([data], { type: 'audio/mp3' })
    const audioFile = new File([audioFileBlob], 'output.mp3', {
      type: 'audio/mpeg'
    })

    console.log('Convert finished.')

    return audioFile
  }

  async function handleUploadVideo(event: FormEvent<HTMLFormElement>){
    event.preventDefault()

    const prompt = promptInputRef.current?.value

    if(!videoFile){ 
      return
    }

    setStatus('converting')

    const audioFile = await convertVideoToAudio(videoFile)

    const data = new FormData()

    data.append('file', audioFile)

    setStatus('uploading')

    const response = await api.post('/videos', data)

    const videoId = response.data.video.id

    setStatus('generating')

    await api.post(`/videos/${videoId}/transcription`, {
      prompt
    })

    setStatus('success')
    onVideoUploaded(videoId)
  }

  const previewURL = useMemo(() => {
    if(!videoFile){
      return null
    }

    return URL.createObjectURL(videoFile)
  }, [videoFile])

  return (
    <form onSubmit={handleUploadVideo} className='space-y-6'>
            <label 
              htmlFor='video'
              className='relative flex border rounded-md aspect-video cursor-pointer border-dashed text-sm text-muted-foreground items-center justify-center gap-2 flex-col hover:bg-primary/5'
            >
              {previewURL ? (
                <video src={previewURL} controls={false} className='pointer-events-none absolute inset-0'/>
              ) : (
                <>
                  <FileVideo className='w-4 h-4'/>
                  Selecione um vídeo
                </>
              )}
            </label>

            <input type='file' id='video' accept='video/mp4' className='sr-only' onChange={handleFilesSelected}/>

            <Separator />

            <div className='space-y-2'>
              <Label htmlFor='transcription_prompt'>Prompt de transcrição</Label>
              <Textarea 
                ref={promptInputRef}
                disabled={status !== 'waiting'}
                id='transcription_prompt'
                placeholder='Inclua palavras-chave mencionadas no vídeo separadas por vírgula (,)'
                className='h-20 leading-relaxed resize-none'
              />
            </div>

            <Button 
              disabled={status !== 'waiting'} 
              data-success={status === 'success'}
              type='submit' 
              className='w-full data-[success=true]:bg-emerald-400'
            >
              {status === 'waiting' ? (
                <>
                  Carregar vídeo
                  <Upload className='h-4 w-4 ml-2'/>
                </>
              ): statusMessagens[status]}
            </Button>
          </form>
  )
}