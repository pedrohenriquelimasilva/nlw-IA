import { FileVideo, Github, Upload, Wand2 } from "lucide-react";
import { Button } from "./components/ui/button";
import { Separator } from "./components/ui/separator";
import { Textarea } from "./components/ui/textarea";
import { Label } from "./components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./components/ui/select";
import { Slider } from "./components/ui/slider";

export function App() {
  return (
    <div className='min-h-screen flex flex-col'>
      <div className='px-6 py-3 flex items-center justify-between border-b'>
        <h1 className='text-xl font-bold'>upload.ia</h1>

        <div className='flex items-center gap-3' >
          <span className='text-sm text-muted-foreground'>Desenvolvido por 💜 no NLW da Rocketseat</span>

          <Separator orientation='vertical' className='h-6'/>
          <Button variant='outline'>
            <Github className='w-4 h-4 mr-2' />
            Github
          </Button>
        </div>
      </div>
      <main className='flex-1 p-6 flex gap-6'>
        <div className='flex-1 flex flex-col gap-4'>
            <div className='flex-1 grid grid-rows-2 gap-4'>
              <Textarea 
                placeholder='Inclua o prompt para a IA...' 
                className='p-4 resize-none leading-relaxed'
              />
              <Textarea 
                placeholder='Resultado gerado pela IA...' 
                className='p-4 resize-none leading-relaxed' 
                readOnly
              />
            </div>
            <p className='text-sm text-muted-foreground'>
              Lembre-se: você pode utilizar a variável <code className='text-violet-400'>{'transcription'}</code> no seu prompt para adicionar o conteúdo da transcrição do vídeo selecionado.
            </p>
        </div>
        <aside className='w-80 space-y-6'>
          <form className='space-y-6'>
            <label 
              htmlFor='video'
              className='flex border rounded-md aspect-video cursor-pointer border-dashed text-sm text-muted-foreground items-center justify-center gap-2 flex-col hover:bg-primary/5'
            >
              <FileVideo className='w-4 h-4'/>
              Selecione um vídeo
            </label>

            <input type='file' id='video' accept='video/mp4' className='sr-only'/>

            <Separator />

            <div className='space-y-2'>
              <Label htmlFor='transcription_prompt'>Prompt de transcrição</Label>
              <Textarea 
                id='transcription_prompt'
                placeholder='Inclua palavras-chave mencionadas no vídeo separadas por vírgula (,)'
                className='h-20 leading-relaxed resize-none'
              />
            </div>

            <Button type='submit' className='w-full'>
              Carregar vídeo
              <Upload className='h-4 w-4 ml-2'/>
            </Button>
          </form>

          <Separator />

          <form className='space-y-6'>
          <div className='space-y-2'>
              <Label>Prompt</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder='Selecione um prompt...' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='value'>Título do Youtube</SelectItem>
                  <SelectItem value='description'>Descrição do Youtube</SelectItem>
                </SelectContent>
              </Select>
            </div> 

            <div className='space-y-2'>
              <Label>Model</Label>
              <Select disabled defaultValue='gpt3.5'>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='gpt3.5'>GPT 3.5-turbo 16k</SelectItem>
                </SelectContent>
              </Select>

              <span className='block text-xs text-muted-foreground italic'>Você poderá customizar essa opção em breve</span>
            </div>

            <Separator />

            <div className='space-y-4'>
              <Label>Temperatura</Label>
              
              <Slider min={0} max={1} step={0.1} />

              <span className='block text-xs text-muted-foreground italic leading-relaxed'>Valores mais altos tendem a deixar o resultado mais criativo e com possíveis erros</span>
            </div>

            <Separator />

            <Button type='submit' className='w-full'>
              Executar
              <Wand2 className='h-4 w-4 ml-2' />
            </Button>
          </form>
        </aside>
      </main>
    </div>
  )
}

