import axios from 'axios';
import * as Dialog from '@radix-ui/react-dialog';
import { Input } from './Form/input';
import { Check, GameController } from 'phosphor-react';
import * as Checkbox from '@radix-ui/react-checkbox';
import * as ToggleGroup from '@radix-ui/react-toggle-group';
import { useEffect, useState, FormEvent } from 'react';


interface Game {
    id: string;
    title: string;
}

export function CreateAddModal() {
    const [games, setGames] = useState<Game[]>([]);
    const [weekDays, setWeekDays] = useState<string[]>([])
    const [useVoiceChanel, setUseVoiceChanel] = useState(false);

    useEffect(() => {
        axios('http://localhost:3333/games').then(response => {
          setGames(response.data);
        })
    }, [])

    async function handleCreateAd(event: FormEvent) {
        event.preventDefault();

        const formData = new FormData(event.target as HTMLFormElement);
        const data = Object.fromEntries(formData);
        console.log(setUseVoiceChanel);

        try {
            await axios.post(`http://localhost:3333/games/${data.game}/ads`, {
                name: data.name,
                discord: data.discord,
                yearsPlaying: Number(data.yearsPlaying),
                weekDays: weekDays.map(Number),
                hourStart: data.hourStart,
                hourEnd: data.hourEnd,
                useVoiceChannel: useVoiceChanel
              })

            alert('Anúncio criado com sucesso')
        } catch (error) {
            alert('Erro ao criar o anúncio')
        }
        
    }
    
    return (
        <Dialog.Portal>
          <Dialog.Overlay className='bg-black/60 inset-0 fixed'>
            <Dialog.Content className='fixed bg-[#2A2634] py-8 px-10 text-white top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-lg w-[480px]'>
              <Dialog.Title className='text-3xl font-black'>Publique um anúncio</Dialog.Title>

                <form className='mt-8 flex flex-col gap-4' onSubmit={handleCreateAd}>
                  <div className='flex flex-col gap-2'>
                    <label htmlFor="game" className='font-semibold'>Qual o game?</label>
                    <select id="game" name="game" className='bg-zinc-900 px-4 py-3 rounded text-sm placeholder::text-zinc-500'>
                        <option disabled defaultValue='' value="">Selecione o game que deseja jogar</option>
                        { games.map(game => {
                            return (<option key={game.id} value={game.id}>{game.title}</option>)
                        })}
                    </select>
                  </div>

                  <div className='flex flex-col gap-2'>
                    <label htmlFor="name">Seu nome (ou nickname)</label>
                    <Input id="name" name="name" placeholder='Como te chamam dentro do game?'/>
                  </div>

                  <div className='grid grid-cols-2 gap-6'>
                    <div className='flex flex-col gap-2'>
                      <label htmlFor="yearsPlaying">Joga há quantos anos?</label>
                      <Input id="yearsPlaying" name="yearsPlaying" type="number" placeholder='Tudo bem ser ZERO' />
                    </div>
                    <div className='flex flex-col gap-2'>
                      <label htmlFor="discord">Qual seu Discord?</label>
                      <Input id="discord" name="discord" type="text" placeholder='Usuario#0000'/>
                    </div>
                  </div>

                  <div className='flex gap-6'>
                    <div className='flex flex-col gap-2'>
                      <label htmlFor="weekDays">Quando costuma jogar?</label>
                      
                      <div>
                        <ToggleGroup.Root type='multiple' className='grid grid-cols-4 gap-2' onValueChange={setWeekDays} value={weekDays} >
                            <ToggleGroup.Item type="button" value='0' title="Domingo" className={`w-8 h-8 rounded bg-zinc-900 ${weekDays.includes('0') ? 'bg-violet-500' : ''}`}>D</ToggleGroup.Item>
                            <ToggleGroup.Item type="button" value='1' title="Segunda" className={`w-8 h-8 rounded bg-zinc-900 ${weekDays.includes('1') ? 'bg-violet-500' : ''}`}>S</ToggleGroup.Item>
                            <ToggleGroup.Item type="button" value='2' title="Terça" className={`w-8 h-8 rounded bg-zinc-900 ${weekDays.includes('2') ? 'bg-violet-500' : ''}`}>T</ToggleGroup.Item>
                            <ToggleGroup.Item type="button" value='3' title="Quarta" className={`w-8 h-8 rounded bg-zinc-900 ${weekDays.includes('3') ? 'bg-violet-500' : ''}`}>Q</ToggleGroup.Item>
                            <ToggleGroup.Item type="button" value='4' title="Quinta" className={`w-8 h-8 rounded bg-zinc-900 ${weekDays.includes('4') ? 'bg-violet-500' : ''}`}>Q</ToggleGroup.Item>
                            <ToggleGroup.Item type="button" value='5' title="Sexta" className={`w-8 h-8 rounded bg-zinc-900 ${weekDays.includes('5') ? 'bg-violet-500' : ''}`}>S</ToggleGroup.Item>
                            <ToggleGroup.Item type="button" value='6' title="Sábado" className={`w-8 h-8 rounded bg-zinc-900 ${weekDays.includes('6') ? 'bg-violet-500' : ''}`}>S</ToggleGroup.Item>
                        </ToggleGroup.Root>
                      </div>
                    </div>
                    <div className='flex flex-col gap-2 flex-1'>
                      <label htmlFor="hourStart">Qual horário do dia?</label>
                      <div className='grid grid-cols-2 gap-2'>
                        <Input id="hourStart" name="hourStart" type="time" placeholder='De'/>
                        <Input id="hourEnd" name="hourEnd" type="time" placeholder='Até'/>
                      </div>
                    </div>
                  </div>

                  <div className='mt-2 flex gap-2 items-center text-sm'>
                    < Checkbox.Root className='w-6 h-6 p-1 rounded bg-zinc-900' checked={useVoiceChanel} onCheckedChange={(checked) => {
                        if (checked === true) {
                            setUseVoiceChanel(true)
                        } else {
                            setUseVoiceChanel(false)
                        }
                    }}>
                        < Checkbox.Indicator >
                            <Check className='w-4 h4-4 text-emerald-400'/>
                        </Checkbox.Indicator>
                    </Checkbox.Root>
                    Costumo me conectar ao chat de voz
                  </div>

                  <footer className='flex mt-4 justify-end gap-4'>
                    <Dialog.Close type='button' className='bg-zinc-500 rounded-md px-5 h-12 font-semibold hover:bg-zinc-600'>Cancelar</Dialog.Close>
                    <button type='submit' className='bg-violet-500 rounded-md px-5 h-12 font-semibold flex items-center gap-3 hover:bg-violet-600'><GameController size={24}/> Encontrar duo</button>
                  </footer>

                </form>
            </Dialog.Content>
          </Dialog.Overlay>
        </Dialog.Portal>
    )
}