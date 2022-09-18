import { InputHTMLAttributes } from 'react'

interface inputProps extends InputHTMLAttributes<HTMLInputElement> {

}

export function Input(props: inputProps) {
    return (
        <input
            {...props}
            className='bg-zinc-900 px-4 py-3 rounded text-sm placeholder::text-zinc-500'
        />
    )
}