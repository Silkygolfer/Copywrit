'use client'
import Chat from '../components/ChatInterface/Chat'
import { UIMessage } from 'ai'

const messages: UIMessage[] = [
  {
    id: '1',
    role: 'user',
    content: 'Hello, how are you?',
    parts: [
      {
        type: 'text',
        text: 'Hello, how are you?',
      },
    ],
  },
]

export default function Home() {


  return (
    <Chat threadId='1' initialMessages={messages} />
  )
}