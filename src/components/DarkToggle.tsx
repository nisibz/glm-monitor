import { useEffect, useState } from 'react'
import { IconMoon, IconSun } from '@tabler/icons-react'
import { Button } from '@/components/ui/button'

export function DarkToggle() {
  const [dark, setDark] = useState(() => document.documentElement.classList.contains('dark'))
  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark)
    localStorage.setItem('theme', dark ? 'dark' : 'light')
  }, [dark])
  return (
    <Button
      variant="outline"
      size="icon"
      onClick={() => setDark(!dark)}
      aria-label="Toggle dark mode"
    >
      <span
        key={dark ? 'sun' : 'moon'}
        className="motion-safe:animate-in motion-safe:zoom-in motion-safe:duration-200"
      >
        {dark ? <IconSun className="size-4" /> : <IconMoon className="size-4" />}
      </span>
    </Button>
  )
}
